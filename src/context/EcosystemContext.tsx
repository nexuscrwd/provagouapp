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
} from '../types';
import {
  INITIAL_SALONS,
  INITIAL_PROFESSIONALS,
  INITIAL_MEDIA_LIBRARY,
  INITIAL_OFFERS,
  INITIAL_APPOINTMENTS,
  DEFAULT_SCHEDULE_CONFIG,
  getTodayDateStr,
} from '../data/initialData';
import { soundManager } from '../utils/audioAlert';

interface EcosystemContextType {
  salons: Salon[];
  activeSalon: Salon;
  setActiveSalonId: (id: string) => void;
  updateSalonBranding: (branding: Partial<SalonBranding>) => void;
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
  activeScreen: 'agenda' | 'schedule' | 'media' | 'financial';
  setActiveScreen: (screen: 'agenda' | 'schedule' | 'media' | 'financial') => void;
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
  }, [activeSalon]);

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

  // Simulate client clicking on "Agendar Vaga" in the consumer app (App Vagou)
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
      notes: 'Reservado via App Consumidor (Vagou Feed Relâmpago).',
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
