/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { AppointmentStatus, Professional, ServiceOffer, Appointment } from '../types';
import {
  Clock,
  User,
  Zap,
  Phone,
  CheckCircle,
  Play,
  UserX,
  Radio,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface PartnerAgendaScreenProps {
  onOpenFastPublish: (profId?: string, time?: string) => void;
}

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

  // Selected professional (defaults to first active professional)
  const [selectedProfId, setSelectedProfId] = useState<string>('');

  const activeProf =
    professionals.find((p) => p.id === selectedProfId) || professionals[0] || null;

  if (!activeProf) {
    return (
      <div className="p-6 text-center text-slate-400">
        Nenhum profissional cadastrado para este salão.
      </div>
    );
  }

  // Get appointments and offers for active professional
  const profAppointments = appointments.filter((a) => a.professional_id === activeProf.id);
  const profOffers = offers.filter((o) => o.professional_id === activeProf.id);

  // Standard hours for the workday
  const standardHours = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ];

  // Merge extra hours from actual appointments or offers if any
  const appointmentHours = profAppointments.map((a) => {
    const linkedOffer = offers.find((o) => o.id === a.offer_id);
    return linkedOffer?.start_time;
  }).filter(Boolean) as string[];

  const offerHours = profOffers.map((o) => o.start_time);

  const allDistinctHours = Array.from(
    new Set([...standardHours, ...appointmentHours, ...offerHours])
  ).sort();

  return (
    <div className="w-full space-y-4">
      {/* 3. NAVEGAÇÃO DA AGENDA: Seletor Horizontal Deslizante de Profissionais (Chips compactos) */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-sm">
        <div className="flex items-center justify-between px-1 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          <span>Profissional da Cadeira</span>
          <span className="text-amber-400 font-mono text-[10px]">
            {activeProf.specialties.join(', ')}
          </span>
        </div>

        <div
          id="prof-horizontal-chips"
          className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none snap-x touch-pan-x"
        >
          {professionals.map((prof) => {
            const isSelected = prof.id === activeProf.id;
            const hasAtendimento = appointments.some(
              (a) => a.professional_id === prof.id && a.status === 'EM_ATENDIMENTO'
            );
            const offersCount = offers.filter(
              (o) => o.professional_id === prof.id && o.status === 'AVAILABLE'
            ).length;

            return (
              <button
                key={prof.id}
                id={`chip-prof-${prof.id}`}
                onClick={() => setSelectedProfId(prof.id)}
                className={`snap-start shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                  isSelected
                    ? 'text-white shadow-lg ring-1'
                    : 'bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white'
                }`}
                style={{
                  backgroundColor: isSelected ? activeSalon.branding.primary_color : undefined,
                  borderColor: isSelected ? activeSalon.branding.accent_color : undefined,
                  boxShadow: isSelected
                    ? `0 4px 14px ${activeSalon.branding.primary_color}50`
                    : undefined,
                }}
              >
                <div className="relative">
                  <img
                    src={prof.avatar_url}
                    alt={prof.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-white/40"
                  />
                  {hasAtendimento ? (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-ping" />
                  ) : offersCount > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-1 ring-slate-900" />
                  ) : null}
                </div>
                <span className="whitespace-nowrap">{prof.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Resumo do Profissional Ativo */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <span>Grade de Hoje:</span>
          <span className="text-white font-bold">{activeProf.name}</span>
          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
            {activeProf.slot_minutes}min
          </span>
        </div>
        <button
          onClick={() => onOpenFastPublish(activeProf.id)}
          className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[11px] cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-400" />
          <span>+ Vaga Rápida</span>
        </button>
      </div>

      {/* 4. CARDS DE HORÁRIO VERTICAIS: Cada horário ocupa 100% da largura do celular */}
      <div className="space-y-3 w-full">
        {allDistinctHours.map((time) => {
          // Check if there is an appointment starting at this time
          const app = profAppointments.find((a) => {
            const linkedOffer = offers.find((o) => o.id === a.offer_id);
            return linkedOffer?.start_time === time;
          });

          // Check if there is an active offer (Vagou Live Slot)
          const offer = profOffers.find((o) => o.start_time === time && o.status === 'AVAILABLE');

          // Case A: Appointment Exists
          if (app) {
            const linkedOffer = offers.find((o) => o.id === app.offer_id);
            const isAtChair = app.status === 'EM_ATENDIMENTO';
            const isConfirmed = app.status === 'CONFIRMADO';
            const isConcluded = app.status === 'CONCLUIDO';
            const isNoShow = app.status === 'NO_SHOW';

            return (
              <div
                key={`app-${app.id}`}
                className={`w-full rounded-2xl p-4 transition-all shadow-md border ${
                  isAtChair
                    ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50'
                    : isConfirmed
                    ? 'bg-slate-900 border-slate-700/90'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                {/* Header do Card: Horário Grande + Status Badge */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-black text-white">
                      {time}
                    </span>
                    {linkedOffer && (
                      <span className="text-xs text-slate-400 font-mono">
                        - {linkedOffer.end_time}
                      </span>
                    )}
                  </div>

                  {isAtChair && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      NA CADEIRA
                    </span>
                  )}

                  {isConfirmed && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      CONFIRMADO
                    </span>
                  )}

                  {isConcluded && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                      CONCLUÍDO
                    </span>
                  )}

                  {isNoShow && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                      <UserX className="w-3.5 h-3.5" />
                      NÃO COMPARECEU
                    </span>
                  )}
                </div>

                {/* Dados do Cliente e Serviço */}
                <div className="py-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-base text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{app.client_name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                      {app.protocol_code}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-300 font-medium">
                      {linkedOffer?.service_title || 'Atendimento'}
                    </span>
                    {linkedOffer && (
                      <span className="font-bold font-mono text-white text-sm">
                        R$ {linkedOffer.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {app.client_phone && (
                    <div className="pt-1">
                      <a
                        href={`https://wa.me/55${app.client_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Olá ${app.client_name}! Confirmando seu atendimento no ${activeSalon.name} (Protocolo ${app.protocol_code}).`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5 text-xs font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{app.client_phone}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Botões de Ação Grandes (Mínimo 48px de altura) */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  {/* Status CONFIRMADO -> Ação: "Sentou na Cadeira" */}
                  {isConfirmed && (
                    <>
                      <button
                        id={`btn-start-${app.id}`}
                        onClick={() => updateAppointmentStatus(app.id, 'EM_ATENDIMENTO')}
                        className="min-h-[48px] h-12 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition active:scale-95 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Sentou na Cadeira</span>
                      </button>

                      <button
                        id={`btn-noshow-${app.id}`}
                        onClick={() => updateAppointmentStatus(app.id, 'NO_SHOW')}
                        className="min-h-[48px] h-12 px-3.5 rounded-2xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 flex items-center justify-center gap-1 transition cursor-pointer"
                        title="Marcar No-Show"
                      >
                        <UserX className="w-4 h-4" />
                        <span className="text-xs font-semibold">No-Show</span>
                      </button>
                    </>
                  )}

                  {/* Status EM_ATENDIMENTO -> Ação: "Concluir Atendimento" */}
                  {isAtChair && (
                    <>
                      <button
                        id={`btn-finish-${app.id}`}
                        onClick={() => updateAppointmentStatus(app.id, 'CONCLUIDO')}
                        className="min-h-[48px] h-12 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition active:scale-95 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Concluir Atendimento</span>
                      </button>

                      <button
                        id={`btn-noshow-${app.id}`}
                        onClick={() => updateAppointmentStatus(app.id, 'NO_SHOW')}
                        className="min-h-[48px] h-12 px-3.5 rounded-2xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 flex items-center justify-center gap-1 transition cursor-pointer"
                        title="Marcar No-Show"
                      >
                        <UserX className="w-4 h-4" />
                        <span className="text-xs font-semibold">No-Show</span>
                      </button>
                    </>
                  )}

                  {isConcluded && (
                    <div className="w-full text-center py-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      ✓ Atendimento Finalizado com Sucesso
                    </div>
                  )}

                  {isNoShow && (
                    <div className="w-full text-center py-2 text-xs font-bold text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">
                      ✕ Cliente Não Compareceu
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Case B: Active Offer (No Radar do Vagou)
          if (offer) {
            return (
              <div
                key={`offer-${offer.id}`}
                className="w-full rounded-2xl p-4 bg-amber-500/10 border-2 border-amber-500/40 space-y-3 shadow-md relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-500/20">
                  <div className="flex items-center gap-2 font-mono text-lg font-black text-amber-300">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{offer.start_time} - {offer.end_time}</span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    NO RADAR (VAGOU)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{offer.service_title}</div>
                    <div className="text-xs text-slate-400 capitalize">Vaga Relâmpago 5s</div>
                  </div>
                  <div className="text-right">
                    <div className="line-through text-slate-500 text-xs">
                      R$ {offer.original_price.toFixed(2)}
                    </div>
                    <div className="text-amber-400 font-black text-base font-mono">
                      R$ {offer.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Botões de Ação Grandes (>= 48px) */}
                <div className="flex items-center gap-2 pt-2 border-t border-amber-500/20">
                  <button
                    onClick={() => simulateIncomingBooking(offer.id)}
                    className="min-h-[48px] h-12 flex-1 rounded-2xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                    title="Simular cliente agendando esta vaga"
                  >
                    <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
                    <span>Simular Reserva</span>
                  </button>

                  <button
                    onClick={() => cancelOffer(offer.id)}
                    className="min-h-[48px] h-12 px-4 rounded-2xl text-xs font-medium text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            );
          }

          // Case C: Horário Vago / Livre -> Botão: "Disparar no Radar"
          return (
            <div
              key={`empty-${time}`}
              className="w-full rounded-2xl p-3.5 bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-slate-300">
                    {time}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
                    Horário Livre
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Cadeira disponível</span>
              </div>

              {/* Botão de ação grande (Mínimo 48px de altura): "Disparar no Radar" */}
              <button
                id={`btn-publish-slot-${time.replace(':', '')}`}
                onClick={() => onOpenFastPublish(activeProf.id, time)}
                className="w-full min-h-[48px] h-12 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition active:scale-95 cursor-pointer border border-white/10"
                style={{
                  backgroundColor: activeSalon.branding.primary_color,
                  boxShadow: `0 4px 14px ${activeSalon.branding.primary_color}35`,
                }}
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Disparar no Radar</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
