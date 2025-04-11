import { FC } from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingTopicDetail: FC = () => {
  return (
    <div className="container mx-auto px-4 lg:px-8 max-w-7xl mt-auto opacity-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4 -mx-4 px-4 lg:-mx-8 lg:px-8 border-b border-border/50">
        <Button 
          variant="ghost" 
          size="sm" 
          className="transition-all duration-300 hover:translate-x-[-4px]" 
          disabled
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to all topics
        </Button>
      </div>

      <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-4 lg:p-6 mt-4 mb-6 transition-all duration-300 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="h-8 bg-accent/20 rounded w-2/3 animate-pulse"></div>
          <div className="flex gap-2 self-end sm:self-auto">
            <div className="w-9 h-9 bg-accent/20 rounded-full animate-pulse"></div>
            <div className="w-9 h-9 bg-accent/20 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="mb-4">
          <div className="h-5 bg-accent/20 rounded w-1/4 animate-pulse" style={{ animationDelay: '200ms' }}></div>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="space-y-2 mb-4">
            <div className="h-5 bg-accent/20 rounded w-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            <div className="h-5 bg-accent/20 rounded w-4/5 animate-pulse" style={{ animationDelay: '300ms' }}></div>
          </div>
          
          <div className="space-y-4 my-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="h-4 bg-accent/20 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-accent/20 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-accent/20 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-accent/20 rounded w-4/5 animate-pulse"></div>
            <div className="h-4 bg-accent/20 rounded w-full animate-pulse"></div>
          </div>

          <div className="mt-8">
            <div className="h-7 bg-accent/20 rounded w-1/3 mb-4 animate-pulse" style={{ animationDelay: '500ms' }}></div>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div 
                  key={index}
                  className="border border-border/50 rounded-md overflow-hidden bg-card/20 p-4 animate-fade-in" style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className="h-6 bg-accent/20 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="h-6 bg-accent/20 rounded w-1/4 mb-4 animate-pulse" style={{ animationDelay: '700ms' }}></div>
            <div className="space-y-3">
              <div className="h-4 bg-accent/20 rounded w-full animate-pulse" style={{ animationDelay: '800ms' }}></div>
              <div className="h-4 bg-accent/20 rounded w-5/6 animate-pulse" style={{ animationDelay: '900ms' }}></div>
              <div className="h-4 bg-accent/20 rounded w-4/5 animate-pulse" style={{ animationDelay: '1000ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingTopicDetail;