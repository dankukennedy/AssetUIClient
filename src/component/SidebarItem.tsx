import React, { useState } from 'react';
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './theme-provider'; 
import { cn } from '../lib/utils'; 

interface SidebarSubItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path?: string;
  subItems?: SidebarSubItem[];
}

export const SidebarItem = ({ icon: Icon, label, path, subItems = [] }: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();
  const hasSubItems = subItems.length > 0;
  
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Check if current route matches this item or any of its sub-items
  const isActive = path === location.pathname || subItems.some(sub => sub.path === location.pathname);

  const content = (
    <div 
      onClick={() => hasSubItems && setIsOpen(!isOpen)}
      className={cn(
        "flex items-center justify-between px-6 py-3 cursor-pointer transition-all duration-200 border-l-4",
        // Active Styles
        isActive 
          ? "bg-blue-600/10 text-blue-500 border-blue-600" 
          : "border-transparent text-gray-400 hover:text-blue-500",
        // Hover background depends on the overall App Theme
        isDark 
          ? "hover:bg-white/5" 
          : "hover:bg-gray-200/50"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={isActive ? "text-blue-500" : ""} />
        <span className={cn(
          "text-[13px] font-medium tracking-wide",
          isActive && "font-semibold"
        )}>{label}</span>
      </div>
      {hasSubItems && (
        <div className={isActive ? "text-blue-500" : "text-gray-500"}>
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} /> }
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {path && !hasSubItems ? (
        <Link to={path}>{content}</Link>
      ) : (
        content
      )}
      
      {hasSubItems && isOpen && (
        <div className={cn(
          "pb-2 transition-colors duration-200",
          // Sub-menu background tint
          isDark ? "bg-black/20" : "bg-gray-100/30"
        )}>
          {subItems.map((item, idx) => {
            const isSubActive = location.pathname === item.path;
            return (
              <Link key={idx} to={item.path}>
                <div className={cn(
                  "flex items-center gap-3 pl-14 py-2 text-[12px] transition-colors",
                  isSubActive 
                    ? "text-blue-500 font-bold" 
                    : "text-gray-500 hover:text-blue-500"
                )}>
                  <item.icon size={14} className={isSubActive ? "text-blue-500" : ""} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};