/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { ServiceCategory, SalonMedia } from '../types';
import { getTodayDateStr } from '../data/initialData';
import {
  X,
  Zap,
  Clock,
  User,
  DollarSign,
  Video,
  Play,
  Check,
  Tag,
  Sparkles,
} from 'lucide-react';

interface FastPublishModalProps {
  initialProfessionalId?: string;
  initialStartTime?: string;
  onClose: () => void;
}

const SERVICE_PRESETS: {
  title: string;
  category: ServiceCategory;
  defaultPrice: number;
  promoPrice: number;
}[] = [
  { title: 'Degradê Navalhado + Barboterapia', category: 'cabelo', defaultPrice: 85, promoPrice: 55 },
  { title: 'Corte Tradicional na Tesoura', category: 'cabelo', defaultPrice: 70, promoPrice: 45 },
  { title: 'Barba Alinhada com Toalha Quente', category: 'barba', defaultPrice: 55, promoPrice: 35 },
  { title: 'Design de Barba + Pigmentação', category: 'barba', defaultPrice: 65, promoPrice: 42 },
  { title: 'Escova Modelada + Hidratação Flash', category: 'cabelo', defaultPrice: 90, promoPrice: 60 },
  { title: 'Unhas em Gel / Esmaltação em Gel', category: 'unhas', defaultPrice: 80, promoPrice: 55 },
  { title: 'Massagem Relaxante Express (30m)', category: 'estetica', defaultPrice: 100, promoPrice: 69 },
];

export const FastPublishModal: React.FC<FastPublishModalProps> = ({
  initialProfessionalId,
  initialStartTime,
  onClose,
}) => {
  const { activeSalon, professionals, mediaLibrary, publishOffer } = useEcosystem();

  const [selectedProfId, setSelectedProfId] = useState<string>(
    initialProfessionalId || professionals[0]?.id || ''
  );
  const [serviceTitle, setServiceTitle] = useState<string>(SERVICE_PRESETS[0].title);
  const [category, setCategory] = useState<ServiceCategory>(SERVICE_PRESETS[0].category);
  const [originalPrice, setOriginalPrice] = useState<number>(SERVICE_PRESETS[0].defaultPrice);
  const [promoPrice, setPromoPrice] = useState<number>(SERVICE_PRESETS[0].promoPrice);
  const [startTime, setStartTime] = useState<string>(
    initialStartTime ||
      (() => {
        const d = new Date();
        d.setMinutes(d.getMinutes() + 15);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      })()
  );

  // Pick first 5s video by default
  const defaultMedia = mediaLibrary.find((m) => m.type === 'video_5s') || mediaLibrary[0];
  const [selectedMediaId, setSelectedMediaId] = useState<string>(defaultMedia?.id || '');

  const activeProf = professionals.find((p) => p.id === selectedProfId) || professionals[0];
  const slotMinutes = activeProf?.slot_minutes || 45;

  // Calculate end time
  const calculateEndTime = (start: string, durationMinutes: number) => {
    const [h, m] = start.split(':').map(Number);
    const date = new Date();
    date.setHours(h || 12, m || 0, 0, 0);
    date.setMinutes(date.getMinutes() + durationMinutes);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const endTime = calculateEndTime(startTime, slotMinutes);
  const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - promoPrice) / originalPrice) * 100) : 0;

  const handleSelectPreset = (preset: (typeof SERVICE_PRESETS)[0]) => {
    setServiceTitle(preset.title);
    setCategory(preset.category);
    setOriginalPrice(preset.defaultPrice);
    setPromoPrice(preset.promoPrice);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const media = mediaLibrary.find((m) => m.id === selectedMediaId) || defaultMedia;

    publishOffer({
      professional_id: selectedProfId,
      service_title: serviceTitle,
      category,
      original_price: Number(originalPrice),
      price: Number(promoPrice),
      date_str: getTodayDateStr(),
      start_time: startTime,
      end_time: endTime,
      video_url: media ? media.url : 'https://assets.mixkit.co/videos/preview/mixkit-barber-using-a-razor-to-cut-hair-43407-large.mp4',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl p-5 sm:p-6 text-white"
        style={{
          borderTop: `4px solid ${activeSalon.branding.primary_color}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${activeSalon.branding.primary_color}25` }}
            >
              <Zap className="w-5 h-5" style={{ color: activeSalon.branding.accent_color }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Publicar Vaga Relâmpago
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Radar 5s
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Disparo instantâneo em 2 toques para clientes próximos ao salão
              </p>
            </div>
          </div>
          <button
            id="btn-close-fast-publish"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePublish} className="mt-4 space-y-4">
          {/* 1. Escolha do Profissional / Cadeira */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <User className="w-3.5 h-3.5" style={{ color: activeSalon.branding.accent_color }} />
              1. Cadeira / Profissional Livre
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {professionals.map((prof) => {
                const isSelected = prof.id === selectedProfId;
                return (
                  <button
                    type="button"
                    key={prof.id}
                    id={`btn-select-prof-${prof.id}`}
                    onClick={() => setSelectedProfId(prof.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/15 text-white ring-1 ring-amber-500'
                        : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={prof.avatar_url}
                      alt={prof.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover shrink-0 border"
                      style={{ borderColor: prof.color_hex }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-white">{prof.name.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-400">{prof.slot_minutes} min</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Horário do Vazio */}
          <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" style={{ color: activeSalon.branding.accent_color }} />
                  Horário de Início
                </label>
                <input
                  type="time"
                  id="input-start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Término Previsto</span>
                <div className="mt-1 text-base font-mono font-bold text-amber-400">
                  {endTime}
                </div>
                <span className="text-[10px] text-slate-500">({slotMinutes} minutos)</span>
              </div>
            </div>
          </div>

          {/* 3. Serviço & Preço Promocional Relâmpago */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" style={{ color: activeSalon.branding.accent_color }} />
                2. Serviço & Desconto Relâmpago
              </label>
              <span className="text-[11px] text-slate-400">Atalhos rápidos:</span>
            </div>

            {/* Quick Presets chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              {SERVICE_PRESETS.slice(0, 4).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white border border-slate-700/60 transition whitespace-nowrap cursor-pointer"
                >
                  {preset.title.split('+')[0].trim()}
                </button>
              ))}
            </div>

            <div className="space-y-2 mt-1">
              <input
                type="text"
                id="input-service-title"
                value={serviceTitle}
                onChange={(e) => setServiceTitle(e.target.value)}
                placeholder="Título do serviço (ex: Degradê + Barboterapia)"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                required
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Preço Normal (Tabela)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400">R$</span>
                    <input
                      type="number"
                      step="0.50"
                      id="input-original-price"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-amber-300 font-semibold block mb-1">Preço Relâmpago ⚡</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-amber-400 font-bold">R$</span>
                    <input
                      type="number"
                      step="0.50"
                      id="input-promo-price"
                      value={promoPrice}
                      onChange={(e) => setPromoPrice(Number(e.target.value))}
                      className="w-full bg-slate-800/80 border border-amber-500/60 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-center justify-center p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-300 uppercase tracking-wider">Desconto</div>
                    <div className="text-base font-black text-amber-400">-{discountPercent}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Escolha do Vídeo de 5s da Biblioteca */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" style={{ color: activeSalon.branding.accent_color }} />
                3. Vídeo Reels de 5s do Radar
              </label>
              <span className="text-[11px] text-slate-400">Garante visualização no feed</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {mediaLibrary.map((media) => {
                const isSelected = media.id === selectedMediaId;
                return (
                  <button
                    type="button"
                    key={media.id}
                    id={`btn-select-media-${media.id}`}
                    onClick={() => setSelectedMediaId(media.id)}
                    className={`relative rounded-xl overflow-hidden border text-left group transition cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-500'
                        : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={media.thumbnail_url || media.url}
                      alt={media.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-20 object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-1.5 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="px-1.5 py-0.2 rounded bg-black/60 text-[9px] font-mono text-amber-300">
                          {media.duration_seconds}s
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-white font-medium truncate">{media.title}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              id="btn-cancel-publish"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              id="btn-confirm-publish"
              className="touch-target flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl transition active:scale-95 cursor-pointer"
              style={{
                backgroundColor: activeSalon.branding.primary_color,
                boxShadow: `0 6px 20px ${activeSalon.branding.primary_color}50`,
              }}
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Lançar Vaga no Radar Vagou</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
