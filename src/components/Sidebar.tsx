import { FC, useState, useEffect, ReactNode, useMemo, memo } from 'react';
import { BookmarkIcon, HistoryIcon, LayersIcon, PlusIcon, ChevronRightIcon, ChevronDownIcon, SettingsIcon, SunIcon, MoonIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Module, Topic } from '@/types/knowledge';
import UserProfile from '@/components/UserProfile';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';

interface SidebarProps {
  currentModule?: Module | null;
  modules?: Module[];
  onSelectTopic?: (moduleIndex: number, topicIndex: number) => void;
  currentTopicIndices?: { moduleIndex: number, topicIndex: number } | null;
  currentModuleIndex?: number;
  onNextModule?: () => void;
  onHistoryClick?: () => void;
  onNewSearch?: () => void;
  onSettingsClick?: () => void;
  completedTopics?: Record<string, boolean>;
}

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

// Memoize SidebarItem to prevent unnecessary re-renders
const SidebarItem: FC<SidebarItemProps> = memo(({ icon, label, onClick }) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-2 my-1",
        "hover:bg-accent/10 dark:hover:bg-accent/20 rounded-md transition-all cursor-pointer text-base focus-ring"
      )}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
});

// Memoized TopicItem component to prevent unnecessary re-renders
const TopicItem = memo(({ 
  topic, 
  topicIndex, 
  moduleIndex, 
  module,
  modules,
  isCompleted, 
  isExpanded, 
  isActive, 
  onSelectTopic, 
  onToggleTopic,
  onNextModule
}: { 
  topic: Topic; 
  topicIndex: number; 
  moduleIndex: number; 
  module: Module;
  modules: Module[];
  isCompleted: boolean; 
  isExpanded: boolean; 
  isActive: boolean; 
  onSelectTopic?: (moduleIndex: number, topicIndex: number) => void; 
  onToggleTopic: (moduleIndex: number, topicIndex: number) => void;
  onNextModule?: () => void;
}) => {
  return (
    <Collapsible 
      key={topicIndex} 
      open={isExpanded}
      onOpenChange={() => onToggleTopic(moduleIndex, topicIndex)}
    >
      <div className={cn(
        "flex items-center gap-2 p-2 rounded-md cursor-pointer text-base",
        isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-accent/10",
        isCompleted ? "text-green-500 dark:text-green-400" : ""
      )}
      onClick={() => onSelectTopic && onSelectTopic(moduleIndex, topicIndex)}
      >
        <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button className="size-6 flex items-center justify-center rounded hover:bg-accent/20 focus-ring">
            {isExpanded ? (
              <ChevronDownIcon className="size-5" />
            ) : (
              <ChevronRightIcon className="size-5" />
            )}
          </button>
        </CollapsibleTrigger>
        
        <div className="w-6 h-6 flex items-center justify-center">
          {isCompleted ? (
            <div className="w-2.5 h-2.5 bg-green-500 dark:bg-green-400 rounded-full"></div>
          ) : (
            <div className="w-2.5 h-2.5 bg-muted rounded-full"></div>
          )}
        </div>
        
        <span className="truncate">{topic.title}</span>
      </div>
      
      <CollapsibleContent>
        {topic.subtopics && topic.subtopics.length > 0 ? (
          <div className="pl-8 pt-1 pb-1 space-y-1.5">
            {topic.subtopics.map((subtopic, subtopicIndex) => (
              <div 
                key={subtopicIndex}
                className="flex items-center gap-2 p-1.5 text-sm rounded-md hover:bg-accent/10 cursor-pointer"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                </div>
                <span className="truncate">{subtopic.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="pl-8 pt-1 pb-1 text-sm text-muted-foreground">
            No subtopics available
          </div>
        )}
        
        {topicIndex < module.topics.length - 1 && (
          <div 
            className="flex items-center gap-2 pl-8 p-1.5 text-sm text-primary hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectTopic && onSelectTopic(moduleIndex, topicIndex + 1);
            }}
          >
            <span>Next topic</span>
            <ChevronRightIcon className="size-4" />
          </div>
        )}
        
        {topicIndex === module.topics.length - 1 && moduleIndex < modules.length - 1 && onNextModule && (
          <div 
            className="flex items-center gap-2 pl-8 p-1.5 text-sm text-primary hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onNextModule();
            }}
          >
            <span>Next module</span>
            <ChevronRightIcon className="size-4" />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
});

// Memoized ModuleItem component to prevent unnecessary re-renders
const ModuleItem = memo(({ 
  module, 
  moduleIndex, 
  isCurrentModule, 
  isExpanded, 
  expandedTopics,
  modules,
  calculateProgress, 
  onSelectTopic, 
  onToggleModule, 
  onToggleTopic, 
  currentTopicIndices, 
  onNextModule, 
  completedTopics 
}: { 
  module: Module; 
  moduleIndex: number; 
  isCurrentModule: boolean; 
  isExpanded: boolean; 
  expandedTopics: Record<string, boolean>;
  modules: Module[];
  calculateProgress: (moduleIndex: number) => number; 
  onSelectTopic?: (moduleIndex: number, topicIndex: number) => void; 
  onToggleModule: (moduleIndex: number) => void; 
  onToggleTopic: (moduleIndex: number, topicIndex: number) => void; 
  currentTopicIndices?: { moduleIndex: number, topicIndex: number } | null; 
  onNextModule?: () => void; 
  completedTopics: Record<string, boolean>; 
}) => {
  const isTopicCompleted = (moduleIndex: number, topicIndex: number) => {
    return completedTopics[`${moduleIndex}-${topicIndex}`] === true;
  };
  
  return (
    <div key={moduleIndex} className="space-y-2">
      <Collapsible 
        open={isExpanded}
        onOpenChange={() => onToggleModule(moduleIndex)}
      >
        <div className={cn(
          "flex items-center justify-between py-2 px-1",
          isCurrentModule ? "text-primary font-medium" : ""
        )}>
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <button className="size-6 flex items-center justify-center rounded hover:bg-accent/20 focus-ring">
                {isExpanded ? (
                  <ChevronDownIcon className="size-5" />
                ) : (
                  <ChevronRightIcon className="size-5" />
                )}
              </button>
            </CollapsibleTrigger>
            <div className="text-base font-medium truncate">Module {moduleIndex + 1}: {module.title}</div>
          </div>
          <div className="text-sm text-muted-foreground">
            {Math.round(calculateProgress(moduleIndex))}%
          </div>
        </div>
        
        <Progress value={calculateProgress(moduleIndex)} className="h-1.5 mb-3" />
        
        <CollapsibleContent>
          <div className="pl-2 space-y-1.5">
            {module.topics.map((topic, topicIndex) => {
              const isCompleted = isTopicCompleted(moduleIndex, topicIndex);
              const isExpanded = expandedTopics[`${moduleIndex}-${topicIndex}`];
              const isActive = currentTopicIndices?.moduleIndex === moduleIndex && 
                              currentTopicIndices?.topicIndex === topicIndex;
              
              return (
                <TopicItem 
                  key={topicIndex}
                  topic={topic}
                  topicIndex={topicIndex}
                  moduleIndex={moduleIndex}
                  module={module}
                  modules={modules}
                  isCompleted={isCompleted}
                  isExpanded={isExpanded}
                  isActive={isActive}
                  onSelectTopic={onSelectTopic}
                  onToggleTopic={onToggleTopic}
                  onNextModule={onNextModule}
                />
              );

            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
});

const Sidebar: FC<SidebarProps> = ({ 
  currentModule, 
  modules = [], 
  onSelectTopic,
  currentTopicIndices,
  currentModuleIndex = 0,
  onNextModule,
  onHistoryClick,
  onNewSearch,
  onSettingsClick,
  completedTopics = {}
}) => {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const calculateProgress = (moduleIndex: number) => {
    if (!modules || !modules[moduleIndex]) return 0;
    
    const module = modules[moduleIndex];
    const totalTopics = module.topics.length;
    if (totalTopics === 0) return 0;
    
    const completedCount = module.topics.filter((_, topicIndex) => 
      completedTopics[`${moduleIndex}-${topicIndex}`]
    ).length;
    
    return (completedCount / totalTopics) * 100;
  };
  
  const toggleTopic = (moduleIndex: number, topicIndex: number) => {
    const key = `${moduleIndex}-${topicIndex}`;
    setExpandedTopics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleModule = (moduleIndex: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex]
    }));
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  useEffect(() => {
    if (currentModuleIndex !== undefined) {
      setExpandedModules(prev => ({
        ...prev,
        [currentModuleIndex]: true
      }));
    }
    
    if (currentTopicIndices) {
      const { moduleIndex, topicIndex } = currentTopicIndices;
      const key = `${moduleIndex}-${topicIndex}`;
      setExpandedTopics(prev => ({
        ...prev,
        [key]: true
      }));
      
      setExpandedModules(prev => ({
        ...prev,
        [moduleIndex]: true
      }));
    }
  }, [currentTopicIndices, currentModuleIndex]);

  const handleLogoClick = () => {
    navigate('/app');
  };
  
  // Memoize the modules list to prevent unnecessary re-renders
  const memoizedModules = useMemo(() => {
    return modules.map((module, moduleIndex) => {
      const isCurrentModule = moduleIndex === currentModuleIndex;
      const isExpanded = expandedModules[moduleIndex];
      
      return (
        <ModuleItem 
          key={moduleIndex}
          module={module}
          moduleIndex={moduleIndex}
          isCurrentModule={isCurrentModule}
          isExpanded={isExpanded}
          expandedTopics={expandedTopics}
          modules={modules}
          calculateProgress={calculateProgress}
          onSelectTopic={onSelectTopic}
          onToggleModule={toggleModule}
          onToggleTopic={toggleTopic}
          currentTopicIndices={currentTopicIndices}
          onNextModule={onNextModule}
          completedTopics={completedTopics}
        />
      );
    });
  }, [modules, currentModuleIndex, expandedModules, expandedTopics, completedTopics, currentTopicIndices, onSelectTopic, onNextModule]);

  return (
    <div className="h-full bg-background flex flex-col border-r border-border/50 dark:border-border/30">
      <div 
        className="flex items-center min-h-[60px] px-4 gap-3 border-b border-border/50 dark:border-border/30 cursor-pointer"
        onClick={handleLogoClick}
      >
        <div className="bg-primary/10 rounded-md p-1.5 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-semibold text-lg whitespace-nowrap">chipling</span>
      </div>

      <div className="p-3 border-b border-border/50 dark:border-border/30">
        <button 
          onClick={onNewSearch}
          className={cn(
            "flex items-center gap-2 w-full p-2",
            "hover:bg-accent/10 dark:hover:bg-accent/20 rounded-md transition-all text-base focus-ring"
          )}
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Search</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin">
        <div className="p-3 pt-4">
          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-sm mb-2 px-1">CURRENT LEARNING PATH</div>
            
            {modules && modules.length > 0 ? (
              <div className="space-y-2">
                {memoizedModules}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <LayersIcon className="size-10 mb-2 opacity-30" />
                <div className="text-sm">No current layers</div>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-6 px-3">
          <SidebarItem icon={<BookmarkIcon className="w-5 h-5" />} label="Notes" />
          <SidebarItem 
            icon={<HistoryIcon className="w-5 h-5" />}
            label="History" 
            onClick={onHistoryClick}
          />
          <SidebarItem 
            icon={<SettingsIcon className="w-5 h-5" />}
            label="Settings" 
            onClick={onSettingsClick}
          />
          <SidebarItem 
            key={`theme-toggle-${theme}`}
            icon={theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            label={theme === 'dark' ? "Light Mode" : "Dark Mode"} 
            onClick={toggleTheme}
          />
        </nav>
      </div>

      <div className="p-3 border-t border-border/50 dark:border-border/30">
        <UserProfile />
      </div>
    </div>
  );
};

export default memo(Sidebar);