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
import { SalonOnboardingModal } from './components/SalonOnboardingModal';
import { ClientAppView } from './components/ClientAppView';
import { BottomNav } from './components/BottomNav';

const AppContent: React.FC = () => {
  const {
    activeScreen,
    viewMode,
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
    <div className="h-[100dvh] w-full bg-[#151A1E] sm:bg-slate-200 flex justify-center items-center antialiased overflow-hidden">
      {/* Moldura de Smartphone Centralizada */}
      <main className="w-full max-w-md h-[100dvh] bg-slate-950 text-slate-100 flex flex-col relative shadow-2xl overflow-hidden font-sans">
        {/* CABEÇALHO COMPACTO SUPERIOR (Apenas no Modo Bancada) */}
        {viewMode === 'salon' && <Header />}

        {/* MODO CLIENTE FINAL (CONSUMER VIEW - 100% FIEL À REFERÊNCIA VALYIOO) */}
        {viewMode === 'client' ? (
          <ClientAppView />
        ) : (
          /* MODO BANCADA DO SALÃO (PARTNER MANAGEMENT) */
          <>
            <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden relative bg-slate-950 p-3">
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

              {/* Rodapé com créditos discretos */}
              <footer className="pt-2 pb-1 text-center select-none">
                <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                  Tecnologia por <span className="text-slate-400 font-semibold">Vagou</span>
                </p>
              </footer>
            </div>

            {/* MENU INFERIOR FIXO (BOTTOM NAV - apenas na Bancada) */}
            <div className="shrink-0 z-30 w-full bg-slate-900 border-t border-slate-800">
              <BottomNav />
            </div>
          </>
        )}
      </main>

      {/* Modais Globais */}
      <FastPublishModal
        isOpen={isFastPublishOpen}
        onClose={() => setIsFastPublishOpen(false)}
        initialProfessionalId={fastPublishInitialProfId}
        initialStartTime={fastPublishInitialTime}
      />
      <BrandingCustomizerModal />
      <SalonOnboardingModal />
      <IncomingBookingAlertModal />
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
