
import { SearchIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border/50">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold">Chipling</h1>
        <span className="text-xs bg-muted px-2 py-1 rounded-full">beta</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className={cn(
          "flex items-center gap-2 px-3 py-2",
          "bg-muted/20 hover:bg-muted/30 rounded-md transition-all",
          "border border-border/50 w-[300px]"
        )}>
          <SearchIcon className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search topics..." 
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
        
        <Button variant="outline" size="sm" className="gap-2">
          <PlusIcon className="w-4 h-4" />
          <span>New Search</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
