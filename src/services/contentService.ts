
import { Module, Topic } from '@/types/knowledge';
import { streamChat } from './chatService';

export async function generateModules(searchQuery: string, maxRetries = 3): Promise<Module[]> {
  let retryCount = 0;
  
  const attemptGeneration = async (): Promise<Module[]> => {
    try {
      let fullResponse = '';
      
      const prompt = `You are an educational content generator. Create a structured learning path for: "${searchQuery}"

IMPORTANT: Respond with ONLY valid JSON in this exact format:
{
  "modules": [
    {"title": "Module 1 Title", "topics": []},
    {"title": "Module 2 Title", "topics": []},
    {"title": "Module 3 Title", "topics": []}
  ]
}

Requirements:
- Generate exactly 3-5 modules that build progressively
- Each module title should be clear and descriptive
- Topics array must be empty (will be populated later)
- Use proper JSON syntax with double quotes
- Do not include any text before or after the JSON

Start your response with { and end with }`;
      
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
          
          // Validate the structure
          if (!Array.isArray(modules) || modules.length === 0) {
            throw new Error(`Invalid module structure returned for query: ${searchQuery}`);
          }
          
          // Ensure each module has the required properties
          const validatedModules = modules.map((module, index) => ({
            title: module.title || `Untitled Module ${index + 1}`,
            topics: Array.isArray(module.topics) ? module.topics : []
          }));
          
          return validatedModules;
        } catch (parseError) {
          if (retryCount < maxRetries) {
            retryCount++;
            // Add a small delay before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            return attemptGeneration();
          }
          throw new Error(`Failed to parse generated modules for query: ${searchQuery} after ${maxRetries} retries. Error: ${parseError.message}`);
        }
      } else {
        if (retryCount < maxRetries) {
          retryCount++;
          // Add a small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          return attemptGeneration();
        }
        throw new Error(`No valid JSON found in the response for query: ${searchQuery} after ${maxRetries} retries`);
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        // Add a small delay before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return attemptGeneration();
      }
      throw new Error(`Failed to generate modules for query: ${searchQuery} after ${maxRetries} retries. Error: ${error.message}`);
    }
  };

  return attemptGeneration();
}

export async function generateTopics(moduleTitle: string, onTopicGenerated?: (topic: Topic) => void, maxRetries = 3): Promise<Topic[]> {
  let retryCount = 0;
  
  const attemptGeneration = async (): Promise<Topic[]> => {
    try {
      let fullResponse = '';
      
      const prompt = `You are an educational content generator. Create topics for module: "${moduleTitle}"

IMPORTANT: Respond with ONLY valid JSON in this exact format:
{
  "topics": [
    {
      "title": "Topic 1 Title",
      "relevance": 9,
      "description": "Brief 2-3 sentence description of this topic."
    },
    {
      "title": "Topic 2 Title", 
      "relevance": 8,
      "description": "Brief 2-3 sentence description of this topic."
    }
  ]
}

Requirements:
- Generate exactly 4-6 topics related to the module
- Each topic must have: title (string), relevance (number 1-10), description (string)
- Descriptions should be 2-3 sentences maximum
- Use proper JSON syntax with double quotes
- Do not include any text before or after the JSON

Start your response with { and end with }`;
      
      await streamChat(prompt, (token) => {
        fullResponse += token;
        
        // Try to parse and emit topics as they come in
        try {
          const jsonStartIndex = fullResponse.indexOf('{');
          const jsonEndIndex = fullResponse.lastIndexOf('}') + 1;
          
          if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
            const jsonStr = fullResponse.substring(jsonStartIndex, jsonEndIndex);
            const result = JSON.parse(jsonStr);
            
            if (result.topics && Array.isArray(result.topics)) {
              result.topics.forEach((topic: Topic) => {
                // Validate topic structure
                if (topic.title && typeof topic.relevance === 'number' && topic.description && onTopicGenerated) {
                  onTopicGenerated(topic);
                }
              });
            }
          }
        } catch (e) {
          // Continue streaming, will parse at the end
        }
      });
      
      const jsonStartIndex = fullResponse.indexOf('{');
      const jsonEndIndex = fullResponse.lastIndexOf('}') + 1;
      
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        const jsonStr = fullResponse.substring(jsonStartIndex, jsonEndIndex);
        try {
          const result = JSON.parse(jsonStr);
          const topics = result.topics || [];
          
          // Validate topics structure
          if (!Array.isArray(topics)) {
            throw new Error(`Invalid topics structure returned for module: ${moduleTitle}`);
          }
          
          // Ensure each topic has the required properties
          const validatedTopics = topics.map((topic, index) => ({
            title: topic.title || `Untitled Topic ${index + 1}`,
            relevance: typeof topic.relevance === 'number' ? topic.relevance : 5,
            description: topic.description || "No description available"
          }));
          
          return validatedTopics;
        } catch (parseError) {
          if (retryCount < maxRetries) {
            retryCount++;
            // Add a small delay before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            return attemptGeneration();
          }
          throw new Error(`Failed to parse generated topics for module: ${moduleTitle} after ${maxRetries} retries. Error: ${parseError.message}`);
        }
      } else {
        if (retryCount < maxRetries) {
          retryCount++;
          // Add a small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          return attemptGeneration();
        }
        throw new Error(`No valid JSON found in the response for module: ${moduleTitle} after ${maxRetries} retries`);
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        // Add a small delay before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return attemptGeneration();
      }
      throw new Error(`Failed to generate topics for module: ${moduleTitle} after ${maxRetries} retries. Error: ${error.message}`);
    }
  };

  return attemptGeneration();
}

export async function generateTopicMainContent(topic: Topic, onStreamUpdate?: (partialContent: string) => void, maxRetries = 3): Promise<string> {
  let retryCount = 0;
  
  const attemptGeneration = async (): Promise<string> => {
    try {
      let fullResponse = '';
      
      const prompt = `You are an educational content generator. Create detailed main content for topic: "${topic.title}"

IMPORTANT: Respond with ONLY valid JSON in this exact format:
{
  "content": "Detailed educational content about the topic. This should be comprehensive, well-structured, and informative. Include multiple paragraphs, examples, and explanations as needed."
}

Requirements:
- Generate comprehensive content (2-4 paragraphs)
- Content should be educational and informative
- Use proper JSON syntax with double quotes
- Escape special characters properly in JSON strings
- Do not include any text before or after the JSON

Start your response with { and end with }`;
      
      await streamChat(prompt, (token) => {
        fullResponse += token;
        
        if (onStreamUpdate) {
          try {
            const jsonStartIndex = fullResponse.indexOf('{');
            if (jsonStartIndex >= 0) {
              const partialJson = fullResponse.substring(jsonStartIndex);
              const contentMatch = partialJson.match(/"content":\s*"([^"\\]*(\\.[^"\\]*)*)"/);
              if (contentMatch && contentMatch[1]) {
                const partialContent = contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
                onStreamUpdate(partialContent);
              }
            }
          } catch (e) {
            // Continue streaming
          }
        }
      });
      
      const jsonStartIndex = fullResponse.indexOf('{');
      const jsonEndIndex = fullResponse.lastIndexOf('}') + 1;
      
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        const jsonStr = fullResponse.substring(jsonStartIndex, jsonEndIndex);
        try {
          const result = JSON.parse(jsonStr);
          return result.content || '';
        } catch (parseError) {
          if (retryCount < maxRetries) {
            retryCount++;
            // Add a small delay before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            return attemptGeneration();
          }
          throw new Error(`Failed to parse generated content for topic: ${topic.title} after ${maxRetries} retries. Error: ${parseError.message}`);
        }
      } else {
        if (retryCount < maxRetries) {
          retryCount++;
          // Add a small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          return attemptGeneration();
        }
        throw new Error(`No valid JSON found in the response for topic: ${topic.title} after ${maxRetries} retries`);
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        // Add a small delay before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return attemptGeneration();
      }
      throw new Error(`Failed to generate content for topic: ${topic.title} after ${maxRetries} retries. Error: ${error.message}`);
    }
  };

  return attemptGeneration();
}

export async function generateTopicExtras(topic: Topic, maxRetries = 3): Promise<{subtopics: any[], references: string[]}> {
  let retryCount = 0;
  
  const attemptGeneration = async (): Promise<{subtopics: any[], references: string[]}> => {
    try {
      let fullResponse = '';
      
      const prompt = `You are an educational content generator. Create subtopics and references for topic: "${topic.title}"

IMPORTANT: Respond with ONLY valid JSON in this exact format:
{
  "subtopics": [
    {
      "title": "Subtopic 1 Title",
      "description": "Brief description of this subtopic.",
      "content": "Detailed content about this subtopic."
    },
    {
      "title": "Subtopic 2 Title",
      "description": "Brief description of this subtopic.",
      "content": "Detailed content about this subtopic."
    }
  ],
  "references": [
    "Reference 1: Book/Article/Website title and author",
    "Reference 2: Book/Article/Website title and author",
    "Reference 3: Book/Article/Website title and author"
  ]
}

Requirements:
- Generate exactly 2-3 subtopics with title, description, and content
- Generate exactly 3-5 references
- Use proper JSON syntax with double quotes
- Escape special characters properly in JSON strings
- Do not include any text before or after the JSON

Start your response with { and end with }`;
      
      await streamChat(prompt, (token) => {
        fullResponse += token;
      });

      const jsonStartIndex = fullResponse.indexOf('{');
      const jsonEndIndex = fullResponse.lastIndexOf('}') + 1;
      
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        const jsonStr = fullResponse.substring(jsonStartIndex, jsonEndIndex);
        try {
          const result = JSON.parse(jsonStr);
          return {
            subtopics: Array.isArray(result.subtopics) ? result.subtopics : [],
            references: Array.isArray(result.references) ? result.references : []
          };
        } catch (parseError) {
          if (retryCount < maxRetries) {
            retryCount++;
            // Add a small delay before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            return attemptGeneration();
          }
          throw new Error(`Failed to parse generated extras for topic: ${topic.title} after ${maxRetries} retries. Error: ${parseError.message}`);
        }
      } else {
        if (retryCount < maxRetries) {
          retryCount++;
          // Add a small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          return attemptGeneration();
        }
        throw new Error(`No valid JSON found in the response for topic: ${topic.title} after ${maxRetries} retries`);
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        // Add a small delay before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return attemptGeneration();
      }
      throw new Error(`Failed to generate extras for topic: ${topic.title} after ${maxRetries} retries. Error: ${error.message}`);
    }
  };

  return attemptGeneration();
}
