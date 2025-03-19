
import { Bell, Search, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 glassmorphism px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-10">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Case Manager
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary button-transition">
            Dashboard
          </Link>
          <Link to="/cases" className="text-sm font-medium text-foreground hover:text-primary button-transition">
            Cases
          </Link>
          <Link to="/tasks" className="text-sm font-medium text-foreground hover:text-primary button-transition">
            Tasks
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 rounded-full bg-secondary border-none text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        
        <button className="relative button-transition p-2 rounded-full hover:bg-secondary">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
        </button>
        
        <button className="flex items-center space-x-2 button-transition p-1.5 rounded-full hover:bg-secondary">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
