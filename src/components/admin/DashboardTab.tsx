import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Search, 
  Plus, 
  Check, 
  Pencil,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { cn } from '../../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { CompleteVisitModal } from './CompleteVisitModal';
import { PatientIntakeModal } from './PatientIntakeModal';
import { PatientSidebar } from './PatientSidebar';
import { Visit, Patient } from '../../types';

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => (
  <div className="bg-white p-8 rounded-[32px] border border-deep/5 shadow-sm">
    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", color)}>
      <Icon size={20} className="text-white" />
    </div>
    <p className="text-[10px] font-black text-deep/30 uppercase tracking-[0.2em] mb-2">{label}</p>
    <h3 className="text-3xl font-display font-black text-deep">{value}</h3>
  </div>
);

export const DashboardTab = () => {
  const { visits, followups, loading, deleteVisit } = useAdminStore();
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const pendingToday = visits.filter(v => v.status === 'pending' && v.visit_date === today).length;
    const completedToday = visits.filter(v => v.status === 'completed' && v.visit_date === today).length;
    const upcomingFollowups = followups.filter(f => f.status === 'upcoming' && f.scheduled_date >= today).length;
    const revenueToday = visits
      .filter(v => v.visit_date === today && (v.status === 'completed' || v.status === 'followup_pending'))
      .reduce((sum, v) => sum + Number(v.amount_paid), 0);

    return { pendingToday, completedToday, upcomingFollowups, revenueToday };
  }, [visits, followups, today]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dailyRev = visits
        .filter(v => v.visit_date === date && (v.status === 'completed' || v.status === 'followup_pending'))
        .reduce((sum, v) => sum + Number(v.amount_paid), 0);
      
      const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return { day: dayLabel, revenue: dailyRev };
    });
  }, [visits]);

  const pendingVisits = useMemo(() => {
    return visits
      .filter(v => v.status === 'pending' || v.status === 'followup_pending')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [visits]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Pending Today" value={stats.pendingToday} color="bg-amber-500" />
        <StatCard icon={CheckCircle2} label="Completed Today" value={stats.completedToday} color="bg-emerald-500" />
        <StatCard icon={Calendar} label="Upcoming Follow-ups" value={stats.upcomingFollowups} color="bg-cyan-500" />
        <StatCard icon={TrendingUp} label="Revenue Today" value={`Rs. ${stats.revenueToday.toLocaleString()}`} color="bg-primary" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Pending Table */}
        <div className="lg:col-span-8 bg-white rounded-[40px] border border-deep/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-deep/5 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-display font-black text-deep">Pending Visits</h3>
              <p className="text-xs font-bold text-deep/30 uppercase tracking-widest mt-1">Currently in clinic</p>
            </div>
            <button 
              onClick={() => setIsIntakeOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-secondary transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              <Plus size={16} />
              New Intake
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg-light/50 text-[10px] font-black uppercase tracking-[0.2em] text-deep/40">
                <tr>
                  <th className="px-8 py-5">Patient Name</th>
                  <th className="px-8 py-5">Complaint</th>
                  <th className="px-8 py-5">Doctor</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-deep/5">
                {pendingVisits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-3 opacity-20">
                          <CheckCircle2 size={48} />
                          <p className="text-sm font-bold italic">No pending patients at the moment.</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  pendingVisits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-bg-light/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-bg-light flex items-center justify-center overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${visit.patient?.name}`} alt="" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-deep">{visit.patient?.name}</p>
                            <p className="text-[10px] font-bold text-deep/30">{visit.patient?.age} yrs • {visit.patient?.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-xs font-bold text-deep/60 max-w-[200px] truncate">{visit.chief_complaint || 'General Checkup'}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-xs font-bold text-deep/60">{visit.doctor}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border",
                          visit.status === 'followup_pending' 
                            ? "bg-cyan-50 text-cyan-600 border-cyan-100" 
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          {visit.status === 'followup_pending' ? 'Follow-up' : 'Pending'}
                        </span>
                      </td>
                       <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                           <button 
                             onClick={() => {
                               if (confirm('Are you sure you want to remove this patient from the pending list?')) {
                                 deleteVisit(visit.id);
                               }
                             }}
                             className="p-2.5 bg-bg-light text-red-300 rounded-xl hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                           >
                              <Trash2 size={14} />
                           </button>
                           <button 
                             onClick={() => setSelectedVisit(visit)}
                             className="p-2.5 bg-bg-light text-deep/30 rounded-xl hover:text-primary transition-all cursor-pointer"
                           >
                              <Pencil size={14} />
                           </button>
                           <button 
                             onClick={() => setSelectedVisit(visit)}
                             className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                           >
                              <Check size={14} strokeWidth={3} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-deep/5 shadow-sm flex flex-col">
               <div className="mb-4">
                 <h3 className="text-xl font-display font-black text-deep">Revenue Trend</h3>
                 <p className="text-[10px] font-bold text-deep/30 uppercase tracking-widest mt-1">Last 7 Days (PKR)</p>
               </div>

               <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 800, fill: '#94A3B8' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 800, fill: '#94A3B8' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#F8FAFC' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-deep text-white p-4 rounded-2xl shadow-xl border border-white/10">
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{payload[0].payload.day}</p>
                              <p className="text-lg font-black">Rs. {payload[0].value?.toLocaleString()}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="url(#revGradient)" 
                      radius={[10, 10, 10, 10]} 
                      barSize={32}
                    />
                    <defs>
                      <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0891B2" />
                        <stop offset="100%" stopColor="#22D3EE" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                 </ResponsiveContainer>
               </div>

               <div className="mt-4 pt-4 border-t border-deep/5 flex items-center justify-between">
                 <div>
                    <p className="text-[8px] font-black text-deep/30 uppercase tracking-widest">Total Period</p>
                    <p className="text-lg font-display font-black text-deep">
                      Rs. {chartData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
                    </p>
                 </div>
                 <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl">
                    <TrendingUp size={14} />
                    <span className="text-[10px] font-black">+12%</span>
                 </div>
               </div>
            </div>

          <div className="bg-white p-8 rounded-[40px] border border-deep/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-display font-black text-deep">Today's Follow-ups</h3>
                <p className="text-xs font-bold text-deep/30 uppercase tracking-widest mt-1">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="w-10 h-10 bg-cyan-50 text-cyan-500 rounded-2xl flex items-center justify-center">
                 <Calendar size={20} />
              </div>
            </div>

            <div className="space-y-4">
              {followups.filter(f => f.scheduled_date === today && f.status === 'upcoming').length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-bg-light rounded-[32px]">
                   <p className="text-sm font-bold text-deep/20">No follow-ups for today</p>
                </div>
              ) : (
                followups
                  .filter(f => f.scheduled_date === today && f.status === 'upcoming')
                   .map(followup => (
                    <div 
                      key={followup.id} 
                      onClick={() => followup.patient_id && setSelectedPatientId(followup.patient_id)}
                      className="p-4 rounded-[32px] bg-bg-light/30 border border-deep/5 flex items-center gap-3 group hover:border-cyan-200 hover:bg-cyan-50/30 transition-all cursor-pointer"
                    >
                       <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-deep/5">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${followup.patient?.name}`} alt="" />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-xs font-black text-deep">{followup.patient?.name}</h4>
                          <p className="text-[9px] font-bold text-deep/40 truncate max-w-[120px] uppercase tracking-widest mt-0.5">
                            {followup.reason}
                          </p>
                       </div>
                       <div className="text-right">
                          <span className="px-2 py-0.5 bg-cyan-500 text-white rounded-lg text-[7px] font-black uppercase tracking-widest">
                            Today
                          </span>
                       </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isIntakeOpen && (
          <PatientIntakeModal onClose={() => setIsIntakeOpen(false)} />
        )}
        {selectedVisit && (
          <CompleteVisitModal 
            visit={selectedVisit} 
            onClose={() => setSelectedVisit(null)} 
          />
        )}
      </AnimatePresence>

      {selectedPatientId && (
        <PatientSidebar 
          patientId={selectedPatientId} 
          onClose={() => setSelectedPatientId(null)} 
        />
      )}
    </div>
  );
};
