import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Patient, Visit, Followup } from '../types';
import { Session } from '@supabase/supabase-js';

interface AdminState {
  patients: Patient[];
  visits: Visit[];
  followups: Followup[];
  loading: boolean;
  error: string | null;
  session: Session | null;

  // Actions
  setSession: (session: Session | null) => void;
  fetchData: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'created_at'>) => Promise<Patient>;
  findPatientsByPhone: (phone: string) => Promise<Patient[]>;
  addVisit: (visit: Omit<Visit, 'id' | 'created_at' | 'patient'>) => Promise<void>;
  completeVisit: (visitId: string, data: Partial<Visit>, followup?: Omit<Followup, 'id' | 'created_at' | 'patient_id' | 'visit_id' | 'patient'>) => Promise<void>;
  updatePatient: (patientId: string, data: Partial<Patient>) => Promise<void>;
  deletePatient: (patientId: string) => Promise<void>;
  updateVisit: (visitId: string, data: Partial<Visit>) => Promise<void>;
  deleteVisit: (visitId: string) => Promise<void>;
  refreshFollowupStatus: (followupId: string, status: Followup['status']) => Promise<void>;
  
  // Computed
  getPatientById: (id: string) => Patient | undefined;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  patients: [],
  visits: [],
  followups: [],
  loading: false,
  error: null,
  session: null,

  setSession: (session) => set({ session }),

  fetchData: async () => {
    set({ loading: true });
    try {
      const [pRes, vRes, fRes] = await Promise.all([
        supabase.from('patients').select('*'),
        supabase.from('visits').select('*, patient:patients(*)').order('created_at', { ascending: false }),
        supabase.from('followups').select('*, patient:patients(*), visit:visits(*)').order('scheduled_date', { ascending: true })
      ]);

      if (pRes.error) throw pRes.error;
      if (vRes.error) throw vRes.error;
      if (fRes.error) throw fRes.error;

      set({ 
        patients: pRes.data, 
        visits: vRes.data, 
        followups: fRes.data, 
        loading: false 
      });
    } catch (err: any) {
      console.error('Data fetch error:', err);
      set({ error: err.message, loading: false });
    }
  },

  findPatientsByPhone: async (phone) => {
    const { data, error } = await supabase.from('patients').select('*').eq('phone', phone);
    if (error) throw error;
    return data || [];
  },

  addPatient: async (patient) => {
    const { data, error } = await supabase.from('patients').insert([patient]).select().single();
    if (error) throw error;
    set(state => ({ patients: [data, ...state.patients] }));
    return data;
  },

  addVisit: async (visit) => {
    const { error } = await supabase.from('visits').insert([visit]);
    if (error) throw error;
    await get().fetchData();
  },

  completeVisit: async (visitId, data, followup) => {
    const { error: vError } = await supabase.from('visits').update({
      ...data,
      status: followup ? 'followup_pending' : 'completed'
    }).eq('id', visitId);

    if (vError) throw vError;

    if (followup) {
      const visit = get().visits.find(v => v.id === visitId);
      if (visit) {
        const { error: fError } = await supabase.from('followups').insert([{
          ...followup,
          visit_id: visitId,
          patient_id: visit.patient_id
        }]);
        if (fError) throw fError;
      }
    }

    await get().fetchData();
  },

  updatePatient: async (patientId, data) => {
    const { error } = await supabase.from('patients').update(data).eq('id', patientId);
    if (error) throw error;
    // Local update for immediate feedback
    set(state => ({
      patients: state.patients.map(p => p.id === patientId ? { ...p, ...data } : p),
      visits: state.visits.map(v => v.patient_id === patientId ? { ...v, patient: { ...v.patient!, ...data } } : v),
      followups: state.followups.map(f => f.patient_id === patientId ? { ...f, patient: { ...f.patient!, ...data } } : f)
    }));
  },

  deletePatient: async (patientId) => {
    const { error } = await supabase.from('patients').delete().eq('id', patientId);
    if (error) throw error;
    await get().fetchData();
  },

  updateVisit: async (visitId, data) => {
    const { error } = await supabase.from('visits').update(data).eq('id', visitId);
    if (error) throw error;
    await get().fetchData();
  },

  deleteVisit: async (visitId) => {
    const { error } = await supabase.from('visits').delete().eq('id', visitId);
    if (error) throw error;
    await get().fetchData();
  },

  refreshFollowupStatus: async (followupId, status) => {
    const { error } = await supabase.from('followups').update({ status }).eq('id', followupId);
    if (error) throw error;
    await get().fetchData();
  },

  getPatientById: (id) => get().patients.find(p => p.id === id),
}));
