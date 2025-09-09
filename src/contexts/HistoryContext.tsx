
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  HistoryEntry, 
  getSearchHistory, 
  saveSearchHistory, 
  updateHistoryProgress,
  deleteHistoryEntry,
  saveTopicDetails
} from '@/services/firebaseService';
import { Module, Topic } from '@/types/knowledge';

interface HistoryContextType {
  history: HistoryEntry[];
  loading: boolean;
  addToHistory: (query: string, modules: Module[]) => Promise<string>;
  updateProgress: (historyId: string, completedTopics: number, moduleProgress: Record<number, number>) => Promise<void>;
  saveTopicDetail: (historyId: string, moduleIndex: number, topicIndex: number, topic: Topic) => Promise<void>;
  deleteEntry: (historyId: string) => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType>({
  history: [],
  loading: false,
  addToHistory: async () => '',
  updateProgress: async () => {},
  saveTopicDetail: async () => {},
  deleteEntry: async () => {}
});

export const useHistory = () => useContext(HistoryContext);

interface HistoryProviderProps {
  children: ReactNode;
}

export const HistoryProvider: React.FC<HistoryProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (isAuthenticated && user) {
        setLoading(true);
        try {
          const entries = await getSearchHistory(user.uid);
          
          // Ensure all entries have valid module structures
          const validEntries = entries.map(entry => ({
            ...entry,
            modules: Array.isArray(entry.modules) 
              ? entry.modules.map(module => ({
                  ...module,
                  topics: Array.isArray(module.topics) ? module.topics : []
                }))
              : [],
            moduleProgress: entry.moduleProgress || {}
          }));
          
          setHistory(validEntries);
        } catch (error) {
          console.error('Error fetching history:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setHistory([]);
      }
    };

    fetchHistory();
  }, [isAuthenticated, user]);

  const addToHistory = async (query: string, modules: Module[]): Promise<string> => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to add to history');
    }

    // Ensure modules have proper structure before saving
    const validModules = modules.map(module => ({
      ...module,
      topics: Array.isArray(module.topics) ? module.topics : []
    }));
    
    const historyId = await saveSearchHistory(user.uid, query, validModules);
    
    // Update local state with the new entry
    const moduleProgress: Record<number, number> = {};
    validModules.forEach((_, index) => {
      moduleProgress[index] = 0;
    });
    
    const newEntry: HistoryEntry = {
      id: historyId,
      query,
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
      modules: validModules,
      progress: 0,
      totalTopics: validModules.reduce((total, module) => total + module.topics.length, 0),
      completedTopics: 0,
      moduleProgress
    };
    
    setHistory(prevHistory => [newEntry, ...prevHistory]);
    
    return historyId;
  };

  const updateProgress = async (historyId: string, completedTopics: number, moduleProgress: Record<number, number>): Promise<void> => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to update progress');
    }

    await updateHistoryProgress(user.uid, historyId, completedTopics, moduleProgress);
    
    // Update local state
    setHistory(prevHistory => 
      prevHistory.map(entry => {
        if (entry.id === historyId) {
          const progress = Math.round((completedTopics / entry.totalTopics) * 100);
          return {
            ...entry,
            completedTopics,
            progress,
            lastAccessedAt: Date.now(),
            moduleProgress
          };
        }
        return entry;
      })
    );
  };
  
  const saveTopicDetail = async (historyId: string, moduleIndex: number, topicIndex: number, topic: Topic): Promise<void> => {
    if (!isAuthenticated || !user) {
      return;
    }
    
    try {
      await saveTopicDetails(user.uid, historyId, moduleIndex, topicIndex, topic);
      
      // Update local state
      setHistory(prevHistory => 
        prevHistory.map(entry => {
          if (entry.id === historyId && Array.isArray(entry.modules) && entry.modules[moduleIndex]) {
            const updatedModules = [...entry.modules];
            if (!Array.isArray(updatedModules[moduleIndex].topics)) {
              updatedModules[moduleIndex].topics = [];
            }
            updatedModules[moduleIndex].topics[topicIndex] = topic;
            
            return {
              ...entry,
              modules: updatedModules,
              lastAccessedAt: Date.now()
            };
          }
          return entry;
        })
      );
    } catch (error) {
      console.error('Error saving topic details:', error);
    }
  };

  const deleteEntry = async (historyId: string): Promise<void> => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to delete history');
    }

    await deleteHistoryEntry(user.uid, historyId);
    
    // Update local state
    setHistory(prevHistory => prevHistory.filter(entry => entry.id !== historyId));
  };

  const value = {
    history,
    loading,
    addToHistory,
    updateProgress,
    saveTopicDetail,
    deleteEntry
  };

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
};
