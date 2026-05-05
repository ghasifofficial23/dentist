import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Phone, 
  Calendar,
  CreditCard,
  User,
  Trash2
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { cn } from '../../lib/utils';
import { Patient } from '../../types';
import { PatientSidebar } from './PatientSidebar';

export const PatientsTab = () => {
  const { patients, visits, loading } = useAdminStore();
  const [search, setSearch] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.phone.includes(search)
    );
  }, [patients, search]);

  const getPatientStats = (patientId: string) => {
    const pVisits = visits.filter(v => v.patient_id === patientId);
    const totalVisits = pVisits.length;
    const lastVisit = pVisits[0]?.visit_date || 'N/A';
    const totalCost = pVisits.reduce((sum, v) => sum + Number(v.total_cost), 0);
    const totalPaid = pVisits.reduce((sum, v) => sum + Number(v.amount_paid), 0);
    const balance = totalCost - totalPaid;
    return { totalVisits, lastVisit, balance };
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-deep/5 shadow-sm">
        <div className="relative w-full md:flex-1 md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-deep/30 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="w-full pl-12 pr-6 py-4 bg-bg-light rounded-2xl text-sm font-bold focus:bg-white focus:border-primary/30 outline-none transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-bg-light text-deep/60 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white border border-transparent hover:border-deep/5 transition-all">
          <Filter size={16} />
          Filters
        </button>
      </div>

      <div className="bg-white rounded-[32px] md:rounded-[40px] border border-deep/5 shadow-sm overflow-hidden overflow-x-auto scrollbar-hide">
        <table className="w-full text-left">
          <thead className="bg-bg-light/50 text-[10px] font-black uppercase tracking-[0.2em] text-deep/40">
            <tr>
              <th className="px-4 md:px-8 py-5">Patient Details</th>
              <th className="hidden md:table-cell px-8 py-5">Visits</th>
              <th className="hidden md:table-cell px-8 py-5">Last Visit</th>
              <th className="px-4 md:px-8 py-5">Balance</th>
              <th className="px-4 md:px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-deep/5">
            {loading ? (
              <tr><td colSpan={5} className="p-20 text-center text-deep/20 font-bold italic">Loading patient records...</td></tr>
            ) : filteredPatients.length === 0 ? (
              <tr><td colSpan={5} className="p-20 text-center text-deep/20 font-bold italic">No patients found matching your search.</td></tr>
            ) : (
              filteredPatients.map(patient => {
                const stats = getPatientStats(patient.id);
                return (
                  <tr 
                    key={patient.id} 
                    onClick={() => setSelectedPatientId(patient.id)}
                    className="hover:bg-bg-light/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 md:px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-bg-light flex items-center justify-center overflow-hidden shrink-0">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`} alt="" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-deep truncate">{patient.name}</p>
                          <p className="text-[10px] font-bold text-deep/30">{patient.phone} • {patient.age} yrs</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-8 py-5">
                       <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-deep/20" />
                          <span className="text-sm font-bold text-deep/60">{stats.totalVisits}</span>
                       </div>
                    </td>
                    <td className="hidden md:table-cell px-8 py-5 text-sm font-bold text-deep/60">
                      {stats.lastVisit !== 'N/A' ? new Date(stats.lastVisit).toLocaleDateString() : 'N/A'}
                    </td>
                     <td className="px-4 md:px-8 py-5">
                        <span className={cn(
                          "px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider whitespace-nowrap",
                          stats.balance > 0 ? "bg-red-50 text-red-500" : (stats.totalVisits > 0 && visits.some(v => v.patient_id === patient.id && Number(v.total_cost) > 0) ? "bg-emerald-50 text-emerald-600" : "bg-bg-light text-deep/20")
                        )}>
                          {stats.balance > 0 
                            ? `Rs. ${stats.balance.toLocaleString()}` 
                            : (stats.totalVisits > 0 && visits.some(v => v.patient_id === patient.id && Number(v.total_cost) > 0) ? 'Cleared' : '—')}
                        </span>
                     </td>
                    <td className="px-4 md:px-8 py-5 text-right">
                       <div className="flex justify-end gap-1 md:gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete ${patient.name} and all their records?`)) {
                                useAdminStore.getState().deletePatient(patient.id);
                              }
                            }}
                            className="p-2 md:p-3 bg-bg-light text-red-300 rounded-lg md:rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                          >
                             <Trash2 size={14} md:size-[16px]} />
                          </button>
                          <button className="p-2 md:p-3 bg-bg-light text-deep/30 rounded-lg md:rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                             <ChevronRight size={14} md:size-[16px]} />
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedPatientId && (
          <PatientSidebar 
            patientId={selectedPatientId} 
            onClose={() => setSelectedPatientId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
