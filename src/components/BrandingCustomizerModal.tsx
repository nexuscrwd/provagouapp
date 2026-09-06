/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { Palette, X, RefreshCw, Check, Eye } from 'lucide-react';

export const BrandingCustomizerModal: React.FC = () => {
  const { activeSalon, updateSalonBranding, isBrandingCustomizerOpen, setIsBrandingCustomizerOpen } =
    useEcosystem();

  const [primary, setPrimary] = useState(activeSalon.branding.primary_color);
  const [secondary, setSecondary] = useState(activeSalon.branding.secondary_color);
  const [bg, setBg] = useState(activeSalon.branding.background_color);
  const [accent, setAccent] = useState(activeSalon.branding.accent_color);

  if (!isBrandingCustomizerOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateSalonBranding({
      primary_color: primary,
      secondary_color: secondary,
      background_color: bg,
      accent_color: accent,
    });
    setIsBrandingCustomizerOpen(false);
  };

  const handleLivePreview = (field: 'primary' | 'secondary' | 'bg' | 'accent', val: string) => {
    if (field === 'primary') setPrimary(val);
    if (field === 'secondary') setSecondary(val);
    if (field === 'bg') setBg(val);
    if (field === 'accent') setAccent(val);

    // Apply live CSS change immediately
    const root = document.documentElement;
    if (field === 'primary') root.style.setProperty('--brand-primary', val);
    if (field === 'secondary') root.style.setProperty('--brand-secondary', val);
    if (field === 'bg') root.style.setProperty('--brand-bg', val);
    if (field === 'accent') root.style.setProperty('--brand-accent', val);
  };

  const PRESETS = [
    { label: 'Âmbar Barbearia', primary: '#D97706', secondary: '#1E293B', bg: '#0B0F17', accent: '#F59E0B' },
    { label: 'Rosa Pink Salon', primary: '#DB2777', secondary: '#1E1B2E', bg: '#0D0B14', accent: '#F472B6' },
    { label: 'Esmeralda Spa', primary: '#10B981', secondary: '#064E3B', bg: '#04130F', accent: '#34D399' },
    { label: 'Azul Fade Tech', primary: '#3B82F6', secondary: '#1E293B', bg: '#080E1A', accent: '#60A5FA' },
    { label: 'Dourado Premium', primary: '#EAB308', secondary: '#27272A', bg: '#09090B', accent: '#FDE047' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Theming Dinâmico White-Label</h3>
              <p className="text-xs text-slate-400">
                Injeção de tokens de cor no `:root` CSS para {activeSalon.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBrandingCustomizerOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
            Paletas Rápidas do Ecossistema
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrimary(p.primary);
                  setSecondary(p.secondary);
                  setBg(p.bg);
                  setAccent(p.accent);
                  const root = document.documentElement;
                  root.style.setProperty('--brand-primary', p.primary);
                  root.style.setProperty('--brand-secondary', p.secondary);
                  root.style.setProperty('--brand-bg', p.bg);
                  root.style.setProperty('--brand-accent', p.accent);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium transition cursor-pointer"
              >
                <div
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: p.primary }}
                />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Pickers */}
        <form onSubmit={handleApply} className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            {/* Primary */}
            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-800">
              <label className="text-xs text-slate-300 block mb-1 font-semibold">
                Cor Primária (--brand-primary)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primary}
                  onChange={(e) => handleLivePreview('primary', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer"
                />
                <input
                  type="text"
                  value={primary}
                  onChange={(e) => handleLivePreview('primary', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-white"
                />
              </div>
            </div>

            {/* Accent */}
            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-800">
              <label className="text-xs text-slate-300 block mb-1 font-semibold">
                Cor de Destaque (--brand-accent)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => handleLivePreview('accent', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer"
                />
                <input
                  type="text"
                  value={accent}
                  onChange={(e) => handleLivePreview('accent', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-white"
                />
              </div>
            </div>

            {/* Secondary */}
            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-800">
              <label className="text-xs text-slate-300 block mb-1 font-semibold">
                Cor Secundária / Cards
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondary}
                  onChange={(e) => handleLivePreview('secondary', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer"
                />
                <input
                  type="text"
                  value={secondary}
                  onChange={(e) => handleLivePreview('secondary', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-white"
                />
              </div>
            </div>

            {/* Background */}
            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-800">
              <label className="text-xs text-slate-300 block mb-1 font-semibold">
                Fundo do App (--brand-bg)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => handleLivePreview('bg', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer"
                />
                <input
                  type="text"
                  value={bg}
                  onChange={(e) => handleLivePreview('bg', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>

          {/* Code Spec Preview Box matching contract */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-400">
            <span className="text-amber-400 font-bold">// JSON salvo na coluna branding (tabela salons):</span>
            <pre className="text-slate-300 mt-1">
{JSON.stringify(
  {
    logo_url: activeSalon.branding.logo_url,
    primary_color: primary,
    secondary_color: secondary,
    background_color: bg,
    accent_color: accent,
    text_primary: '#FFFFFF',
    text_muted: '#94A3B8',
  },
  null,
  2
)}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsBrandingCustomizerOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Fechar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow transition cursor-pointer"
              style={{ backgroundColor: primary }}
            >
              Salvar Theming
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
