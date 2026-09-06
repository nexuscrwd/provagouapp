/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import {
  Calendar,
  Clock,
  Video,
  DollarSign,
  Zap,
  Volume2,
  VolumeX,
  Palette,
  CheckCircle2,
  ChevronDown,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeSalon,
    salons,
    setActiveSalonId,
    activeScreen,
    setActiveScreen,
    setIsFastPublishOpen,
    setIsBrandingCustomizerOpen,
    simulateIncomingBooking,
    isMuted,
    toggleMute,
    testSound,
    offers,
    appointments,
  } = useEcosystem();

  const [isSalonDropdownOpen, setIsSalonDropdownOpen] = useState(false);

  const availableOffersCount = offers.filter((o) => o.status === 'AVAILABLE').length;
  const activeAppointmentsCount = appointments.filter(
    (a) => a.status === 'CONFIRMADO' || a.status === 'EM_ATENDIMENTO'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-[var(--brand-bg)]/95 backdrop-blur-md border-b border-slate-800/80 transition-colors duration-300">
      {/* Top Banner: Ecosystem Context & Simulation Controls */}
      <div className="bg-slate-900/90 border-b border-slate-800/60 px-3 py-1.5 text-xs">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              ECOSSISTEMA VAGOU PRO
            </span>
            <span className="hidden sm:inline text-slate-400">
              Módulo Operacional B2B
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle & Test */}
            <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/60">
              <button
                id="btn-toggle-mute"
                onClick={toggleMute}
                title={isMuted ? 'Desmutar alarme sonoro' : 'Mutar alarme sonoro'}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
              <button
                id="btn-test-sound"
                onClick={testSound}
                className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
                title="Disparar teste do Alerta Sonoro Alto (Capacitor)"
              >
                Testar Alarme
              </button>
            </div>

            {/* Simulated Booking Trigger Button */}
            <button
              id="btn-simulate-booking"
              onClick={() => simulateIncomingBooking()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition active:scale-95 cursor-pointer"
              title="Simula cliente do App Vagou reservando uma vaga relâmpago agora"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Simular Reserva</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Salon Branding Bar */}
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Active Salon Brand & Switcher */}
          <div className="relative">
            <button
              id="btn-open-salon-dropdown"
              onClick={() => setIsSalonDropdownOpen(!isSalonDropdownOpen)}
              className="flex items-center gap-3 text-left p-1.5 -ml-1.5 rounded-xl hover:bg-slate-800/60 transition group cursor-pointer"
            >
              <div className="relative">
                <img
                  src={activeSalon.branding.logo_url}
                  alt={activeSalon.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-xl object-cover border-2 transition-all shadow-md group-hover:scale-105"
                  style={{ borderColor: activeSalon.branding.primary_color }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white shadow"
                  style={{ backgroundColor: activeSalon.branding.primary_color }}
                >
                  ★
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-base sm:text-lg text-white tracking-tight leading-tight">
                    {activeSalon.name}
                  </h1>
                  {activeSalon.is_verified && (
                    <CheckCircle2
                      className="w-4 h-4 shrink-0"
                      style={{ color: activeSalon.branding.accent_color }}
                    />
                  )}
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span>{activeSalon.neighborhood}</span>
                  <span>•</span>
                  <span className="font-mono text-[11px]" style={{ color: activeSalon.branding.accent_color }}>
                    {availableOffersCount} no radar
                  </span>
                </p>
              </div>
            </button>

            {/* Dropdown for Switcher / Theming Showcase */}
            {isSalonDropdownOpen && (
              <div
                id="salon-dropdown-menu"
                className="absolute top-full left-0 mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                  <span>Trocar Estabelecimento</span>
                  <span className="text-[10px] text-amber-400">Theming Dinâmico</span>
                </div>
                <div className="py-1 space-y-1">
                  {salons.map((salon) => {
                    const isSelected = salon.id === activeSalon.id;
                    return (
                      <button
                        key={salon.id}
                        id={`btn-select-salon-${salon.id}`}
                        onClick={() => {
                          setActiveSalonId(salon.id);
                          setIsSalonDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl text-left text-xs transition cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <img
                          src={salon.branding.logo_url}
                          alt={salon.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover border"
                          style={{ borderColor: salon.branding.primary_color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-white font-medium">{salon.name}</div>
                          <div className="text-[11px] text-slate-400 truncate">{salon.neighborhood}</div>
                        </div>
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: salon.branding.primary_color }}
                          title={`Cor primária: ${salon.branding.primary_color}`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    id="btn-open-branding-modal"
                    onClick={() => {
                      setIsSalonDropdownOpen(false);
                      setIsBrandingCustomizerOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 transition cursor-pointer"
                  >
                    <Palette className="w-3.5 h-3.5" style={{ color: activeSalon.branding.accent_color }} />
                    <span>Personalizar Cores White-Label</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions & Fast Publish CTA */}
          <div className="flex items-center gap-2">
            <button
              id="btn-open-branding"
              onClick={() => setIsBrandingCustomizerOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/70 transition cursor-pointer"
              title="Ajustar paleta white-label do salão"
            >
              <Palette className="w-3.5 h-3.5" style={{ color: activeSalon.branding.accent_color }} />
              <span>Cores</span>
            </button>

            {/* Fast Publish Button (2-Touch) */}
            <button
              id="btn-fast-publish"
              onClick={() => setIsFastPublishOpen(true)}
              className="touch-target flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition active:scale-95 cursor-pointer"
              style={{
                backgroundColor: activeSalon.branding.primary_color,
                boxShadow: `0 4px 14px ${activeSalon.branding.primary_color}40`,
              }}
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Publicar Vaga (5s)</span>
            </button>
          </div>
        </div>

        {/* B2B Operational Navigation Tabs (Visible on Tablet/Desktop; Mobile uses Bottom Dock) */}
        <nav className="hidden md:flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-800/50 overflow-x-auto no-scrollbar">
          <button
            id="tab-agenda"
            onClick={() => setActiveScreen('agenda')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeScreen === 'agenda'
                ? 'text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            style={{
              backgroundColor: activeScreen === 'agenda' ? activeSalon.branding.secondary_color : 'transparent',
              borderBottom: activeScreen === 'agenda' ? `2px solid ${activeSalon.branding.primary_color}` : '2px solid transparent',
            }}
          >
            <Calendar className="w-4 h-4" />
            <span>Grade do Dia</span>
            {activeAppointmentsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {activeAppointmentsCount}
              </span>
            )}
          </button>

          <button
            id="tab-media"
            onClick={() => setActiveScreen('media')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeScreen === 'media'
                ? 'text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            style={{
              backgroundColor: activeScreen === 'media' ? activeSalon.branding.secondary_color : 'transparent',
              borderBottom: activeScreen === 'media' ? `2px solid ${activeSalon.branding.primary_color}` : '2px solid transparent',
            }}
          >
            <Video className="w-4 h-4" />
            <span>Biblioteca 5s</span>
          </button>

          <button
            id="tab-schedule"
            onClick={() => setActiveScreen('schedule')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeScreen === 'schedule'
                ? 'text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            style={{
              backgroundColor: activeScreen === 'schedule' ? activeSalon.branding.secondary_color : 'transparent',
              borderBottom: activeScreen === 'schedule' ? `2px solid ${activeSalon.branding.primary_color}` : '2px solid transparent',
            }}
          >
            <Clock className="w-4 h-4" />
            <span>Equipe & Escala</span>
          </button>

          <button
            id="tab-financial"
            onClick={() => setActiveScreen('financial')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeScreen === 'financial'
                ? 'text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            style={{
              backgroundColor: activeScreen === 'financial' ? activeSalon.branding.secondary_color : 'transparent',
              borderBottom: activeScreen === 'financial' ? `2px solid ${activeSalon.branding.primary_color}` : '2px solid transparent',
            }}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financeiro & Comissões</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
