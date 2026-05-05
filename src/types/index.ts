export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
  chief_complaint?: string;
  location?: string;
  medical_history?: string;
  created_at: string;
}

export interface Visit {
  id: string;
  patient_id: string;
  visit_date: string;
  doctor: string;
  status: 'pending' | 'completed' | 'followup_pending';
  procedures: string[];
  procedure_notes?: string;
  completion_pct: number;
  total_cost: number;
  amount_paid: number;
  payment_status: 'unpaid' | 'partial' | 'paid';
  chief_complaint?: string;
  created_at: string;
  patient?: Patient; // Optional joined data
}

export interface Followup {
  id: string;
  visit_id: string;
  patient_id: string;
  scheduled_date: string;
  reason: string;
  status: 'upcoming' | 'completed' | 'missed';
  created_at: string;
  patient?: Patient; // Optional joined data
  visit?: Visit; // Optional joined data
}


export type SidebarTab = 'Dashboard' | 'Patients' | 'Revenue' | 'Calendar' | 'Settings';
