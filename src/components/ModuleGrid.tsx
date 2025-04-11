
import { FC, useState, useEffect } from 'react';
import TopicCard from './TopicCard';
import LoadingTopicCard from './LoadingTopicCard';
import { Module, Topic } from '@/types/knowledge';
import { ChevronRight } from 'lucide-react';
import exp from 'node:constants';

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
    <div className="container mx-auto px-4 animate-fade-in max-w-7xl flex flex-col h-full overflow-hidden">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm py-6 z-50 border-b border-border/50 flex-shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold">
            Module {currentModuleIndex + 1}: {currentModule.title}
          </h2>

          {currentModuleIndex < modules.length - 1 && onNextModule && (
            <button 
              onClick={onNextModule}
              className="flex items-center gap-2 text-sm bg-primary/20 border border-primary/20 rounded-md px-3 py-2 hover:bg-primary/30 transition-colors whitespace-nowrap"
            >
              Next Module <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {currentModule.topics.map((topic, topicIndex) => (
            <TopicCard
              key={`${currentModuleIndex}-${topicIndex}`}
              title={topic.title}
              relevance={topic.relevance}
              description={topic.description}
              onClick={() => onSelectTopic(currentModuleIndex, topicIndex)}
            />
          ))}
          {currentModule.topics.length === 0 && (
            Array.from({ length: 4 }).map((_, index) => (
              <LoadingTopicCard key={`loading-${index}`} />
            ))
          )}
          {currentModule.topics.length > 0 && currentModule.topics.length < 6 && (
            Array.from({ length: 4 - currentModule.topics.length }).map((_, index) => (
              <LoadingTopicCard key={`loading-${index}`} />
            ))
          )}
        </div>
    </div> 
  </div>
  );
};
export default ModuleGrid;