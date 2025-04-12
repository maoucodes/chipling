
import { useState, useEffect } from 'react';
import { Module } from '@/types/knowledge';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/contexts/HistoryContext';

export const useModuleProgress = (modules: Module[], currentHistoryId: string | null) => {
  const { isAuthenticated } = useAuth();
  const { updateProgress } = useHistory();
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [moduleProgress, setModuleProgress] = useState<Record<number, number>>({});

  // Calculate module progress
  const calculateModuleProgress = (moduleIndex: number) => {
    if (!modules[moduleIndex]) return 0;
    
    const moduleTotalTopics = modules[moduleIndex].topics.length;
    if (moduleTotalTopics === 0) return 0;
    
    const moduleCompletedTopics = Object.keys(completedTopics)
      .filter(key => key.startsWith(`${moduleIndex}-`) && completedTopics[key])
      .length;
      
    return Math.round((moduleCompletedTopics / moduleTotalTopics) * 100);
  };
  
  const countCompletedTopics = () => {
    return Object.values(completedTopics).filter(Boolean).length;
  };

  useEffect(() => {
    const computeModuleProgress = () => {
      const progress: Record<number, number> = {};
      
      modules.forEach((module, index) => {
        progress[index] = calculateModuleProgress(index);
      });
      
      return progress;
    };
    
    const updateHistoryEntry = async () => {
      if (currentHistoryId && isAuthenticated) {
        const completed = countCompletedTopics();
        const moduleProgressData = computeModuleProgress();
        
        setModuleProgress(moduleProgressData);
        
        try {
          await updateProgress(currentHistoryId, completed, moduleProgressData);
          console.log(`Updated progress for history ID ${currentHistoryId}: ${completed} topics completed, module progress:`, moduleProgressData);
        } catch (error) {
          console.error("Error updating history progress:", error);
        }
      }
    };
    
    updateHistoryEntry();
  }, [completedTopics, currentHistoryId, isAuthenticated, modules, updateProgress]);

  const markTopicCompleted = (moduleIndex: number, topicIndex: number) => {
    const key = `${moduleIndex}-${topicIndex}`;
    setCompletedTopics(prev => ({
      ...prev,
      [key]: true
    }));
  };

  return {
    completedTopics,
    setCompletedTopics,
    moduleProgress,
    markTopicCompleted
  };
};
