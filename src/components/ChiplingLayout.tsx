
import React, { FC, ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Module, Topic } from '@/types/knowledge';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface ChiplingLayoutProps {
  children: ReactNode;
  currentModule?: Module | null;
  modules?: Module[];
  onSelectTopic?: (moduleIndex: number, topicIndex: number) => void;
  currentTopicIndices?: { moduleIndex: number; topicIndex: number } | null;
  currentModuleIndex?: number;
  onNextModule?: () => void;
  onHistoryClick?: () => void;
  completedTopics?: Record<string, boolean>;
}

const ChiplingLayout: FC<ChiplingLayoutProps> = ({ 
  children, 
  currentModule, 
  modules = [],
  onSelectTopic,
  currentTopicIndices,
  currentModuleIndex = 0,
  onNextModule,
  onHistoryClick,
  completedTopics = {}
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          currentModule={currentModule} 
          modules={modules}
          onSelectTopic={onSelectTopic}
          currentTopicIndices={currentTopicIndices}
          currentModuleIndex={currentModuleIndex}
          onNextModule={onNextModule}
          onHistoryClick={onHistoryClick}
          completedTopics={completedTopics}
        />
      </div>
      
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar 
            currentModule={currentModule} 
            modules={modules}
            onSelectTopic={(moduleIndex, topicIndex) => {
              if (onSelectTopic) {
                onSelectTopic(moduleIndex, topicIndex);
                setSidebarOpen(false);
              }
            }}
            currentTopicIndices={currentTopicIndices}
            currentModuleIndex={currentModuleIndex}
            onNextModule={onNextModule}
            onHistoryClick={() => {
              if (onHistoryClick) {
                onHistoryClick();
                setSidebarOpen(false);
              }
            }}
            completedTopics={completedTopics}
          />
        </SheetContent>
      </Sheet>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ChiplingLayout;
