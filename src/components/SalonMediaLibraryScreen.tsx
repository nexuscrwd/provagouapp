/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { SalonMedia, ServiceCategory } from '../types';
import {
  Video,
  Image as ImageIcon,
  Play,
  Pause,
  Plus,
  Trash2,
  Zap,
  Tag,
  Clock,
  Sparkles,
  X,
  Upload,
} from 'lucide-react';

interface SalonMediaLibraryScreenProps {
  onPublishWithMedia: (mediaId: string) => void;
}

export const SalonMediaLibraryScreen: React.FC<SalonMediaLibraryScreenProps> = ({
  onPublishWithMedia,
}) => {
  const { activeSalon, mediaLibrary, addMediaItem, deleteMediaItem } = useEcosystem();

  const [activeTab, setActiveTab] = useState<'all' | 'video_5s' | 'photo'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 5-Second Reel Preview state
  const [playingMediaId, setPlayingMediaId] = useState<string | null>(null);
  const [playCountdown, setPlayCountdown] = useState<number>(5);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (playingMediaId) {
      setPlayCountdown(5);
      interval = setInterval(() => {
        setPlayCountdown((prev) => {
          if (prev <= 1) {
            return 5; // Loop 5s reel
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playingMediaId]);

  const filteredMedia = mediaLibrary.filter((item) => {
    const matchesType = activeTab === 'all' || item.type === activeTab;
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesType && matchesCat;
  });

  // Form state for adding media
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'video_5s' | 'photo'>('video_5s');
  const [newCategory, setNewCategory] = useState<ServiceCategory>('cabelo');
  const [newUrl, setNewUrl] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addMediaItem({
      title: newTitle,
      type: newType,
      category: newCategory,
      url:
        newUrl ||
        (newType === 'video_5s'
          ? 'https://assets.mixkit.co/videos/preview/mixkit-barber-using-a-razor-to-cut-hair-43407-large.mp4'
          : 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80'),
      thumbnail_url:
        newThumbnail ||
        'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&auto=format&fit=crop&q=80',
      duration_seconds: newType === 'video_5s' ? 5 : 0,
    });

    setNewTitle('');
    setNewUrl('');
    setNewThumbnail('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Biblioteca de Mídia do Radar (5s)</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {mediaLibrary.length} Itens
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Vídeos curtos de 5 segundos que aparecem no feed estilo Reels do App Consumidor (Vagou). Vagas com vídeo convertem 3.4x mais rápido.
          </p>
        </div>

        <button
          id="btn-open-add-media"
          onClick={() => setIsAddModalOpen(true)}
          className="touch-target flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 font-bold text-xs sm:text-sm text-slate-950 shadow-lg transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Vídeo / Foto</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({mediaLibrary.length})
          </button>
          <button
            onClick={() => setActiveTab('video_5s')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'video_5s'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Vídeos 5s ({mediaLibrary.filter((m) => m.type === 'video_5s').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'photo'
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Fotos ({mediaLibrary.filter((m) => m.type === 'photo').length})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {['all', 'cabelo', 'barba', 'unhas', 'estetica', 'beleza'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition capitalize cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-amber-400 font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'Categorias' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((media) => {
          const isPlaying = playingMediaId === media.id;
          return (
            <div
              key={media.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg group hover:border-slate-700 transition flex flex-col justify-between"
            >
              {/* Media Preview Stage */}
              <div className="relative aspect-[4/5] bg-black overflow-hidden flex items-center justify-center">
                {isPlaying && media.type === 'video_5s' ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      src={media.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Live 5-second countdown indicator */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 border border-amber-500/30">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>{playCountdown}s / 5s (Loop)</span>
                    </div>

                    <button
                      onClick={() => setPlayingMediaId(null)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black text-white transition cursor-pointer"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <img
                      src={media.thumbnail_url || media.url}
                      alt={media.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Overlay badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1 border border-white/10">
                        {media.type === 'video_5s' ? (
                          <>
                            <Video className="w-3 h-3 text-amber-400" />
                            <span>5s Reel</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3 h-3 text-blue-400" />
                            <span>Foto</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Play Button for Video Preview */}
                    {media.type === 'video_5s' && (
                      <button
                        onClick={() => setPlayingMediaId(media.id)}
                        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-amber-500/90 hover:bg-amber-400 flex items-center justify-center text-slate-950 shadow-2xl transition group-hover:scale-110 cursor-pointer"
                        title="Simular visualização de 5 segundos no App Consumidor"
                      >
                        <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Media Info & Action Bar */}
              <div className="p-3.5 space-y-2.5">
                <div>
                  <h4 className="font-bold text-sm text-white truncate">{media.title}</h4>
                  <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
                    <span className="capitalize text-slate-300">{media.category}</span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(media.uploaded_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onPublishWithMedia(media.id)}
                    className="flex-1 touch-target flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs border border-amber-500/40 transition active:scale-95 cursor-pointer"
                    title="Lançar vaga relâmpago usando este vídeo"
                  >
                    <Zap className="w-3.5 h-3.5 fill-amber-300" />
                    <span>Usar no Radar</span>
                  </button>

                  <button
                    onClick={() => deleteMediaItem(media.id)}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                    title="Excluir da biblioteca"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Media Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Cadastrar Mídia para o Radar</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tipo de Mídia</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('video_5s')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      newType === 'video_5s'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Vídeo Curto (5s Reel)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('photo')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      newType === 'photo'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Foto Institucional
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Título do Clip</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Corte Americano Texturizado"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Categoria do Radar</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ServiceCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 capitalize"
                >
                  <option value="cabelo">Cabelo</option>
                  <option value="barba">Barba</option>
                  <option value="unhas">Unhas</option>
                  <option value="estetica">Estética</option>
                  <option value="beleza">Beleza</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  URL do Vídeo / Foto (Opcional - Demo inclusa se vazio)
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://exemplo.com/video-5s.mp4"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-xs text-slate-950 shadow cursor-pointer"
                >
                  Salvar na Biblioteca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
