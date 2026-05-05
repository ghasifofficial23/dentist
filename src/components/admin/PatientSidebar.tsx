import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Pencil, 
  Check, 
  Clock, 
  Calendar, 
  CreditCard, 
  AlertCircle,
  Plus,
  ArrowRight,
  ClipboardList,
  Trash2
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { cn } from '../../lib/utils';
import { Patient, Visit, Followup } from '../../types';
import { CompleteVisitModal } from './CompleteVisitModal';

interface Props {
  patientId: string;
  onClose: () => void;
}

export const PatientSidebar = ({ patientId, onClose }: Props) => {
  const { patients, visits, followups, updatePatient, addVisit, deleteVisit } = useAdminStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const patient = useMemo(() => patients.find(p => p.id === patientId), [patients, patientId]);
  const patientVisits = useMemo(() => 
    visits.filter(v => v.patient_id === patientId).sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()),
    [visits, patientId]
  );
  const patientFollowups = useMemo(() => 
    followups.filter(f => f.visit?.patient_id === patientId).sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime()),
    [followups, patientId]
  );

  const [editForm, setEditForm] = useState<Partial<Patient>>({});

  const handleStartEdit = () => {
    if (!patient) return;
    setEditForm(patient);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!patient) return;
    setLoading(true);
    try {
      await updatePatient(patient.id, editForm);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update patient info');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVisit = async (visitId: string) => {
    if (!confirm('Are you sure you want to delete this visit record?')) return;
    try {
      await deleteVisit(visitId);
    } catch (err) {
      console.error(err);
      alert('Failed to delete visit');
    }
  };

  if (!patient) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-deep/20 backdrop-blur-sm" 
      />
      
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 z-[70] w-full max-w-xl bg-white shadow-2xl flex flex-col"
      >
        <div className="p-8 border-b border-deep/5 flex justify-between items-center bg-bg-light/30">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-[20px] bg-white flex items-center justify-center overflow-hidden shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`} alt="" />
             </div>
             <div>
                <h2 className="text-2xl font-display font-black text-deep leading-none">{patient.name}</h2>
                <p className="text-[10px] font-black text-deep/30 uppercase tracking-[0.2em] mt-2">Patient ID: {patient.id.slice(0,8)}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          {/* Patient Info Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-deep uppercase tracking-[0.2em]">Basic Information</h3>
              {!isEditing ? (
                <button onClick={handleStartEdit} className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  <Pencil size={14} />
                </button>
              ) : (
                <div className="flex gap-2">
                   <button onClick={() => setIsEditing(false)} className="px-4 py-1.5 text-[10px] font-black uppercase text-deep/30">Cancel</button>
                   <button onClick={handleSaveEdit} disabled={loading} className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase rounded-lg shadow-lg shadow-primary/20">Save</button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 bg-bg-light/50 p-6 rounded-3xl">
              {[
                { label: 'Age', value: patient.age, key: 'age' },
                { label: 'Gender', value: patient.gender, key: 'gender' },
                { label: 'Phone', value: patient.phone, key: 'phone' },
                { label: 'Email', value: patient.email || 'N/A', key: 'email' },
              ].map(item => (
                <div key={item.key} className="space-y-1">
                  <p className="text-[10px] font-black text-deep/30 uppercase tracking-widest">{item.label}</p>
                  {isEditing ? (
                    <input 
                      className="w-full bg-white px-3 py-1.5 rounded-lg text-sm font-bold border-deep/5 outline-none focus:border-primary/30"
                      value={(editForm as any)[item.key] || ''}
                      onChange={e => setEditForm({...editForm, [item.key]: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-black text-deep">{item.value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-deep/30 uppercase tracking-widest pl-2">Chief Complaint</p>
                  {isEditing ? (
                    <textarea 
                      className="w-full bg-bg-light/50 px-6 py-4 rounded-2xl text-sm font-medium border-transparent outline-none focus:bg-white focus:border-primary/30 resize-none"
                      rows={2}
                      value={editForm.chief_complaint || ''}
                      onChange={e => setEditForm({...editForm, chief_complaint: e.target.value})}
                    />
                  ) : (
                    <div className="bg-bg-light/50 px-6 py-4 rounded-2xl border border-deep/5">
                       <p className="text-sm font-bold text-deep/60">{patient.chief_complaint || 'No complaint recorded'}</p>
                    </div>
                  )}
               </div>

               <div className="space-y-2">
                  <p className="text-[10px] font-black text-deep/30 uppercase tracking-widest pl-2">Medical History / Allergies</p>
                  {isEditing ? (
                    <textarea 
                      className="w-full bg-bg-light/50 px-6 py-4 rounded-2xl text-sm font-medium border-transparent outline-none focus:bg-white focus:border-primary/30 resize-none"
                      rows={2}
                      value={editForm.medical_history || ''}
                      onChange={e => setEditForm({...editForm, medical_history: e.target.value})}
                    />
                  ) : (
                    <div className="bg-bg-light/50 px-6 py-4 rounded-2xl border border-deep/5">
                       <p className="text-sm font-bold text-deep/60 italic">{patient.medical_history || 'No history recorded'}</p>
                    </div>
                  )}
               </div>
            </div>
          </section>

          {/* Medical History */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-deep uppercase tracking-[0.2em]">Clinical Background</h3>
            <div className={cn(
              "p-6 rounded-3xl border border-dashed transition-all",
              isEditing ? "border-primary/30 bg-primary/5" : "border-deep/10 bg-white"
            )}>
              {isEditing ? (
                <textarea 
                  rows={4}
                  className="w-full bg-transparent text-sm font-medium outline-none resize-none"
                  placeholder="Record allergies, chronic conditions, regular medications..."
                  value={editForm.medical_history || ''}
                  onChange={e => setEditForm({...editForm, medical_history: e.target.value})}
                />
              ) : (
                <p className={cn("text-sm font-medium leading-relaxed", patient.medical_history ? "text-deep/70" : "text-deep/20 italic")}>
                  {patient.medical_history || 'No medical history recorded.'}
                </p>
              )}
            </div>
          </section>

          {/* Visit History */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
               <h3 className="text-xs font-black text-deep uppercase tracking-[0.2em]">Treatment History</h3>
               <button 
                 onClick={() => addVisit({ patient_id: patient.id, visit_date: new Date().toISOString().split('T')[0], doctor: 'Dr. Nova', status: 'pending', procedures: [], completion_pct: 0, total_cost: 0, amount_paid: 0, payment_status: 'unpaid', chief_complaint: 'Re-visit' })}
                 className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all"
               >
                 <Plus size={12} strokeWidth={4} /> New Visit
               </button>
            </div>
            
            <div className="space-y-4">
               {patientVisits.length === 0 ? (
                 <div className="p-10 text-center border border-dashed border-deep/10 rounded-3xl opacity-20">
                    <p className="text-xs font-bold italic">No visits recorded yet.</p>
                 </div>
               ) : (
                 patientVisits.map((visit, idx) => (
                   <div key={visit.id} className="relative pl-8 group">
                      {idx !== patientVisits.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-deep/5" />
                      )}
                      <div className="absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full bg-white border-2 border-deep/5 flex items-center justify-center z-10 group-hover:border-primary/30 transition-colors">
                         <div className={cn("w-2 h-2 rounded-full", visit.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500')} />
                      </div>
                      <div className="bg-white border border-deep/5 p-5 rounded-3xl group-hover:border-primary/20 transition-all group-hover:shadow-xl group-hover:shadow-primary/5">
                         <div className="flex justify-between items-start mb-3">
                            <div>
                               <p className="text-sm font-black text-deep">{new Date(visit.visit_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                               <p className="text-[10px] font-black text-deep/30 uppercase tracking-widest mt-1">{visit.doctor}</p>
                            </div>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                              visit.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                            )}>
                              {visit.status.replace('_', ' ')}
                            </span>
                         </div>
                         <div className="flex flex-wrap gap-2 mb-4">
                            {visit.procedures?.map((proc, i) => (
                              <span key={i} className="px-3 py-1 bg-bg-light rounded-lg text-[10px] font-bold text-deep/60">{proc}</span>
                            ))}
                         </div>
                         <div className="flex justify-between items-center pt-3 border-t border-deep/5">
                            <div className="flex items-center gap-2">
                               <CreditCard size={12} className="text-deep/20" />
                               <span className="text-xs font-bold text-deep/60">Rs. {visit.amount_paid?.toLocaleString()}</span>
                            </div>
                            <div className="flex gap-2">
                               <button 
                                 onClick={() => handleDeleteVisit(visit.id)}
                                 className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                               >
                                  <Trash2 size={12} />
                               </button>
                               <button 
                                 onClick={() => setSelectedVisit(visit)}
                                 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 group/btn cursor-pointer"
                               >
                                 Details <ArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
          </section>

          {/* Followups */}
          <section className="space-y-6">
            <h3 className="text-xs font-black text-deep uppercase tracking-[0.2em]">Scheduled Follow-ups</h3>
            <div className="grid gap-3">
               {patientFollowups.filter(f => f.status === 'upcoming').map(followup => (
                 <div key={followup.id} className="p-5 rounded-3xl bg-cyan-50 border border-cyan-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-cyan-500 shadow-sm">
                       <Clock size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-cyan-900">{new Date(followup.scheduled_date).toLocaleDateString()}</p>
                       <p className="text-xs font-medium text-cyan-700/60">{followup.reason}</p>
                    </div>
                    <Check className="ml-auto text-cyan-500 opacity-20" size={20} />
                 </div>
               ))}
               {patientFollowups.filter(f => f.status === 'upcoming').length === 0 && (
                 <p className="text-sm font-medium text-deep/20 italic text-center py-4">No upcoming follow-ups.</p>
               )}
            </div>
          </section>
        </div>

        <div className="p-8 border-t border-deep/5 bg-bg-light/30">
           <button 
             onClick={onClose}
             className="w-full py-5 bg-white border border-deep/5 rounded-[24px] text-deep/40 font-black text-xs uppercase tracking-[0.2em] hover:bg-deep hover:text-white transition-all shadow-sm"
           >
             Close Records
           </button>
        </div>
      </motion.aside>

      <AnimatePresence>
        {selectedVisit && (
          <CompleteVisitModal 
            visit={selectedVisit} 
            onClose={() => setSelectedVisit(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};
