
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onOpenSidebar?: () => void;
}

const Header = ({ onOpenSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate('/');
  };
  
  return (
    <header className="flex items-center justify-between px-4 py-3 sm:py-4 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {onOpenSidebar && (
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenSidebar}>
            <MenuIcon className="h-5 w-5" />
          </Button>
        )}
        <div 
          className="md:hidden flex items-center gap-2 cursor-pointer" 
          onClick={handleLogoClick}
        >
          <div className="bg-white/10 rounded-md p-1 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-semibold text-base whitespace-nowrap">chipling</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
