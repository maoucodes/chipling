
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RabbitHole, getRabbitHoles, saveRabbitHole, updateRabbitHoleProgress } from '@/services/firebaseService';

interface RabbitHolesContextType {
  rabbitHoles: RabbitHole[];
  loading: boolean;
  addRabbitHole: (query: string) => Promise<string>;
  updateProgress: (rabbitHoleId: string, progress: number) => Promise<void>;
}

const RabbitHolesContext = createContext<RabbitHolesContextType>({
  rabbitHoles: [],
  loading: false,
  addRabbitHole: async () => '',
  updateProgress: async () => {}
});

export const useRabbitHoles = () => useContext(RabbitHolesContext);

interface RabbitHolesProviderProps {
  children: ReactNode;
}

export const RabbitHolesProvider: React.FC<RabbitHolesProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [rabbitHoles, setRabbitHoles] = useState<RabbitHole[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRabbitHoles = async () => {
      if (isAuthenticated && user) {
        setLoading(true);
        try {
          const holes = await getRabbitHoles(user.uid);
          setRabbitHoles(holes);
        } catch (error) {
          console.error('Error fetching rabbit holes:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setRabbitHoles([]);
      }
    };

    fetchRabbitHoles();
  }, [isAuthenticated, user]);

  const addRabbitHole = async (query: string): Promise<string> => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to add a rabbit hole');
    }

    const rabbitHoleId = await saveRabbitHole(user.uid, query);
    return rabbitHoleId;
  };

  const updateProgress = async (rabbitHoleId: string, progress: number): Promise<void> => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to update progress');
    }

    await updateRabbitHoleProgress(user.uid, rabbitHoleId, progress);
  };

  const value = {
    rabbitHoles,
    loading,
    addRabbitHole,
    updateProgress
  };

  return <RabbitHolesContext.Provider value={value}>{children}</RabbitHolesContext.Provider>;
};
