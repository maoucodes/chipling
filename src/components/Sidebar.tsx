import { FC, useState, useEffect } from 'react';
import { BookmarkIcon, HistoryIcon, LayersIcon, PlusIcon, ChevronRightIcon, ChevronDownIcon, SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Module, Topic } from '@/types/knowledge';
import UserProfile from '@/components/UserProfile';
import { useNavigate } from 'react-router-dom';

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
  
  const isTopicCompleted = (moduleIndex: number, topicIndex: number) => {
    return completedTopics[`${moduleIndex}-${topicIndex}`] === true;
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
  
  return (
    <div className="h-full bg-[#070A0E] flex flex-col">
      <div 
        className="flex items-center min-h-[60px] px-4 gap-3 border-b border-border/50 cursor-pointer"
        onClick={handleLogoClick}
      >
        <div className="bg-white/10 rounded-md p-1.5 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-semibold text-lg whitespace-nowrap">chipling</span>
      </div>

      <div className="p-3 border-b border-border/50">
        <button 
          onClick={onNewSearch}
          className={cn(
            "flex items-center gap-2 w-full p-2",
            "hover:bg-accent/10 rounded-md transition-all text-base"
          )}
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Search</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-3 pt-4">
          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-sm mb-2">CURRENT LEARNING PATH</div>
            
            {modules && modules.length > 0 ? (
              <div className="space-y-2">
                {modules.map((module, moduleIndex) => {
                  const isCurrentModule = moduleIndex === currentModuleIndex;
                  const isExpanded = expandedModules[moduleIndex];
                  
                  return (
                    <div key={moduleIndex} className="space-y-2">
                      <Collapsible 
                        open={isExpanded}
                        onOpenChange={() => toggleModule(moduleIndex)}
                      >
                        <div className={cn(
                          "flex items-center justify-between py-2",
                          isCurrentModule ? "text-primary font-medium" : ""
                        )}>
                          <div className="flex items-center gap-2">
                            <CollapsibleTrigger asChild>
                              <button className="size-6 flex items-center justify-center rounded hover:bg-accent/20">
                                {isExpanded ? (
                                  <ChevronDownIcon className="size-5" />
                                ) : (
                                  <ChevronRightIcon className="size-5" />
                                )}
                              </button>
                            </CollapsibleTrigger>
                            <div className="text-base font-medium">Module {moduleIndex + 1}: {module.title}</div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(calculateProgress(moduleIndex))}%
                          </div>
                        </div>
                        
                        <Progress value={calculateProgress(moduleIndex)} className="h-2 mb-3" />
                        
                        <CollapsibleContent>
                          <div className="pl-3 space-y-1.5">
                            {module.topics.map((topic, topicIndex) => {
                              const isCompleted = isTopicCompleted(moduleIndex, topicIndex);
                              const isExpanded = expandedTopics[`${moduleIndex}-${topicIndex}`];
                              const isActive = currentTopicIndices?.moduleIndex === moduleIndex && 
                                              currentTopicIndices?.topicIndex === topicIndex;
                              
                              return (
                                <Collapsible 
                                  key={topicIndex} 
                                  open={isExpanded}
                                  onOpenChange={() => toggleTopic(moduleIndex, topicIndex)}
                                >
                                  <div className={cn(
                                    "flex items-center gap-2 p-2 rounded-md cursor-pointer text-base",
                                    isActive ? "bg-primary/20" : "hover:bg-accent/10",
                                    isCompleted ? "text-green-400" : ""
                                  )}
                                  onClick={() => onSelectTopic && onSelectTopic(moduleIndex, topicIndex)}
                                  >
                                    <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
                                      <button className="size-6 flex items-center justify-center rounded hover:bg-accent/20">
                                        {isExpanded ? (
                                          <ChevronDownIcon className="size-5" />
                                        ) : (
                                          <ChevronRightIcon className="size-5" />
                                        )}
                                      </button>
                                    </CollapsibleTrigger>
                                    
                                    <div className="w-6 h-6 flex items-center justify-center">
                                      {isCompleted ? (
                                        <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
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
                                    
                                    {topicIndex === module.topics.length - 1 && moduleIndex < modules.length - 1 && (
                                      <div 
                                        className="flex items-center gap-2 pl-8 p-1.5 text-sm text-primary hover:underline cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (onNextModule) onNextModule();
                                        }}
                                      >
                                        <span>Next module</span>
                                        <ChevronRightIcon className="size-4" />
                                      </div>
                                    )}
                                  </CollapsibleContent>
                                </Collapsible>
                              );
                            })}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  );
                })}
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
        </nav>
      </div>

      <div className="p-3 border-t border-border/50">
        <UserProfile />
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, label, onClick }) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-2 my-1",
        "hover:bg-accent/10 rounded-md transition-all cursor-pointer text-base"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;
