import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, UserPlus, Check, AlertCircle, Calendar, Plus, Users, ChevronRight } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { cn } from '../../lib/utils';
import { Patient } from '../../types';

interface Props {
  onClose: () => void;
}

export const PatientIntakeModal = ({ onClose }: Props) => {
  const { findPatientsByPhone, addPatient, addVisit } = useAdminStore();
  const [step, setStep] = useState<'search' | 'results' | 'form'>('search');
  const [loading, setLoading] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    email: '',
    phone: '',
    chief_complaint: '',
    medical_history: '',
    appointment_date: new Date().toISOString().split('T')[0],
    doctor: 'Dr. Nova'
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneSearch) return;
    setLoading(true);
    try {
      const patients = await findPatientsByPhone(phoneSearch.trim());
      if (patients.length > 0) {
        setSearchResults(patients);
        setStep('results');
      } else {
        setFormData(prev => ({ ...prev, phone: phoneSearch.trim() }));
        setStep('form');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData(prev => ({
      ...prev,
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      email: patient.email || '',
      phone: patient.phone,
      medical_history: patient.medical_history || ''
    }));
    setStep('form');
  };

  const handleAddNewInFamily = () => {
    setSelectedPatient(null);
    setFormData(prev => ({
      ...prev,
      name: '',
      age: '',
      gender: 'Male',
      email: '',
      phone: phoneSearch.trim(),
      medical_history: ''
    }));
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let patientId = selectedPatient?.id;

      if (!patientId) {
        // Only add if we don't have a selected patient
        const patient = await addPatient({
          name: formData.name.trim(),
          age: parseInt(formData.age) || 0,
          gender: formData.gender,
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          chief_complaint: formData.chief_complaint.trim(),
          medical_history: formData.medical_history.trim()
        });
        patientId = patient.id;
      }

      await addVisit({
        patient_id: patientId,
        visit_date: formData.appointment_date,
        doctor: formData.doctor,
        status: 'pending',
        procedures: [],
        completion_pct: 0,
        total_cost: 0,
        amount_paid: 0,
        payment_status: 'unpaid',
        chief_complaint: formData.chief_complaint.trim()
      });

      onClose();
    } catch (err: any) {
      console.error(err);
      alert('Failed to register intake. ' + (err.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="text-2xl font-display font-black text-deep">Patient Intake</h2>
            <p className="text-xs font-bold text-deep/30 uppercase tracking-widest mt-1">
              {step === 'search' ? 'Search or Register' : step === 'results' ? 'Family Records Found' : 'Complete Registration'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-deep/5 rounded-full transition-colors">
            <X size={24} className="text-deep/30" />
          </button>
        </div>

        <div className="p-8">
          {step === 'search' && (
            <div className="space-y-8 py-10 text-center">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} />
              </div>
              <div className="max-w-xs mx-auto">
                <h3 className="text-xl font-bold text-deep mb-2">Search First</h3>
                <p className="text-sm text-deep/40 leading-relaxed mb-8">Enter phone number to check if the patient or their family is registered.</p>
                <form onSubmit={handleSearch} className="space-y-4">
                  <input 
                    type="tel"
                    required
                    placeholder="e.g. 0300 1234567"
                    className="w-full px-8 py-5 rounded-2xl bg-bg-light border-transparent focus:bg-white focus:border-primary/30 outline-none text-center text-lg font-black tracking-wider"
                    value={phoneSearch}
                    onChange={e => setPhoneSearch(e.target.value)}
                  />
                  <button 
                    disabled={loading}
                    className="w-full py-5 bg-deep text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-deep/10 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search Patient'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep('form')}
                    className="text-xs font-black text-primary uppercase tracking-widest hover:underline pt-4"
                  >
                    Skip to New Patient Form
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 'results' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 bg-amber-50 rounded-3xl border border-amber-100 mb-2">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Users className="text-amber-500" size={24} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-deep">Family Members Found</h4>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Shared number: {phoneSearch}</p>
                 </div>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {searchResults.map(patient => (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className="w-full p-4 rounded-2xl bg-bg-light/50 border border-transparent hover:border-primary/30 hover:bg-white transition-all flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`} alt="" />
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="text-sm font-black text-deep">{patient.name}</h4>
                      <p className="text-[10px] font-bold text-deep/30 uppercase tracking-widest">{patient.gender}, {patient.age} years</p>
                    </div>
                    <ChevronRight size={16} className="text-deep/20 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-deep/5 flex gap-4">
                 <button 
                   onClick={() => setStep('search')}
                   className="flex-1 py-4 bg-bg-light text-deep/30 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-bg-light/80 transition-all cursor-pointer"
                 >
                   Back
                 </button>
                 <button 
                   onClick={handleAddNewInFamily}
                   className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 cursor-pointer"
                 >
                   <Plus size={18} />
                   Register New Family Member
                 </button>
              </div>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
               {selectedPatient && (
                 <div className="p-6 rounded-[32px] bg-emerald-50 border border-emerald-100 flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-sm">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient.name}`} alt="" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-deep">{selectedPatient.name}</h3>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Existing Profile Selected</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSelectedPatient(null)}
                      className="ml-auto text-[10px] font-black text-deep/30 hover:text-red-500 uppercase tracking-widest"
                    >
                      Change
                    </button>
                 </div>
               )}

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                     <label className="text-[10px] font-black text-deep/30 uppercase tracking-widest pl-2">Full Name</label>
                     <input 
                       type="text" required
                       readOnly={!!selectedPatient}
                       className={cn(
                         "w-full px-6 py-4 rounded-2xl border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm font-bold transition-all",
                         selectedPatient ? "bg-bg-light/30 opacity-60" : "bg-bg-light"
                       )}
                       value={formData.name}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-deep/30 uppercase tracking-widest pl-2">Age</label>
                     <input 
                       type="number" required
                       readOnly={!!selectedPatient}
                       className={cn(
                         "w-full px-6 py-4 rounded-2xl border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm font-bold transition-all",
                         selectedPatient ? "bg-bg-light/30 opacity-60" : "bg-bg-light"
                       )}
                       value={formData.age}
                       onChange={e => setFormData({...formData, age: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-deep/30 uppercase tracking-widest pl-2">Gender</label>
                     <select 
                       disabled={!!selectedPatient}
                       className={cn(
                         "w-full px-6 py-4 rounded-2xl border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm font-bold transition-all appearance-none",
                         selectedPatient ? "bg-bg-light/30 opacity-60" : "bg-bg-light"
                       )}
                       value={formData.gender}
                       onChange={e => setFormData({...formData, gender: e.target.value})}
                     >
                       <option>Male</option>
                       <option>Female</option>
                       <option>Other</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-deep/30 uppercase tracking-widest pl-2">Phone</label>
                     <input 
                       type="tel" required
                       readOnly={!!selectedPatient}
                       className={cn(
                         "w-full px-6 py-4 rounded-2xl border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm font-bold transition-all",
                         selectedPatient ? "bg-bg-light/30 opacity-60" : "bg-bg-light"
                       )}
                       value={formData.phone}
                       onChange={e => setFormData({...formData, phone: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-deep/30 uppercase tracking-widest pl-2">Email (Optional)</label>
                     <input 
                       type="email"
                       readOnly={!!selectedPatient}
                       className={cn(
                         "w-full px-6 py-4 rounded-2xl border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm font-bold transition-all",
                         selectedPatient ? "bg-bg-light/30 opacity-60" : "bg-bg-light"
                       )}
                       value={formData.email}
                       onChange={e => setFormData({...formData, email: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2 col-span-2">
                     <label className="text-[10px] font-black text-deep/30 uppercase tracking-widest pl-2">Chief Complaint</label>
                     <input 
                       type="text" required
                       placeholder="Why is the patient visiting today?"
                       className="w-full px-6 py-4 rounded-2xl bg-bg-light border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm font-bold"
                       value={formData.chief_complaint}
                       onChange={e => setFormData({...formData, chief_complaint: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2 col-span-2">
                     <label className="text-[10px] font-black text-deep/30 uppercase tracking-widest pl-2">Medical History (Allergies, Meds, Conditions)</label>
                     <textarea 
                       rows={3}
                       readOnly={!!selectedPatient}
                       className={cn(
                         "w-full px-6 py-4 rounded-2xl border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm font-medium resize-none transition-all",
                         selectedPatient ? "bg-bg-light/30 opacity-60" : "bg-bg-light"
                       )}
                       value={formData.medical_history}
                       onChange={e => setFormData({...formData, medical_history: e.target.value})}
                     />
                  </div>
               </div>

               <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      if (searchResults.length > 0) setStep('results');
                      else setStep('search');
                    }}
                    className="flex-1 py-4 bg-bg-light text-deep/30 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-bg-light/80 transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    {loading ? 'Saving...' : (
                      <>
                        <UserPlus size={18} />
                        {selectedPatient ? 'Add Family Visit' : 'Register & Intake'}
                      </>
                    )}
                  </button>
               </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
