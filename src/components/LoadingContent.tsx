
import { FC } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuitIcon } from '@/components/ui/icons';

interface LoadingContentProps {
  message?: string;
}

const LoadingContent: FC<LoadingContentProps> = ({ 
  message = "Generating knowledge modules..."
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <BrainCircuitIcon className="w-12 h-12 text-primary/70" />
        </div>
        <div className="absolute inset-0 border-t-2 border-primary/30 rounded-full animate-spin"></div>
      </div>
      
      <h3 className="text-xl font-medium mb-2">{message}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Chipling is analyzing and structuring knowledge on your topic. This may take a few moments.
      </p>
      
      <div className="w-full max-w-md space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
};

export default LoadingContent;
