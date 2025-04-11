
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  HistoryEntry, 
  getSearchHistory, 
  saveSearchHistory, 
  updateHistoryProgress,
  deleteHistoryEntry
} from '@/services/firebaseService';
import { Module } from '@/types/knowledge';

interface HistoryContextType {
  history: HistoryEntry[];
  loading: boolean;
  addToHistory: (query: string, modules: Module[]) => Promise<string>;
  updateProgress: (historyId: string, completedTopics: number) => Promise<void>;
  deleteEntry: (historyId: string) => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType>({
  history: [],
  loading: false,
  addToHistory: async () => '',
  updateProgress: async () => {},
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
          console.log(`Fetching history for user ${user.uid}`);
          const entries = await getSearchHistory(user.uid);
          setHistory(entries);
          console.log(`Fetched ${entries.length} history entries`);
        } catch (error) {
          console.error('Error fetching history:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('User not authenticated, setting history to empty array');
        setHistory([]);
      }
    };

    fetchHistory();
  }, [isAuthenticated, user]);

  const addToHistory = async (query: string, modules: Module[]): Promise<string> => {
    if (!isAuthenticated || !user) {
      console.error('User must be authenticated to add to history');
      throw new Error('User must be authenticated to add to history');
    }

    console.log(`Adding to history for user ${user.uid}: ${query}`);
    const historyId = await saveSearchHistory(user.uid, query, modules);
    
    // Update local state with the new entry
    const newEntry: HistoryEntry = {
      id: historyId,
      query,
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
      modules,
      progress: 0,
      totalTopics: modules.reduce((total, module) => total + module.topics.length, 0),
      completedTopics: 0
    };
    
    setHistory(prevHistory => [newEntry, ...prevHistory]);
    
    return historyId;
  };

  const updateProgress = async (historyId: string, completedTopics: number): Promise<void> => {
    if (!isAuthenticated || !user) {
      console.error('User must be authenticated to update progress');
      throw new Error('User must be authenticated to update progress');
    }

    console.log(`Updating progress for history entry ${historyId}: ${completedTopics} topics`);
    await updateHistoryProgress(user.uid, historyId, completedTopics);
    
    // Update local state
    setHistory(prevHistory => 
      prevHistory.map(entry => {
        if (entry.id === historyId) {
          const progress = Math.round((completedTopics / entry.totalTopics) * 100);
          return {
            ...entry,
            completedTopics,
            progress,
            lastAccessedAt: Date.now()
          };
        }
        return entry;
      })
    );
  };

  const deleteEntry = async (historyId: string): Promise<void> => {
    if (!isAuthenticated || !user) {
      console.error('User must be authenticated to delete history');
      throw new Error('User must be authenticated to delete history');
    }

    console.log(`Deleting history entry ${historyId}`);
    await deleteHistoryEntry(user.uid, historyId);
    
    // Update local state
    setHistory(prevHistory => prevHistory.filter(entry => entry.id !== historyId));
  };

  const value = {
    history,
    loading,
    addToHistory,
    updateProgress,
    deleteEntry
  };

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
};
