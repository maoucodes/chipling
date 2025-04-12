
import { FC } from 'react';
import { Module } from '@/types/knowledge';
import { MapIcon } from 'lucide-react';
import ModuleGrid from '@/components/ModuleGrid';

interface ExploringViewProps {
  modules: Module[];
  onSelectTopic: (moduleIndex: number, topicIndex: number) => void;
  currentModuleIndex: number;
  onNextModule?: () => void;
  onToggleLearningPath: () => void;
}

const ExploringView: FC<ExploringViewProps> = ({
  modules,
  onSelectTopic,
  currentModuleIndex,
  onNextModule,
  onToggleLearningPath
}) => {
  return (
    <div className="container mx-auto mt-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Exploring Knowledge</h1>
        <div className="flex gap-2">
          <button 
            onClick={onToggleLearningPath}
            className="flex items-center gap-2 text-sm bg-primary/20 border border-primary/20 rounded-md px-3 py-2 hover:bg-primary/30 transition-colors"
          >
            <span>Learning Path</span>
            <MapIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <ModuleGrid 
        modules={modules} 
        onSelectTopic={onSelectTopic} 
        currentModuleIndex={currentModuleIndex}
        onNextModule={onNextModule}
      />
    </div>
  );
};

export default ExploringView;
