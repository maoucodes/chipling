
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

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
          className="flex items-center gap-2 cursor-pointer" 
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
      
      <div className="hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] grid-cols-2">
                  <li className="col-span-2">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/app"
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 to-primary/10 p-6 no-underline outline-none focus:shadow-md"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Start Learning
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Begin your knowledge journey with our interactive learning platform
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <LinkItem to="/privacy" title="Privacy Policy">
                    Our commitment to protecting your data and privacy
                  </LinkItem>
                  <LinkItem to="/terms" title="Terms of Service">
                    Guidelines and rules for using our platform
                  </LinkItem>
                  <LinkItem to="/contact" title="Contact Us">
                    Get in touch with our team for support or feedback
                  </LinkItem>
                  <LinkItem to="/settings" title="Settings">
                    Customize your learning experience
                  </LinkItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/contact" className={navigationMenuTriggerStyle()}>
                Contact
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

interface LinkItemProps {
  title: string;
  children: React.ReactNode;
  to: string;
}

const LinkItem = ({ title, children, to }: LinkItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default Header;
