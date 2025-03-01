
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Plus, User, Settings } from 'lucide-react';
import { buttonFeedback, navigationFeedback } from '@/utils/hapticFeedback';
import { cn } from '@/lib/utils';

const AppNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Plus, label: 'Report', path: '/report', highlight: true },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];
  
  const handleNavigation = (path: string) => {
    buttonFeedback();
    navigationFeedback();
    navigate(path);
  };
  
  return (
    <nav className="nav-bar">
      {navItems.map(({ icon: Icon, label, path, highlight }) => {
        const isActive = location.pathname === path;
        
        return (
          <button
            key={path}
            onClick={() => handleNavigation(path)}
            className={cn(
              'flex flex-col items-center justify-center w-16 relative button-animation',
              highlight ? 'text-accessibility-blue' : isActive ? 'text-foreground' : 'text-muted-foreground'
            )}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className={cn(
              'p-2 relative',
              highlight && 'bg-accessibility-blue text-white rounded-full shadow-subtle',
              isActive && !highlight && 'before:absolute before:bottom-0 before:left-1/2 before:transform before:-translate-x-1/2 before:w-1 before:h-1 before:bg-foreground before:rounded-full'
            )}>
              <Icon size={highlight ? 22 : 20} />
            </div>
            <span className="text-xs mt-0.5">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default AppNavigation;
