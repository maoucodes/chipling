
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
          const entries = await getSearchHistory(user.uid);
          setHistory(entries);
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

    const historyId = await saveSearchHistory(user.uid, query, modules);
    return historyId;
  };

  const updateProgress = async (historyId: string, completedTopics: number): Promise<void> => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to update progress');
    }

    await updateHistoryProgress(user.uid, historyId, completedTopics);
  };

  const deleteEntry = async (historyId: string): Promise<void> => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to delete history');
    }

    await deleteHistoryEntry(user.uid, historyId);
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
