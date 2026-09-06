/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { Palette, Zap, BadgeCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeSalon,
    setIsFastPublishOpen,
    setIsBrandingCustomizerOpen,
  } = useEcosystem();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2.5 shadow-md">
      <div className="flex items-center justify-between gap-2">
        {/* Lado Esquerdo: Logo circular pequeno + Nome do Salão com badge/ícone */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={activeSalon.branding.logo_url}
              alt={activeSalon.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border-2 shadow-sm"
              style={{ borderColor: activeSalon.branding.primary_color }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm text-white truncate leading-tight">
                {activeSalon.name}
              </h1>
              {activeSalon.is_verified && (
                <BadgeCheck className="w-4 h-4 text-sky-400 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">Vagou Pro</span>
              <span>•</span>
              <span className="truncate">{activeSalon.neighborhood || activeSalon.city}</span>
            </div>
          </div>
        </div>

        {/* Lado Direito: [🎨 Editor] + [⚡ Vaga (5s)] */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Botão [🎨 Editor] */}
          <button
            id="btn-header-editor"
            onClick={() => setIsBrandingCustomizerOpen(true)}
            className="h-10 px-2.5 sm:px-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5 text-xs font-semibold transition active:scale-95 cursor-pointer shadow-sm"
            title="Abrir editor de cores (Theming), logo e nome do salão"
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span className="text-xs">Editor</span>
          </button>

          {/* Botão [⚡ Vaga (5s)] */}
          <button
            id="btn-header-fast-publish"
            onClick={() => setIsFastPublishOpen(true)}
            className="h-10 px-3 sm:px-3.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition active:scale-95 cursor-pointer"
            style={{
              backgroundColor: activeSalon.branding.primary_color,
              boxShadow: `0 4px 14px ${activeSalon.branding.primary_color}40`,
            }}
            title="Publicar Vaga Relâmpago em 5 segundos"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span className="whitespace-nowrap">Vaga (5s)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
