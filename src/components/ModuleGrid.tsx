
import { FC } from 'react';
import TopicCard from './TopicCard';
import { Module, Topic } from '@/types/knowledge';

interface ModuleGridProps {
  modules: Module[];
  onSelectTopic: (moduleIndex: number, topicIndex: number) => void;
}

const ModuleGrid: FC<ModuleGridProps> = ({ modules, onSelectTopic }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {modules.map((module, moduleIndex) => (
        module.topics.map((topic, topicIndex) => (
          <TopicCard
            key={`${moduleIndex}-${topicIndex}`}
            title={topic.title}
            relevance={topic.relevance}
            description={topic.description}
            onClick={() => onSelectTopic(moduleIndex, topicIndex)}
          />
        ))
      ))}
    </div>
  );
};

export default ModuleGrid;
