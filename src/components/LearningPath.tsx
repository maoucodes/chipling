import { FC } from 'react';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Module } from '@/types/knowledge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface LearningPathProps {
  modules: Module[];
  currentModuleIndex: number;
  onClose: () => void;
  onModuleSelect?: (moduleIndex: number) => void;
}

const LearningPath: FC<LearningPathProps> = ({ 
  modules, 
  currentModuleIndex, 
  onModuleSelect,
  onClose
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Calculate progress as a percentage
  const progressPercentage = ((currentModuleIndex + 1) / modules.length) * 100;
  
  const handleModuleSelect = (moduleIndex: number) => {
    // First call the provided onModuleSelect callback if it exists
    if (onModuleSelect) {
      onModuleSelect(moduleIndex);
    }
    
    // Navigate to the app page
    navigate('/app');
    
    // Close the learning path modal
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-lg flex flex-col max-h-[90vh] animate-scale-in m-2 sm:m-0">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border shrink-0">
          <h2 className="text-lg sm:text-xl font-bold">Learning Path</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted/30 transition-colors focus-ring">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 overflow-hidden flex flex-col min-h-0">
          <div className="mb-5 sm:mb-6 shrink-0">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{currentModuleIndex + 1} of {modules.length} modules</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="space-y-3 sm:space-y-4 overflow-y-auto pr-2 min-h-0 flex-1 scrollbar-thin">
            {modules.map((module, index) => (
              <div
                key={index}
                className={cn(
                  "w-full p-3 sm:p-4 border rounded-md flex items-center gap-3 cursor-pointer transition-colors focus-ring",
                  index === currentModuleIndex ? "bg-primary/10 border-primary/30" : "border-border/50 hover:bg-accent/10"
                )}
                onClick={() => handleModuleSelect(index)}
              >
                <div className={cn(
                  "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold",
                  index === currentModuleIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                <span className={cn("text-sm sm:text-base", index === currentModuleIndex ? "font-bold" : "")}>{module.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;