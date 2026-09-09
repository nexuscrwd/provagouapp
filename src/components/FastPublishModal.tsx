/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { ServiceCategory } from '../types';
import { getTodayDateStr } from '../data/initialData';
import {
  X,
  Zap,
  Clock,
  User,
  Video,
  Check,
} from 'lucide-react';

interface FastPublishModalProps {
  isOpen: boolean;
  initialProfessionalId?: string;
  initialStartTime?: string;
  onClose: () => void;
}

export const FastPublishModal: React.FC<FastPublishModalProps> = ({
  isOpen,
  initialProfessionalId,
  initialStartTime,
  onClose,
}) => {
  const { activeSalon, professionals, mediaLibrary, publishOffer, setIsFastPublishOpen } = useEcosystem();

  const handleClose = () => {
    setIsFastPublishOpen(false);
    onClose();
  };

  const [selectedProfId, setSelectedProfId] = useState<string>(
    initialProfessionalId || professionals[0]?.id || ''
  );
  const [startTime, setStartTime] = useState<string>(
    initialStartTime ||
      (() => {
        const d = new Date();
        d.setMinutes(d.getMinutes() + 15);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      })()
  );

  React.useEffect(() => {
    if (initialProfessionalId) {
      setSelectedProfId(initialProfessionalId);
    }
    if (initialStartTime) {
      setStartTime(initialStartTime);
    }
  }, [initialProfessionalId, initialStartTime, isOpen]);

  // Pick first 5s video by default
  const defaultMedia = mediaLibrary.find((m) => m.type === 'video_5s') || mediaLibrary[0];
  const [selectedMediaId, setSelectedMediaId] = useState<string>(defaultMedia?.id || '');

  const activeProf = professionals.find((p) => p.id === selectedProfId) || professionals[0];
  const slotMinutes = activeProf?.slot_minutes || 45;
  const serviceTitle = activeProf?.specialties?.[0] || 'Atendimento Cadeira';
  const category: ServiceCategory = activeProf?.specialties?.some((s) => s.toLowerCase().includes('barba'))
    ? 'barba'
    : 'cabelo';
  const originalPrice = 70;
  const promoPrice = 49;

  // Calculate end time
  const calculateEndTime = (start: string, durationMinutes: number) => {
    const [h, m] = start.split(':').map(Number);
    const date = new Date();
    date.setHours(h || 12, m || 0, 0, 0);
    date.setMinutes(date.getMinutes() + durationMinutes);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const endTime = calculateEndTime(startTime, slotMinutes);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const media = mediaLibrary.find((m) => m.id === selectedMediaId) || defaultMedia;

    publishOffer({
      professional_id: selectedProfId,
      service_title: serviceTitle,
      category,
      original_price: originalPrice,
      price: promoPrice,
      date_str: getTodayDateStr(),
      start_time: startTime,
      end_time: endTime,
      video_url: media ? media.url : 'https://assets.mixkit.co/videos/preview/mixkit-barber-using-a-razor-to-cut-hair-43407-large.mp4',
    });

    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl text-white flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        style={{
          borderTop: `4px solid ${activeSalon.branding.primary_color}`,
        }}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${activeSalon.branding.primary_color}25` }}
            >
              <Zap className="w-5 h-5" style={{ color: activeSalon.branding.accent_color }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Divulgar Vaga!
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Flash 5s
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Divulgação instantânea no radar do app para clientes do salão
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-fast-publish"
            onClick={handleClose}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="fast-publish-form" onSubmit={handlePublish} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
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

          {/* 2. Horário da Vaga */}
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

          {/* 3. Escolha do Vídeo de 5s da Biblioteca */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" style={{ color: activeSalon.branding.accent_color }} />
                2. Vídeo Reels de 5s (Stories do App)
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
        </form>

        {/* Fixed Sticky Footer - Always Accessible */}
        <div className="p-4 sm:px-6 py-3.5 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            id="btn-cancel-publish"
            onClick={handleClose}
            className="min-h-[48px] px-5 py-3 rounded-2xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition cursor-pointer active:scale-95"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="fast-publish-form"
            id="btn-confirm-publish"
            className="min-h-[48px] flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-xl transition active:scale-95 cursor-pointer"
            style={{
              backgroundColor: activeSalon.branding.primary_color,
              boxShadow: `0 6px 20px ${activeSalon.branding.primary_color}50`,
            }}
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Divulgar Vaga!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
