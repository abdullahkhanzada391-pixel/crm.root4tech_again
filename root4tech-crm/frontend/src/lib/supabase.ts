import { createClient } from '@supabase/supabase-js';
import type {
  Lead,
  Client,
  Quotation,
  Invoice,
  SalesRecord,
  Activity,
  AttendanceRecord,
  SalesPersonTask,
  SalesPersonSale,
  MarketingAttendanceRecord,
  OnboardedClient,
  MarketingTask,
  UserAccount
} from '@/types/crm';

// Read from Vite or Next.js environment variables with project fallback defaults
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string) ||
  'https://pqntazkjxiygilfifvzu.supabase.co';

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string) ||
  'sb_publishable_l8zRKvziOghCjQ3tF50edw_C8LHr_hU';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

/**
 * Check if the Supabase cloud database is reachable
 */
export async function checkSupabaseHealth(): Promise<{ ok: boolean; latencyMs?: number; message: string }> {
  const start = Date.now();
  try {
    const { error } = await supabase.from('leads').select('id').limit(1);
    const latencyMs = Date.now() - start;
    if (error) {
      return { ok: false, message: error.message };
    }
    return { ok: true, latencyMs, message: `Connected (${latencyMs}ms)` };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Connection failed' };
  }
}

// ----------------------------------------------------
// 1. Leads Services
// ----------------------------------------------------
export async function fetchLeadsFromSupabase(): Promise<Lead[] | null> {
  try {
    const { data, error } = await supabase.from('leads').select('*').order('dateAdded', { ascending: false });
    if (error) {
      console.warn('Supabase fetchLeads error:', error.message);
      return null;
    }
    return (data as Lead[]) || [];
  } catch (e) {
    console.warn('Supabase fetchLeads exception:', e);
    return null;
  }
}

export async function upsertLeadToSupabase(lead: Lead): Promise<boolean> {
  try {
    const { error } = await supabase.from('leads').upsert(lead);
    if (error) {
      console.warn('Supabase upsertLead error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteLeadFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) {
      console.warn('Supabase deleteLead error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteMultipleLeadsFromSupabase(ids: string[]): Promise<boolean> {
  try {
    const { error } = await supabase.from('leads').delete().in('id', ids);
    return !error;
  } catch {
    return false;
  }
}

// ----------------------------------------------------
// 2. Clients Services
// ----------------------------------------------------
export async function fetchClientsFromSupabase(): Promise<Client[] | null> {
  try {
    const { data, error } = await supabase.from('clients').select('*').order('dateAdded', { ascending: false });
    if (error) return null;
    return (data as Client[]) || [];
  } catch {
    return null;
  }
}

export async function upsertClientToSupabase(client: Client): Promise<boolean> {
  try {
    const { error } = await supabase.from('clients').upsert(client);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteClientFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ----------------------------------------------------
// 3. Quotations Services
// ----------------------------------------------------
export async function fetchQuotationsFromSupabase(): Promise<Quotation[] | null> {
  try {
    const { data, error } = await supabase.from('quotations').select('*').order('dateIssued', { ascending: false });
    if (error) return null;
    return (data as Quotation[]) || [];
  } catch {
    return null;
  }
}

export async function upsertQuotationToSupabase(quote: Quotation): Promise<boolean> {
  try {
    const { error } = await supabase.from('quotations').upsert(quote);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteQuotationFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('quotations').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ----------------------------------------------------
// 4. Invoices Services
// ----------------------------------------------------
export async function fetchInvoicesFromSupabase(): Promise<Invoice[] | null> {
  try {
    const { data, error } = await supabase.from('invoices').select('*').order('issueDate', { ascending: false });
    if (error) return null;
    return (data as Invoice[]) || [];
  } catch {
    return null;
  }
}

export async function upsertInvoiceToSupabase(invoice: Invoice): Promise<boolean> {
  try {
    const { error } = await supabase.from('invoices').upsert(invoice);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteInvoiceFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ----------------------------------------------------
// 5. Sales Records Services
// ----------------------------------------------------
export async function fetchSalesRecordsFromSupabase(): Promise<SalesRecord[] | null> {
  try {
    const { data, error } = await supabase.from('sales_records').select('*');
    if (error) return null;
    return (data as SalesRecord[]) || [];
  } catch {
    return null;
  }
}

export async function upsertSalesRecordToSupabase(sale: SalesRecord): Promise<boolean> {
  try {
    const { error } = await supabase.from('sales_records').upsert(sale);
    return !error;
  } catch {
    return false;
  }
}

// ----------------------------------------------------
// 6. Activities Services
// ----------------------------------------------------
export async function fetchActivitiesFromSupabase(): Promise<Activity[] | null> {
  try {
    const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(30);
    if (error) return null;
    return (data as Activity[]) || [];
  } catch {
    return null;
  }
}

export async function addActivityToSupabase(act: Activity): Promise<boolean> {
  try {
    const { error } = await supabase.from('activities').upsert(act);
    return !error;
  } catch {
    return false;
  }
}

// ----------------------------------------------------
// 7. Users / Auth Services
// ----------------------------------------------------
export async function fetchUsersFromSupabase(): Promise<UserAccount[] | null> {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return null;
    return (data as UserAccount[]) || [];
  } catch {
    return null;
  }
}

export async function upsertUserToSupabase(user: UserAccount): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').upsert(user);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteUserFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ----------------------------------------------------
// 8. Attendance & Tasks Services
// ----------------------------------------------------
export async function fetchAttendanceFromSupabase(): Promise<AttendanceRecord[] | null> {
  try {
    const { data, error } = await supabase.from('attendance').select('*').order('date', { ascending: false });
    if (error) return null;
    return (data as AttendanceRecord[]) || [];
  } catch {
    return null;
  }
}

export async function upsertAttendanceToSupabase(record: AttendanceRecord): Promise<boolean> {
  try {
    const { error } = await supabase.from('attendance').upsert(record);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchSalesTasksFromSupabase(): Promise<SalesPersonTask[] | null> {
  try {
    const { data, error } = await supabase.from('sales_tasks').select('*');
    if (error) return null;
    return (data as SalesPersonTask[]) || [];
  } catch {
    return null;
  }
}

export async function upsertSalesTaskToSupabase(task: SalesPersonTask): Promise<boolean> {
  try {
    const { error } = await supabase.from('sales_tasks').upsert(task);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSalesTaskFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('sales_tasks').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchPersonalSalesFromSupabase(): Promise<SalesPersonSale[] | null> {
  try {
    const { data, error } = await supabase.from('personal_sales').select('*');
    if (error) return null;
    return (data as SalesPersonSale[]) || [];
  } catch {
    return null;
  }
}

export async function upsertPersonalSaleToSupabase(sale: SalesPersonSale): Promise<boolean> {
  try {
    const { error } = await supabase.from('personal_sales').upsert(sale);
    return !error;
  } catch {
    return false;
  }
}

export async function deletePersonalSaleFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('personal_sales').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchMarketingAttendanceFromSupabase(): Promise<MarketingAttendanceRecord[] | null> {
  try {
    const { data, error } = await supabase.from('marketing_attendance').select('*').order('date', { ascending: false });
    if (error) return null;
    return (data as MarketingAttendanceRecord[]) || [];
  } catch {
    return null;
  }
}

export async function upsertMarketingAttendanceToSupabase(record: MarketingAttendanceRecord): Promise<boolean> {
  try {
    const { error } = await supabase.from('marketing_attendance').upsert(record);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchOnboardedClientsFromSupabase(): Promise<OnboardedClient[] | null> {
  try {
    const { data, error } = await supabase.from('onboarded_clients').select('*');
    if (error) return null;
    return (data as OnboardedClient[]) || [];
  } catch {
    return null;
  }
}

export async function upsertOnboardedClientToSupabase(client: OnboardedClient): Promise<boolean> {
  try {
    const { error } = await supabase.from('onboarded_clients').upsert(client);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteOnboardedClientFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('onboarded_clients').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchMarketingTasksFromSupabase(): Promise<MarketingTask[] | null> {
  try {
    const { data, error } = await supabase.from('marketing_tasks').select('*');
    if (error) return null;
    return (data as MarketingTask[]) || [];
  } catch {
    return null;
  }
}

export async function upsertMarketingTaskToSupabase(task: MarketingTask): Promise<boolean> {
  try {
    const { error } = await supabase.from('marketing_tasks').upsert(task);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteMarketingTaskFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('marketing_tasks').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}
