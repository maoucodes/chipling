
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onOpenSidebar?: () => void;
}

const Header = ({ onOpenSidebar }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border/50">
      {onOpenSidebar && (
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenSidebar}>
          <MenuIcon className="h-5 w-5" />
        </Button>
      )}
    </header>
  );
};

export default Header;
