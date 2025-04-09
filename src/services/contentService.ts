
import { Module, Topic } from '@/types/knowledge';
import { streamChat } from './chatService';

export async function generateModules(searchQuery: string): Promise<Module[]> {
  return new Promise(async (resolve, reject) => {
    try {
      let fullResponse = '';
      
      // Create a structured prompt to generate modules
      const prompt = `Generate a structured learning path for the topic: "${searchQuery}".
      Please provide 3 modules (chapters), with each module having:
      - A title
      - 3-5 topics that are specifically related to that module
      
      For each topic, include:
      - A title
      - A relevance score (1-10)
      - A short description (2-3 sentences)
      
      Format the response as JSON that matches this TypeScript interface:
      {
        modules: Array<{
          title: string;
          topics: Array<{
            title: string;
            relevance: number;
            description: string;
          }>
        }>
      }
      
      Each module should build on the previous one, progressively increasing in complexity or depth.
      Only respond with the JSON data.`;
      
      await streamChat(prompt, (token) => {
        fullResponse += token;
      });
      
      // Extract JSON from the response
      const jsonStartIndex = fullResponse.indexOf('{');
      const jsonEndIndex = fullResponse.lastIndexOf('}') + 1;
      
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        const jsonStr = fullResponse.substring(jsonStartIndex, jsonEndIndex);
        try {
          const result = JSON.parse(jsonStr);
          // If the response has a 'modules' array, use it, otherwise wrap a single module in an array
          const modules = result.modules || [result];
          resolve(modules);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          console.log("Raw JSON:", jsonStr);
          reject(new Error("Failed to parse generated content"));
        }
      } else {
        reject(new Error("No valid JSON found in the response"));
      }
    } catch (error) {
      console.error("Error generating modules:", error);
      reject(error);
    }
  });
}

export async function generateTopicDetail(topic: Topic): Promise<Topic> {
  return new Promise(async (resolve, reject) => {
    try {
      let fullResponse = '';
      
      const prompt = `Generate detailed information about the topic: "${topic.title}".
      Please include:
      - A comprehensive content section (3-4 paragraphs)
      - 2-3 subtopics, each with title, description, and content
      - 3-5 references or further reading suggestions
      
      Format the response as JSON that matches this TypeScript interface:
      {
        title: string;
        relevance: number;
        description: string;
        content: string;
        subtopics: Array<{
          title: string;
          description: string;
          content: string;
        }>;
        references: string[];
      }
      
      Only respond with the JSON data.`;
      
      await streamChat(prompt, (token) => {
        fullResponse += token;
      });
      
      // Extract JSON from the response
      const jsonStartIndex = fullResponse.indexOf('{');
      const jsonEndIndex = fullResponse.lastIndexOf('}') + 1;
      
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        const jsonStr = fullResponse.substring(jsonStartIndex, jsonEndIndex);
        try {
          const enrichedTopic = JSON.parse(jsonStr);
          resolve({
            ...topic,
            ...enrichedTopic
          });
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          console.log("Raw JSON:", jsonStr);
          reject(new Error("Failed to parse generated content"));
        }
      } else {
        reject(new Error("No valid JSON found in the response"));
      }
    } catch (error) {
      console.error("Error generating topic detail:", error);
      reject(error);
    }
  });
}
