
import { useState, FC, useEffect } from 'react';
import { toast } from 'sonner';
import ChiplingLayout from '@/components/ChiplingLayout';
import SearchInput from '@/components/SearchInput';
import ModuleGrid from '@/components/ModuleGrid';
import TopicDetail from '@/components/TopicDetail';
import LearningPath from '@/components/LearningPath';
import LoadingContent from '@/components/LoadingContent';
import { Module, Topic } from '@/types/knowledge';
import { generateModules, generateTopics, generateTopicDetail } from '@/services/contentService';
import { MapIcon, LayersIcon, HistoryIcon } from 'lucide-react';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/contexts/HistoryContext';
import HistoryModal from '@/components/HistoryModal';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { history, addToHistory, updateProgress } = useHistory();
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<{moduleIndex: number, topicIndex: number, topic: Topic} | null>(null);
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingSearch, setPendingSearch] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [moduleProgress, setModuleProgress] = useState<Record<number, number>>({});
  
  // Calculate module progress
  const calculateModuleProgress = (moduleIndex: number) => {
    if (!modules[moduleIndex]) return 0;
    
    const moduleTotalTopics = modules[moduleIndex].topics.length;
    if (moduleTotalTopics === 0) return 0;
    
    const moduleCompletedTopics = Object.keys(completedTopics)
      .filter(key => key.startsWith(`${moduleIndex}-`) && completedTopics[key])
      .length;
      
    return Math.round((moduleCompletedTopics / moduleTotalTopics) * 100);
  };
  
  const countCompletedTopics = () => {
    return Object.values(completedTopics).filter(Boolean).length;
  };
  
  useEffect(() => {
    const computeModuleProgress = () => {
      const progress: Record<number, number> = {};
      
      modules.forEach((module, index) => {
        progress[index] = calculateModuleProgress(index);
      });
      
      return progress;
    };
    
    const updateHistoryEntry = async () => {
      if (currentHistoryId && isAuthenticated) {
        const completed = countCompletedTopics();
        const moduleProgressData = computeModuleProgress();
        
        setModuleProgress(moduleProgressData);
        
        try {
          await updateProgress(currentHistoryId, completed, moduleProgressData);
          console.log(`Updated progress for history ID ${currentHistoryId}: ${completed} topics completed, module progress:`, moduleProgressData);
        } catch (error) {
          console.error("Error updating history progress:", error);
        }
      }
    };
    
    updateHistoryEntry();
  }, [completedTopics, currentHistoryId, isAuthenticated, modules, updateProgress]);
  
  const markTopicCompleted = (moduleIndex: number, topicIndex: number) => {
    const key = `${moduleIndex}-${topicIndex}`;
    setCompletedTopics(prev => ({
      ...prev,
      [key]: true
    }));
  };
  
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchPerformed(true);
    setCurrentModuleIndex(0);
    setCompletedTopics({});
    setModuleProgress({});
    
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
    setSearchPerformed(true);
    setCurrentModuleIndex(0);
    setSelectedTopic(null);
    
    const historyEntry = Array.isArray(history) ? 
      history.find(entry => entry.query === query) : 
      undefined;
      
    if (historyEntry) {
      setCurrentHistoryId(historyEntry.id);
      
      const completedCount = historyEntry.completedTopics || 0;
      const newCompletedTopics: Record<string, boolean> = {};
      
      let markedCount = 0;
      validatedModules.forEach((module, moduleIndex) => {
        module.topics.forEach((_, topicIndex) => {
          if (markedCount < completedCount) {
            newCompletedTopics[`${moduleIndex}-${topicIndex}`] = true;
            markedCount++;
          }
        });
      });
      
      setCompletedTopics(newCompletedTopics);
      
      if (historyEntry.moduleProgress) {
        setModuleProgress(historyEntry.moduleProgress);
      }
    }
    
    toast.success(`Continuing your journey: "${query}"`);
  };
  
  const handleSelectTopic = async (moduleIndex: number, topicIndex: number) => {
    const topic = modules[moduleIndex].topics[topicIndex];
    
    setSelectedTopic({ moduleIndex, topicIndex, topic });
    setStreamingContent('');
    
    if (!topic.content) {
      try {
        generateTopicDetail(topic, (partialContent) => {
          setStreamingContent(partialContent);
        }).then(enrichedTopic => {
          const updatedModules = [...modules];
          updatedModules[moduleIndex].topics[topicIndex] = enrichedTopic;
          setModules(updatedModules);
          
          setSelectedTopic({ moduleIndex, topicIndex, topic: enrichedTopic });
          setStreamingContent('');
          
          markTopicCompleted(moduleIndex, topicIndex);
        });
      } catch (error) {
        console.error("Error generating topic details:", error);
        toast.error("Failed to load detailed content. Please try again.");
        setStreamingContent('');
      }
    } else {
      markTopicCompleted(moduleIndex, topicIndex);
    }
  };
  
  const handleNewSearch = () => {
    setSearchPerformed(false);
    setModules([]);
    setSelectedTopic(null);
    setStreamingContent('');
    setCurrentModuleIndex(0);
    setCompletedTopics({});
    setModuleProgress({});
    setCurrentHistoryId(null);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setStreamingContent('');
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
  
  const handleToggleLearningPath = () => {
    setShowLearningPath(!showLearningPath);
  };

  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    if (pendingSearch) {
      handleSearch(pendingSearch);
      setPendingSearch(null);
    }
  };

  const handleToggleHistory = () => {
    setShowHistoryModal(!showHistoryModal);
  };
  
  const renderContent = () => {
    if (selectedTopic !== null) {
      return (
        <TopicDetail 
          topic={selectedTopic.topic} 
          onBack={handleBackToTopics} 
          streamingContent={streamingContent}
          historyId={currentHistoryId}
          moduleIndex={selectedTopic.moduleIndex}
          topicIndex={selectedTopic.topicIndex}
        />
      );
    }
    
    if (isLoading) {
      return <LoadingContent />;
    }
    
    if (searchPerformed && modules.length > 0) {
      return (
        <div className="container mx-auto mt-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Exploring Knowledge</h1>
            <div className="flex gap-2">
              <button 
                onClick={handleToggleHistory}
                className="flex items-center gap-2 text-sm bg-primary/20 border border-primary/20 rounded-md px-3 py-2 hover:bg-primary/30 transition-colors"
              >
                <span>History</span>
                <HistoryIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={handleToggleLearningPath}
                className="flex items-center gap-2 text-sm bg-primary/20 border border-primary/20 rounded-md px-3 py-2 hover:bg-primary/30 transition-colors"
              >
                <span>Learning Path</span>
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <ModuleGrid 
            modules={modules} 
            onSelectTopic={handleSelectTopic} 
            currentModuleIndex={currentModuleIndex}
            onNextModule={handleNextModule}
          />
        </div>
      );
    }
    
    if (searchPerformed && modules.length === 0 && !isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't generate knowledge modules for your query. Please try a different search term.
          </p>
          <SearchInput onSearch={handleSearch} onLoginRequired={handleLoginRequired} />
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Deep Dive into Knowledge</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Explore any academic or research topic in a structured, progressively expanding format designed for deep understanding.
        </p>
        <SearchInput onSearch={handleSearch} onLoginRequired={handleLoginRequired} />
        <div className="relative w-full mt-8 overflow-hidden">
          <div className="animate-carousel flex gap-4 py-4">
            {[
              { icon: "🌌", title: "Black Hole Paradoxes" },
              { icon: "🔬", title: "Dark Matter Theory" },
              { icon: "💭", title: "Dream Science Research" },
              { icon: "🧘", title: "Meditation Neuroscience" },
              { icon: "🤖", title: "Quantum Computing" },
              { icon: "🚀", title: "Space Exploration" },
              { icon: "🧠", title: "AI Ethics" },
              { icon: "🔮", title: "Cognitive Science" },
              { icon: "🧬", title: "Genetic Engineering" },
              { icon: "🌍", title: "Climate Science" },
              { icon: "⚛️", title: "Particle Physics" },
              { icon: "🦠", title: "Microbiology" }
            ].map((topic, index) => (
              <PopularTopic
                key={index}
                icon={topic.icon}
                title={topic.title}
                onClick={() => {
                  if (isAuthenticated) {
                    handleSearch(topic.title);
                  } else {
                    setPendingSearch(topic.title);
                    setShowLoginModal(true);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderLearningPath = () => {
    if (showLearningPath && modules.length > 0) {
      return (
        <LearningPath 
          modules={modules} 
          currentModuleIndex={currentModuleIndex} 
          onClose={() => setShowLearningPath(false)} 
        />
      );
    }
    return null;
  };
  
  const currentModule = selectedTopic ? modules[selectedTopic.moduleIndex] : (modules[currentModuleIndex] || null);
  const currentTopicIndices = selectedTopic ? { moduleIndex: selectedTopic.moduleIndex, topicIndex: selectedTopic.topicIndex } : null;
  
  return (
    <>
      <ChiplingLayout 
        modules={modules}
        currentModule={currentModule}
        onSelectTopic={handleSelectTopic}
        currentTopicIndices={currentTopicIndices}
        currentModuleIndex={currentModuleIndex}
        onNextModule={handleNextModule}
        onHistoryClick={handleToggleHistory}
        onNewSearch={handleNewSearch}
        completedTopics={completedTopics}
      >
        {renderContent()}
        {renderLearningPath()}
      </ChiplingLayout>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
      
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onSelectHistory={handleSelectHistory}
      />
    </>
  );
};

interface PopularTopicProps {
  icon: string;
  title: string;
  onClick: () => void;
}

const PopularTopic: FC<PopularTopicProps> = ({ icon, title, onClick }) => {
  return (
    <button 
      className="popular-topic group"
      onClick={onClick}
    >
      <span className="popular-topic-icon">{icon}</span>
      <span className="popular-topic-title">{title}</span>
    </button>
  );
};

export default Index;
