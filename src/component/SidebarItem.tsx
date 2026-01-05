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
  isCollapsed?: boolean;
  onMobileClick?: () => void;
}

export const SidebarItem = ({ 
  icon: Icon, 
  label, 
  path, 
  subItems = [], 
  isCollapsed = false,
  onMobileClick 
}: SidebarItemProps) => {
  // 1. Keep track of whether the user wants the menu open
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  
  const { theme } = useTheme();
  const location = useLocation();
  const hasSubItems = subItems.length > 0;
  
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const isActive = path === location.pathname || subItems.some(sub => sub.path === location.pathname);

  // 2. DERIVED STATE: The menu is effectively "open" only if 
  // the user toggled it AND the sidebar isn't collapsed.
  // This removes the need for useEffect.
  const isOpen = isMenuToggled && !isCollapsed;

  const content = (
    <div 
      onClick={() => hasSubItems && !isCollapsed && setIsMenuToggled(!isMenuToggled)}
      className={cn(
        "flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 border-l-4 group",
        isActive 
          ? "bg-blue-600/10 text-blue-500 border-blue-600" 
          : "border-transparent text-gray-400 hover:text-blue-500",
        isDark ? "hover:bg-white/5" : "hover:bg-gray-100",
        isCollapsed && "justify-center px-0 border-l-0" 
      )}
      title={isCollapsed ? label : ""}
    >
      <div className={cn("flex items-center gap-3", isCollapsed && "gap-0")}>
        <Icon size={20} className={cn("shrink-0", isActive ? "text-blue-500" : "group-hover:text-blue-500")} />
        
        {!isCollapsed && (
          <span className={cn(
            "text-[13px] font-medium tracking-wide whitespace-nowrap overflow-hidden transition-opacity duration-300",
            isActive && "font-semibold"
          )}>
            {label}
          </span>
        )}
      </div>

      {hasSubItems && !isCollapsed && (
        <div className={isActive ? "text-blue-500" : "text-gray-500"}>
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} /> }
        </div>
      )}

      {isCollapsed && isActive && (
        <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
      )}
    </div>
  );

  return (
    <div className="w-full relative">
      {path && !hasSubItems ? (
        <Link to={path} onClick={onMobileClick}>
          {content}
        </Link>
      ) : (
        content
      )}
      
      {hasSubItems && isOpen && (
        <div className={cn(
          "pb-2 transition-colors duration-200",
          isDark ? "bg-black/20" : "bg-gray-50/50"
        )}>
          {subItems.map((item, idx) => {
            const isSubActive = location.pathname === item.path;
            return (
              <Link key={idx} to={item.path} onClick={onMobileClick}>
                <div className={cn(
                  "flex items-center gap-3 pl-12 py-2 text-[12px] transition-colors",
                  isSubActive ? "text-blue-500 font-bold" : "text-gray-500 hover:text-blue-500"
                )}>
                  <item.icon size={14} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};