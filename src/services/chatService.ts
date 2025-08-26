import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "rk_f112c370d4b0f82940d9a4274e9b0b78e547a904af65e933577b825a7b8f3ebd",
  baseURL: "https://unio.onrender.com/v1/api",
  dangerouslyAllowBrowser: true,
});

export async function streamChat(
  message: string,
  onToken: (token: string) => void
) {
  try {
    const stream = await client.chat.completions.create({
      model: "google:gemini-2.5-flash-lite",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You are Chipling, an AI assistant that helps users learn about academic and research topics in a structured way. Provide concise, accurate information and guide the learning process."
        },
        { role: "user", content: message }
      ]
    });

    let completeResponse = "";

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || "";
      if (token) {
        completeResponse += token;
        onToken(token);
      }
    }

    return completeResponse;
  } catch (error) {
    console.error("Error in streamChat:", error);
    throw error;
  }
}
