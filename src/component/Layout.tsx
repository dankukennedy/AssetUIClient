import React from 'react';
import type { ReactNode } from 'react';
import { 
  LayoutDashboard, Box, Settings, Users, ShieldCheck, Database, 
  Info, Search, Moon, Sun, LucideIcon, Building2, 
  UserCircle, ClipboardCheck, BarChart3, XCircle, UserPlus,
  FileText, Repeat, Trash2, BookOpen, MessageSquare, Phone
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { SidebarItem } from './SidebarItem';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
  title: string;
  icon?: LucideIcon;
}

export const Layout = ({ children, title, icon: TitleIcon }: LayoutProps) => {
  const { theme, setTheme } = useTheme();
  
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className={cn(
      "flex h-screen font-sans transition-colors duration-300",
      isDark ? "dark bg-[#0a0a0a] text-white" : "bg-[#f8fafc] text-gray-800"
    )}>
      {/* Sidebar */}
      <aside className={cn(
        "w-64 flex flex-col shrink-0 border-r shadow-2xl z-20 transition-colors duration-300",
        isDark ? "bg-[#111118] border-white/5" : "bg-white border-gray-200"
      )}>
        <div className={cn("p-6 flex items-center gap-3 border-b", isDark ? "border-white/5" : "border-gray-100")}>
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
            <Box className="text-white" size={20} />
          </div>
          <span className={cn("font-bold text-lg tracking-tight", isDark ? "text-white" : "text-gray-900")}>
            Asset MGT
          </span>
        </div>
        
        
<nav className="flex-1 mt-4 overflow-y-auto custom-scrollbar">
  {/* Dashboard - Direct Link */}
  <SidebarItem 
    icon={LayoutDashboard} 
    label="Dashboard" 
    path="/" 
  />
  
  {/* Asset Management - With SubItems */}
  <SidebarItem 
    icon={Box} 
    label="Asset Management" 
    subItems={[
      { label: 'All Assets', icon: Box, path: '/assets' },
      { label: 'Blocks', icon: Building2, path: '/blocks' },
      { label: 'Departments', icon: Box, path: '/departments' },
      { label: 'Asset Users', icon: Users, path: '/users' },
      { label: 'Audit Items', icon: ClipboardCheck, path: '/audit' }
    ]}
  />

  {/* Operations - With SubItems */}
  <SidebarItem 
    icon={Settings} 
    label="Operations" 
    subItems={[
      { label: 'Allocations', icon: FileText, path: '/operations/allocations' },
      { label: 'Transfers', icon: Repeat, path: '/operations/transfers' },
      { label: 'Disposal', icon: Trash2, path: '/operations/disposal' }
    ]}
  />

  {/* System - With SubItems */}
  <SidebarItem 
    icon={Database} 
    label="System" 
    subItems={[
      { label: 'Archive', icon: Database, path: '/system/archive' },
      { label: 'Reports', icon: BarChart3, path: '/system/reports' },
      { label: 'Decommission', icon: XCircle, path: '/system/decommission' }
    ]}
  />

  {/* Administration - With SubItems */}
  <SidebarItem 
    icon={ShieldCheck} 
    label="Administration" 
    subItems={[
      { label: 'Users', icon: UserPlus, path: '/users' },
      { label: 'Settings', icon: Settings, path: '/settings' },
      { label: 'My Profile', icon: UserCircle, path: '/account-settings' }
    ]}
  />

  {/* Dev - Info - With SubItems */}
  <SidebarItem 
    icon={Info} 
    label="Dev - Info" 
    subItems={[
      { label: 'User Manual', icon: BookOpen, path: '/info/manual' },
      { label: 'About', icon: MessageSquare, path: '/info/about' },
      { label: 'Contact Us', icon: Phone, path: '/info/contact' }
    ]}
  />
</nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={cn(
          "h-16 border-b flex items-center justify-between px-8 z-10 transition-colors duration-300",
          isDark ? "bg-[#111118] border-white/5" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3">
             {TitleIcon && <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500"><TitleIcon size={18} /></div>}
             <span className={cn("font-bold text-lg", isDark ? "text-white" : "text-gray-900")}>{title}</span>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')} 
              className={cn(
                "p-2 rounded-lg cursor-pointer transition-all hover:scale-110",
                isDark ? "hover:bg-white/5" : "hover:bg-gray-100"
              )}
            >
              {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-400" />}
            </button>

            <div className={cn("flex items-center gap-3 border-l pl-6", isDark ? "border-white/10" : "border-gray-200")}>
              <div className="text-right">
                <p className={cn("text-xs font-bold", isDark ? "text-white" : "text-gray-900")}>Edem</p>
                <p className="text-[10px] text-gray-500 uppercase">Administrator</p>
              </div>
              <img src="https://ui-avatars.com/api/?name=Edem&background=0D8ABC&color=fff" className="w-8 h-8 rounded-full ring-2 ring-blue-500/20" alt="User" />
            </div>
          </div>
        </header>

        <main className={cn("flex-1 overflow-y-auto p-8 transition-colors duration-300", isDark ? "bg-[#0a0a0a]" : "bg-[#f3f6f9]")}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};