/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SalonBranding {
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  accent_color: string;
  text_primary: string;
  text_muted: string;
}

export interface Salon {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  address: string;
  neighborhood: string;
  city: string;
  phone_whatsapp: string;
  branding: SalonBranding;
  is_verified: boolean;
}

export interface Professional {
  id: string;
  salon_id: string;
  name: string;
  avatar_url: string;
  specialties: string[];
  color_hex: string;
  slot_minutes: number;
  is_active: boolean;
}

export type ServiceCategory = 'cabelo' | 'barba' | 'unhas' | 'estetica' | 'beleza';

export type OfferStatus = 'AVAILABLE' | 'BOOKED' | 'EXPIRED' | 'CANCELLED';

export interface ServiceOffer {
  id: string;
  salon_id: string;
  professional_id: string;
  service_title: string;
  category: ServiceCategory;
  original_price: number;
  price: number;
  date_str: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  video_url: string;
  status: OfferStatus;
  expires_at: string; // ISO String
}

export type AppointmentStatus =
  | 'CONFIRMADO'
  | 'EM_ATENDIMENTO'
  | 'CONCLUIDO'
  | 'CANCELADO'
  | 'NO_SHOW';

export interface Appointment {
  id: string;
  protocol_code: string; // ex: 'VG-9482'
  offer_id: string;
  salon_id: string;
  professional_id: string;
  client_name: string;
  client_phone: string;
  status: AppointmentStatus;
  booked_at: string; // ISO String
  notes?: string;
}

export interface SalonMedia {
  id: string;
  salon_id: string;
  title: string;
  type: 'video_5s' | 'photo';
  url: string;
  thumbnail_url?: string;
  duration_seconds: number;
  category: ServiceCategory;
  uploaded_at: string;
}

export interface SalonScheduleConfig {
  open_time: string; // '08:00'
  close_time: string; // '20:00'
  lunch_start: string; // '12:00'
  lunch_end: string; // '13:00'
  work_days: number[]; // 0 = Dom, 1 = Seg, ..., 6 = Sab
  auto_sound_alert: boolean;
}
