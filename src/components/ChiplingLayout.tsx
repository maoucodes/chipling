
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatPanel from './ChatPanel';
import { useLocation } from 'react-router-dom';

interface ChiplingLayoutProps {
  children: ReactNode;
  currentModule?: any;
  modules?: any[];
  onSelectTopic?: (moduleIndex: number, topicIndex: number) => void;
  currentTopicIndices?: { moduleIndex: number, topicIndex: number } | null;
}

const ChiplingLayout = ({ 
  children, 
  currentModule,
  modules,
  onSelectTopic,
  currentTopicIndices
}: ChiplingLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar 
        currentModule={currentModule}
        modules={modules}
        onSelectTopic={onSelectTopic}
        currentTopicIndices={currentTopicIndices}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      <ChatPanel />
    </div>
  );
};

export default ChiplingLayout;
