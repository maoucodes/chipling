
import { Module, Topic } from '@/types/knowledge';
import { streamChat } from './chatService';

export async function generateModules(searchQuery: string): Promise<Module[]> {
  return new Promise(async (resolve, reject) => {
    try {
      let fullResponse = '';
      
      // Create a structured prompt to generate only module titles
      const prompt = `Generate a structured learning path outline for the topic: "${searchQuery}".
      Please provide only the module (chapter) titles that would cover this topic comprehensively.
      Each module should build on the previous one, progressively increasing in complexity or depth.
      
      Format the response as JSON that matches this TypeScript interface:
      {
        modules: Array<{
          title: string;
          topics: Array<any>; // This will be populated later
        }>
      }
      
      Only respond with the JSON data containing module titles.`;
      
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

export async function generateTopics(moduleTitle: string, onTopicGenerated?: (topic: Topic) => void): Promise<Topic[]> {
  return new Promise(async (resolve, reject) => {
    try {
      let fullResponse = '';
      let currentTopics: Topic[] = [];
      
      const prompt = `Generate a list of topics for the module titled: "${moduleTitle}".
      Please provide at least 4 topics that are specifically related to this module.
      Each topic should be provided one at a time in a separate JSON object.
      
      For each topic, include:
      - A title
      - A relevance score (1-10)
      - A Very short description (2-3 sentences)
      
      Format each topic as a separate JSON object that matches this TypeScript interface:
      {
        title: string;
        relevance: number;
        description: string;
      }
      
      Provide one topic at a time, with each topic on a new line.`;
      
      await streamChat(prompt, (token) => {
        fullResponse += token;
        
        // Try to extract topics as they come in
        const lines = fullResponse.split('\n');
        for (const line of lines) {
          if (line.trim()) {
            try {
              // Look for JSON objects in the line
              const jsonStartIndex = line.indexOf('{');
              const jsonEndIndex = line.lastIndexOf('}') + 1;
              
              if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
                const jsonStr = line.substring(jsonStartIndex, jsonEndIndex);
                const topic = JSON.parse(jsonStr);
                
                // Check if this is a valid topic object
                if (topic.title && typeof topic.relevance === 'number' && topic.description) {
                  // Check if we already have this topic
                  const topicExists = currentTopics.some(t => t.title === topic.title);
                  
                  if (!topicExists) {
                    currentTopics.push(topic);
                    if (onTopicGenerated) {
                      onTopicGenerated(topic);
                    }
                  }
                }
              }
            } catch (e) {
              // Ignore parsing errors for incomplete JSON
            }
          }
        }
      });
      
      resolve(currentTopics);
    } catch (error) {
      console.error("Error generating topics:", error);
      reject(error);
    }
  });

}

export function generateTopicDetail(topic: Topic, onStreamUpdate?: (partialContent: string) => void): Promise<Topic> {
  return new Promise(async (resolve, reject) => {
    try {
      let fullResponse = '';
      let currentStreamingContent = '';
      
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
        
        // Try to extract partial content as it streams
        if (onStreamUpdate) {
          try {
            // Look for content field in the streamed JSON
            const contentMatch = fullResponse.match(/"content":\s*"([^"]*)"/);
            if (contentMatch && contentMatch[1]) {
              const partialContent = contentMatch[1];
              // Only update if content has changed
              if (partialContent !== currentStreamingContent) {
                currentStreamingContent = partialContent;
                onStreamUpdate(partialContent);
              }
            }
          } catch (e) {
            // Ignore JSON parsing errors during streaming
          }
        }
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
