/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Salon,
  Professional,
  ServiceOffer,
  Appointment,
  SalonMedia,
  SalonScheduleConfig,
  SalonBranding,
  AppointmentStatus,
  ServiceCategory,
  SalonService,
  TemplateStyle,
  BusinessNiche,
  TargetAudience,
} from '../types';
import {
  INITIAL_SALONS,
  INITIAL_PROFESSIONALS,
  INITIAL_MEDIA_LIBRARY,
  INITIAL_OFFERS,
  INITIAL_APPOINTMENTS,
  DEFAULT_SCHEDULE_CONFIG,
  INITIAL_SERVICES_MAP,
  getTodayDateStr,
} from '../data/initialData';
import { NICHE_CATALOG, TEMPLATE_DEFINITIONS } from '../data/catalogTemplates';
import { soundManager } from '../utils/audioAlert';

export interface NewSalonOnboardingData {
  name: string;
  owner_name?: string;
  owner_email?: string;
  phone_whatsapp: string;
  phone_landline?: string;
  address: string;
  neighborhood: string;
  city: string;
  niche: BusinessNiche;
  target_audience: TargetAudience;
  template_id: TemplateStyle;
  branding: SalonBranding;
  services: Array<{
    title: string;
    category: string;
    duration_minutes: number;
    price: number;
    description?: string;
    rules?: string;
    image_url?: string;
  }>;
}

interface EcosystemContextType {
  salons: Salon[];
  activeSalon: Salon;
  setActiveSalonId: (id: string) => void;
  updateSalonBranding: (branding: Partial<SalonBranding>) => void;
  updateSalonDetails: (updates: { name?: string; logo_url?: string; branding?: Partial<SalonBranding> }) => void;
  viewMode: 'salon' | 'client';
  setViewMode: (mode: 'salon' | 'client') => void;
  toggleViewMode: () => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  salonServices: SalonService[];
  addSalonService: (service: Omit<SalonService, 'id' | 'salon_id'>) => void;
  updateSalonService: (service: SalonService) => void;
  deleteSalonService: (id: string) => void;
  createSalonFromOnboarding: (data: NewSalonOnboardingData) => Salon;
  setSalonTemplate: (templateId: TemplateStyle) => void;
  bookAppointmentFromClient: (data: {
    serviceTitle: string;
    servicePrice: number;
    professionalId: string;
    dateStr: string;
    timeStr: string;
    clientName: string;
    clientPhone: string;
    notes?: string;
  }) => Appointment;
  professionals: Professional[];
  addProfessional: (prof: Omit<Professional, 'id' | 'salon_id'>) => void;
  updateProfessional: (prof: Professional) => void;
  deleteProfessional: (id: string) => void;
  mediaLibrary: SalonMedia[];
  addMediaItem: (item: Omit<SalonMedia, 'id' | 'salon_id' | 'uploaded_at'>) => void;
  deleteMediaItem: (id: string) => void;
  offers: ServiceOffer[];
  publishOffer: (data: {
    professional_id: string;
    service_title: string;
    category: ServiceCategory;
    original_price: number;
    price: number;
    date_str: string;
    start_time: string;
    end_time: string;
    video_url: string;
  }) => ServiceOffer;
  cancelOffer: (id: string) => void;
  appointments: Appointment[];
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  scheduleConfig: SalonScheduleConfig;
  updateScheduleConfig: (config: Partial<SalonScheduleConfig>) => void;
  // Live simulation & Audio
  incomingBooking: Appointment | null;
  dismissIncomingBooking: () => void;
  simulateIncomingBooking: (offerId?: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
  testSound: () => void;
  activeScreen: 'agenda' | 'schedule' | 'media' | 'settings' | 'financial';
  setActiveScreen: (screen: 'agenda' | 'schedule' | 'media' | 'settings' | 'financial') => void;
  isFastPublishOpen: boolean;
  setIsFastPublishOpen: (open: boolean) => void;
  isBrandingCustomizerOpen: boolean;
  setIsBrandingCustomizerOpen: (open: boolean) => void;
}

const EcosystemContext = createContext<EcosystemContextType | undefined>(undefined);

export const EcosystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [salons, setSalons] = useState<Salon[]>(INITIAL_SALONS);
  const [activeSalonId, setActiveSalonId] = useState<string>(INITIAL_SALONS[0].id);
  const activeSalon = salons.find((s) => s.id === activeSalonId) || salons[0];

  const [professionalsMap, setProfessionalsMap] = useState<Record<string, Professional[]>>(INITIAL_PROFESSIONALS);
  const [mediaList, setMediaList] = useState<SalonMedia[]>(INITIAL_MEDIA_LIBRARY);
  const [offers, setOffers] = useState<ServiceOffer[]>(INITIAL_OFFERS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [scheduleConfig, setScheduleConfig] = useState<SalonScheduleConfig>(DEFAULT_SCHEDULE_CONFIG);
  
  const [activeScreen, setActiveScreen] = useState<'agenda' | 'schedule' | 'media' | 'financial'>('agenda');
  const [isFastPublishOpen, setIsFastPublishOpen] = useState<boolean>(false);
  const [isBrandingCustomizerOpen, setIsBrandingCustomizerOpen] = useState<boolean>(false);
  const [incomingBooking, setIncomingBooking] = useState<Appointment | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // View Mode: 'salon' (dashboard/bancada) or 'client' (visão do cliente final)
  const [viewMode, setViewMode] = useState<'salon' | 'client'>('client');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [servicesMap, setServicesMap] = useState<Record<string, SalonService[]>>(INITIAL_SERVICES_MAP);

  // Dynamic Theming injection into document root (White-label)
  useEffect(() => {
    if (!activeSalon?.branding) return;
    const { primary_color, secondary_color, background_color, accent_color, text_primary, text_muted } = activeSalon.branding;
    const root = document.documentElement;

    root.style.setProperty('--brand-primary', primary_color);
    root.style.setProperty('--brand-secondary', secondary_color);
    root.style.setProperty('--brand-bg', background_color);
    root.style.setProperty('--brand-accent', accent_color);
    root.style.setProperty('--brand-text-primary', text_primary);
    root.style.setProperty('--brand-text-muted', text_muted);
    document.title = `${activeSalon.name} — App Oficial`;
  }, [activeSalon]);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'salon' ? 'client' : 'salon'));
    soundManager.playSuccessTone();
  };

  // Sync mute state with sound manager
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  };

  const testSound = () => {
    soundManager.playHighPriorityAlert();
  };

  const updateSalonBranding = (brandingUpdates: Partial<SalonBranding>) => {
    setSalons((prev) =>
      prev.map((s) => {
        if (s.id === activeSalon.id) {
          return {
            ...s,
            branding: {
              ...s.branding,
              ...brandingUpdates,
            },
          };
        }
        return s;
      })
    );
    soundManager.playSuccessTone();
  };

  const updateSalonDetails = (updates: { name?: string; logo_url?: string; branding?: Partial<SalonBranding> }) => {
    setSalons((prev) =>
      prev.map((s) => {
        if (s.id === activeSalon.id) {
          return {
            ...s,
            name: updates.name ?? s.name,
            branding: {
              ...s.branding,
              logo_url: updates.logo_url ?? updates.branding?.logo_url ?? s.branding.logo_url,
              ...(updates.branding || {}),
            },
          };
        }
        return s;
      })
    );
    soundManager.playSuccessTone();
  };

  const setSalonTemplate = (templateId: TemplateStyle) => {
    const templateDef = TEMPLATE_DEFINITIONS[templateId];
    setSalons((prev) =>
      prev.map((s) => {
        if (s.id === activeSalon.id) {
          return {
            ...s,
            template_id: templateId,
            branding: {
              ...s.branding,
              primary_color: templateDef.branding.primary_color,
              secondary_color: templateDef.branding.secondary_color,
              background_color: templateDef.branding.background_color,
              accent_color: templateDef.branding.accent_color,
              text_primary: templateDef.branding.text_primary,
              text_muted: templateDef.branding.text_muted,
            },
          };
        }
        return s;
      })
    );
    soundManager.playSuccessTone();
  };

  const currentProfessionals = professionalsMap[activeSalon.id] || [];

  const addProfessional = (prof: Omit<Professional, 'id' | 'salon_id'>) => {
    const newProf: Professional = {
      ...prof,
      id: `prof-${Date.now()}`,
      salon_id: activeSalon.id,
    };
    setProfessionalsMap((prev) => ({
      ...prev,
      [activeSalon.id]: [...(prev[activeSalon.id] || []), newProf],
    }));
    soundManager.playSuccessTone();
  };

  const updateProfessional = (updated: Professional) => {
    setProfessionalsMap((prev) => ({
      ...prev,
      [activeSalon.id]: (prev[activeSalon.id] || []).map((p) => (p.id === updated.id ? updated : p)),
    }));
    soundManager.playSuccessTone();
  };

  const deleteProfessional = (id: string) => {
    setProfessionalsMap((prev) => ({
      ...prev,
      [activeSalon.id]: (prev[activeSalon.id] || []).filter((p) => p.id !== id),
    }));
  };

  // Services Management per Salon
  const currentSalonServices = servicesMap[activeSalon.id] || [];

  const addSalonService = (srv: Omit<SalonService, 'id' | 'salon_id'>) => {
    const newSrv: SalonService = {
      ...srv,
      id: `srv-${Date.now()}`,
      salon_id: activeSalon.id,
    };
    setServicesMap((prev) => ({
      ...prev,
      [activeSalon.id]: [...(prev[activeSalon.id] || []), newSrv],
    }));
    soundManager.playSuccessTone();
  };

  const updateSalonService = (updated: SalonService) => {
    setServicesMap((prev) => ({
      ...prev,
      [activeSalon.id]: (prev[activeSalon.id] || []).map((s) => (s.id === updated.id ? updated : s)),
    }));
    soundManager.playSuccessTone();
  };

  const deleteSalonService = (id: string) => {
    setServicesMap((prev) => ({
      ...prev,
      [activeSalon.id]: (prev[activeSalon.id] || []).filter((s) => s.id !== id),
    }));
  };

  // Factory to create brand new Salon from Onboarding Wizard
  const createSalonFromOnboarding = (data: NewSalonOnboardingData): Salon => {
    const newId = `s-${data.niche}-${Date.now().toString().slice(-6)}`;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newSalon: Salon = {
      id: newId,
      name: data.name,
      slug,
      latitude: -23.561684 + (Math.random() - 0.5) * 0.05,
      longitude: -46.655981 + (Math.random() - 0.5) * 0.05,
      address: data.address,
      neighborhood: data.neighborhood,
      city: data.city,
      phone_whatsapp: data.phone_whatsapp,
      phone_landline: data.phone_landline,
      owner_name: data.owner_name,
      owner_email: data.owner_email,
      niche: data.niche,
      target_audience: data.target_audience,
      template_id: data.template_id,
      is_verified: true,
      branding: data.branding,
    };

    const builtServices: SalonService[] = data.services.map((s, idx) => ({
      id: `srv-${newId}-${idx + 1}`,
      salon_id: newId,
      title: s.title,
      category: s.category,
      duration_minutes: s.duration_minutes,
      price: s.price,
      description: s.description,
      rules: s.rules,
      image_url: s.image_url,
    }));

    const nicheTeam = NICHE_CATALOG[data.niche]?.defaultTeam || [
      {
        name: data.owner_name || 'Profissional Principal',
        role: 'Responsável Técnico',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
    ];

    const builtTeam: Professional[] = nicheTeam.map((t, idx) => ({
      id: `prof-${newId}-${idx + 1}`,
      salon_id: newId,
      name: t.name,
      avatar_url: t.avatar,
      specialties: [data.services[0]?.title || 'Atendimento'],
      color_hex: data.branding.primary_color,
      slot_minutes: 30,
      is_active: true,
    }));

    setSalons((prev) => [newSalon, ...prev]);
    setServicesMap((prev) => ({ ...prev, [newId]: builtServices }));
    setProfessionalsMap((prev) => ({ ...prev, [newId]: builtTeam }));
    setActiveSalonId(newId);
    setIsOnboardingOpen(false);
    setViewMode('salon');
    soundManager.playSuccessTone();

    return newSalon;
  };

  // Direct Booking from Client Mode
  const bookAppointmentFromClient = (data: {
    serviceTitle: string;
    servicePrice: number;
    professionalId: string;
    dateStr: string;
    timeStr: string;
    clientName: string;
    clientPhone: string;
    notes?: string;
  }): Appointment => {
    const randomCode = `APP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: `app-client-${Date.now()}`,
      protocol_code: randomCode,
      offer_id: `off-custom-${Date.now()}`,
      salon_id: activeSalon.id,
      professional_id: data.professionalId,
      client_name: data.clientName,
      client_phone: data.clientPhone,
      status: 'CONFIRMADO',
      booked_at: new Date().toISOString(),
      notes: `${data.serviceTitle} (R$ ${data.servicePrice.toFixed(2)}) às ${data.timeStr}. ${data.notes || ''}`,
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setIncomingBooking(newAppointment);

    soundManager.playHighPriorityAlert();
    return newAppointment;
  };

  const addMediaItem = (item: Omit<SalonMedia, 'id' | 'salon_id' | 'uploaded_at'>) => {
    const newMedia: SalonMedia = {
      ...item,
      id: `med-${Date.now()}`,
      salon_id: activeSalon.id,
      uploaded_at: new Date().toISOString(),
    };
    setMediaList((prev) => [newMedia, ...prev]);
    soundManager.playSuccessTone();
  };

  const deleteMediaItem = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  // Publish Lightning Slot (Offer)
  const publishOffer = (data: {
    professional_id: string;
    service_title: string;
    category: ServiceCategory;
    original_price: number;
    price: number;
    date_str: string;
    start_time: string;
    end_time: string;
    video_url: string;
  }): ServiceOffer => {
    const newOffer: ServiceOffer = {
      id: `off-${Date.now()}`,
      salon_id: activeSalon.id,
      ...data,
      status: 'AVAILABLE',
      expires_at: new Date(Date.now() + 1000 * 60 * 90).toISOString(), // 90 min radar window
    };

    setOffers((prev) => [newOffer, ...prev]);
    soundManager.playSuccessTone();
    return newOffer;
  };

  const cancelOffer = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'CANCELLED' } : o))
    );
  };

  // Appointment Status Transition
  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    soundManager.playSuccessTone();
  };

  // Simulate client clicking on "Agendar Vaga" in the consumer app
  const simulateIncomingBooking = (specificOfferId?: string) => {
    // Find an available offer or create an immediate test booking
    const available = specificOfferId 
      ? offers.find((o) => o.id === specificOfferId)
      : offers.find((o) => o.status === 'AVAILABLE');

    const randomClients = [
      { name: 'Gabriel Santana', phone: '(11) 98451-9022' },
      { name: 'Mariana Duarte', phone: '(11) 97190-3345' },
      { name: 'Lucas Penteado', phone: '(11) 99123-0098' },
      { name: 'Beatriz Vasconcelos', phone: '(11) 96321-7788' },
      { name: 'Thiago Martins', phone: '(11) 98774-1290' },
    ];
    const client = randomClients[Math.floor(Math.random() * randomClients.length)];
    const randomCode = `VG-${Math.floor(1000 + Math.random() * 9000)}`;

    let targetOffer: ServiceOffer;

    if (available) {
      targetOffer = available;
      // Transition state: AVAILABLE -> BOOKED
      setOffers((prev) =>
        prev.map((o) => (o.id === available.id ? { ...o, status: 'BOOKED' } : o))
      );
    } else {
      // Create instant offer
      const prof = currentProfessionals[0] || { id: 'prof-fallback', name: 'Profissional' };
      targetOffer = {
        id: `off-auto-${Date.now()}`,
        salon_id: activeSalon.id,
        professional_id: prof.id,
        service_title: 'Degradê Especial Relâmpago',
        category: 'cabelo',
        original_price: 65,
        price: 45,
        date_str: getTodayDateStr(),
        start_time: '17:00',
        end_time: '17:45',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-barber-using-a-razor-to-cut-hair-43407-large.mp4',
        status: 'BOOKED',
        expires_at: new Date().toISOString(),
      };
      setOffers((prev) => [targetOffer, ...prev]);
    }

    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      protocol_code: randomCode,
      offer_id: targetOffer.id,
      salon_id: activeSalon.id,
      professional_id: targetOffer.professional_id,
      client_name: client.name,
      client_phone: client.phone,
      status: 'CONFIRMADO',
      booked_at: new Date().toISOString(),
      notes: 'Reservado online pelo aplicativo oficial do estabelecimento.',
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setIncomingBooking(newAppointment);

    // CRITICAL REQUIREMENT: "Alerta Sonoro Alto no Ionic via Capacitor quando chega agendamento relâmpago"
    soundManager.playHighPriorityAlert();
  };

  const dismissIncomingBooking = () => {
    setIncomingBooking(null);
  };

  const updateScheduleConfigState = (newConfig: Partial<SalonScheduleConfig>) => {
    setScheduleConfig((prev) => ({ ...prev, ...newConfig }));
    soundManager.playSuccessTone();
  };

  return (
    <EcosystemContext.Provider
      value={{
        salons,
        activeSalon,
        setActiveSalonId,
        updateSalonBranding,
        updateSalonDetails,
        viewMode,
        setViewMode,
        toggleViewMode,
        isOnboardingOpen,
        setIsOnboardingOpen,
        salonServices: currentSalonServices,
        addSalonService,
        updateSalonService,
        deleteSalonService,
        createSalonFromOnboarding,
        setSalonTemplate,
        bookAppointmentFromClient,
        professionals: currentProfessionals,
        addProfessional,
        updateProfessional,
        deleteProfessional,
        mediaLibrary: mediaList.filter((m) => m.salon_id === activeSalon.id),
        addMediaItem,
        deleteMediaItem,
        offers: offers.filter((o) => o.salon_id === activeSalon.id),
        publishOffer,
        cancelOffer,
        appointments: appointments.filter((a) => a.salon_id === activeSalon.id),
        updateAppointmentStatus,
        scheduleConfig,
        updateScheduleConfig: updateScheduleConfigState,
        incomingBooking,
        dismissIncomingBooking,
        simulateIncomingBooking,
        isMuted,
        toggleMute,
        testSound,
        activeScreen,
        setActiveScreen,
        isFastPublishOpen,
        setIsFastPublishOpen,
        isBrandingCustomizerOpen,
        setIsBrandingCustomizerOpen,
      }}
    >
      {children}
    </EcosystemContext.Provider>
  );
};

export const useEcosystem = (): EcosystemContextType => {
  const context = useContext(EcosystemContext);
  if (!context) {
    throw new Error('useEcosystem must be used within an EcosystemProvider');
  }
  return context;
};
