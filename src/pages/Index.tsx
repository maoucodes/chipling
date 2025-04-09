
import { useState } from 'react';
import ChiplingLayout from '@/components/ChiplingLayout';
import SearchInput from '@/components/SearchInput';
import ModuleGrid from '@/components/ModuleGrid';
import TopicDetail from '@/components/TopicDetail';
import LearningPath from '@/components/LearningPath';
import { Module, Topic } from '@/types/knowledge';
import { mockModules, timeMockModule } from '@/data/sampleData';
import { toast } from 'sonner';

const Index = () => {
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [selectedTopic, setSelectedTopic] = useState<{moduleIndex: number, topicIndex: number} | null>(null);
  const [showLearningPath, setShowLearningPath] = useState(false);
  
  const handleSearch = (query: string) => {
    // In a real app, this would fetch data from an API
    // For now, we'll simulate a search result using mock data
    setSearchPerformed(true);
    
    // Create a synthetic delay to simulate API call
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 800)),
      {
        loading: 'Exploring knowledge on ' + query + '...',
        success: 'Found relevant topics',
        error: 'Error fetching topics'
      }
    );
    
    // Set mock data as the result
    if (query.toLowerCase().includes('time') || query.toLowerCase().includes('perception')) {
      setModules([timeMockModule]);
    } else {
      setModules(mockModules);
    }
  };
  
  const handleSelectTopic = (moduleIndex: number, topicIndex: number) => {
    setSelectedTopic({ moduleIndex, topicIndex });
  };
  
  const handleBackToTopics = () => {
    setSelectedTopic(null);
  };
  
  const handleToggleLearningPath = () => {
    setShowLearningPath(!showLearningPath);
  };
  
  const renderContent = () => {
    // If a topic is selected, show the topic detail view
    if (selectedTopic !== null) {
      const topic = modules[selectedTopic.moduleIndex].topics[selectedTopic.topicIndex];
      return <TopicDetail topic={topic} onBack={handleBackToTopics} />;
    }
    
    // If search has been performed, show the module grid
    if (searchPerformed) {
      return (
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Exploring Knowledge</h1>
            <button 
              onClick={handleToggleLearningPath}
              className="flex items-center gap-2 text-sm bg-primary/20 border border-primary/20 rounded-md px-3 py-2 hover:bg-primary/30 transition-colors"
            >
              <span>Learning Path</span>
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
          <ModuleGrid modules={modules} onSelectTopic={handleSelectTopic} />
        </div>
      );
    }
    
    // Initial state - show landing content
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Down the Rabbit Hole</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Explore any academic or research topic in a structured, progressively expanding format designed for deep understanding.
        </p>
        <SearchInput onSearch={handleSearch} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-8">
          <PopularTopic 
            icon="🌌" 
            title="Black Hole Paradoxes" 
            onClick={() => handleSearch("Black Hole Paradoxes")}
          />
          <PopularTopic 
            icon="🔬" 
            title="Dark Matter Theory" 
            onClick={() => handleSearch("Dark Matter Theory")}
          />
          <PopularTopic 
            icon="💭" 
            title="Dream Science Research" 
            onClick={() => handleSearch("Dream Science Research")}
          />
          <PopularTopic 
            icon="🧘" 
            title="Meditation Neuroscience" 
            onClick={() => handleSearch("Meditation Neuroscience")}
          />
        </div>
      </div>
    );
  };
  
  // Render learning path modal if shown
  const renderLearningPath = () => {
    if (showLearningPath && modules.length > 0) {
      return (
        <LearningPath 
          module={modules[0]} 
          currentModuleIndex={0} 
          totalModules={10} 
          onClose={() => setShowLearningPath(false)} 
        />
      );
    }
    return null;
  };
  
  return (
    <ChiplingLayout>
      {renderContent()}
      {renderLearningPath()}
    </ChiplingLayout>
  );
};

interface PopularTopicProps {
  icon: string;
  title: string;
  onClick: () => void;
}

const PopularTopic: React.FC<PopularTopicProps> = ({ icon, title, onClick }) => {
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

const MapIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z"/>
    <path d="M9 3v15"/>
    <path d="M15 6v15"/>
  </svg>
);

export default Index;
