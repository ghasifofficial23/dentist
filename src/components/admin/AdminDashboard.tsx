import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Calendar as CalendarIcon, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { SidebarTab } from '../../types';
import { useAdminStore } from '../../store/useAdminStore';
import { DashboardTab } from './DashboardTab';
import { PatientsTab } from './PatientsTab';
import { RevenueTab } from './RevenueTab';
import { CalendarTab } from './CalendarTab';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface SidebarItemProps {
  icon: any;
  label: SidebarTab;
  active: boolean;
  onClick: () => void;
  key?: React.Key;
}

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group",
      active 
        ? "bg-primary text-white shadow-lg shadow-primary/20" 
        : "text-deep/40 hover:bg-bg-light hover:text-deep"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-white" : "group-hover:text-primary")} />
    <span className="font-bold text-sm tracking-tight">{label}</span>
    {active && (
      <motion.div 
        layoutId="activeTab"
        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
      />
    )}
  </button>
);

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { fetchData, loading, error } = useAdminStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sidebarItems: { icon: any; label: SidebarTab }[] = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Users, label: 'Patients' },
    { icon: CreditCard, label: 'Revenue' },
    { icon: CalendarIcon, label: 'Calendar' },
    { icon: Settings, label: 'Settings' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-bg-light flex relative overflow-x-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-deep/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r border-deep/5 transition-all duration-500 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0 w-72 lg:w-20"
      )}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-12 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              {(isSidebarOpen || window.innerWidth < 1024) && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg font-display font-black text-deep tracking-tight"
                >
                  Lumina Admin
                </motion.span>
              )}
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-deep/40 hover:text-deep transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          <div className="pt-6 border-t border-deep/5 space-y-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-deep/40 hover:bg-red-50 hover:text-red-500 transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {(isSidebarOpen || window.innerWidth < 1024) && <span className="font-bold text-sm tracking-tight">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-500 min-h-screen",
        isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
      )}>
        <header className="sticky top-0 z-30 bg-bg-light/80 backdrop-blur-md px-4 md:px-10 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 bg-white border border-deep/5 rounded-2xl text-deep hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-black text-deep">{activeTab}</h1>
              <p className="hidden md:block text-xs font-bold text-deep/30 uppercase tracking-widest mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex -space-x-2">
               {[1,2,3].map(i => (
                 <img 
                   key={i} 
                   src={`https://api.dicebear.com/7.x/avataaars/svg?seed=doc${i}`} 
                   className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                   alt="Staff"
                 />
               ))}
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-3 bg-white border border-deep/5 rounded-2xl text-deep hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        <div className="px-4 md:px-10 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'Dashboard' && <DashboardTab />}
              {activeTab === 'Patients' && <PatientsTab />}
              {activeTab === 'Revenue' && <RevenueTab />}
              {activeTab === 'Calendar' && <CalendarTab />}
              {activeTab === 'Settings' && (
                <div className="py-20 text-center">
                   <Settings size={48} className="mx-auto text-deep/10 mb-4" />
                   <h3 className="text-xl font-bold text-deep/40 italic">Settings module coming soon...</h3>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
