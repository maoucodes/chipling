
import { FC, ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar 
        modules={modules}
        currentModule={currentModule}
        onSelectTopic={onSelectTopic}
        currentTopicIndices={currentTopicIndices}
        currentModuleIndex={currentModuleIndex}
        onNextModule={onNextModule}
      />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header />
        <ScrollArea className="flex-1 h-full">
          <main className="p-4 min-h-full">{children}</main>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChiplingLayout;
