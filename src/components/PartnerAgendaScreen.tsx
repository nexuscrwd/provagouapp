/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
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

  // Horários ocupados por agendamentos ou ofertas ao vivo
  const busyTimeSet = new Set<string>();
  profAppointments.forEach((a) => {
    const linkedOffer = offers.find((o) => o.id === a.offer_id);
    if (linkedOffer?.start_time) {
      busyTimeSet.add(linkedOffer.start_time);
    }
  });
  profOffers
    .filter((o) => o.status === 'AVAILABLE')
    .forEach((o) => {
      busyTimeSet.add(o.start_time);
    });

  // Horários Livres da Cadeira (Cadeiras Disponíveis)
  const availableHours = allDistinctHours.filter((time) => !busyTimeSet.has(time));

  // Atendimentos e Ofertas Ativas do Dia
  const activeItems = allDistinctHours
    .map((time) => {
      const app = profAppointments.find((a) => {
        const linkedOffer = offers.find((o) => o.id === a.offer_id);
        return linkedOffer?.start_time === time;
      });
      const offer = profOffers.find((o) => o.start_time === time && o.status === 'AVAILABLE');
      return { time, app, offer };
    })
    .filter((item) => Boolean(item.app || item.offer));

  return (
    <div className="w-full space-y-4">
      {/* 3. NAVEGAÇÃO DA AGENDA: Seletor Horizontal Deslizante de Profissionais (Limpo, sem caixas aninhadas) */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between px-1 text-[11px] font-medium text-slate-400">
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
                    ? 'text-white shadow-lg'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white'
                }`}
                style={{
                  backgroundColor: isSelected ? activeSalon.branding.primary_color : undefined,
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
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  {hasAtendimento ? (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-ping" />
                  ) : offersCount > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400" />
                  ) : null}
                </div>
                <span className="whitespace-nowrap">{prof.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resumo Discreto do Profissional Ativo */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-medium">
          <span>Grade:</span>
          <span className="text-white font-bold">{activeProf.name}</span>
          <span className="text-slate-500 font-mono text-[11px]">({activeProf.slot_minutes}min)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {availableHours.length} horários livres
          </span>
          <button
            onClick={() => onOpenFastPublish(activeProf.id)}
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>+ Vaga</span>
          </button>
        </div>
      </div>

      {/* 4. CADEIRAS DISPONÍVEIS: GRID LIMPO DE HORÁRIOS (Sem caixas aninhadas e sem legendas repetidas) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Cadeiras Livres
            </h3>
            <span className="text-[11px] font-mono font-bold text-emerald-400">
              ({availableHours.length})
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Selecione para divulgar
          </span>
        </div>

        {availableHours.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-500">
            Sem horários livres no momento.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {availableHours.map((time) => (
              <button
                key={`slot-${time}`}
                id={`btn-publish-slot-${time.replace(':', '')}`}
                onClick={() => onOpenFastPublish(activeProf.id, time)}
                className="h-12 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-emerald-500/20 text-slate-100 hover:text-emerald-300 font-mono font-bold text-sm transition-colors active:scale-95 cursor-pointer shadow-sm border border-slate-800/40 hover:border-emerald-500/40"
                title={`Divulgar vaga para às ${time}`}
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 5. ATENDIMENTOS E VAGAS ATIVAS DO DIA (Cards Operacionais) */}
      {activeItems.length > 0 && (
        <div className="space-y-3 w-full pt-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Atendimentos & Vagas do Dia ({activeItems.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Em andamento
            </span>
          </div>

          {activeItems.map(({ time, app, offer }) => {
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
                          title="Marcar Falta (Não Compareceu)"
                        >
                          <UserX className="w-4 h-4" />
                          <span className="text-xs font-semibold">Falta</span>
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
                          title="Marcar Falta (Não Compareceu)"
                        >
                          <UserX className="w-4 h-4" />
                          <span className="text-xs font-semibold">Falta</span>
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
                      VAGA ONLINE (AO VIVO)
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

            return null;
          })}
        </div>
      )}
    </div>
  );
};
