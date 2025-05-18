import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Menu, 
  X, 
  BarChart3, 
  Settings, 
  User, 
  Moon, 
  Sun, 
  Home,
  FileText,
  Tag
} from 'lucide-react';
import { Button } from '../ui/Button';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <li>
      <button
        className={`
          w-full flex items-center space-x-3 px-3 py-3 rounded-md transition-colors
          ${active 
            ? 'bg-blue-100 text-blue-900 dark:bg-indigo-900 dark:text-indigo-100 font-medium' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        onClick={onClick}
      >
        <span className="flex-shrink-0">{icon}</span>
        <span>{label}</span>
      </button>
    </li>
  );
};

interface SidebarProps {
  onNavChange: (nav: string) => void;
  currentNav: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavChange, currentNav }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`
        h-screen fixed left-0 top-0 z-20 transition-all duration-300 
        ${collapsed ? 'w-16' : 'w-64'}
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
      `}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <h1 className="text-xl font-bold text-blue-800 dark:text-indigo-400">AdTracker</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <div className="py-4 px-3">
        <nav>
          <ul className="space-y-1">
            <NavItem
              icon={<Home size={20} />}
              label="Dashboard"
              active={currentNav === 'dashboard'}
              onClick={() => onNavChange('dashboard')}
            />
            <NavItem
              icon={<Tag size={20} />}
              label="Offers"
              active={currentNav === 'offers'}
              onClick={() => onNavChange('offers')}
            />
            <NavItem
              icon={<BarChart3 size={20} />}
              label="Analytics"
              active={currentNav === 'analytics'}
              onClick={() => onNavChange('analytics')}
            />
            <NavItem
              icon={<FileText size={20} />}
              label="Notes"
              active={currentNav === 'notes'}
              onClick={() => onNavChange('notes')}
            />
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 mt-8">
          <ul className="space-y-1">
            <NavItem
              icon={<User size={20} />}
              label="Profile"
              active={currentNav === 'profile'}
              onClick={() => onNavChange('profile')}
            />
            <NavItem
              icon={<Settings size={20} />}
              label="Settings"
              active={currentNav === 'settings'}
              onClick={() => onNavChange('settings')}
            />
            <li>
              <Button
                variant="ghost"
                className="w-full flex justify-start"
                icon={theme.mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                onClick={toggleTheme}
              >
                {collapsed ? '' : (theme.mode === 'dark' ? 'Light Mode' : 'Dark Mode')}
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;