
import { FC } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuitIcon } from '@/components/ui/icons';
import { Progress } from '@/components/ui/progress';

interface LoadingContentProps {
  message?: string;
}

const LoadingContent: FC<LoadingContentProps> = ({ 
  message = "Generating knowledge modules..."
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12 opacity-0 animate-fade-in">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <BrainCircuitIcon className="w-12 h-12 text-primary/70" />
        </div>
        <div className="absolute inset-0 border-t-2 border-primary/30 rounded-full animate-spin"></div>
      </div>
      
      <h3 className="text-xl font-medium mb-2 animate-fade-in" style={{ animationDelay: '300ms' }}>{message}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
        Chipling is analyzing and structuring knowledge on your topic. This may take a few moments.
      </p>
      
      <div className="w-full max-w-md space-y-3 animate-fade-in" style={{ animationDelay: '500ms' }}>
        <Progress value={15} className="h-1 mb-6 opacity-75">
          <div className="absolute bg-primary h-full w-full animate-pulse rounded-full opacity-25"></div>
        </Progress>
        <Skeleton className="h-4 w-full animate-pulse" />
        <Skeleton className="h-4 w-3/4 animate-pulse" />
        <Skeleton className="h-4 w-5/6 animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingContent;
