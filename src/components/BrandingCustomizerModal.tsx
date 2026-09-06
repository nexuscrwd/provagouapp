/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { Palette, X, Check, Code, ChevronDown, ChevronUp, Upload, Image, Building2 } from 'lucide-react';

export const BrandingCustomizerModal: React.FC = () => {
  const { activeSalon, updateSalonDetails, isBrandingCustomizerOpen, setIsBrandingCustomizerOpen } =
    useEcosystem();

  const [salonName, setSalonName] = useState(activeSalon.name);
  const [logoUrl, setLogoUrl] = useState(activeSalon.branding.logo_url);
  const [primary, setPrimary] = useState(activeSalon.branding.primary_color);
  const [secondary, setSecondary] = useState(activeSalon.branding.secondary_color);
  const [bg, setBg] = useState(activeSalon.branding.background_color);
  const [accent, setAccent] = useState(activeSalon.branding.accent_color);
  const [showJsonSpec, setShowJsonSpec] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when activeSalon changes
  useEffect(() => {
    setSalonName(activeSalon.name);
    setLogoUrl(activeSalon.branding.logo_url);
    setPrimary(activeSalon.branding.primary_color);
    setSecondary(activeSalon.branding.secondary_color);
    setBg(activeSalon.branding.background_color);
    setAccent(activeSalon.branding.accent_color);
  }, [activeSalon]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isBrandingCustomizerOpen) {
        setIsBrandingCustomizerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBrandingCustomizerOpen, setIsBrandingCustomizerOpen]);

  if (!isBrandingCustomizerOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateSalonDetails({
      name: salonName.trim() || activeSalon.name,
      logo_url: logoUrl,
      branding: {
        logo_url: logoUrl,
        primary_color: primary,
        secondary_color: secondary,
        background_color: bg,
        accent_color: accent,
      },
    });
    setIsBrandingCustomizerOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsBrandingCustomizerOpen(false);
      }}
    >
      <div
        className="w-full max-w-md max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl text-white shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        style={{
          borderTop: `4px solid ${primary}`,
        }}
      >
        {/* Fixed Header (Never scrolls away) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${primary}25`, color: accent }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Editor da Marca</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/30">
                  White-Label
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Nome, logo e cores do ecossistema
              </p>
            </div>
          </div>

          <button
            id="btn-close-branding-top"
            onClick={() => setIsBrandingCustomizerOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="branding-form" onSubmit={handleApply} className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* 1. Nome do Salão */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Nome do Estabelecimento</span>
            </label>
            <input
              type="text"
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}
              placeholder="Ex: Barbearia Dom Pedro"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
              required
            />
          </div>

          {/* 2. Subir Logo / Alterar Imagem */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Image className="w-3.5 h-3.5 text-amber-400" />
              <span>Logo do Estabelecimento</span>
            </label>

            <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-800">
              <div className="relative shrink-0">
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 shadow-md"
                  style={{ borderColor: primary }}
                  onError={(e) => {
                    // Fallback to initial logo if broken URL
                    (e.target as HTMLImageElement).src = activeSalon.branding.logo_url;
                  }}
                />
              </div>

              <div className="flex-1 space-y-1.5 min-w-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-650 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-600"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Foto do Dispositivo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Ou cole URL da imagem..."
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Quick Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 uppercase tracking-wider">
              Paletas Rápidas do Ecossistema
            </label>
            <div className="grid grid-cols-2 gap-2">
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
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition cursor-pointer min-h-[44px] ${
                    primary === p.primary
                      ? 'bg-slate-800 border-amber-400 text-white shadow-md'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                  }`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                    style={{ backgroundColor: p.primary }}
                  />
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Custom Color Pickers */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
              Cores Personalizadas
            </label>

            <div className="grid grid-cols-2 gap-2">
              {/* Primary */}
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-slate-300 block font-semibold">Primária</span>
                  <span className="text-[10px] text-slate-500 font-mono">--brand-primary</span>
                </div>
                <input
                  type="color"
                  value={primary}
                  onChange={(e) => handleLivePreview('primary', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer p-0.5"
                />
              </div>

              {/* Accent */}
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-slate-300 block font-semibold">Destaque</span>
                  <span className="text-[10px] text-slate-500 font-mono">--brand-accent</span>
                </div>
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => handleLivePreview('accent', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer p-0.5"
                />
              </div>

              {/* Secondary */}
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-slate-300 block font-semibold">Cards</span>
                  <span className="text-[10px] text-slate-500 font-mono">--brand-secondary</span>
                </div>
                <input
                  type="color"
                  value={secondary}
                  onChange={(e) => handleLivePreview('secondary', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer p-0.5"
                />
              </div>

              {/* Background */}
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-slate-300 block font-semibold">Fundo</span>
                  <span className="text-[10px] text-slate-500 font-mono">--brand-bg</span>
                </div>
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => handleLivePreview('bg', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer p-0.5"
                />
              </div>
            </div>
          </div>

          {/* Collapsible Contract Spec Preview */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowJsonSpec(!showJsonSpec)}
              className="w-full flex items-center justify-between p-2.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5 font-mono text-amber-400/90 font-semibold">
                <Code className="w-3.5 h-3.5" />
                <span>JSON branding (tabela salons)</span>
              </span>
              {showJsonSpec ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showJsonSpec && (
              <div className="p-3 pt-0 border-t border-slate-800/80 text-[11px] font-mono text-slate-300">
                <pre className="overflow-x-auto max-h-32 py-1">
{JSON.stringify(
  {
    name: salonName,
    logo_url: logoUrl,
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
            )}
          </div>
        </form>

        {/* Fixed Sticky Footer - Always Accessible */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md shrink-0 flex items-center justify-end gap-2.5">
          <button
            type="button"
            id="btn-cancel-branding"
            onClick={() => setIsBrandingCustomizerOpen(false)}
            className="min-h-[48px] px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition cursor-pointer active:scale-95"
          >
            Fechar
          </button>

          <button
            type="submit"
            form="branding-form"
            id="btn-save-branding"
            className="min-h-[48px] flex-1 py-2.5 rounded-2xl font-bold text-xs text-white shadow-xl transition cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            style={{
              backgroundColor: primary,
              boxShadow: `0 4px 18px ${primary}50`,
            }}
          >
            <Check className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>
    </div>
  );
};
