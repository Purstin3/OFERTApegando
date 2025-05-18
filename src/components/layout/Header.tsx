import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Input } from '../ui/Input';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="w-64">
          <Input
            placeholder="Search..."
            icon={<Search size={18} />}
            className="h-9"
          />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell size={20} className="text-gray-600 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <User size={16} />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">John Doe</span>
        </div>
      </div>
    </header>
  );
};

export default Header;