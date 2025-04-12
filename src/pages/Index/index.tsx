import { useState, FC } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/contexts/HistoryContext';
import ChiplingLayout from '@/components/ChiplingLayout';
import TopicDetail from '@/components/TopicDetail';
import LearningPath from '@/components/LearningPath';
import LoadingContent from '@/components/LoadingContent';
import LoginModal from '@/components/LoginModal';
import HistoryModal from '@/components/HistoryModal';
import WelcomeScreen from './WelcomeScreen';
import ExploringView from './ExploringView';
import NoResultsView from './NoResultsView';
import { useContentGeneration } from './useContentGeneration';
import { useModuleProgress } from './useModuleProgress';

const Index: FC = () => {
  const { isAuthenticated } = useAuth();
  const { history } = useHistory();
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingSearch, setPendingSearch] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  const {
    isLoading,
    modules,
    currentModuleIndex,
    selectedTopic,
    streamingContent,
    currentHistoryId,
    isLoadingRelatedContent,
    setCurrentHistoryId,
    handleSearch,
    handleSelectTopic,
    handleNextModule,
    handleBackToTopics,
    handleSelectHistory
  } = useContentGeneration();
  
  const {
    completedTopics,
    setCompletedTopics,
    markTopicCompleted
  } = useModuleProgress(modules, currentHistoryId);

  const handleSearchWithState = (query: string) => {
    setSearchPerformed(true);
    setCompletedTopics({});
    handleSearch(query);
  };
  
  const handleSelectTopicWithProgress = (moduleIndex: number, topicIndex: number) => {
    handleSelectTopic(moduleIndex, topicIndex);
    markTopicCompleted(moduleIndex, topicIndex);
  };

  const handleNewSearch = () => {
    setSearchPerformed(false);
    setShowLearningPath(false);
    setCompletedTopics({});
    setCurrentHistoryId(null);
  };

  const handleToggleLearningPath = () => {
    setShowLearningPath(!showLearningPath);
  };

  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    if (pendingSearch) {
      handleSearchWithState(pendingSearch);
      setPendingSearch(null);
    }
  };

  const handleToggleHistory = () => {
    setShowHistoryModal(!showHistoryModal);
  };
  
  const handleFullHistorySelect = (query: string, historyModules: any) => {
    setSearchPerformed(true);
    const validatedModules = handleSelectHistory(query, historyModules);
    
    const historyEntry = Array.isArray(history) ? 
      history.find(entry => entry.query === query) : 
      undefined;
      
    if (historyEntry) {
      setCurrentHistoryId(historyEntry.id);
      
      const completedCount = historyEntry.completedTopics || 0;
      const newCompletedTopics: Record<string, boolean> = {};
      
      let markedCount = 0;
      if (validatedModules) {
        validatedModules.forEach((module: any, moduleIndex: number) => {
          module.topics.forEach((_: any, topicIndex: number) => {
            if (markedCount < completedCount) {
              newCompletedTopics[`${moduleIndex}-${topicIndex}`] = true;
              markedCount++;
            }
          });
        });
        
        setCompletedTopics(newCompletedTopics);
      }
    }
  };
  
  const renderContent = () => {
    if (selectedTopic !== null) {
      return (
        <TopicDetail 
          topic={selectedTopic.topic} 
          onBack={handleBackToTopics} 
          streamingContent={streamingContent}
          historyId={currentHistoryId}
          moduleIndex={selectedTopic.moduleIndex}
          topicIndex={selectedTopic.topicIndex}
          isLoadingRelatedContent={isLoadingRelatedContent}
        />
      );
    }
    
    if (isLoading) {
      return <LoadingContent />;
    }
    
    if (searchPerformed && modules.length > 0) {
      return (
        <ExploringView
          modules={modules}
          onSelectTopic={handleSelectTopicWithProgress}
          currentModuleIndex={currentModuleIndex}
          onNextModule={handleNextModule}
          onToggleLearningPath={handleToggleLearningPath}
        />
      );
    }
    
    if (searchPerformed && modules.length === 0 && !isLoading) {
      return (
        <NoResultsView
          onSearch={handleSearchWithState}
          onLoginRequired={handleLoginRequired}
        />
      );
    }
    
    return (
      <WelcomeScreen
        onSearch={handleSearchWithState}
        onLoginRequired={handleLoginRequired}
        setPendingSearch={setPendingSearch}
        isAuthenticated={isAuthenticated}
      />
    );
  };
  
  const renderLearningPath = () => {
    if (showLearningPath && modules.length > 0) {
      return (
        <LearningPath 
          modules={modules} 
          currentModuleIndex={currentModuleIndex} 
          onClose={() => setShowLearningPath(false)} 
        />
      );
    }
    return null;
  };
  
  const currentModule = selectedTopic ? modules[selectedTopic.moduleIndex] : (modules[currentModuleIndex] || null);
  const currentTopicIndices = selectedTopic ? { moduleIndex: selectedTopic.moduleIndex, topicIndex: selectedTopic.topicIndex } : null;
  
  return (
    <>
      <ChiplingLayout 
        modules={modules}
        currentModule={currentModule}
        onSelectTopic={handleSelectTopicWithProgress}
        currentTopicIndices={currentTopicIndices}
        currentModuleIndex={currentModuleIndex}
        onNextModule={handleNextModule}
        onHistoryClick={handleToggleHistory}
        onNewSearch={handleNewSearch}
        completedTopics={completedTopics}
      >
        {renderContent()}
        {renderLearningPath()}
      </ChiplingLayout>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
      
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onSelectHistory={handleFullHistorySelect}
      />
    </>
  );
};

export default Index;
