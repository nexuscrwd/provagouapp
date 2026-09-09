/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { Palette, Zap, BadgeCheck, Eye, Store, Plus, ChevronDown, Check } from 'lucide-react';
import { TEMPLATE_DEFINITIONS } from '../data/catalogTemplates';

export const Header: React.FC = () => {
  const {
    salons,
    activeSalon,
    setActiveSalonId,
    viewMode,
    toggleViewMode,
    setIsOnboardingOpen,
    setIsFastPublishOpen,
    setIsBrandingCustomizerOpen,
    setSalonTemplate,
  } = useEcosystem();

  const [isSalonDropdownOpen, setIsSalonDropdownOpen] = useState(false);
  const currentTemplate = TEMPLATE_DEFINITIONS[activeSalon.template_id || 'dark_luxury'];

  return (
    <header className="shrink-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-2.5 py-2 flex flex-col gap-1.5 shadow-md">
      <div className="flex items-center justify-between gap-1.5 w-full">
        {/* Lado Esquerdo: Salão Ativo + Dropdown de troca rápida */}
        <div className="relative min-w-0 flex-1">
          <button
            id="btn-header-salon-selector"
            onClick={() => setIsSalonDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-900 transition-colors text-left max-w-full"
          >
            <div className="relative shrink-0">
              <img
                src={activeSalon.branding.logo_url}
                alt={activeSalon.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border-2 shadow-sm"
                style={{ borderColor: activeSalon.branding.primary_color }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h1 className="font-bold text-xs text-white truncate leading-tight">
                  {activeSalon.name}
                </h1>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {currentTemplate.name}
              </p>
            </div>
          </button>

          {/* Menu Dropdown de Salões */}
          {isSalonDropdownOpen && (
            <div
              id="dropdown-salon-switcher"
              className="absolute left-0 top-11 z-50 w-64 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl space-y-1.5 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                <span>Estabelecimentos</span>
                <span className="text-emerald-400">{salons.length} ativos</span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1">
                {salons.map((s) => {
                  const isCurrent = s.id === activeSalon.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveSalonId(s.id);
                        setIsSalonDropdownOpen(false);
                      }}
                      className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-colors text-xs ${
                        isCurrent
                          ? 'bg-slate-800 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={s.branding.logo_url}
                          alt={s.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                        <div className="truncate">
                          <p className="truncate">{s.name}</p>
                          <p className="text-[9px] text-slate-400 font-normal">
                            {s.neighborhood} • {s.template_id}
                          </p>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsSalonDropdownOpen(false);
                    setIsOnboardingOpen(true);
                  }}
                  className="w-full py-2 px-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Cadastrar Novo Salão
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lado Direito: Alternador [👁️ Ver como Cliente / 🛠️ Modo Salão] + Botões Rápidos */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Botão Alternador de Visão */}
          <button
            id="btn-toggle-view-mode"
            onClick={toggleViewMode}
            className={`h-8 px-2.5 rounded-xl border flex items-center gap-1 text-[11px] font-bold transition-all active:scale-95 shadow-sm ${
              viewMode === 'client'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border-emerald-500/40 hover:border-emerald-500'
            }`}
            title="Alternar entre a visão do cliente final e a bancada do salão"
          >
            {viewMode === 'client' ? (
              <>
                <Store className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Bancada</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Ver Cliente</span>
              </>
            )}
          </button>

          {/* Botão + Salão (Onboarding Express) */}
          <button
            id="btn-header-new-salon"
            onClick={() => setIsOnboardingOpen(true)}
            className="h-8 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1 text-[11px] font-semibold transition active:scale-95"
            title="Cadastrar novo estabelecimento em minutos"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Salão</span>
          </button>

          {/* Botão Editor de Cores / Branding */}
          <button
            id="btn-header-editor"
            onClick={() => setIsBrandingCustomizerOpen(true)}
            className="h-8 w-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 flex items-center justify-center transition active:scale-95"
            title="Personalizar identidade visual e cores"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>

          {/* Botão [⚡ Vaga (5s)] */}
          <button
            id="btn-header-fast-publish"
            onClick={() => setIsFastPublishOpen(true)}
            className="h-8 px-2.5 rounded-xl text-white font-bold text-[11px] flex items-center gap-1 shadow-md transition active:scale-95"
            style={{ backgroundColor: activeSalon.branding.primary_color }}
            title="Publicar Vaga Relâmpago em 5s"
          >
            <Zap className="w-3 h-3 fill-white" />
            <span className="whitespace-nowrap">5s</span>
          </button>
        </div>
      </div>
    </header>
  );
};

