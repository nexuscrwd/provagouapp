/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { AppointmentStatus, Professional, ServiceOffer, Appointment, Salon } from '../types';
import {
  Clock,
  User,
  Zap,
  Phone,
  CheckCircle,
  Play,
  UserX,
  XCircle,
  Columns,
  ListFilter,
  Plus,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface PartnerAgendaScreenProps {
  onOpenFastPublish: (profId?: string, time?: string) => void;
}

// Status visual badge helper
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'AVAILABLE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40 animate-radar">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          NO RADAR (VAGOU)
        </span>
      );
    case 'BOOKED':
    case 'CONFIRMADO':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/40">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          CONFIRMADO
        </span>
      );
    case 'EM_ATENDIMENTO':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          NA CADEIRA
        </span>
      );
    case 'CONCLUIDO':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-700/60 text-slate-300 border border-slate-600/50">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          CONCLUÍDO
        </span>
      );
    case 'NO_SHOW':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-300 border border-red-500/40">
          <UserX className="w-3.5 h-3.5" />
          NÃO COMPARECEU
        </span>
      );
    case 'CANCELADO':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-500 border border-slate-700">
          <XCircle className="w-3.5 h-3.5" />
          CANCELADO
        </span>
      );
    default:
      return null;
  }
};

interface ChairScheduleColumnProps {
  prof: Professional;
  offers: ServiceOffer[];
  appointments: Appointment[];
  activeSalon: Salon;
  onOpenFastPublish: (profId?: string, time?: string) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  cancelOffer: (id: string) => void;
  simulateIncomingBooking: (offerId?: string) => void;
  isMobileFullWidth?: boolean;
}

/**
 * Reusable vertical schedule column for a single chair/professional.
 * Optimized for Mobile-First with big touch-friendly buttons (min-height: 48px).
 */
const ChairScheduleColumn: React.FC<ChairScheduleColumnProps> = ({
  prof,
  offers,
  appointments,
  activeSalon,
  onOpenFastPublish,
  updateAppointmentStatus,
  cancelOffer,
  simulateIncomingBooking,
  isMobileFullWidth = false,
}) => {
  const activeOffers = offers.filter((o) => o.status === 'AVAILABLE');

  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col justify-between ${
        isMobileFullWidth ? 'w-full' : ''
      }`}
      style={{
        borderTop: `4px solid ${prof.color_hex}`,
      }}
    >
      {/* Professional Chair Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={prof.avatar_url}
              alt={prof.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-2xl object-cover border-2 shadow-md"
              style={{ borderColor: prof.color_hex }}
            />
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900"
              style={{ backgroundColor: prof.color_hex }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">{prof.name}</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {prof.slot_minutes}m
              </span>
            </div>
            <div className="text-xs text-slate-400 capitalize mt-0.5">
              {prof.specialties.join(', ')}
            </div>
          </div>
        </div>

        {/* Fast publish shortcut for this chair */}
        <button
          id={`btn-fast-chair-${prof.id}`}
          onClick={() => onOpenFastPublish(prof.id)}
          className="min-h-[48px] min-w-[48px] px-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 shadow-sm"
          title={`Lançar vaga relâmpago para ${prof.name}`}
        >
          <Zap className="w-4 h-4 fill-amber-400" />
          <span className="text-xs font-bold hidden sm:inline">Vaga 5s</span>
        </button>
      </div>

      {/* Slots & Appointments for this chair */}
      <div className="mt-4 space-y-3.5 flex-1 min-h-[220px]">
        {/* Active Radar Offers (Vagou Live Slots) */}
        {activeOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 text-xs space-y-3 relative overflow-hidden shadow-md"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-mono text-amber-300 font-black text-base">
                <Clock className="w-4 h-4" />
                <span>{offer.start_time} - {offer.end_time}</span>
              </div>
              {getStatusBadge(offer.status)}
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-amber-500/20">
              <div className="font-bold text-white text-sm">{offer.service_title}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="line-through text-slate-500 text-xs">
                  R$ {offer.original_price.toFixed(2)}
                </span>
                <span className="text-amber-400 font-black text-base font-mono">
                  R$ {offer.price.toFixed(2)}
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold uppercase">
                  Vaga Relâmpago
                </span>
              </div>
            </div>

            {/* Quick Actions for Active Radar Offer */}
            <div className="flex items-center justify-between pt-1 gap-2">
              <button
                onClick={() => simulateIncomingBooking(offer.id)}
                className="min-h-[44px] px-3.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                title="Simular cliente agendando esta vaga"
              >
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Simular Reserva</span>
              </button>

              <button
                onClick={() => cancelOffer(offer.id)}
                className="min-h-[44px] px-3 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 transition cursor-pointer"
              >
                Cancelar Vaga
              </button>
            </div>
          </div>
        ))}

        {/* Appointments List */}
        {appointments.map((app) => {
          const linkedOffer = offers.find((o) => o.id === app.offer_id);
          const isAtChair = app.status === 'EM_ATENDIMENTO';
          const isConfirmed = app.status === 'CONFIRMADO';

          return (
            <div
              key={app.id}
              className={`border rounded-2xl p-4 text-xs space-y-3 transition shadow-md ${
                isAtChair
                  ? 'bg-emerald-950/30 border-emerald-500/50 ring-1 ring-emerald-500/30'
                  : isConfirmed
                  ? 'bg-slate-800/90 border-slate-700/80 hover:border-slate-600'
                  : 'bg-slate-850 border-slate-800 opacity-80'
              }`}
            >
              {/* Protocol Header & Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-black text-amber-300 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-slate-700">
                  {app.protocol_code}
                </span>
                {getStatusBadge(app.status)}
              </div>

              {/* Client & Service Info */}
              <div className="space-y-1.5">
                <div className="font-bold text-white text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{app.client_name}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <a
                    href={`https://wa.me/55${app.client_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Olá ${app.client_name}! Confirmando seu atendimento no ${activeSalon.name} (Protocolo ${app.protocol_code}).`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-mono font-semibold min-h-[36px] py-1"
                  >
                    <span>{app.client_phone}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {linkedOffer && (
                  <div className="text-xs text-slate-300 pt-1 border-t border-slate-700/40 flex items-center justify-between">
                    <span>{linkedOffer.service_title}</span>
                    <span className="font-bold font-mono text-amber-400 text-sm">
                      R$ {linkedOffer.price.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Strict Mobile-First Big Action Buttons (>= 48px height) */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                {/* 1. "Sentou na Cadeira" Action Button (CONFIRMADO -> EM_ATENDIMENTO) */}
                {isConfirmed && (
                  <>
                    <button
                      id={`btn-start-${app.id}`}
                      onClick={() => updateAppointmentStatus(app.id, 'EM_ATENDIMENTO')}
                      className="min-h-[48px] h-12 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg transition active:scale-95 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Sentou na Cadeira</span>
                    </button>

                    <button
                      id={`btn-noshow-${app.id}`}
                      onClick={() => updateAppointmentStatus(app.id, 'NO_SHOW')}
                      className="min-h-[48px] h-12 px-3.5 rounded-2xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      title="Marcar No-Show (Cliente não compareceu)"
                    >
                      <UserX className="w-4 h-4" />
                      <span className="text-xs font-semibold">No-Show</span>
                    </button>
                  </>
                )}

                {/* 2. "Concluir" Action Button (EM_ATENDIMENTO -> CONCLUIDO) */}
                {isAtChair && (
                  <>
                    <button
                      id={`btn-finish-${app.id}`}
                      onClick={() => updateAppointmentStatus(app.id, 'CONCLUIDO')}
                      className="min-h-[48px] h-12 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg transition active:scale-95 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Concluir</span>
                    </button>

                    <button
                      id={`btn-noshow-${app.id}`}
                      onClick={() => updateAppointmentStatus(app.id, 'NO_SHOW')}
                      className="min-h-[48px] h-12 px-3.5 rounded-2xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      title="Marcar No-Show"
                    >
                      <UserX className="w-4 h-4" />
                      <span className="text-xs font-semibold">No-Show</span>
                    </button>
                  </>
                )}

                {app.status === 'CONCLUIDO' && (
                  <div className="w-full text-center py-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    ✓ Atendimento Concluído com Sucesso
                  </div>
                )}

                {app.status === 'NO_SHOW' && (
                  <div className="w-full text-center py-2 text-xs font-bold text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">
                    ✕ Cliente Não Compareceu (No-Show)
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty State when no active offers or appointments */}
        {activeOffers.length === 0 && appointments.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-800 rounded-3xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-300">Cadeira sem agendamentos</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Lance uma vaga relâmpago para ocupar este horário no app consumidor
            </p>
            <button
              onClick={() => onOpenFastPublish(prof.id)}
              className="mt-4 min-h-[48px] h-12 px-5 rounded-2xl text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Disparar Vaga Relâmpago (5s)</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Quick Trigger: New Slot for This Chair (Min 48px height) */}
      <button
        onClick={() => onOpenFastPublish(prof.id)}
        className="mt-4 w-full min-h-[48px] h-12 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white text-sm font-bold border border-slate-700/70 shadow transition cursor-pointer active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>Novo Horário para {prof.name.split(' ')[0]}</span>
      </button>
    </div>
  );
};

export const PartnerAgendaScreen: React.FC<PartnerAgendaScreenProps> = ({ onOpenFastPublish }) => {
  const {
    activeSalon,
    professionals,
    offers,
    appointments,
    updateAppointmentStatus,
    cancelOffer,
    simulateIncomingBooking,
  } = useEcosystem();

  // Mobile selected professional (guaranteed to fall back to first professional)
  const [selectedMobileProfId, setSelectedMobileProfId] = useState<string>('');
  
  // Desktop filters and modes
  const [desktopProfFilter, setDesktopProfFilter] = useState<string>('ALL');
  const [desktopViewMode, setDesktopViewMode] = useState<'columns' | 'timeline'>('columns');

  // Ensure valid selected professional on mobile
  const currentMobileProf =
    professionals.find((p) => p.id === selectedMobileProfId) || professionals[0];

  // Desktop filtered professionals
  const desktopFilteredProfessionals =
    desktopProfFilter === 'ALL'
      ? professionals
      : professionals.filter((p) => p.id === desktopProfFilter);

  // Pre-generate standard time slots for the countertop timeline view
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '15:30', '16:00', '16:30', '17:00', '18:00', '19:00'
  ];

  return (
    <div className="space-y-4 pb-4">
      {/* ========================================================================= */}
      {/* 1. VISÃO SMARTPHONE (PADRÃO MOBILE-FIRST < 768px): ESTREITAMENTE VERTICAL */}
      {/* ========================================================================= */}
      <div className="block md:hidden space-y-4">
        {/* Horizontal Sliding Selector (Chips com avatar e nome: [Matheus] [Diego] [Carlos]) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 shadow-lg space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Cadeiras da Bancada
            </span>
            <span className="text-[11px] text-amber-400 font-mono">
              Selecione o profissional
            </span>
          </div>

          {/* Horizontal Sliding Chips */}
          <div
            id="mobile-prof-chips-container"
            className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none snap-x touch-pan-x"
          >
            {professionals.map((prof) => {
              const isSelected = prof.id === currentMobileProf?.id;
              const profAppointments = appointments.filter((a) => a.professional_id === prof.id);
              const hasActiveNow = profAppointments.some((a) => a.status === 'EM_ATENDIMENTO');
              const profOffers = offers.filter(
                (o) => o.professional_id === prof.id && o.status === 'AVAILABLE'
              );
              const confirmedCount = profAppointments.filter((a) => a.status === 'CONFIRMADO').length;

              return (
                <button
                  key={prof.id}
                  id={`mobile-prof-chip-${prof.id}`}
                  onClick={() => setSelectedMobileProfId(prof.id)}
                  className={`snap-start shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all cursor-pointer min-h-[48px] ${
                    isSelected
                      ? 'shadow-xl ring-2 bg-slate-800/95 text-white'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  style={{
                    borderColor: isSelected ? activeSalon.branding.primary_color : 'rgba(51, 65, 85, 0.7)',
                    boxShadow: isSelected
                      ? `0 4px 14px ${activeSalon.branding.primary_color}40`
                      : undefined,
                  }}
                >
                  <div className="relative">
                    <img
                      src={prof.avatar_url}
                      alt={prof.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-xl object-cover border-2 shadow-sm"
                      style={{ borderColor: prof.color_hex }}
                    />
                    {hasActiveNow ? (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
                    ) : profOffers.length > 0 ? (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                    ) : null}
                  </div>

                  <div className="text-left">
                    <div className="text-xs font-bold leading-tight text-white">
                      {prof.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {hasActiveNow ? (
                        <span className="text-emerald-400 font-bold">Na Cadeira</span>
                      ) : profOffers.length > 0 ? (
                        <span className="text-amber-400 font-bold">{profOffers.length} no radar</span>
                      ) : confirmedCount > 0 ? (
                        <span className="text-blue-400 font-bold">{confirmedCount} agendamento{confirmedCount > 1 ? 's' : ''}</span>
                      ) : (
                        <span>Livre</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vertical Column for Selected Professional: 100% Full Screen Width */}
        {currentMobileProf && (
          <div className="w-full">
            <ChairScheduleColumn
              prof={currentMobileProf}
              offers={offers.filter((o) => o.professional_id === currentMobileProf.id)}
              appointments={appointments.filter((a) => a.professional_id === currentMobileProf.id)}
              activeSalon={activeSalon}
              onOpenFastPublish={onOpenFastPublish}
              updateAppointmentStatus={updateAppointmentStatus}
              cancelOffer={cancelOffer}
              simulateIncomingBooking={simulateIncomingBooking}
              isMobileFullWidth
            />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. VISÃO TABLET / DESKTOP (>= 768px): MÚLTIPLAS COLUNAS & LINHA DO TEMPO */}
      {/* ========================================================================= */}
      <div className="hidden md:block space-y-4">
        {/* Desktop Filter & View Switcher Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-md">
          {/* Professional Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              id="filter-prof-all-desktop"
              onClick={() => setDesktopProfFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                desktopProfFilter === 'ALL'
                  ? 'bg-white text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Todas as Cadeiras ({professionals.length})
            </button>

            {professionals.map((prof) => {
              const isSelected = prof.id === desktopProfFilter;
              return (
                <button
                  key={prof.id}
                  id={`filter-prof-desktop-${prof.id}`}
                  onClick={() => setDesktopProfFilter(prof.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'text-white font-bold ring-1'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isSelected ? activeSalon.branding.secondary_color : undefined,
                    borderColor: isSelected ? prof.color_hex : undefined,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: prof.color_hex }}
                  />
                  <span>{prof.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* View mode toggle (Bancada vs Linha do tempo) */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              id="btn-view-columns-desktop"
              onClick={() => setDesktopViewMode('columns')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                desktopViewMode === 'columns'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Modo Bancada (Colunas por Profissional para Recepção e Tablet)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Modo Bancada</span>
            </button>
            <button
              id="btn-view-timeline-desktop"
              onClick={() => setDesktopViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                desktopViewMode === 'timeline'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Modo Linha do Tempo Unificada"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Linha do Tempo</span>
            </button>
          </div>
        </div>

        {/* Multi-column Grid (>= 768px) */}
        {desktopViewMode === 'columns' ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {desktopFilteredProfessionals.map((prof) => (
              <ChairScheduleColumn
                key={prof.id}
                prof={prof}
                offers={offers.filter((o) => o.professional_id === prof.id)}
                appointments={appointments.filter((a) => a.professional_id === prof.id)}
                activeSalon={activeSalon}
                onOpenFastPublish={onOpenFastPublish}
                updateAppointmentStatus={updateAppointmentStatus}
                cancelOffer={cancelOffer}
                simulateIncomingBooking={simulateIncomingBooking}
              />
            ))}
          </div>
        ) : (
          /* Desktop Unified Linear Timeline */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Linha do Tempo Operacional</h3>
              <span className="text-xs text-slate-400">
                Hoje • {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
              </span>
            </div>

            <div className="space-y-3">
              {timeSlots.map((time) => {
                const matchedOffer = offers.find((o) => o.start_time === time);

                return (
                  <div
                    key={time}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <div className="w-16 font-mono text-sm font-bold text-slate-400 pt-0.5 shrink-0">
                      {time}
                    </div>

                    <div className="flex-1">
                      {matchedOffer ? (
                        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">
                                {matchedOffer.service_title}
                              </span>
                              {getStatusBadge(matchedOffer.status)}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              Profissional: {professionals.find((p) => p.id === matchedOffer.professional_id)?.name} • R$ {matchedOffer.price.toFixed(2)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => simulateIncomingBooking(matchedOffer.id)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition cursor-pointer"
                            >
                              Simular Reserva
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => onOpenFastPublish(undefined, time)}
                          className="w-full text-left py-2 px-3 rounded-xl border border-dashed border-slate-700/80 hover:border-amber-500/60 text-slate-500 hover:text-slate-300 text-xs flex items-center justify-between group transition cursor-pointer"
                        >
                          <span>Horário livre — clique para disparar vaga relâmpago</span>
                          <Plus className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
