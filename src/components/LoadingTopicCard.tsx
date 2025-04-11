import { FC } from 'react';

const LoadingTopicCard: FC = () => {
    return (
      <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-md overflow-hidden animate-pulse">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="h-6 bg-accent/20 rounded w-2/3"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-accent/20 rounded-full"></div>
              <div className="w-8 h-8 bg-accent/20 rounded-full"></div>
            </div>
          </div>
          <div className="mb-4">
            <div className="h-6 bg-accent/20 rounded w-1/4"></div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-accent/20 rounded w-full"></div>
            <div className="h-6 bg-accent/20 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    );
  };
  
export default LoadingTopicCard;