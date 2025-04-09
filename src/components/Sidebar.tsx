
import { FC } from 'react';
import { BookmarkIcon, LayersIcon, HistoryIcon, User2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar: FC = () => {
  return (
    <div className="chipling-sidebar">
      <div className="flex items-center p-4 gap-2 border-b border-border/50">
        <div className="bg-white/10 rounded-md p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-semibold text-lg">chipling</span>
      </div>

      <div className="p-4 border-b border-border/50">
        <button className={cn(
          "flex items-center gap-2 w-full p-2",
          "hover:bg-accent/10 rounded-md transition-all"
        )}>
          <PlusIcon className="w-5 h-5" />
          <span>New Search</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 pt-6">
          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-sm mb-2">CURRENT LEARNING PATH</div>
            <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-md">
              <div className="w-5 h-5 flex items-center justify-center">1</div>
              <span className="truncate">Introduction to Time Perception...</span>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-2">
          <SidebarItem icon={<BookMarkIcon className="w-5 h-5" />} label="Notes" />
          <SidebarItem icon={<HistoryIcon className="w-5 h-5" />} label="Rabbit Holes" />
        </nav>
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center">
            <User2Icon className="w-5 h-5" />
          </div>
          <span>User</span>
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, label }) => {
  return (
    <div className={cn(
      "flex items-center gap-2 p-2 my-1",
      "hover:bg-accent/10 rounded-md transition-all cursor-pointer"
    )}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

export default Sidebar;
