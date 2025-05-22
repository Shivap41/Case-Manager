
import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Home, LayoutDashboard, FilePlus2, CheckSquare, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center gap-2 font-semibold text-xl">
          <img 
            src="/placeholder.svg" 
            alt="Logo"
            className="h-8 w-8" 
          />
          <span>Case Manager</span>
        </div>
        
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <Home className="h-4 w-4" />
            <span>Cases</span>
          </NavLink>
          
          <NavLink
            to="/dashboard"
            className={({ isActive }) => 
              `text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink
            to="/tasks"
            className={({ isActive }) => 
              `text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <CheckSquare className="h-4 w-4" />
            <span>Tasks</span>
          </NavLink>
          
          <NavLink
            to="/create-case"
            className={({ isActive }) => 
              `text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <FilePlus2 className="h-4 w-4" />
            <span>Create Case</span>
          </NavLink>
        </nav>
        
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
