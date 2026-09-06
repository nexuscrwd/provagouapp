/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EcosystemProvider, useEcosystem } from './context/EcosystemContext';
import { Header } from './components/Header';
import { PartnerAgendaScreen } from './components/PartnerAgendaScreen';
import { FastPublishModal } from './components/FastPublishModal';
import { PartnerScheduleConfigScreen } from './components/PartnerScheduleConfigScreen';
import { SalonMediaLibraryScreen } from './components/SalonMediaLibraryScreen';
import { PartnerFinancialScreen } from './components/PartnerFinancialScreen';
import { IncomingBookingAlertModal } from './components/IncomingBookingAlertModal';
import { BrandingCustomizerModal } from './components/BrandingCustomizerModal';
import { Calendar, Video, Clock, DollarSign, Zap } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    isFastPublishOpen,
    setIsFastPublishOpen,
    activeSalon,
    appointments,
  } = useEcosystem();

  const [fastPublishInitialProfId, setFastPublishInitialProfId] = useState<string | undefined>(undefined);
  const [fastPublishInitialTime, setFastPublishInitialTime] = useState<string | undefined>(undefined);

  const handleOpenFastPublish = (profId?: string, time?: string) => {
    setFastPublishInitialProfId(profId);
    setFastPublishInitialTime(time);
    setIsFastPublishOpen(true);
  };

  const handlePublishWithMedia = (mediaId: string) => {
    setFastPublishInitialProfId(undefined);
    setFastPublishInitialTime(undefined);
    setIsFastPublishOpen(true);
  };

  const activeAppointmentsCount = appointments.filter(
    (a) => a.status === 'CONFIRMADO' || a.status === 'EM_ATENDIMENTO'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--brand-bg)] text-[var(--brand-text-primary)] transition-colors duration-300 antialiased selection:bg-amber-500 selection:text-white">
      {/* Sticky Header with Dynamic Theming, Switcher, and Sound Controls */}
      <Header />

      {/* Main Operational Container (Optimized for Mobile Vertical Smartphone < 768px and Tablet >= 768px) */}
      <main className="flex-1 w-full max-w-md md:max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-6 pb-24 md:pb-8">
        {activeScreen === 'agenda' && (
          <PartnerAgendaScreen onOpenFastPublish={handleOpenFastPublish} />
        )}

        {activeScreen === 'media' && (
          <SalonMediaLibraryScreen onPublishWithMedia={handlePublishWithMedia} />
        )}

        {activeScreen === 'schedule' && (
          <PartnerScheduleConfigScreen />
        )}

        {activeScreen === 'financial' && (
          <PartnerFinancialScreen />
        )}
      </main>

      {/* Mobile-First Vertical Bottom Navigation Dock (< 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Tab 1: Agenda / Grade do Dia */}
          <button
            id="mobile-nav-agenda"
            onClick={() => setActiveScreen('agenda')}
            className={`min-h-[48px] flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-2xl transition cursor-pointer relative ${
              activeScreen === 'agenda'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition ${
                activeScreen === 'agenda' ? 'scale-110' : ''
              }`}
              style={{
                backgroundColor: activeScreen === 'agenda' ? `${activeSalon.branding.primary_color}30` : 'transparent',
                color: activeScreen === 'agenda' ? activeSalon.branding.primary_color : undefined,
              }}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-none">Agenda</span>
            {activeAppointmentsCount > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center shadow">
                {activeAppointmentsCount}
              </span>
            )}
          </button>

          {/* Tab 2: Biblioteca 5s */}
          <button
            id="mobile-nav-media"
            onClick={() => setActiveScreen('media')}
            className={`min-h-[48px] flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-2xl transition cursor-pointer ${
              activeScreen === 'media'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition ${
                activeScreen === 'media' ? 'scale-110' : ''
              }`}
              style={{
                backgroundColor: activeScreen === 'media' ? `${activeSalon.branding.primary_color}30` : 'transparent',
                color: activeScreen === 'media' ? activeSalon.branding.primary_color : undefined,
              }}
            >
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-none">Vídeos 5s</span>
          </button>

          {/* Center Mobile Quick Action: Fast Publish Vaga Relâmpago */}
          <button
            id="mobile-nav-fast-publish"
            onClick={() => setIsFastPublishOpen(true)}
            className="min-h-[48px] px-3.5 -mt-4 py-2 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl transition active:scale-95 cursor-pointer font-bold border-2 border-slate-900"
            style={{
              backgroundColor: activeSalon.branding.primary_color,
              boxShadow: `0 4px 20px ${activeSalon.branding.primary_color}60`,
            }}
            title="Publicar Vaga Relâmpago em 2 toques"
          >
            <Zap className="w-5 h-5 fill-white" />
            <span className="text-[10px] uppercase tracking-tight mt-0.5">Vaga 5s</span>
          </button>

          {/* Tab 3: Equipe & Escala */}
          <button
            id="mobile-nav-schedule"
            onClick={() => setActiveScreen('schedule')}
            className={`min-h-[48px] flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-2xl transition cursor-pointer ${
              activeScreen === 'schedule'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition ${
                activeScreen === 'schedule' ? 'scale-110' : ''
              }`}
              style={{
                backgroundColor: activeScreen === 'schedule' ? `${activeSalon.branding.primary_color}30` : 'transparent',
                color: activeScreen === 'schedule' ? activeSalon.branding.primary_color : undefined,
              }}
            >
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-none">Equipe</span>
          </button>

          {/* Tab 4: Financeiro & Comissões */}
          <button
            id="mobile-nav-financial"
            onClick={() => setActiveScreen('financial')}
            className={`min-h-[48px] flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-2xl transition cursor-pointer ${
              activeScreen === 'financial'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition ${
                activeScreen === 'financial' ? 'scale-110' : ''
              }`}
              style={{
                backgroundColor: activeScreen === 'financial' ? `${activeSalon.branding.primary_color}30` : 'transparent',
                color: activeScreen === 'financial' ? activeSalon.branding.primary_color : undefined,
              }}
            >
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-none">Financeiro</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {isFastPublishOpen && (
        <FastPublishModal
          initialProfessionalId={fastPublishInitialProfId}
          initialStartTime={fastPublishInitialTime}
          onClose={() => setIsFastPublishOpen(false)}
        />
      )}

      {/* High-priority Loud Incoming Booking Alert */}
      <IncomingBookingAlertModal />

      {/* Dynamic Theming White-Label Customizer */}
      <BrandingCustomizerModal />
    </div>
  );
};

export default function App() {
  return (
    <EcosystemProvider>
      <AppContent />
    </EcosystemProvider>
  );
}
