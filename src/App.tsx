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
import { PartnerSettingsScreen } from './components/PartnerSettingsScreen';
import { IncomingBookingAlertModal } from './components/IncomingBookingAlertModal';
import { BrandingCustomizerModal } from './components/BrandingCustomizerModal';
import { BottomNav } from './components/BottomNav';

const AppContent: React.FC = () => {
  const {
    activeScreen,
    isFastPublishOpen,
    setIsFastPublishOpen,
  } = useEcosystem();

  const [fastPublishInitialProfId, setFastPublishInitialProfId] = useState<string | undefined>(undefined);
  const [fastPublishInitialTime, setFastPublishInitialTime] = useState<string | undefined>(undefined);

  const handleOpenFastPublish = (profId?: string, time?: string) => {
    setFastPublishInitialProfId(profId);
    setFastPublishInitialTime(time);
    setIsFastPublishOpen(true);
  };

  const handlePublishWithMedia = (_mediaId: string) => {
    setFastPublishInitialProfId(undefined);
    setFastPublishInitialTime(undefined);
    setIsFastPublishOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center antialiased selection:bg-amber-500 selection:text-white">
      {/* 1. ESTRUTURA DO CONTAINER (MOLDURA DE SMARTPHONE ESTRITA: max-w-md, 430px centralizado) */}
      <div className="w-full max-w-md min-h-screen bg-slate-950 text-white flex flex-col relative shadow-2xl overflow-x-hidden pb-20">
        {/* 2. NOVO CABEÇALHO SUPERIOR (STICKY TOP-0 Z-40) */}
        <Header />

        {/* Telas Principais */}
        <main className="flex-1 w-full px-3 py-3">
          {activeScreen === 'agenda' && (
            <PartnerAgendaScreen onOpenFastPublish={handleOpenFastPublish} />
          )}

          {activeScreen === 'media' && (
            <SalonMediaLibraryScreen onPublishWithMedia={handlePublishWithMedia} />
          )}

          {activeScreen === 'schedule' && (
            <PartnerScheduleConfigScreen />
          )}

          {activeScreen === 'settings' && (
            <PartnerSettingsScreen />
          )}
        </main>

        {/* 5. MENU INFERIOR FIXO (BOTTOM NAV): [📅 Agenda] [🎬 Vídeos 5s] [👥 Equipe] [⚙️ Configurações] */}
        <BottomNav />

        {/* Modals & Overlays */}
        <FastPublishModal
          isOpen={isFastPublishOpen}
          onClose={() => setIsFastPublishOpen(false)}
          initialProfessionalId={fastPublishInitialProfId}
          initialStartTime={fastPublishInitialTime}
        />
        <BrandingCustomizerModal />
        <IncomingBookingAlertModal />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <EcosystemProvider>
      <AppContent />
    </EcosystemProvider>
  );
};

export default App;
