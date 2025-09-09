import { FC } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuitIcon } from '@/components/ui/icons';
import { Progress } from '@/components/ui/progress';

interface LoadingContentProps {
  message?: string;
  stage?: 'modules' | 'topics' | 'content';
}

const LoadingContent: FC<LoadingContentProps> = ({ 
  message = "Generating knowledge modules...",
  stage = 'modules'
}) => {
  const getStageMessage = () => {
    switch (stage) {
      case 'modules':
        return "Structuring learning modules...";
      case 'topics':
        return "Generating topics for modules...";
      case 'content':
        return "Creating detailed content...";
      default:
        return message;
    }
  };
  
  const getStageDescription = () => {
    switch (stage) {
      case 'modules':
        return "Creating a structured learning path for your topic";
      case 'topics':
        return "Generating relevant topics for each module";
      case 'content':
        return "Creating detailed educational content";
      default:
        return "Chipling is analyzing and structuring knowledge on your topic. This may take a few moments.";
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full py-12 opacity-0 animate-fade-in">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 flex items-center justify-center animate-pulse-subtle">
          <BrainCircuitIcon className="w-12 h-12 text-primary/70" />
        </div>
        <div className="absolute inset-0 border-t-2 border-primary/30 rounded-full animate-spin"></div>
      </div>
      
      <h3 className="text-xl font-bold mb-2">{getStageMessage()}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        {getStageDescription()}
      </p>
      
      <div className="w-full max-w-md space-y-3">
        <Progress value={stage === 'modules' ? 30 : stage === 'topics' ? 60 : 90} className="h-2 mb-6">
          <div className="absolute bg-primary h-full w-full animate-pulse-subtle rounded-full opacity-25"></div>
        </Progress>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
};

export default LoadingContent;