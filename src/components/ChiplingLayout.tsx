import { FC, ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

interface ChiplingLayoutProps {
  children: ReactNode;
  modules?: any;
  currentModule?: any;
  onSelectTopic?: any;
  currentTopicIndices?: any;
  currentModuleIndex?: any;
  onNextModule?: any;
}

const ChiplingLayout: FC<ChiplingLayoutProps> = ({ 
  children, 
  modules, 
  currentModule, 
  onSelectTopic, 
  currentTopicIndices,
  currentModuleIndex,
  onNextModule
}) => {
  return (
    <div className="chipling-layout">
      <Sidebar 
        modules={modules}
        currentModule={currentModule}
        onSelectTopic={onSelectTopic}
        currentTopicIndices={currentTopicIndices}
        currentModuleIndex={currentModuleIndex}
        onNextModule={onNextModule}
      />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default ChiplingLayout;
