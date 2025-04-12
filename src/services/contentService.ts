
import { Module, Topic } from '@/types/knowledge';
import { streamChat } from './chatService';

export async function generateModules(searchQuery: string, maxRetries = 10): Promise<Module[]> {
  let retryCount = 0;
  
  const attemptGeneration = async (): Promise<Module[]> => {
    try {
      let fullResponse = '';
      
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
      
      const jsonStartIndex = fullResponse.indexOf('{');
      const jsonEndIndex = fullResponse.lastIndexOf('}') + 1;
      
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        const jsonStr = fullResponse.substring(jsonStartIndex, jsonEndIndex);
        try {
          const result = JSON.parse(jsonStr);
          const modules = result.modules || [result];
          return modules;
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          console.log("Raw JSON:", jsonStr);
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying generation attempt ${retryCount}/${maxRetries}`);
            return attemptGeneration();
          }
          throw new Error("Failed to parse generated content after max retries");
        }
      } else {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying generation attempt ${retryCount}/${maxRetries}`);
          return attemptGeneration();
        }
        throw new Error("No valid JSON found in the response after max retries");
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying generation attempt ${retryCount}/${maxRetries}`);
        return attemptGeneration();
      }
      throw error;
    }
  };

  return attemptGeneration();
}

export async function generateTopics(moduleTitle: string, onTopicGenerated?: (topic: Topic) => void, maxRetries = 10): Promise<Topic[]> {
  let retryCount = 0;
  
  const attemptGeneration = async (): Promise<Topic[]> => {
    try {
      let fullResponse = '';
      let currentTopics: Topic[] = [];
      
      const prompt = `Generate a list of topics for the module titled: "${moduleTitle}".
      Please provide at least 4 topics that are specifically related to this module.
      Each topic should be provided one at a time in a separate JSON object.
      
      For each topic, include:
      - A title
      - A relevance score (1-10)
      - A Very short description (2-3 sentences only)
      
      Format each topic as a separate JSON object that matches this TypeScript interface:
      {
        title: string;
        relevance: number;
        description: string;
      }
      
      Provide one topic at a time, with each topic on a new line.`;
      
      await streamChat(prompt, (token) => {
        fullResponse += token;
        
        const lines = fullResponse.split('\n');
        for (const line of lines) {
          if (line.trim()) {
            try {
              const jsonStartIndex = line.indexOf('{');
              const jsonEndIndex = line.lastIndexOf('}') + 1;
              
              if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
                const jsonStr = line.substring(jsonStartIndex, jsonEndIndex);
                const topic = JSON.parse(jsonStr);
                
                if (topic.title && typeof topic.relevance === 'number' && topic.description) {
                  const topicExists = currentTopics.some(t => t.title === topic.title);
                  
                  if (!topicExists) {
                    currentTopics.push(topic);
                    if (onTopicGenerated) {
                      onTopicGenerated(topic);
                    }
                  }
                }
              }
            } catch (e) {}
          }
        }
      });
      
      if (currentTopics.length > 0) {
        return currentTopics;
      } else {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying generation attempt ${retryCount}/${maxRetries}`);
          return attemptGeneration();
        }
        throw new Error("No valid topics generated after max retries");
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying generation attempt ${retryCount}/${maxRetries}`);
        return attemptGeneration();
      }
      throw error;
    }
  };

  return attemptGeneration();
}

export async function generateTopicDetail(topic: Topic, onStreamUpdate?: (partialContent: string) => void, maxRetries = 10): Promise<Topic> {
  let retryCount = 0;
  
  const attemptGeneration = async (): Promise<Topic> => {
    try {
      let fullResponse = '';
      let currentStreamingContent = '';
      
      const prompt = `Generate detailed information about the topic: "${topic.title}".
      Please include:
      - A comprehensive content section (2-3 paragraphs)
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
        
        if (onStreamUpdate) {
          try {
            const contentMatch = fullResponse.match(/"content":\s*"([^"]*)"/);            if (contentMatch && contentMatch[1]) {
              const partialContent = contentMatch[1];
              if (partialContent !== currentStreamingContent) {
                currentStreamingContent = partialContent;
                onStreamUpdate(partialContent);
              }
            }
          } catch (e) {}
        }
      });
      
      const jsonStartIndex = fullResponse.indexOf('{');
      const jsonEndIndex = fullResponse.lastIndexOf('}') + 1;
      
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        const jsonStr = fullResponse.substring(jsonStartIndex, jsonEndIndex);
        try {
          const enrichedTopic = JSON.parse(jsonStr);
          return {
            ...topic,
            ...enrichedTopic
          };
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          console.log("Raw JSON:", jsonStr);
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying generation attempt ${retryCount}/${maxRetries}`);
            return attemptGeneration();
          }
          throw new Error("Failed to parse generated content after max retries");
        }
      } else {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying generation attempt ${retryCount}/${maxRetries}`);
          return attemptGeneration();
        }
        throw new Error("No valid JSON found in the response after max retries");
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying generation attempt ${retryCount}/${maxRetries}`);
        return attemptGeneration();
      }
      throw error;
    }
  };

  return attemptGeneration();
}
