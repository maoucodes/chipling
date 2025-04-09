
import { FC } from 'react';
import TopicCard from './TopicCard';
import { Module, Topic } from '@/types/knowledge';
import { ChevronRight } from 'lucide-react';

interface ModuleGridProps {
  modules: Module[];
  onSelectTopic: (moduleIndex: number, topicIndex: number) => void;
  currentModuleIndex: number;
  onNextModule?: () => void;
}

const ModuleGrid: FC<ModuleGridProps> = ({ 
  modules, 
  onSelectTopic, 
  currentModuleIndex, 
  onNextModule 
}) => {
  // Only show the current module's topics
  const currentModule = modules[currentModuleIndex];
  
  if (!currentModule) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No module content available</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          Module {currentModuleIndex + 1}: {currentModule.title}
        </h2>
        
        {currentModuleIndex < modules.length - 1 && onNextModule && (
          <button 
            onClick={onNextModule}
            className="flex items-center gap-2 text-sm bg-primary/20 border border-primary/20 rounded-md px-3 py-2 hover:bg-primary/30 transition-colors"
          >
            Next Module <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentModule.topics.map((topic, topicIndex) => (
          <TopicCard
            key={`${currentModuleIndex}-${topicIndex}`}
            title={topic.title}
            relevance={topic.relevance}
            description={topic.description}
            onClick={() => onSelectTopic(currentModuleIndex, topicIndex)}
          />
        ))}
      </div>
    </div>
  );
};

export default ModuleGrid;
