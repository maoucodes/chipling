
import { useState } from 'react';
import { toast } from 'sonner';
import { Module, Topic } from '@/types/knowledge';
import { generateModules, generateTopics, generateTopicMainContent, generateTopicExtras } from '@/services/contentService';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/contexts/HistoryContext';

export const useContentGeneration = () => {
  const { isAuthenticated } = useAuth();
  const { addToHistory } = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'modules' | 'topics' | 'content'>('modules');
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<{moduleIndex: number, topicIndex: number, topic: Topic} | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [searchInProgress, setSearchInProgress] = useState(false);

  const resetState = () => {
    console.log("Resetting state in useContentGeneration");
    setSelectedTopic(null);
    setStreamingContent('');
    setModules([]);
    setCurrentModuleIndex(0);
    setCurrentHistoryId(null);
    setSearchInProgress(false); // Also reset the search in progress flag
  };

  const handleSearch = async (query: string) => {
    // Prevent multiple concurrent searches
    if (searchInProgress) {
      console.log("Search already in progress, ignoring new search request");
      return;
    }
    
    setSearchInProgress(true);
    
    // Clear all previous state before starting new search
    resetState();
    setIsLoading(true);
    setLoadingStage('modules');
    
    try {
      const generatedModules = await generateModules(query);
      setModules(generatedModules.map(module => ({ ...module, topics: [] })));
      toast.success(`Found knowledge modules for "${query}"`);
      
      setLoadingStage('topics');
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
      // Don't reset searchInProgress here as we want to keep it true until the search is fully completed
    }
  };

  const handleSelectTopic = async (moduleIndex: number, topicIndex: number) => {
    const topic = modules[moduleIndex].topics[topicIndex];
    
    setSelectedTopic({ moduleIndex, topicIndex, topic });
    setStreamingContent('');
    
    if (!topic.content) {
      try {
        // Generate main content with streaming
        const mainContent = await generateTopicMainContent(topic, (partialContent) => {
          setStreamingContent(partialContent);
        });
        
        // Generate extras (subtopics and references)
        const { subtopics, references } = await generateTopicExtras(topic);
        
        // Create enriched topic with all content
        const enrichedTopic = {
          ...topic,
          content: mainContent,
          subtopics,
          references
        };
        
        // Update the modules state
        const updatedModules = [...modules];
        updatedModules[moduleIndex].topics[topicIndex] = enrichedTopic;
        setModules(updatedModules);
        
        setSelectedTopic({ moduleIndex, topicIndex, topic: enrichedTopic });
        setStreamingContent('');
      } catch (error) {
        console.error("Error generating topic details:", error);
        toast.error("Failed to load detailed content. Please try again.");
        setStreamingContent('');
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
    console.log("handleBackToTopics called in useContentGeneration hook");
    setSelectedTopic(null);
    setStreamingContent('');
  };

  const resetSearch = () => {
    console.log("Resetting search state in useContentGeneration hook");
    resetState();
    setSearchInProgress(false);
  };

  const handleSelectHistory = (query: string, historyModules: Module[]) => {
    console.log("Selected history modules:", historyModules);
    
    if (!historyModules || !Array.isArray(historyModules)) {
      toast.error("Invalid history data");
      console.error("Invalid history modules data:", historyModules);
      return;
    }
    
    // Clear current state before loading history
    setSelectedTopic(null);
    setStreamingContent('');
    setCurrentModuleIndex(0);
    
    const validatedModules = historyModules.map(module => ({
      title: module.title || "Untitled Module",
      topics: Array.isArray(module.topics) ? module.topics : []
    }));
    
    setModules(validatedModules);
    
    toast.success(`Continuing your journey: "${query}"`);
    
    return validatedModules;
  };

  return {
    isLoading,
    loadingStage,
    modules,
    currentModuleIndex,
    selectedTopic,
    streamingContent,
    currentHistoryId,
    setCurrentHistoryId,
    handleSearch,
    handleSelectTopic,
    handleNextModule,
    handleBackToTopics,
    handleSelectHistory,
    resetSearch, // Add this new function
    searchInProgress // Also expose this state
  };
};
