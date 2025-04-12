
import { useState } from 'react';
import { toast } from 'sonner';
import { Module, Topic } from '@/types/knowledge';
import { generateModules, generateTopics, generateTopicDetail, generateTopicMainContent, generateTopicRelatedContent } from '@/services/contentService';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/contexts/HistoryContext';

export const useContentGeneration = () => {
  const { isAuthenticated } = useAuth();
  const { addToHistory } = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<{moduleIndex: number, topicIndex: number, topic: Topic} | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [isLoadingRelatedContent, setIsLoadingRelatedContent] = useState(false);
  const [mainContentLoading, setMainContentLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setCurrentModuleIndex(0);
    
    try {
      const generatedModules = await generateModules(query);
      setModules(generatedModules.map(module => ({ ...module, topics: [] })));
      toast.success(`Found knowledge modules for "${query}"`);
      setIsLoading(false);
      
      const updatedModules = [...generatedModules];
      updatedModules[0].topics = [];
      setModules(updatedModules);
      
      await generateTopics(generatedModules[0].title, (topic) => {
        setModules(currentModules => {
          const newModules = [...currentModules];
          newModules[0].topics = [...newModules[0].topics, topic];
          return newModules;
        });
      });
      
      if (isAuthenticated) {
        try {
          console.log("Saving search to history:", query);
          const historyId = await addToHistory(query, generatedModules);
          console.log("History saved with ID:", historyId);
          setCurrentHistoryId(historyId);
        } catch (error) {
          console.error("Error saving to history:", error);
          toast.error("Failed to save your journey to history");
        }
      } else {
        console.log("User not authenticated, not saving search to history");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please try again.");
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTopic = async (moduleIndex: number, topicIndex: number) => {
    const topic = modules[moduleIndex].topics[topicIndex];
    
    // Set the topic immediately to navigate to it
    setSelectedTopic({ moduleIndex, topicIndex, topic });
    setStreamingContent('');
    
    // Check if the content is already loaded to avoid fetching it again
    if (!topic.content) {
      // Set loading state for main content
      setMainContentLoading(true);
      
      try {
        // Set loading state for related content
        setIsLoadingRelatedContent(true);
        
        // Generate main content first with streaming updates
        generateTopicMainContent(topic, (partialContent) => {
          setStreamingContent(partialContent);
        }).then(mainContent => {
          // Update modules with main content
          const updatedModules = [...modules];
          updatedModules[moduleIndex].topics[topicIndex] = {
            ...topic,
            content: mainContent.content
          };
          setModules(updatedModules);
          
          // Update selected topic with main content
          setSelectedTopic({
            moduleIndex,
            topicIndex,
            topic: {
              ...topic,
              content: mainContent.content
            }
          });
          
          // Clear streaming content and mark main content as loaded
          setStreamingContent('');
          setMainContentLoading(false);
          
          // Only fetch related content if it's not already loaded
          if (!topic.subtopics || topic.subtopics.length === 0) {
            // Generate related content after main content is loaded
            generateTopicRelatedContent(topic).then(relatedContent => {
              const fullyUpdatedModules = [...updatedModules];
              const currentTopic = fullyUpdatedModules[moduleIndex].topics[topicIndex];
              
              fullyUpdatedModules[moduleIndex].topics[topicIndex] = {
                ...currentTopic,
                subtopics: relatedContent.subtopics,
                references: relatedContent.references
              };
              
              setModules(fullyUpdatedModules);
              setSelectedTopic({
                moduleIndex,
                topicIndex,
                topic: {
                  ...currentTopic,
                  subtopics: relatedContent.subtopics,
                  references: relatedContent.references
                }
              });
              setIsLoadingRelatedContent(false);
            }).catch(error => {
              console.error("Error generating related content:", error);
              toast.error("Failed to load related content. Please try again.");
              setIsLoadingRelatedContent(false);
            });
          } else {
            // If subtopics are already loaded, just update the loading state
            setIsLoadingRelatedContent(false);
          }
        }).catch(error => {
          console.error("Error generating main content:", error);
          toast.error("Failed to load content. Please try again.");
          setStreamingContent('');
          setMainContentLoading(false);
          setIsLoadingRelatedContent(false);
        });
      } catch (error) {
        console.error("Error generating topic details:", error);
        toast.error("Failed to load detailed content. Please try again.");
        setStreamingContent('');
        setMainContentLoading(false);
        setIsLoadingRelatedContent(false);
      }
    } else {
      // Content is already loaded, just check if we need related content
      if (!topic.subtopics || topic.subtopics.length === 0) {
        setIsLoadingRelatedContent(true);
        
        try {
          const relatedContent = await generateTopicRelatedContent(topic);
          
          const updatedModules = [...modules];
          updatedModules[moduleIndex].topics[topicIndex] = {
            ...topic,
            subtopics: relatedContent.subtopics,
            references: relatedContent.references
          };
          
          setModules(updatedModules);
          setSelectedTopic({
            moduleIndex,
            topicIndex,
            topic: {
              ...topic,
              subtopics: relatedContent.subtopics,
              references: relatedContent.references
            }
          });
          
          setIsLoadingRelatedContent(false);
        } catch (error) {
          console.error("Error generating related content:", error);
          toast.error("Failed to load related content. Please try again.");
          setIsLoadingRelatedContent(false);
        }
      } else {
        // Both main content and related content are already loaded
        setIsLoadingRelatedContent(false);
      }
    }
  };

  const loadModuleTopics = async (moduleIndex: number) => {
    if (modules[moduleIndex].topics.length === 0) {
      try {
        const updatedModules = [...modules];
        updatedModules[moduleIndex].topics = [];
        setModules(updatedModules);
        
        await generateTopics(modules[moduleIndex].title, (topic) => {
          setModules(currentModules => {
            const newModules = [...currentModules];
            newModules[moduleIndex].topics = [...newModules[moduleIndex].topics, topic];
            return newModules;
          });
        });
      } catch (error) {
        console.error("Error loading module topics:", error);
        toast.error("Failed to load module topics. Please try again.");
      }
    }
  };

  const handleNextModule = async () => {
    if (currentModuleIndex < modules.length - 1) {
      const nextIndex = currentModuleIndex + 1;
      setCurrentModuleIndex(nextIndex);
      await loadModuleTopics(nextIndex);
      
      toast.success(`Navigating to Module ${nextIndex + 1}`);
    }
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setStreamingContent('');
  };

  const handleSelectHistory = (query: string, historyModules: Module[]) => {
    console.log("Selected history modules:", historyModules);
    
    if (!historyModules || !Array.isArray(historyModules)) {
      toast.error("Invalid history data");
      console.error("Invalid history modules data:", historyModules);
      return;
    }
    
    const validatedModules = historyModules.map(module => ({
      title: module.title || "Untitled Module",
      topics: Array.isArray(module.topics) ? module.topics : []
    }));
    
    setModules(validatedModules);
    setCurrentModuleIndex(0);
    setSelectedTopic(null);
    
    toast.success(`Continuing your journey: "${query}"`);
    
    return validatedModules;
  };

  return {
    isLoading,
    modules,
    currentModuleIndex,
    selectedTopic,
    streamingContent,
    currentHistoryId,
    isLoadingRelatedContent,
    mainContentLoading,
    setCurrentHistoryId,
    handleSearch,
    handleSelectTopic,
    handleNextModule,
    handleBackToTopics,
    handleSelectHistory
  };
};
