
import React from 'react';
import { useRabbitHoles } from '@/contexts/RabbitHolesContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatDistance } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRightIcon, TrashIcon } from 'lucide-react';

interface RabbitHolesViewProps {
  onSelectRabbitHole: (query: string) => void;
  onClose: () => void;
}

const RabbitHolesView: React.FC<RabbitHolesViewProps> = ({ onSelectRabbitHole, onClose }) => {
  const { rabbitHoles, loading } = useRabbitHoles();

  const handleSelectRabbitHole = (query: string) => {
    onSelectRabbitHole(query);
    onClose();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Rabbit Holes</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : rabbitHoles.length > 0 ? (
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {rabbitHoles.map((rabbitHole) => (
              <div 
                key={rabbitHole.id} 
                className="border border-border/50 rounded-md p-4 hover:bg-accent/5 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <h3 
                      className="font-medium cursor-pointer hover:text-primary" 
                      onClick={() => handleSelectRabbitHole(rabbitHole.query)}
                    >
                      {rabbitHole.query}
                    </h3>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>Created {formatDistance(rabbitHole.createdAt, new Date(), { addSuffix: true })}</span>
                      <span>{rabbitHole.progress}% Complete</span>
                    </div>
                    <Progress value={rabbitHole.progress} className="h-1.5" />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2" 
                    onClick={() => handleSelectRabbitHole(rabbitHole.query)}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <p>You haven't explored any rabbit holes yet.</p>
          <Button variant="outline" className="mt-2" onClick={onClose}>
            Start Exploring
          </Button>
        </div>
      )}
    </div>
  );
};

export default RabbitHolesView;
