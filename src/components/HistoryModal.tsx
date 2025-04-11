
import { FC, useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Trash2Icon } from 'lucide-react';
import { useHistory } from '@/contexts/HistoryContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHistory: (query: string, modules: any[]) => void;
}

const HistoryModal: FC<HistoryModalProps> = ({ isOpen, onClose, onSelectHistory }) => {
  const { history, loading, deleteEntry } = useHistory();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleContinue = (entry: any) => {
    onSelectHistory(entry.query, entry.modules);
    onClose();
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id);
      toast.success("Journey deleted successfully");
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting journey:", error);
      toast.error("Failed to delete journey");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Your Journeys</DialogTitle>
        </DialogHeader>
        
        {loading && (
          <div className="py-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your journeys...</p>
          </div>
        )}
        
        {!loading && history.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">You haven't started any journeys yet.</p>
          </div>
        )}
        
        {!loading && history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {history.map((entry) => (
              <div key={entry.id} className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-md overflow-hidden">
                <div className="p-5">
                  <h3 className="text-lg font-medium mb-1">{entry.query}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Created on: {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                  </p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                    <span>Progress: {entry.completedTopics} / {entry.totalTopics}</span>
                    <span>{entry.progress}%</span>
                  </div>
                  <Progress value={entry.progress} className="h-1.5 mb-4" />
                  
                  <div className="flex justify-between mt-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setDeletingId(entry.id)}>
                          <Trash2Icon className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your journey and remove the data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(entry.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button variant="default" className="ml-auto" onClick={() => handleContinue(entry)}>
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
