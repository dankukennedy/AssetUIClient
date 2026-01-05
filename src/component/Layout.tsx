import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { 
  LayoutDashboard, Box, Settings, Users, ShieldCheck, Database, 
  Info, Moon, Sun, LucideIcon, Building2, Menu, X,
  UserCircle, ClipboardCheck, BarChart3, XCircle, UserPlus,
  FileText, Repeat, Trash2, BookOpen, MessageSquare, Phone
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { SidebarItem } from './SidebarItem';
import { cn } from '../lib/utils';
import { Button } from "./ui/button"

interface LayoutProps {
  children: ReactNode;
  title: string;
  icon?: LucideIcon;
}

export const Layout = ({ children, title, icon: TitleIcon }: LayoutProps) => {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className={cn(
      "flex h-screen font-sans transition-colors duration-300 overflow-hidden",
      isDark ? "dark bg-[#0a0a0a] text-white" : "bg-[#f8fafc] text-gray-800"
    )}>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 flex flex-col shrink-0 border-r shadow-2xl z-50 transition-transform duration-300 lg:relative lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        isDark ? "bg-[#111118] border-white/5" : "bg-white border-gray-200"
      )}>
        {/* Sidebar Header */}
        <div className={cn("p-6 flex items-center justify-between border-b", isDark ? "border-white/5" : "border-gray-100")}>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <Box className="text-white" size={20} />
            </div>
            <span className={cn("font-bold text-lg tracking-tight", isDark ? "text-white" : "text-gray-900")}>
              Asset MGT
            </span>
          </div>
          {/* Close button for mobile */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </Button>
        </div>
        
        <nav className="flex-1 mt-4 overflow-y-auto custom-scrollbar px-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" onMobileClick={() => setIsMobileMenuOpen(false)} />
          
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

          <SidebarItem 
            icon={Settings} 
            label="Operations" 
            subItems={[
              { label: 'Allocations', icon: FileText, path: '/operations/allocations' },
              { label: 'Transfers', icon: Repeat, path: '/operations/transfers' },
              { label: 'Disposal', icon: Trash2, path: '/operations/disposal' }
            ]}
          />

          <SidebarItem 
            icon={Database} 
            label="System" 
            subItems={[
              { label: 'Archive', icon: Database, path: '/system/archive' },
              { label: 'Reports', icon: BarChart3, path: '/system/reports' },
              { label: 'Decommission', icon: XCircle, path: '/system/decommission' }
            ]}
          />

          <SidebarItem 
            icon={ShieldCheck} 
            label="Administration" 
            subItems={[
              { label: 'Users', icon: UserPlus, path: '/users' },
              { label: 'Settings', icon: Settings, path: '/settings' },
              { label: 'My Profile', icon: UserCircle, path: '/account-settings' }
            ]}
          />

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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className={cn(
          "h-16 border-b flex items-center justify-between px-4 md:px-8 z-30 transition-colors duration-300 shrink-0",
          isDark ? "bg-[#111118] border-white/5" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3">
             {/* Mobile Menu Toggle */}
             <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden mr-2" 
                onClick={() => setIsMobileMenuOpen(true)}
             >
                <Menu size={24} />
             </Button>

             {TitleIcon && (
               <div className="hidden sm:flex bg-blue-500/10 p-2 rounded-lg text-blue-500">
                 <TitleIcon size={18} />
               </div>
             )}
             <span className={cn("font-bold text-base md:text-lg truncate", isDark ? "text-white" : "text-gray-900")}>
               {title}
             </span>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="rounded-full"
              >
                {isDark ? <Sun className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" /> : <Moon className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />}
              </Button>

            <div className={cn("flex items-center gap-2 md:gap-3 border-l pl-3 md:pl-6", isDark ? "border-white/10" : "border-gray-200")}>
              <div className="hidden sm:block text-right">
                <p className={cn("text-xs font-bold", isDark ? "text-white" : "text-gray-900")}>Edem</p>
                <p className="text-[10px] text-gray-500 uppercase">Admin</p>
              </div>
              <img 
                src="https://ui-avatars.com/api/?name=Edem&background=0D8ABC&color=fff" 
                className="w-8 h-8 rounded-full ring-2 ring-blue-500/20" 
                alt="User" 
              />
            </div>
          </div>
        </header>

        <main className={cn(
          "flex-1 overflow-y-auto p-4 md:p-8 transition-colors duration-300",
          isDark ? "bg-[#0a0a0a]" : "bg-[#f3f6f9]"
        )}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        <footer className={`text-center py-4 text-[10px] uppercase tracking-widest border-t transition-colors ${isDark ? 'text-gray-600 border-white/5' : 'text-gray-400 border-gray-100'}`}>
          © 2026 Asset App. All rights reserved.
        </footer>
      </div>
    </div>
  );
};