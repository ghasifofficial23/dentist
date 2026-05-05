import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { cn } from '../../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const MetricCard = ({ label, value, change, isPositive }: { label: string, value: string, change: string, isPositive: boolean }) => (
  <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-deep/5 shadow-sm">
    <p className="text-[9px] md:text-[10px] font-black text-deep/30 uppercase tracking-[0.2em] mb-3 md:mb-4">{label}</p>
    <div className="flex items-end justify-between gap-4">
      <h3 className="text-2xl md:text-4xl font-display font-black text-deep leading-none break-all">{value}</h3>
      <div className={cn(
        "flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-xl text-[8px] md:text-[10px] font-black uppercase shrink-0",
        isPositive ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"
      )}>
        {isPositive ? <ArrowUpRight className="size-3 md:size-3.5" /> : <ArrowDownRight className="size-3 md:size-3.5" />}
        {change}
      </div>
    </div>
  </div>
);

export const RevenueTab = () => {
  const { visits } = useAdminStore();

  const totalRevenue = useMemo(() => 
    visits.reduce((sum, v) => sum + Number(v.amount_paid), 0),
  [visits]);

  const unpaidBalance = useMemo(() => 
    visits.reduce((sum, v) => sum + (Number(v.total_cost) - Number(v.amount_paid)), 0),
  [visits]);

  const monthlyRevData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((m, idx) => {
      const rev = visits
        .filter(v => new Date(v.visit_date).getMonth() === idx)
        .reduce((sum, v) => sum + Number(v.amount_paid), 0);
      return { month: m, revenue: rev };
    });
  }, [visits]);

  const procedureBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    visits.forEach(v => {
      v.procedures?.forEach(p => {
        counts[p] = (counts[p] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [visits]);

  const COLORS = ['#0891B2', '#06B6D4', '#22D3EE', '#7DD3FC', '#BAE6FD'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Total Revenue" value={`Rs. ${totalRevenue.toLocaleString()}`} change="18%" isPositive={true} />
        <MetricCard label="Outstanding Balance" value={`Rs. ${unpaidBalance.toLocaleString()}`} change="4%" isPositive={false} />
        <MetricCard label="Avg. Ticket Size" value={`Rs. ${(totalRevenue / (visits.length || 1)).toFixed(0)}`} change="12%" isPositive={true} />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-deep/5 shadow-sm">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12">
              <div>
                 <h3 className="text-xl md:text-2xl font-display font-black text-deep">Growth Overview</h3>
                 <p className="text-[10px] font-bold text-deep/30 uppercase tracking-widest mt-1">Monthly performance tracking</p>
              </div>
              <div className="flex gap-4">
                 {['Income', 'Forecast'].map(item => (
                   <div key={item} className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", item === 'Income' ? 'bg-primary' : 'bg-bg-light')} />
                      <span className="text-[9px] font-black uppercase text-deep/40 tracking-widest">{item}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={monthlyRevData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#0891B2" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#0891B2" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                 <XAxis 
                   dataKey="month" 
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
                   content={({ active, payload }) => {
                     if (active && payload && payload.length) {
                       return (
                         <div className="bg-deep text-white p-4 rounded-2xl shadow-xl border border-white/10">
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{payload[0].payload.month}</p>
                           <p className="text-lg font-black">Rs. {payload[0].value?.toLocaleString()}</p>
                         </div>
                       );
                     }
                     return null;
                   }}
                 />
                 <Area 
                   type="monotone" 
                   dataKey="revenue" 
                   stroke="#0891B2" 
                   strokeWidth={4}
                   fillOpacity={1} 
                   fill="url(#colorRev)" 
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-10 rounded-[40px] border border-deep/5 shadow-sm h-full">
              <h3 className="text-xl font-display font-black text-deep mb-2">Procedure Distribution</h3>
              <p className="text-xs font-bold text-deep/30 uppercase tracking-widest mb-10">Top services by volume</p>

              <div className="h-[250px] relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                         data={procedureBreakdown}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={100}
                         paddingAngle={8}
                         dataKey="value"
                       >
                         {procedureBreakdown.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                         ))}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <PieChartIcon className="text-deep/5" size={48} />
                 </div>
              </div>

              <div className="mt-10 space-y-4">
                 {procedureBreakdown.map((item, idx) => (
                   <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                         <span className="text-xs font-bold text-deep/60">{item.name}</span>
                      </div>
                      <span className="text-xs font-black text-deep">{item.value}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
