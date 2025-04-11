
import { FC } from 'react';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Module } from '@/types/knowledge';

interface LearningPathProps {
  modules: Module[];
  currentModuleIndex: number;
  onClose: () => void;
}

const LearningPath: FC<LearningPathProps> = ({ 
  modules, 
  currentModuleIndex, 
  onModuleSelect,
  onClose
}) => {
  // Calculate progress as a percentage
  const progressPercentage = ((currentModuleIndex + 1) / modules.length) * 100;
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-lg flex flex-col max-h-[90vh] animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h2 className="text-xl font-semibold">Learning Path</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted/30 transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-hidden flex flex-col min-h-0">
          <div className="mb-6 shrink-0">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{currentModuleIndex + 1} of {modules.length} modules</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="space-y-4 overflow-y-auto pr-2 min-h-0 flex-1">
            {modules.map((module, index) => (
              <div
                key={index}
                className={cn(
                  "w-full p-4 border rounded-md flex items-center gap-3",
                  index === currentModuleIndex ? "bg-primary/10 border-primary/30" : "border-border/50"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                  index === currentModuleIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                <span className={index === currentModuleIndex ? "font-medium" : ""}>{module.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
