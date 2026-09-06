/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Salon, Professional, ServiceOffer, Appointment, SalonMedia, SalonScheduleConfig } from '../types';

// Helper to get today's date in YYYY-MM-DD
export const getTodayDateStr = (): string => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const INITIAL_SALONS: Salon[] = [
  {
    id: 's-vintage-barber-01',
    name: 'Vintage Barber Club',
    slug: 'vintage-barber-club',
    latitude: -23.561684,
    longitude: -46.655981,
    address: 'Rua Augusta, 1420 - Consolação',
    neighborhood: 'Jardins / Bela Vista',
    city: 'São Paulo - SP',
    phone_whatsapp: '+55 11 98765-4321',
    is_verified: true,
    branding: {
      logo_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150&auto=format&fit=crop&q=80',
      primary_color: '#D97706',      // Amber 600
      secondary_color: '#1E293B',    // Slate 800
      background_color: '#0B0F17',   // Deep Charcoal
      accent_color: '#F59E0B',       // Amber 500
      text_primary: '#FFFFFF',
      text_muted: '#94A3B8',
    },
  },
  {
    id: 's-belle-femme-02',
    name: 'Studio Belle Femme',
    slug: 'studio-belle-femme',
    latitude: -23.585211,
    longitude: -46.678129,
    address: 'Av. Brigadeiro Faria Lima, 2890',
    neighborhood: 'Itaim Bibi',
    city: 'São Paulo - SP',
    phone_whatsapp: '+55 11 97123-8899',
    is_verified: true,
    branding: {
      logo_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150&auto=format&fit=crop&q=80',
      primary_color: '#DB2777',      // Pink / Rose 600
      secondary_color: '#1E1B2E',    // Dark Violet-Slate
      background_color: '#0D0B14',   // Midnight Rose Dark
      accent_color: '#F472B6',       // Pink 400
      text_primary: '#FFFFFF',
      text_muted: '#A1A1AA',
    },
  },
  {
    id: 's-zen-spa-03',
    name: 'Espaço Zen & Terapias',
    slug: 'espaco-zen-terapias',
    latitude: -23.550520,
    longitude: -46.633308,
    address: 'Alameda Santos, 980',
    neighborhood: 'Cerqueira César',
    city: 'São Paulo - SP',
    phone_whatsapp: '+55 11 96543-2109',
    is_verified: true,
    branding: {
      logo_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150&auto=format&fit=crop&q=80',
      primary_color: '#10B981',      // Emerald 500
      secondary_color: '#064E3B',    // Emerald 900
      background_color: '#04130F',   // Deep Forest Dark
      accent_color: '#34D399',       // Emerald 400
      text_primary: '#FFFFFF',
      text_muted: '#6EE7B7',
    },
  },
  {
    id: 's-urban-lab-04',
    name: 'Urban Fade Barber Lab',
    slug: 'urban-fade-barber-lab',
    latitude: -23.568210,
    longitude: -46.698940,
    address: 'Rua dos Pinheiros, 740',
    neighborhood: 'Pinheiros',
    city: 'São Paulo - SP',
    phone_whatsapp: '+55 11 99887-1122',
    is_verified: true,
    branding: {
      logo_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=150&auto=format&fit=crop&q=80',
      primary_color: '#3B82F6',      // Blue 500
      secondary_color: '#1E293B',    // Slate 800
      background_color: '#080E1A',   // Deep Navy Dark
      accent_color: '#60A5FA',       // Blue 400
      text_primary: '#FFFFFF',
      text_muted: '#93C5FD',
    },
  },
];

export const INITIAL_PROFESSIONALS: Record<string, Professional[]> = {
  's-vintage-barber-01': [
    {
      id: 'prof-01',
      salon_id: 's-vintage-barber-01',
      name: 'Matheus "Navalha" Silva',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      specialties: ['barba', 'cabelo'],
      color_hex: '#F59E0B',
      slot_minutes: 45,
      is_active: true,
    },
    {
      id: 'prof-02',
      salon_id: 's-vintage-barber-01',
      name: 'Diego Barber',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      specialties: ['cabelo'],
      color_hex: '#3B82F6',
      slot_minutes: 40,
      is_active: true,
    },
    {
      id: 'prof-03',
      salon_id: 's-vintage-barber-01',
      name: 'Carlos Mestre Barbeiro',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      specialties: ['barba', 'beleza'],
      color_hex: '#10B981',
      slot_minutes: 50,
      is_active: true,
    },
  ],
  's-belle-femme-02': [
    {
      id: 'prof-bf-01',
      salon_id: 's-belle-femme-02',
      name: 'Camila Hair Stylist',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      specialties: ['cabelo', 'estetica'],
      color_hex: '#EC4899',
      slot_minutes: 60,
      is_active: true,
    },
    {
      id: 'prof-bf-02',
      salon_id: 's-belle-femme-02',
      name: 'Larissa Nail Designer',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      specialties: ['unhas', 'beleza'],
      color_hex: '#A855F7',
      slot_minutes: 50,
      is_active: true,
    },
  ],
  's-zen-spa-03': [
    {
      id: 'prof-zen-01',
      salon_id: 's-zen-spa-03',
      name: 'Juliana Massoterapeuta',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      specialties: ['estetica', 'beleza'],
      color_hex: '#10B981',
      slot_minutes: 60,
      is_active: true,
    },
  ],
  's-urban-lab-04': [
    {
      id: 'prof-urban-01',
      salon_id: 's-urban-lab-04',
      name: 'Renan Fade Master',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      specialties: ['cabelo', 'barba'],
      color_hex: '#3B82F6',
      slot_minutes: 40,
      is_active: true,
    },
  ],
};

export const INITIAL_MEDIA_LIBRARY: SalonMedia[] = [
  {
    id: 'med-01',
    salon_id: 's-vintage-barber-01',
    title: 'Degradê Navalhado em 5s',
    type: 'video_5s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-barber-using-a-razor-to-cut-hair-43407-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&auto=format&fit=crop&q=80',
    duration_seconds: 5,
    category: 'cabelo',
    uploaded_at: '2026-09-01T14:20:00Z',
  },
  {
    id: 'med-02',
    salon_id: 's-vintage-barber-01',
    title: 'Toalha Quente & Barboterapia',
    type: 'video_5s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-barber-trimming-a-mans-beard-43406-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&auto=format&fit=crop&q=80',
    duration_seconds: 5,
    category: 'barba',
    uploaded_at: '2026-09-02T11:00:00Z',
  },
  {
    id: 'med-03',
    salon_id: 's-vintage-barber-01',
    title: 'Acabamento Pomada Matte',
    type: 'video_5s',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-man-getting-his-haircut-at-a-barbershop-43404-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=80',
    duration_seconds: 5,
    category: 'cabelo',
    uploaded_at: '2026-09-03T09:30:00Z',
  },
  {
    id: 'med-04',
    salon_id: 's-vintage-barber-01',
    title: 'Fachada & Lounge Vintage',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&auto=format&fit=crop&q=80',
    duration_seconds: 5,
    category: 'beleza',
    uploaded_at: '2026-08-28T16:00:00Z',
  },
];

export const INITIAL_OFFERS: ServiceOffer[] = [
  {
    id: 'off-01',
    salon_id: 's-vintage-barber-01',
    professional_id: 'prof-01',
    service_title: 'Degradê Navalhado + Penteado',
    category: 'cabelo',
    original_price: 75.0,
    price: 49.9,
    date_str: getTodayDateStr(),
    start_time: '15:30',
    end_time: '16:15',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-barber-using-a-razor-to-cut-hair-43407-large.mp4',
    status: 'AVAILABLE',
    expires_at: new Date(Date.now() + 1000 * 60 * 55).toISOString(), // expira em 55min
  },
  {
    id: 'off-02',
    salon_id: 's-vintage-barber-01',
    professional_id: 'prof-02',
    service_title: 'Corte Tradicional na Tesoura',
    category: 'cabelo',
    original_price: 70.0,
    price: 45.0,
    date_str: getTodayDateStr(),
    start_time: '16:30',
    end_time: '17:10',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-getting-his-haircut-at-a-barbershop-43404-large.mp4',
    status: 'AVAILABLE',
    expires_at: new Date(Date.now() + 1000 * 60 * 115).toISOString(),
  },
  {
    id: 'off-03',
    salon_id: 's-vintage-barber-01',
    professional_id: 'prof-03',
    service_title: 'Barboterapia Completa com Toalha',
    category: 'barba',
    original_price: 65.0,
    price: 39.9,
    date_str: getTodayDateStr(),
    start_time: '14:00',
    end_time: '14:50',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-barber-trimming-a-mans-beard-43406-large.mp4',
    status: 'BOOKED',
    expires_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-01',
    protocol_code: 'VG-9482',
    offer_id: 'off-03',
    salon_id: 's-vintage-barber-01',
    professional_id: 'prof-03',
    client_name: 'Felipe Albuquerque',
    client_phone: '(11) 98341-2099',
    status: 'EM_ATENDIMENTO',
    booked_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    notes: 'Cliente de primeira viagem pelo app Vagou.',
  },
  {
    id: 'app-02',
    protocol_code: 'VG-3104',
    offer_id: 'off-past-01',
    salon_id: 's-vintage-barber-01',
    professional_id: 'prof-01',
    client_name: 'Rodrigo Santoro Jr.',
    client_phone: '(11) 97762-4411',
    status: 'CONCLUIDO',
    booked_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    notes: 'Pagou no balcão via Pix.',
  },
  {
    id: 'app-03',
    protocol_code: 'VG-7712',
    offer_id: 'off-past-02',
    salon_id: 's-vintage-barber-01',
    professional_id: 'prof-02',
    client_name: 'Lucas Penteado',
    client_phone: '(11) 99123-0098',
    status: 'CONFIRMADO',
    booked_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    notes: 'Agendou vaga relâmpago para as 17:30.',
  },
];

export const DEFAULT_SCHEDULE_CONFIG: SalonScheduleConfig = {
  open_time: '09:00',
  close_time: '20:00',
  lunch_start: '12:30',
  lunch_end: '13:30',
  work_days: [1, 2, 3, 4, 5, 6], // Segunda a Sábado
  auto_sound_alert: true,
};
