import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Order {
  customer_name: string;
  customer_phone: string;
  delivery_date: string;
  delivery_time: string;
  delivery_address: string;
  pax?: string | null;
  special_notes?: string | null;
  products: { id: string; name: string; quantity: number; price: string | number }[];
  extras: { id: string; name: string; quantity: number; price: string | number }[];
  subtotal: string;
  status: string;
}

export async function saveOrderToSupabase(order: Order): Promise<void> {
  const { error } = await supabase.from('orders').insert(order);
  if (error) throw error;
}
