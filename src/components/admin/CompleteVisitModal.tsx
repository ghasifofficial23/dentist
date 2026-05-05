import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Calendar, AlertCircle } from 'lucide-react';
import { Visit, Followup } from '../../types';
import { useAdminStore } from '../../store/useAdminStore';
import { cn } from '../../lib/utils';

interface Props {
  visit: Visit;
  onClose: () => void;
}

export const CompleteVisitModal = ({ visit, onClose }: Props) => {
  const { completeVisit } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    procedures: visit.procedures || [] as string[],
    otherProcedure: '',
    notes: visit.procedure_notes || '',
    completionPct: visit.completion_pct || 100,
    totalCost: Number(visit.total_cost) || 0,
    amountPaid: Number(visit.amount_paid) || 0,
    needsFollowup: false,
    followupDate: '',
    followupReason: ''
  });

  const procedureOptions = [
    'Cleaning', 'Filling', 'Extraction', 'Root Canal', 'Crown', 
    'Whitening', 'X-Ray', 'Scaling', 'Fluoride', 'Other'
  ];

  const handleToggleProcedure = (proc: string) => {
    setDetails(prev => ({
      ...prev,
      procedures: prev.procedures.includes(proc) 
        ? prev.procedures.filter(p => p !== proc)
        : [...prev.procedures, proc]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalProcedures = details.procedures.includes('Other') && details.otherProcedure
        ? [...details.procedures.filter(p => p !== 'Other'), details.otherProcedure]
        : details.procedures;

      const paymentStatus = details.amountPaid >= details.totalCost ? 'paid' : (details.amountPaid > 0 ? 'partial' : 'unpaid');

      const followup = details.needsFollowup ? {
        scheduled_date: details.followupDate,
        reason: details.followupReason,
        status: 'upcoming' as const
      } : undefined;

      await completeVisit(visit.id, {
        procedures: finalProcedures,
        procedure_notes: details.notes,
        completion_pct: details.completionPct,
        total_cost: details.totalCost,
        amount_paid: details.amountPaid,
        payment_status: paymentStatus
      }, followup);

      onClose();
    } catch (err) {
      console.error('Failed to complete visit:', err);
      alert('Failed to save record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const balanceDue = details.totalCost - details.amountPaid;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-deep/40 backdrop-blur-sm" 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
      >
         <div className="p-8 border-b border-deep/5 flex justify-between items-center bg-bg-light/30">
          <div>
            <h2 className="text-2xl font-display font-black text-deep">Complete Visit</h2>
            <p className="text-xs font-bold text-deep/30 uppercase tracking-widest mt-1">
              Patient: {visit.patient?.name}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-deep/5 rounded-full transition-colors">
            <X size={24} className="text-deep/30" />
          </button>
        </div>

        {/* History Context */}
        <div className="px-8 pt-6">
          {(() => {
            const { visits } = useAdminStore.getState();
            const previousVisit = visits
              .filter(v => v.patient_id === visit.patient_id && v.id !== visit.id && v.status === 'completed')
              .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())[0];

            if (!previousVisit) return null;

            const balance = Number(previousVisit.total_cost) - Number(previousVisit.amount_paid);

            return (
              <div className="bg-bg-light/50 border border-deep/5 rounded-[32px] p-6 space-y-4">
                <div className="flex justify-between items-center">
                   <h3 className="text-[10px] font-black text-deep/40 uppercase tracking-[0.2em]">Previous Visit History</h3>
                   <span className="text-[10px] font-bold text-deep/20">{new Date(previousVisit.visit_date).toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <p className="text-[10px] font-bold text-deep/30 uppercase mb-2">Procedures Done</p>
                      <div className="flex flex-wrap gap-1">
                         {previousVisit.procedures?.map((p, i) => (
                           <span key={i} className="px-2 py-0.5 bg-white border border-deep/5 rounded text-[10px] font-bold text-deep/60">{p}</span>
                         ))}
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-deep/30 uppercase mb-2">Completion / Balance</p>
                      <p className="text-sm font-black text-deep">{previousVisit.completion_pct}% Finished</p>
                      {balance > 0 && (
                        <p className="text-[10px] font-black text-red-500 uppercase mt-1">Rs. {balance.toLocaleString()} Pending</p>
                      )}
                   </div>
                </div>
                {previousVisit.procedure_notes && (
                  <div className="pt-3 border-t border-deep/5">
                     <p className="text-[10px] font-bold text-deep/30 uppercase mb-1">Last Notes</p>
                     <p className="text-[10px] font-bold text-deep/60 italic leading-relaxed">{previousVisit.procedure_notes}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto space-y-8 scrollbar-hide">
          {/* Procedures */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-deep uppercase tracking-widest">Procedures Performed</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {procedureOptions.map(proc => (
                <button
                  key={proc}
                  type="button"
                  onClick={() => handleToggleProcedure(proc)}
                  className={cn(
                    "px-4 py-3 rounded-2xl text-xs font-bold transition-all border",
                    details.procedures.includes(proc)
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-white text-deep/60 border-deep/5 hover:border-primary/30"
                  )}
                >
                  {proc}
                </button>
              ))}
            </div>
            {details.procedures.includes('Other') && (
              <input 
                type="text"
                placeholder="Specify other procedure..."
                className="w-full px-6 py-4 rounded-2xl bg-bg-light border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm font-bold mt-2"
                value={details.otherProcedure}
                onChange={e => setDetails({...details, otherProcedure: e.target.value})}
              />
            )}
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-deep uppercase tracking-widest">Clinical Notes</h3>
            <textarea 
              rows={3}
              placeholder="Record details of the procedure, materials used, etc..."
              className="w-full px-6 py-4 rounded-2xl bg-bg-light border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm font-medium resize-none"
              value={details.notes}
              onChange={e => setDetails({...details, notes: e.target.value})}
            />
          </div>

          {/* Completion Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-deep uppercase tracking-widest">Completion Progress</h3>
              <span className="text-sm font-black text-primary">{details.completionPct}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="5"
              className="w-full h-2 bg-bg-light rounded-lg appearance-none cursor-pointer accent-primary"
              value={details.completionPct}
              onChange={e => setDetails({...details, completionPct: parseInt(e.target.value)})}
            />
            <p className="text-[10px] font-bold text-deep/30 italic">How much of the planned work was finished today?</p>
          </div>

          {/* Billing */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-black text-deep uppercase tracking-widest">Total Cost (PKR)</h3>
              <input 
                type="number" 
                className="w-full px-6 py-4 rounded-2xl bg-bg-light border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm font-black"
                value={details.totalCost}
                onChange={e => setDetails({...details, totalCost: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-black text-deep uppercase tracking-widest">Paid Today (PKR)</h3>
              <input 
                type="number" 
                className="w-full px-6 py-4 rounded-2xl bg-bg-light border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm font-black"
                value={details.amountPaid}
                onChange={e => setDetails({...details, amountPaid: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          {balanceDue > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-3">
              <AlertCircle size={18} className="text-amber-500" />
              <span className="text-xs font-bold text-amber-700">Remaining Balance: Rs. {balanceDue.toLocaleString()}</span>
            </div>
          )}

          {/* Followup */}
          <div className="space-y-6 pt-4 border-t border-deep/5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-deep uppercase tracking-widest">Follow-up Needed?</h3>
              <div className="flex gap-4">
                {['No', 'Yes'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDetails({...details, needsFollowup: opt === 'Yes'})}
                    className={cn(
                      "px-6 py-2 rounded-xl text-xs font-black transition-all",
                      (details.needsFollowup && opt === 'Yes') || (!details.needsFollowup && opt === 'No')
                        ? "bg-deep text-white"
                        : "bg-bg-light text-deep/30"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {details.needsFollowup && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-deep/30 uppercase tracking-widest pl-2">Scheduled Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      required={details.needsFollowup}
                      className="w-full px-6 py-4 rounded-2xl bg-bg-light border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm font-bold appearance-none"
                      value={details.followupDate}
                      onChange={e => setDetails({...details, followupDate: e.target.value})}
                    />
                    <Calendar size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-deep/20 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-deep/30 uppercase tracking-widest pl-2">Reason</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Session 2, Review..."
                    className="w-full px-6 py-4 rounded-2xl bg-bg-light border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm font-bold"
                    value={details.followupReason}
                    onChange={e => setDetails({...details, followupReason: e.target.value})}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </form>

        <div className="p-8 bg-bg-light/30 border-t border-deep/5 flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-4 bg-white border border-deep/5 text-deep/40 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/80 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Saving...' : (
              <>
                <Check size={18} />
                Confirm & Complete
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
