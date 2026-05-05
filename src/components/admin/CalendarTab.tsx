import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { cn } from '../../lib/utils';

export const CalendarTab = () => {
  const { visits, followups } = useAdminStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();
    
    const prevMonthDays = Array.from({ length: firstDay }, (_, i) => ({
      day: new Date(year, month, -i).getDate(),
      currentMonth: false,
      date: new Date(year, month, -i).toISOString().split('T')[0]
    })).reverse();

    const currentMonthDays = Array.from({ length: daysCount }, (_, i) => ({
      day: i + 1,
      currentMonth: true,
      date: new Date(year, month, i + 1).toISOString().split('T')[0]
    }));

    return [...prevMonthDays, ...currentMonthDays];
  }, [currentDate]);

  const appointmentsForSelectedDate = useMemo(() => {
    const v = visits.filter(v => v.visit_date === selectedDate);
    const f = followups.filter(f => f.scheduled_date === selectedDate);
    return { visits: v, followups: f };
  }, [visits, followups, selectedDate]);

  const hasEvent = (date: string) => {
    return visits.some(v => v.visit_date === date) || followups.some(f => f.scheduled_date === date);
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

  return (
    <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="lg:col-span-8 bg-white rounded-[40px] border border-deep/5 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-deep/5 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-display font-black text-deep">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <p className="text-xs font-bold text-deep/30 uppercase tracking-widest mt-1">Schedule Overview</p>
          </div>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-3 bg-bg-light hover:bg-primary hover:text-white rounded-2xl transition-all"><ChevronLeft size={20} /></button>
            <button onClick={nextMonth} className="p-3 bg-bg-light hover:bg-primary hover:text-white rounded-2xl transition-all"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-7 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-deep/30">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-3">
            {daysInMonth.map((d, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(d.date)}
                className={cn(
                  "aspect-square rounded-3xl flex flex-col items-center justify-center relative transition-all group",
                  !d.currentMonth ? "opacity-20" : "",
                  selectedDate === d.date 
                    ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110 z-10" 
                    : "hover:bg-bg-light"
                )}
              >
                <span className="text-sm font-black">{d.day}</span>
                {hasEvent(d.date) && (
                  <div className={cn(
                    "absolute bottom-3 w-1.5 h-1.5 rounded-full",
                    selectedDate === d.date ? "bg-white" : "bg-primary"
                  )} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-8 rounded-[40px] border border-deep/5 shadow-sm min-h-[500px] flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-display font-black text-deep">
               {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </h3>
            <p className="text-xs font-bold text-deep/30 uppercase tracking-widest mt-1">Daily Agenda</p>
          </div>

          <div className="flex-1 space-y-4">
            <AnimatePresence mode="wait">
               <motion.div
                 key={selectedDate}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-4"
               >
                 {appointmentsForSelectedDate.visits.map(v => (
                   <div key={v.id} className="p-5 rounded-3xl bg-amber-50 border border-amber-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm">
                         <CalendarIcon size={20} />
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-black text-deep leading-none">{v.patient?.name}</p>
                         <p className="text-[10px] font-bold text-deep/40 uppercase mt-1">Consultation</p>
                      </div>
                      <span className="text-[10px] font-black text-amber-600 bg-white px-2 py-1 rounded-lg">VISIT</span>
                   </div>
                 ))}
                 {appointmentsForSelectedDate.followups.map(f => (
                   <div key={f.id} className="p-5 rounded-3xl bg-cyan-50 border border-cyan-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-cyan-500 shadow-sm">
                         <Clock size={20} />
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-black text-deep leading-none">{f.visit?.patient?.name}</p>
                         <p className="text-[10px] font-bold text-deep/40 uppercase mt-1">{f.reason}</p>
                      </div>
                      <span className="text-[10px] font-black text-cyan-600 bg-white px-2 py-1 rounded-lg">F-UP</span>
                   </div>
                 ))}
                 {appointmentsForSelectedDate.visits.length === 0 && appointmentsForSelectedDate.followups.length === 0 && (
                   <div className="flex flex-col items-center justify-center py-20 opacity-20">
                      <CalendarIcon size={48} className="mb-4" />
                      <p className="text-sm font-bold italic">No appointments scheduled.</p>
                   </div>
                 )}
               </motion.div>
            </AnimatePresence>
          </div>

          <button className="w-full py-4 mt-8 bg-bg-light text-deep/30 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
             <Plus size={16} /> Schedule New
          </button>
        </div>
      </div>
    </div>
  );
};
