import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "rk_c5f43e7ec775b73228f1c42b07a8fe152bbbbec93a69713d0b7964c165a53d44",
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
      ],
      extra_headers: {
            "X-Fallback-Model": "groq:openai/gpt-oss-120b"  
        }
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
