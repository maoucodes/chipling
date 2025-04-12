
import { FC } from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

interface LoadingTopicDetailProps {
  loadingState?: 'full' | 'main-only' | 'related-only';
}

const LoadingTopicDetail: FC<LoadingTopicDetailProps> = ({ loadingState = 'full' }) => {
  const showMainContent = loadingState === 'full' || loadingState === 'main-only';
  const showRelatedContent = loadingState === 'full' || loadingState === 'related-only';

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-8 max-w-7xl mt-auto opacity-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-3 sm:py-4 -mx-3 px-3 sm:-mx-4 sm:px-4 lg:-mx-8 lg:px-8 border-b border-border/50">
        <Button 
          variant="ghost" 
          size="sm" 
          className="transition-all duration-300 hover:translate-x-[-4px]" 
          disabled
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Back to all topics</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>

      <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-3 sm:p-4 lg:p-6 mt-3 sm:mt-4 mb-6 transition-all duration-300 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <div className="h-7 sm:h-8 bg-accent/20 rounded w-2/3 animate-pulse"></div>
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
          
          {showMainContent && (
            <div className="space-y-4 my-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="h-4 bg-accent/20 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-accent/20 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-accent/20 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-accent/20 rounded w-4/5 animate-pulse"></div>
              <div className="h-4 bg-accent/20 rounded w-full animate-pulse"></div>
            </div>
          )}

          {showRelatedContent && (
            <>
              <div className="mt-8">
                <div className="h-7 bg-accent/20 rounded w-1/3 mb-4 animate-pulse" style={{ animationDelay: '500ms' }}></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div 
                      key={index}
                      className="border border-border/50 rounded-md overflow-hidden bg-card/20 p-3 sm:p-4 animate-fade-in" style={{ animationDelay: `${600 + index * 100}ms` }}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingTopicDetail;
