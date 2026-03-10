import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { task_title } = await req.json();

        if (!task_title || typeof task_title !== "string") {
            return new Response(
                JSON.stringify({ error: "task_title is required and must be a string" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Retrieve API key from Supabase secrets (Vault)
        const deepseekApiKey = Deno.env.get("DEEPSEEK_API_KEY");
        if (!deepseekApiKey) {
            console.error("DEEPSEEK_API_KEY not found in environment");
            return new Response(
                JSON.stringify({ error: "AI service not configured" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Call DeepSeek API
        const deepseekResponse = await fetch(
            "https://api.deepseek.com/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${deepseekApiKey}`,
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content:
                                "Act as a productivity assistant. Break down the user's task into 5 clear, actionable sub-tasks. Return only a JSON array of strings. Example: [\"Step 1\", \"Step 2\", \"Step 3\", \"Step 4\", \"Step 5\"]. Do not include any other text, markdown, or formatting.",
                        },
                        {
                            role: "user",
                            content: task_title,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 512,
                }),
            }
        );

        if (!deepseekResponse.ok) {
            const errorBody = await deepseekResponse.text();
            console.error("DeepSeek API error:", deepseekResponse.status, errorBody);
            return new Response(
                JSON.stringify({
                    error: "Failed to generate sub-tasks",
                    details: `DeepSeek API returned ${deepseekResponse.status}`,
                }),
                {
                    status: 502,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const data = await deepseekResponse.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            return new Response(
                JSON.stringify({ error: "No content in AI response" }),
                {
                    status: 502,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Parse the JSON array from the AI response
        let subtasks: string[];
        try {
            // Strip any markdown code fences the model might add
            const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            subtasks = JSON.parse(cleaned);

            if (!Array.isArray(subtasks)) {
                throw new Error("Response is not an array");
            }

            // Ensure all items are strings
            subtasks = subtasks.map((item: unknown) => String(item));
        } catch (parseError) {
            console.error("Failed to parse AI response:", content, parseError);
            return new Response(
                JSON.stringify({
                    error: "Failed to parse AI response",
                    raw: content,
                }),
                {
                    status: 502,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        return new Response(JSON.stringify({ subtasks }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Edge function error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
