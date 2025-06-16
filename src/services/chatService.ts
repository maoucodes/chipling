
export async function streamChat(message: string, onToken: (token: string) => void) {
  try {
    const response = await fetch("https://chipling-api.hf.space/api/v1/generate", {
      method: "POST",
      headers: {
        "accept": "*/*",
        "content-type": "application/json",
        "Referer": "https://axiom-minds.vercel.app/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      body: JSON.stringify({
        message,
        messages: [
          {
            role: "system",
            content: "You are Chipling, an AI assistant that helps users learn about academic and research topics in a structured way. Provide concise, accurate information and guide the learning process."
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "grok-3-fast"
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the reader from the response body as a stream
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Failed to get response reader");

    // Process the stream
    const decoder = new TextDecoder();
    let completeResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Convert Uint8Array to string
      const text = decoder.decode(value);
      
      // Process each line of the SSE response
      const lines = text.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ") && line !== "data: [DONE]") {
          try {
            const jsonData = JSON.parse(line.substring(6));
            
            // Check if the response has choices
            if (jsonData.choices && jsonData.choices.length > 0) {
              const tokenText = jsonData.choices[0].text || "";
              if (tokenText) {
                completeResponse += tokenText;
                onToken(tokenText);
              }
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      }
    }
    
    return completeResponse;
  } catch (error) {
    console.error("Error in streamChat:", error);
    throw error;
  }
}
