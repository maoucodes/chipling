
import { useState, FC } from 'react';
import { toast } from 'sonner';
import ChiplingLayout from '@/components/ChiplingLayout';
import SearchInput from '@/components/SearchInput';
import ModuleGrid from '@/components/ModuleGrid';
import TopicDetail from '@/components/TopicDetail';
import LearningPath from '@/components/LearningPath';
import LoadingContent from '@/components/LoadingContent';
import { Module, Topic } from '@/types/knowledge';
import { generateModules, generateTopicDetail } from '@/services/contentService';
import { MapIcon, LayersIcon, HistoryIcon } from 'lucide-react';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { useRabbitHoles } from '@/contexts/RabbitHolesContext';
import RabbitHolesView from '@/components/RabbitHolesView';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<{moduleIndex: number, topicIndex: number, topic: Topic} | null>(null);
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingSearch, setPendingSearch] = useState<string | null>(null);
  const [showRabbitHoles, setShowRabbitHoles] = useState(false);
  
  const handleSearch = async (query: string) => {
    // Set loading state
    setIsLoading(true);
    setSearchPerformed(true);
    setCurrentModuleIndex(0); // Reset to first module on new search
    
    try {
      // Generate content using the LLM
      const generatedModules = await generateModules(query);
      setModules(generatedModules);
      toast.success(`Found knowledge modules for "${query}"`);
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please try again.");
      // Set empty modules if failed
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectTopic = async (moduleIndex: number, topicIndex: number) => {
    const topic = modules[moduleIndex].topics[topicIndex];
    
    // First set with basic info to show something is happening
    setSelectedTopic({ moduleIndex, topicIndex, topic });
    setStreamingContent(''); // Reset streaming content
    
    // Then fetch detailed content if we don't have it yet
    if (!topic.content) {
      try {
        // Begin streaming content
        generateTopicDetail(topic, (partialContent) => {
          setStreamingContent(partialContent);
        }).then(enrichedTopic => {
          // Update the module with the enriched topic
          const updatedModules = [...modules];
          updatedModules[moduleIndex].topics[topicIndex] = enrichedTopic;
          setModules(updatedModules);
          
          // Update the selected topic
          setSelectedTopic({ moduleIndex, topicIndex, topic: enrichedTopic });
          setStreamingContent(''); // Clear streaming content when done
        });
      } catch (error) {
        console.error("Error generating topic details:", error);
        toast.error("Failed to load detailed content. Please try again.");
        setStreamingContent(''); // Clear streaming on error
      }
    }
  };
  
  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setStreamingContent('');
  };
  
  const handleNextModule = () => {
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      toast.success(`Navigating to Module ${currentModuleIndex + 2}`);
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

  const handleToggleRabbitHoles = () => {
    setShowRabbitHoles(!showRabbitHoles);
  };
  
  const renderContent = () => {
    // If showing rabbit holes view
    if (showRabbitHoles) {
      return (
        <RabbitHolesView 
          onSelectRabbitHole={handleSearch}
          onClose={() => setShowRabbitHoles(false)}
        />
      );
    }
    
    // If a topic is selected, show the topic detail view
    if (selectedTopic !== null) {
      return (
        <TopicDetail 
          topic={selectedTopic.topic} 
          onBack={handleBackToTopics} 
          streamingContent={streamingContent}
        />
      );
    }
    
    // If content is loading, show the loading state
    if (isLoading) {
      return <LoadingContent />;
    }
    
    // If search has been performed, show the module grid
    if (searchPerformed && modules.length > 0) {
      return (
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Exploring Knowledge</h1>
            <div className="flex gap-2">
              <button 
                onClick={handleToggleRabbitHoles}
                className="flex items-center gap-2 text-sm bg-primary/20 border border-primary/20 rounded-md px-3 py-2 hover:bg-primary/30 transition-colors"
              >
                <span>Rabbit Holes</span>
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
    
    // If search performed but no results
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
    
    // Initial state - show landing content
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold mb-4">"Deep Dive into Knowledge"</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Explore any academic or research topic in a structured, progressively expanding format designed for deep understanding.
        </p>
        <SearchInput onSearch={handleSearch} onLoginRequired={handleLoginRequired} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-8">
          <PopularTopic 
            icon="🌌" 
            title="Black Hole Paradoxes" 
            onClick={() => {
              if (isAuthenticated) {
                handleSearch("Black Hole Paradoxes");
              } else {
                setPendingSearch("Black Hole Paradoxes");
                setShowLoginModal(true);
              }
            }}
          />
          <PopularTopic 
            icon="🔬" 
            title="Dark Matter Theory" 
            onClick={() => {
              if (isAuthenticated) {
                handleSearch("Dark Matter Theory");
              } else {
                setPendingSearch("Dark Matter Theory");
                setShowLoginModal(true);
              }
            }}
          />
          <PopularTopic 
            icon="💭" 
            title="Dream Science Research" 
            onClick={() => {
              if (isAuthenticated) {
                handleSearch("Dream Science Research");
              } else {
                setPendingSearch("Dream Science Research");
                setShowLoginModal(true);
              }
            }}
          />
          <PopularTopic 
            icon="🧘" 
            title="Meditation Neuroscience" 
            onClick={() => {
              if (isAuthenticated) {
                handleSearch("Meditation Neuroscience");
              } else {
                setPendingSearch("Meditation Neuroscience");
                setShowLoginModal(true);
              }
            }}
          />
        </div>
      </div>
    );
  };
  
  const renderLearningPath = () => {
    if (showLearningPath && modules.length > 0) {
      return (
        <LearningPath 
          module={modules[currentModuleIndex]} 
          currentModuleIndex={currentModuleIndex} 
          totalModules={modules.length} 
          onClose={() => setShowLearningPath(false)} 
        />
      );
    }
    return null;
  };
  
  // Determine the current module for the sidebar
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
      >
        {renderContent()}
        {renderLearningPath()}
      </ChiplingLayout>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
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
      className="p-4 bg-card/30 backdrop-blur-sm border border-border/50 rounded-md hover:bg-card/50 transition-colors flex items-center gap-3"
      onClick={onClick}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium">{title}</span>
    </button>
  );
};

export default Index;
