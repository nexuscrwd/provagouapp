/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import {
  Settings,
  Palette,
  Volume2,
  VolumeX,
  Radio,
  Building2,
  Phone,
  DollarSign,
  TrendingUp,
  Users,
  ShieldCheck,
  BellRing,
  LayoutTemplate,
  Plus,
  Eye,
  Check,
} from 'lucide-react';
import { TEMPLATE_DEFINITIONS } from '../data/catalogTemplates';
import { TemplateStyle } from '../types';

export const PartnerSettingsScreen: React.FC = () => {
  const {
    activeSalon,
    salons,
    setActiveSalonId,
    setIsBrandingCustomizerOpen,
    setIsOnboardingOpen,
    setSalonTemplate,
    toggleViewMode,
    isMuted,
    toggleMute,
    testSound,
    simulateIncomingBooking,
    appointments,
    offers,
    professionals,
  } = useEcosystem();

  // Quick stats
  const concludedCount = appointments.filter((a) => a.status === 'CONCLUIDO').length;
  const inProgressCount = appointments.filter((a) => a.status === 'EM_ATENDIMENTO').length;
  const confirmedCount = appointments.filter((a) => a.status === 'CONFIRMADO').length;

  // Calculate gross revenue from completed appointments
  const grossRevenue = appointments
    .filter((a) => a.status === 'CONCLUIDO')
    .reduce((acc, a) => {
      const offer = offers.find((o) => o.id === a.offer_id);
      return acc + (offer ? offer.price : 45);
    }, 0);

  return (
    <div className="w-full space-y-4 pb-4">
      {/* 1. Header do Painel de Configurações */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={activeSalon.branding.logo_url}
              alt={activeSalon.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 shadow-md"
              style={{ borderColor: activeSalon.branding.primary_color }}
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-white truncate">{activeSalon.name}</h2>
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {activeSalon.address}, {activeSalon.neighborhood}
            </p>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{activeSalon.phone_whatsapp}</span>
            </div>
          </div>
        </div>

        {/* Botão de Atalho para Editor da Marca */}
        <button
          onClick={() => setIsBrandingCustomizerOpen(true)}
          className="w-full min-h-[44px] py-2.5 px-3.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
          style={{
            backgroundColor: activeSalon.branding.primary_color,
            boxShadow: `0 4px 14px ${activeSalon.branding.primary_color}35`,
          }}
        >
          <Palette className="w-4 h-4" />
          <span>Editar Nome, Logo & Cores (Theming)</span>
        </button>
      </div>

      {/* 2. Seleção de Unidade / Filial */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Trocar Unidade / Filial</span>
        </div>
        <div className="space-y-1.5">
          {salons.map((salon) => {
            const isActive = salon.id === activeSalon.id;
            return (
              <button
                key={salon.id}
                onClick={() => setActiveSalonId(salon.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 border-amber-400 text-white shadow-sm'
                    : 'bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: salon.branding.primary_color }}
                  />
                  <span>{salon.name}</span>
                </div>
                {isActive ? (
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Ativo</span>
                ) : (
                  <span className="text-[10px] text-slate-500">Alternar</span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Estabelecimento (Setup 5 Minutos)</span>
        </button>
      </div>

      {/* 2.1. Modelos de Templates Oficiais (5 Modelos Baseados nas Imagens) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <LayoutTemplate className="w-3.5 h-3.5 text-emerald-400" />
            <span>Modelo de Template do App</span>
          </div>
          <button
            onClick={toggleViewMode}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            Ver no App do Cliente
          </button>
        </div>

        <div className="space-y-2">
          {(Object.values(TEMPLATE_DEFINITIONS) as typeof TEMPLATE_DEFINITIONS[TemplateStyle][]).map((tpl) => {
            const isCurrent = activeSalon.template_id === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => setSalonTemplate(tpl.id)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                    : 'bg-slate-850 hover:bg-slate-800 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full border border-slate-700 shrink-0"
                    style={{ backgroundColor: tpl.branding.primary_color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white truncate">{tpl.name}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border ${tpl.badgeClass}`}>
                        {tpl.id}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{tpl.tagline}</p>
                  </div>
                </div>
                {isCurrent ? (
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Ativo
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 shrink-0">Aplicar</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Alertas Sonoros & Simulações de Reserva */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <BellRing className="w-3.5 h-3.5 text-amber-400" />
          <span>Alertas de Nova Reserva</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center gap-2.5">
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400 animate-pulse" />
            )}
            <div>
              <div className="text-xs font-bold text-white">Alarme Sonoro</div>
              <div className="text-[10px] text-slate-400">
                {isMuted ? 'Mudo (sem bipes)' : 'Alto (som ao receber cliente)'}
              </div>
            </div>
          </div>

          <button
            onClick={toggleMute}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer min-h-[36px] ${
              isMuted
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {isMuted ? 'Ativar Som' : 'Silenciar'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={testSound}
            className="min-h-[44px] py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Testar Som</span>
          </button>

          <button
            onClick={() => simulateIncomingBooking()}
            className="min-h-[44px] py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Simular Cliente</span>
          </button>
        </div>
      </div>

      {/* 4. Resumo Financeiro da Bancada */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Faturamento de Hoje</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Realizado</div>
            <div className="text-lg font-black font-mono text-emerald-400 mt-1">
              R$ {grossRevenue.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{concludedCount} atendimentos</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Em Andamento</div>
            <div className="text-lg font-black font-mono text-white mt-1">
              {inProgressCount}
            </div>
            <div className="text-[10px] text-blue-400 mt-0.5">{confirmedCount} confirmados</div>
          </div>
        </div>
      </div>

      {/* Rodapé com créditos discretos (conforme solicitado) */}
      <div className="pt-2 text-center">
        <p className="text-[11px] text-slate-500 font-medium tracking-wide">
          Tecnologia por <span className="text-slate-400 font-semibold">Vagou</span> • v2.4
        </p>
      </div>
    </div>
  );
};
