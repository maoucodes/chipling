
import React, { FC, ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Module, Topic } from '@/types/knowledge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useNavigate, useLocation } from 'react-router-dom';

interface ChiplingLayoutProps {
  children: ReactNode;
  currentModule?: Module | null;
  modules?: Module[];
  onSelectTopic?: (moduleIndex: number, topicIndex: number) => void;
  currentTopicIndices?: { moduleIndex: number; topicIndex: number } | null;
  currentModuleIndex?: number;
  onNextModule?: () => void;
  onHistoryClick?: () => void;
  onNewSearch?: () => void;
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
  onNewSearch,
  completedTopics = {}
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Hide header on /app route
  const showHeader = location.pathname !== '/app';

  const handleSettingsClick = () => {
    navigate('/settings');
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar - increased width from 240px to 280px */}
      <div className="hidden md:block md:w-[280px] h-screen flex-shrink-0 border-r border-border/50">
        <Sidebar 
          currentModule={currentModule} 
          modules={modules}
          onSelectTopic={onSelectTopic}
          currentTopicIndices={currentTopicIndices}
          currentModuleIndex={currentModuleIndex}
          onNextModule={onNextModule}
          onHistoryClick={onHistoryClick}
          onNewSearch={onNewSearch}
          onSettingsClick={handleSettingsClick}
          completedTopics={completedTopics}
        />
      </div>
      
      {/* Mobile sidebar - increased width from 85vw to 90vw and max-width from sm:w-72 to sm:w-80 */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[90vw] sm:w-80 max-w-sm">
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
            onNewSearch={onNewSearch}
            onSettingsClick={handleSettingsClick}
            completedTopics={completedTopics}
          />
        </SheetContent>
      </Sheet>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {showHeader && <Header onOpenSidebar={() => setSidebarOpen(true)} />}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ChiplingLayout;
