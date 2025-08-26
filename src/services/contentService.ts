import OpenAI from "openai";

// Initialize OpenAI client (replace with your own URL + key)
const client = new OpenAI({
  apiKey: "rk_fa4f3725055a5a20e6f1737d32e87e3ffd137864497314ee4da4aadf07e7e6a0",
  baseURL: "https://unio.onrender.com/v1/api",
  dangerouslyAllowBrowser: true, // Browser-safe mode
});

// Types
export interface Module {
  title: string;
  topics: Topic[];
}

export interface Topic {
  title: string;
  content?: string;
  extras?: string[];
}

// ----------------------
// Shared JSON extractor
// ----------------------
function extractJSON(fullResponse: string) {
  // Remove accidental code fences
  const clean = fullResponse.replace(/```json|```/g, "").trim();

  // Locate JSON boundaries
  const jsonStartIndex = clean.indexOf("{");
  const jsonEndIndex = clean.lastIndexOf("}") + 1;

  if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
    const jsonStr = clean.slice(jsonStartIndex, jsonEndIndex);
    try {
      return JSON.parse(jsonStr);
    } catch {
      console.warn("JSON parse failed — likely incomplete stream.");
    }
  }
  return null;
}

// ----------------------
// Streaming helper
// ----------------------
async function streamChat(prompt: string, onToken?: (token: string) => void) {
  let response = "";

  const stream = await client.chat.completions.create({
    model: "google:gemini-2.5-flash",
    stream: true,
    messages: [{ role: "user", content: prompt }],
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content || "";
    response += token;
    if (onToken) onToken(token);
  }

  return response;
}

// ----------------------
// Module Generator
// ----------------------
export async function generateModules(
  searchQuery: string,
  maxRetries = 5
): Promise<Module[]> {
  let retryCount = 0;

  const attempt = async (): Promise<Module[]> => {
    const prompt = `You are an educational content generator. Create a structured learning path for: "${searchQuery}"

Return ONLY valid JSON in this format:
{
  "modules": [
    {"title": "Module 1 Title", "topics": []},
    {"title": "Module 2 Title", "topics": []},
    {"title": "Module 3 Title", "topics": []}
  ]
}

Rules:
- Generate 3-5 modules
- topics array must be empty
- Start with { and end with }`;

    const fullResponse = await streamChat(prompt);
    const parsed = extractJSON(fullResponse);

    if (parsed?.modules) return parsed.modules;

    if (retryCount < maxRetries) {
      retryCount++;
      console.log(`Retrying generateModules ${retryCount}/${maxRetries}`);
      return attempt();
    }
    throw new Error("Failed to parse modules after retries");
  };

  return attempt();
}

// ----------------------
// Topic Generator
// ----------------------
export async function generateTopics(
  moduleTitle: string,
  maxRetries = 5
): Promise<Topic[]> {
  let retryCount = 0;

  const attempt = async (): Promise<Topic[]> => {
    const prompt = `Generate topics for the module: "${moduleTitle}".
Return ONLY valid JSON:
{
  "topics": [
    {"title": "Topic 1"},
    {"title": "Topic 2"},
    {"title": "Topic 3"}
  ]
}`;

    const fullResponse = await streamChat(prompt);
    const parsed = extractJSON(fullResponse);

    if (parsed?.topics) return parsed.topics;

    if (retryCount < maxRetries) {
      retryCount++;
      console.log(`Retrying generateTopics ${retryCount}/${maxRetries}`);
      return attempt();
    }
    throw new Error("Failed to parse topics after retries");
  };

  return attempt();
}

// ----------------------
// Topic Content Generator
// ----------------------
export async function generateTopicMainContent(
  topicTitle: string,
  onStreamUpdate?: (partial: string) => void
): Promise<string> {
  const prompt = `Write detailed educational content for the topic: "${topicTitle}".
Return plain text (no JSON).`;

  const fullResponse = await streamChat(prompt, (token) => {
    if (onStreamUpdate) onStreamUpdate(token);
  });

  return fullResponse.trim();
}

// ----------------------
// Topic Extras Generator
// ----------------------
export async function generateTopicExtras(
  topicTitle: string,
  maxRetries = 5
): Promise<string[]> {
  let retryCount = 0;

  const attempt = async (): Promise<string[]> => {
    const prompt = `Generate 3-5 extra learning resources (like fun facts, exercises, or questions)
for the topic: "${topicTitle}".

Return ONLY valid JSON:
{
  "extras": [
    "Extra resource 1",
    "Extra resource 2",
    "Extra resource 3"
  ]
}`;

    const fullResponse = await streamChat(prompt);
    const parsed = extractJSON(fullResponse);

    if (parsed?.extras) return parsed.extras;

    if (retryCount < maxRetries) {
      retryCount++;
      console.log(`Retrying generateTopicExtras ${retryCount}/${maxRetries}`);
      return attempt();
    }
    throw new Error("Failed to parse extras after retries");
  };

  return attempt();
}
