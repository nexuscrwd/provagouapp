import React, { useState, useMemo, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, Scissors, Check, X, 
  Sparkles, Clock, Image as ImageIcon,
  AlertCircle, Search, Video, Upload, Film, FolderPlus,
  Images, Play, Camera, Eye, ChevronRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { hapticLight, hapticSuccess, hapticMedium } from '../../utils/haptics';
import { CatalogServiceItem } from '../../types';
import { ServicePublicAdPreview } from './ServicePublicAdPreview';

interface ProfessionalServicesManagerProps {
  services: CatalogServiceItem[];
  onUpdateServices: (services: CatalogServiceItem[]) => void;
  isAddingNewFromQuickAction?: boolean;
  onCloseQuickAction?: () => void;
}

export interface SavedMediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  title: string;
  createdAt: number;
  duration?: number;
}

const DEFAULT_CATEGORIES = ['Cabelo', 'Barba', 'Combos', 'Estética', 'Tratamentos', 'Rosto', 'Unhas'];

const INITIAL_SAVED_IMAGES: SavedMediaItem[] = [
  {
    id: 'img_cabelo_1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    category: 'Cabelo',
    title: 'Corte Degradê na Lâmina',
    createdAt: Date.now() - 120000,
  },
  {
    id: 'img_cabelo_2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    category: 'Cabelo',
    title: 'Penteado & Alinhamento',
    createdAt: Date.now() - 110000,
  },
  {
    id: 'img_cabelo_3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80',
    category: 'Cabelo',
    title: 'Corte Tesoura & Textura',
    createdAt: Date.now() - 100000,
  },
  {
    id: 'img_barba_1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    category: 'Barba',
    title: 'Barboterapia & Toalha Quente',
    createdAt: Date.now() - 90000,
  },
  {
    id: 'img_rosto_1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80',
    category: 'Rosto',
    title: 'Visagismo & Navalha',
    createdAt: Date.now() - 80000,
  },
  {
    id: 'img_cabelo_4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    category: 'Cabelo',
    title: 'Iluminação & Tonalização',
    createdAt: Date.now() - 70000,
  },
  {
    id: 'img_combos_1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    category: 'Combos',
    title: 'Cabelo & Barba Completo',
    createdAt: Date.now() - 60000,
  },
  {
    id: 'img_estetica_1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507081323647-4d250478b919?auto=format&fit=crop&w=800&q=80',
    category: 'Estética',
    title: 'Limpeza de Pele & Esfoliação',
    createdAt: Date.now() - 50000,
  },
];

const INITIAL_SAVED_VIDEOS: SavedMediaItem[] = [
  {
    id: 'vid_cabelo_1',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hairdresser-cutting-hair-with-scissors-41443-large.mp4',
    category: 'Cabelo',
    title: 'Corte na Tesoura',
    duration: 5,
    createdAt: Date.now() - 120000,
  },
  {
    id: 'vid_barba_1',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-barber-shaving-a-mans-beard-with-a-razor-41446-large.mp4',
    category: 'Barba',
    title: 'Barboterapia & Navalha',
    duration: 5,
    createdAt: Date.now() - 110000,
  },
  {
    id: 'vid_cabelo_2',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hairdresser-styling-hair-with-a-blow-dryer-41444-large.mp4',
    category: 'Cabelo',
    title: 'Finalização & Penteado',
    duration: 5,
    createdAt: Date.now() - 100000,
  },
  {
    id: 'vid_barba_2',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-barber-trimming-a-mans-beard-41445-large.mp4',
    category: 'Barba',
    title: 'Alinhamento de Barba',
    duration: 5,
    createdAt: Date.now() - 90000,
  },
];

export const ProfessionalServicesManager: React.FC<ProfessionalServicesManagerProps> = ({
  services,
  onUpdateServices,
  isAddingNewFromQuickAction = false,
  onCloseQuickAction,
}) => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Categorias cadastradas com sincronização em LocalStorage
  const [categoryList, setCategoryList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vagou_custom_service_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const fromServices = services.map((s) => s.category?.trim()).filter(Boolean);
          return Array.from(new Set([...DEFAULT_CATEGORIES, ...parsed, ...fromServices]));
        }
      }
    } catch {
      // ignore
    }
    const fromServices = services.map((s) => s.category?.trim()).filter(Boolean);
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...fromServices]));
  });

  // Modal de Nova Categoria
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');

  // Modal de Adicionar / Editar Serviço
  const [isModalOpen, setIsModalOpen] = useState<boolean>(isAddingNewFromQuickAction);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  // Pré-visualização do anúncio no portal / modo público
  const [previewService, setPreviewService] = useState<CatalogServiceItem | null>(null);

  // Campos do formulário
  const [formTitle, setFormTitle] = useState<string>('');
  const [formPrice, setFormPrice] = useState<number>(50);
  const [formDuration, setFormDuration] = useState<string>('40 min');
  const [formCategory, setFormCategory] = useState<string>('Cabelo');
  const [formDescription, setFormDescription] = useState<string>('');
  
  // Modo de Publicação do Anúncio (Foto Estática, Slide de Imagens ou Vídeo)
  const [displayMode, setDisplayMode] = useState<'static' | 'slideshow' | 'video'>('static');
  
  // Até 5 fotos para o serviço (na Foto Única, usa apenas a 1ª foto)
  const [formPhotos, setFormPhotos] = useState<string[]>([INITIAL_SAVED_IMAGES[0].url]);
  
  // 1 Vídeo de até 5s para o serviço
  const [formVideoUrl, setFormVideoUrl] = useState<string>(INITIAL_SAVED_VIDEOS[0].url);
  const [formVideoDuration, setFormVideoDuration] = useState<number>(5);
  const [videoDurationWarning, setVideoDurationWarning] = useState<string | null>(null);

  // Biblioteca de Mídias Salvas com persistência no LocalStorage
  const [savedMediaList, setSavedMediaList] = useState<SavedMediaItem[]>(() => {
    try {
      const stored = localStorage.getItem('vagou_saved_media_library_v3');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [...INITIAL_SAVED_IMAGES, ...INITIAL_SAVED_VIDEOS];
  });

  // Modal dedicado para seleção da Biblioteca de Mídias Salvas
  const [isMediaLibraryModalOpen, setIsMediaLibraryModalOpen] = useState<boolean>(false);

  // Filtro de Categoria da Biblioteca de Mídias Salvas
  const [mediaLibraryCategory, setMediaLibraryCategory] = useState<string>('Todas');

  const availableLibraryCategories = useMemo(() => {
    const cats = new Set<string>();
    categoryList.forEach((c) => cats.add(c));
    savedMediaList.forEach((m) => {
      if (m.category) cats.add(m.category);
    });
    return ['Todas', ...Array.from(cats)];
  }, [savedMediaList, categoryList]);

  const filteredSavedImages = useMemo(() => {
    return savedMediaList.filter((m) => {
      if (m.type !== 'image') return false;
      if (mediaLibraryCategory === 'Todas') return true;
      return m.category.toLowerCase() === mediaLibraryCategory.toLowerCase();
    });
  }, [savedMediaList, mediaLibraryCategory]);

  const filteredSavedVideos = useMemo(() => {
    return savedMediaList.filter((m) => {
      if (m.type !== 'video') return false;
      if (mediaLibraryCategory === 'Todas') return true;
      return m.category.toLowerCase() === mediaLibraryCategory.toLowerCase();
    });
  }, [savedMediaList, mediaLibraryCategory]);
  
  // Referências para inputs de Câmera e Dispositivo
  const cameraPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const devicePhotoInputRef = useRef<HTMLInputElement | null>(null);
  const cameraVideoInputRef = useRef<HTMLInputElement | null>(null);
  const deviceVideoInputRef = useRef<HTMLInputElement | null>(null);
  
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Salvar categorias no LocalStorage
  const persistCategories = (newCats: string[]) => {
    setCategoryList(newCats);
    try {
      localStorage.setItem('vagou_custom_service_categories', JSON.stringify(newCats));
    } catch {
      // ignore
    }
  };

  // Criar nova categoria
  const handleCreateCategory = (nameToCreate?: string) => {
    const target = (nameToCreate || newCategoryName).trim();
    if (!target) return;

    if (categoryList.some((c) => c.toLowerCase() === target.toLowerCase())) {
      showToast(`Categoria "${target}" já existe!`);
      setFormCategory(target);
      setIsCategoryModalOpen(false);
      setNewCategoryName('');
      return;
    }

    const updated = [...categoryList, target];
    persistCategories(updated);
    setFormCategory(target);
    setNewCategoryName('');
    setIsCategoryModalOpen(false);
    hapticSuccess();
    showToast(`Categoria "${target}" criada com sucesso!`);
  };

  // Abrir modal para novo serviço
  const handleOpenNew = (defaultCat?: string) => {
    hapticLight();
    setEditingServiceId(null);
    setFormTitle('');
    setFormPrice(50);
    setFormDuration('40 min');
    setFormCategory(defaultCat && defaultCat !== 'Todos' ? defaultCat : (categoryList[0] || 'Cabelo'));
    setFormDescription('');
    setDisplayMode('static');
    setFormPhotos([INITIAL_SAVED_IMAGES[0].url]);
    setFormVideoUrl(INITIAL_SAVED_VIDEOS[0].url);
    setFormVideoDuration(5);
    setVideoDurationWarning(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (srv: CatalogServiceItem) => {
    hapticLight();
    setEditingServiceId(srv.id);
    setFormTitle(srv.title);
    setFormPrice(srv.price);
    setFormDuration(srv.duration || '40 min');
    setFormCategory(srv.category || categoryList[0] || 'Cabelo');
    setFormDescription(srv.description || '');

    // Carregar fotos (até 5)
    if (srv.photos && Array.isArray(srv.photos) && srv.photos.length > 0) {
      setFormPhotos(srv.photos.slice(0, 5));
    } else if (srv.image) {
      setFormPhotos([srv.image]);
    } else {
      setFormPhotos([INITIAL_SAVED_IMAGES[0].url]);
    }

    // Carregar vídeo
    if (srv.videoUrl) {
      setFormVideoUrl(srv.videoUrl);
      setFormVideoDuration(srv.videoDurationSeconds || 5);
    } else {
      setFormVideoUrl(INITIAL_SAVED_VIDEOS[0].url);
      setFormVideoDuration(5);
    }

    // Modo de exibição
    if (srv.displayMode) {
      setDisplayMode(srv.displayMode);
    } else if (srv.mediaType === 'video' || srv.videoUrl) {
      setDisplayMode('video');
    } else {
      setDisplayMode('static');
    }

    setVideoDurationWarning(null);
    setIsModalOpen(true);
  };

  // Processar arquivo de foto/vídeo capturado na hora ou enviado do aparelho
  const processAndSaveMediaFile = (
    file: File,
    type: 'image' | 'video',
    targetMode: 'static' | 'slideshow' | 'video'
  ) => {
    if (type === 'image') {
      if (!file.type.startsWith('image/')) {
        showToast('Por favor, selecione um arquivo de imagem válido.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawUrl = e.target?.result as string;
        if (!rawUrl) return;

        // Otimizar resolução se imagem for pesada (ex: foto de câmera de 12MP)
        const img = new Image();
        img.onload = () => {
          let finalUrl = rawUrl;
          const maxDim = 1200;
          if (img.width > maxDim || img.height > maxDim) {
            const canvas = document.createElement('canvas');
            const scale = Math.min(maxDim / img.width, maxDim / img.height);
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              finalUrl = canvas.toDataURL('image/jpeg', 0.85);
            }
          }

          const newMedia: SavedMediaItem = {
            id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            type: 'image',
            url: finalUrl,
            category: formCategory,
            title: `${formTitle.trim() || 'Foto'} (${formCategory})`,
            createdAt: Date.now(),
          };

          setSavedMediaList((prev) => {
            const updated = [newMedia, ...prev];
            try {
              localStorage.setItem('vagou_saved_media_library_v3', JSON.stringify(updated.slice(0, 50)));
            } catch {
              // ignore
            }
            return updated;
          });

          if (targetMode === 'static') {
            setFormPhotos([finalUrl]);
            hapticSuccess();
            showToast(`Foto salva em "${formCategory}" e selecionada!`);
          } else {
            // slideshow: adicionar até 5 fotos
            if (formPhotos.length >= 5) {
              hapticLight();
              showToast(`Salva na biblioteca de "${formCategory}". (Slide cheio: máx 5)`);
            } else {
              setFormPhotos((prev) => [...prev, finalUrl]);
              hapticSuccess();
              showToast(`Foto salva em "${formCategory}" e adicionada ao slide (${formPhotos.length + 1}/5)!`);
            }
          }
        };
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    } else {
      // Vídeo
      if (!file.type.startsWith('video/')) {
        showToast('Por favor, selecione um arquivo de vídeo válido.');
        return;
      }
      const videoBlobUrl = URL.createObjectURL(file);
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = videoBlobUrl;
      tempVideo.onloadedmetadata = () => {
        const dur = Math.round(tempVideo.duration * 10) / 10;
        setFormVideoDuration(dur);
        if (dur > 5.5) {
          setVideoDurationWarning(`Vídeo de ${dur}s. O radar prioriza vídeos de até 5 segundos para máxima conversão.`);
        } else {
          setVideoDurationWarning(null);
        }
      };

      const newMedia: SavedMediaItem = {
        id: `vid_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type: 'video',
        url: videoBlobUrl,
        category: formCategory,
        title: `${formTitle.trim() || 'Vídeo'} (${formCategory})`,
        createdAt: Date.now(),
        duration: 5,
      };

      setSavedMediaList((prev) => {
        const updated = [newMedia, ...prev];
        try {
          localStorage.setItem('vagou_saved_media_library_v3', JSON.stringify(updated.slice(0, 30)));
        } catch {
          // ignore
        }
        return updated;
      });

      setFormVideoUrl(videoBlobUrl);
      setDisplayMode('video');
      hapticSuccess();
      showToast(`Vídeo salvo na biblioteca em "${formCategory}" e selecionado!`);
    }
  };

  // Remover foto do slide
  const handleRemovePhotoFromSlide = (index: number) => {
    if (formPhotos.length <= 1) {
      showToast('O slide precisa de pelo menos 1 foto.');
      return;
    }
    setFormPhotos((prev) => prev.filter((_, i) => i !== index));
    hapticLight();
  };

  // Salvar serviço (novo ou existente)
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const primaryPhoto = formPhotos[0] || INITIAL_SAVED_IMAGES[0].url;
    const finalPhotos = formPhotos.length > 0 ? formPhotos : [primaryPhoto];
    const finalMediaType: 'image' | 'video' = displayMode === 'video' ? 'video' : 'image';

    if (editingServiceId) {
      // Editar
      const updated = services.map((s) => {
        if (s.id === editingServiceId) {
          return {
            ...s,
            title: formTitle.trim(),
            price: Number(formPrice) || 0,
            duration: formDuration.trim() || '40 min',
            category: formCategory,
            description: formDescription.trim(),
            image: primaryPhoto,
            photos: finalPhotos,
            mediaType: finalMediaType,
            displayMode,
            videoUrl: formVideoUrl,
            videoDurationSeconds: formVideoDuration,
          };
        }
        return s;
      });
      onUpdateServices(updated);
      hapticSuccess();
      showToast('Serviço atualizado com sucesso!');
    } else {
      // Criar novo (subcategoria)
      const newService: CatalogServiceItem = {
        id: `srv-${Date.now()}`,
        title: formTitle.trim(),
        price: Number(formPrice) || 0,
        duration: formDuration.trim() || '40 min',
        category: formCategory,
        description: formDescription.trim(),
        image: primaryPhoto,
        photos: finalPhotos,
        mediaType: finalMediaType,
        displayMode,
        videoUrl: formVideoUrl,
        videoDurationSeconds: formVideoDuration,
        aspectRatio: 'aspect-square',
      };
      const updated = [newService, ...services];
      onUpdateServices(updated);
      hapticSuccess();
      showToast('Novo serviço cadastrado na categoria!');
    }

    setIsModalOpen(false);
    onCloseQuickAction?.();
  };

  // Excluir serviço
  const handleDeleteService = (id: string) => {
    hapticMedium();
    const updated = services.filter((s) => s.id !== id);
    onUpdateServices(updated);
    setDeletingServiceId(null);
    showToast('Serviço removido do catálogo.');
  };

  // Filtragem de serviços
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesCategory = selectedCategory === 'Todos' || srv.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = srv.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (srv.description && srv.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  // Agrupamento por Categoria (Categoria como Grupo Pai e Serviços como Subcategorias)
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, CatalogServiceItem[]> = {};
    filteredServices.forEach((srv) => {
      const cat = srv.category?.trim() || 'Outros';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(srv);
    });
    return groups;
  }, [filteredServices]);

  const allAvailableCategories = useMemo(() => {
    return ['Todos', ...categoryList];
  }, [categoryList]);

  return (
    <div className="w-full h-full flex flex-col justify-start overflow-hidden relative">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-3.5 py-2 rounded bg-emerald-500 text-white font-bold text-xs shadow-lg animate-in fade-in flex items-center gap-1.5 whitespace-nowrap">
          <Check className="w-4 h-4 text-white stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOPO: BARRA DE AÇÃO E GESTÃO */}
      <div className={`p-3 border-b transition-colors shrink-0 space-y-2.5 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-xs font-black uppercase tracking-wider font-['Poppins'] flex items-center gap-1.5 text-emerald-400">
              <Scissors className="w-3.5 h-3.5 text-emerald-400" />
              <span>Categorias & Serviços</span>
            </h2>
            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} truncate`}>
              Gerencie até 5 fotos, 1 vídeo e escolha o modo de publicação do anúncio
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Botão Nova Categoria */}
            <button
              type="button"
              onClick={() => {
                hapticLight();
                setNewCategoryName('');
                setIsCategoryModalOpen(true);
              }}
              className={`px-2.5 py-1.5 rounded text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-emerald-500/30' 
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
              }`}
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ Categoria</span>
            </button>

            {/* Botão Novo Serviço */}
            <button
              type="button"
              onClick={() => handleOpenNew(selectedCategory)}
              className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] uppercase tracking-wider transition shadow-sm flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              <span>Novo Serviço</span>
            </button>
          </div>
        </div>

        {/* Busca Rápida */}
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por serviço ou categoria..."
            className={`w-full pl-8 pr-8 py-1.5 rounded text-xs border outline-hidden transition ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Chips de Categorias Roláveis */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {allAvailableCategories.map((cat) => {
            const count = cat === 'Todos' ? services.length : services.filter((s) => s.category?.toLowerCase() === cat.toLowerCase()).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  hapticLight();
                  setSelectedCategory(cat);
                }}
                className={`py-1 px-2.5 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                    : isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded-full ${
                  isSelected ? 'bg-emerald-600 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LISTA DE SERVIÇOS (ORGANIZADOS POR CATEGORIA MESTRE E SUBCATEGORIAS) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <Scissors className={`w-8 h-8 mx-auto ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
            <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Nenhum serviço encontrado em "{selectedCategory}"
            </p>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Cadastre novos serviços ou crie uma categoria exclusiva para este tipo de atendimento.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleOpenNew(selectedCategory)}
                className="px-3 py-1.5 rounded bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
              >
                + Adicionar Serviço
              </button>
            </div>
          </div>
        ) : (
          (Object.entries(groupedByCategory) as [string, CatalogServiceItem[]][]).map(([categoryName, catServices]) => (
            <div key={categoryName} className="space-y-2">
              {/* Header da Categoria Mestre */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-3.5 rounded-full bg-emerald-500 shadow-xs" />
                  <h3 className={`text-xs font-black uppercase tracking-wider font-['Poppins'] ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    {categoryName}
                  </h3>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                    isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {catServices.length} {catServices.length === 1 ? 'serviço' : 'serviços'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenNew(categoryName)}
                  className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-emerald-400" />
                  <span>Subcategoria</span>
                </button>
              </div>

              {/* Grid de Serviços (Subcategorias) */}
              <div className="grid grid-cols-1 gap-2">
                {catServices.map((srv) => {
                  const srvMode = srv.displayMode || (srv.mediaType === 'video' ? 'video' : 'static');
                  const photoCount = srv.photos?.length || (srv.image ? 1 : 0);
                  const isVideoMode = srvMode === 'video' && !!srv.videoUrl;
                  const isSlideshowMode = srvMode === 'slideshow';

                  return (
                    <div
                      key={srv.id}
                      className={`p-2.5 rounded transition flex items-center justify-between gap-3 border ${
                        isDark 
                          ? 'bg-slate-900/90 border-slate-800/90 hover:border-slate-700' 
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      {/* Miniatura do Anúncio (Vídeo, Slide ou Foto) */}
                      <div className="w-14 h-14 rounded overflow-hidden relative shrink-0 bg-slate-950 border border-slate-800">
                        {isVideoMode ? (
                          <>
                            <video
                              src={srv.videoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 right-1 px-1 py-0.2 rounded bg-slate-950/90 border border-emerald-500/40 text-emerald-400 text-[8px] font-black flex items-center gap-0.5 shadow-xs">
                              <Video className="w-2 h-2 text-emerald-400" />
                              <span>5s</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={srv.image || (srv.photos && srv.photos[0]) || INITIAL_SAVED_IMAGES[0].url}
                              alt={srv.title}
                              className="w-full h-full object-cover"
                            />
                            {isSlideshowMode && (
                              <div className="absolute top-1 right-1 px-1 py-0.2 rounded bg-slate-950/90 border border-emerald-500/40 text-emerald-400 text-[8px] font-black flex items-center gap-0.5 shadow-xs">
                                <Images className="w-2 h-2 text-emerald-400" />
                                <span>{photoCount}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Informações Centrais */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {srv.title}
                          </h4>
                          
                          {/* Badge do Modo de Publicação */}
                          {isVideoMode ? (
                            <span className="shrink-0 px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-extrabold flex items-center gap-0.5">
                              <Film className="w-2.5 h-2.5 text-emerald-400" />
                              <span>Vídeo 5s</span>
                            </span>
                          ) : isSlideshowMode ? (
                            <span className="shrink-0 px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-extrabold flex items-center gap-0.5">
                              <Images className="w-2.5 h-2.5 text-emerald-400" />
                              <span>Slide ({photoCount} fotos)</span>
                            </span>
                          ) : (
                            <span className="shrink-0 px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[9px] font-semibold flex items-center gap-0.5">
                              <ImageIcon className="w-2.5 h-2.5 text-slate-400" />
                              <span>Foto</span>
                            </span>
                          )}
                        </div>

                        {srv.description && (
                          <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} line-clamp-1`}>
                            {srv.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="font-black text-emerald-400 text-xs">
                            R$ {srv.price.toFixed(0)}
                          </span>
                          <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>•</span>
                          <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <Clock className="w-2.5 h-2.5 text-emerald-400" />
                            <span>{srv.duration}</span>
                          </span>
                        </div>
                      </div>

                      {/* Ações Rápidas: Editar / Excluir */}
                      <div className="flex items-center gap-1 shrink-0">
                        {deletingServiceId === srv.id ? (
                          <div className="flex items-center gap-1 animate-in fade-in">
                            <button
                              type="button"
                              onClick={() => handleDeleteService(srv.id)}
                              className="px-2 py-1 rounded bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                            >
                              Excluir
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingServiceId(null)}
                              className={`p-1 rounded text-[10px] cursor-pointer ${
                                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                hapticLight();
                                setPreviewService(srv);
                              }}
                              className={`w-7 h-7 rounded flex items-center justify-center transition cursor-pointer border ${
                                isDark 
                                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500' 
                                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-emerald-500'
                              }`}
                              title="Visualizar anúncio no portal"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(srv)}
                              className={`w-7 h-7 rounded flex items-center justify-center transition cursor-pointer border ${
                                isDark 
                                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500' 
                                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-emerald-500'
                              }`}
                              title="Editar serviço"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingServiceId(srv.id)}
                              className={`w-7 h-7 rounded flex items-center justify-center transition cursor-pointer border ${
                                isDark 
                                  ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/50' 
                                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300'
                              }`}
                              title="Excluir serviço"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: CRIAR NOVA CATEGORIA MESTRE */}
      {/* ============================================================ */}
      {isCategoryModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsCategoryModalOpen(false)}
        >
          <div 
            className={`w-full max-w-sm rounded-lg p-4 shadow-xl border ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-['Poppins']">
                  Nova Categoria de Serviço
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-3`}>
              As categorias organizam seu catálogo. Cada serviço cadastrado funcionará como uma subcategoria deste grupo.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateCategory();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ex: Coloração, Depilação, Podologia..."
                  className={`w-full px-3 py-2 rounded text-xs border outline-hidden ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider cursor-pointer border ${
                    isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newCategoryName.trim()}
                  className="flex-1 py-2 rounded bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                  <span>Criar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: CADASTRO / EDIÇÃO DE SERVIÇO COM FOTOS (ATÉ 5) E VÍDEO 5S */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className={`w-full max-w-md max-h-[92vh] rounded-lg flex flex-col overflow-hidden shadow-2xl border ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className={`px-4 py-3 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-['Poppins']">
                  {editingServiceId ? 'Editar Serviço' : 'Novo Serviço (Subcategoria)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulário com Scroll Suave */}
            <form onSubmit={handleSaveService} className="p-4 space-y-3.5 overflow-y-auto no-scrollbar flex-1">
              {/* Categoria Mestre com Criação Rápida */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Categoria Mestre *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      hapticLight();
                      setNewCategoryName('');
                      setIsCategoryModalOpen(true);
                    }}
                    className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer"
                  >
                    <FolderPlus className="w-3 h-3 text-emerald-400" />
                    <span>+ Nova Categoria</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-28 overflow-y-auto no-scrollbar p-0.5">
                  {categoryList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormCategory(cat)}
                      className={`py-1.5 px-2 rounded text-[11px] font-bold transition cursor-pointer text-center truncate ${
                        formCategory === cat
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : isDark
                          ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                          : 'bg-slate-100 border border-slate-200 text-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Título do Serviço (Subcategoria) */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Nome do Serviço (Subcategoria) *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Corte Degradê, Alinhamento de Fios, etc."
                  className={`w-full px-3 py-2 rounded text-xs border ${
                    isDark 
                      ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                  } outline-hidden`}
                />
              </div>

              {/* Preço e Duração */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Preço (R$) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400">
                      R$
                    </span>
                    <input
                      type="number"
                      required
                      min={0}
                      step={1}
                      value={formPrice}
                      onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                      className={`w-full pl-8 pr-3 py-2 rounded text-xs font-bold border ${
                        isDark 
                          ? 'bg-slate-900 border-slate-800 text-white focus:border-emerald-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                      } outline-hidden`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Duração Estimada *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="Ex: 35 min, 1h"
                    className={`w-full px-3 py-2 rounded text-xs border ${
                      isDark 
                        ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                    } outline-hidden`}
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Descrição dos Benefícios
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descreva a técnica, acabamento, produtos ou benefícios..."
                  className={`w-full px-3 py-2 rounded text-xs border resize-none ${
                    isDark 
                      ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                  } outline-hidden`}
                />
              </div>

              {/* ============================================================ */}
              {/* ESCOLHA DO MODO DE PUBLICAÇÃO DO ANÚNCIO (FOTO, SLIDE OU VÍDEO) */}
              {/* ============================================================ */}
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                {/* Inputs Ocultos de Câmera e Arquivos */}
                <input
                  type="file"
                  ref={cameraPhotoInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processAndSaveMediaFile(e.target.files[0], 'image', displayMode);
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={devicePhotoInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processAndSaveMediaFile(e.target.files[0], 'image', displayMode);
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={cameraVideoInputRef}
                  accept="video/*"
                  capture="environment"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processAndSaveMediaFile(e.target.files[0], 'video', 'video');
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={deviceVideoInputRef}
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processAndSaveMediaFile(e.target.files[0], 'video', 'video');
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />

                {/* Seletor dos 3 Modos de Anúncio */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Modo de Exibição do Anúncio</span>
                    </label>
                    <span className="text-[9px] text-emerald-400 font-semibold">Selecione o formato</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Opção 1: Foto Única */}
                    <button
                      type="button"
                      onClick={() => {
                        hapticLight();
                        setDisplayMode('static');
                      }}
                      className={`p-2 rounded text-left transition cursor-pointer border flex flex-col justify-between ${
                        displayMode === 'static'
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                          : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <ImageIcon className={`w-3.5 h-3.5 ${displayMode === 'static' ? 'text-white' : 'text-emerald-400'}`} />
                        {displayMode === 'static' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wide">Foto Única</p>
                        <p className={`text-[9px] ${displayMode === 'static' ? 'text-white' : 'text-slate-400'} line-clamp-1`}>
                          1 foto fixa
                        </p>
                      </div>
                    </button>

                    {/* Opção 2: Slide de Fotos */}
                    <button
                      type="button"
                      onClick={() => {
                        hapticLight();
                        setDisplayMode('slideshow');
                      }}
                      className={`p-2 rounded text-left transition cursor-pointer border flex flex-col justify-between ${
                        displayMode === 'slideshow'
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                          : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Images className={`w-3.5 h-3.5 ${displayMode === 'slideshow' ? 'text-white' : 'text-emerald-400'}`} />
                        {displayMode === 'slideshow' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wide">Slide de Fotos</p>
                        <p className={`text-[9px] ${displayMode === 'slideshow' ? 'text-white' : 'text-slate-400'} line-clamp-1`}>
                          Até 5 fotos
                        </p>
                      </div>
                    </button>

                    {/* Opção 3: Vídeo 5s */}
                    <button
                      type="button"
                      onClick={() => {
                        hapticLight();
                        setDisplayMode('video');
                      }}
                      className={`p-2 rounded text-left transition cursor-pointer border flex flex-col justify-between ${
                        displayMode === 'video'
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                          : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Video className={`w-3.5 h-3.5 ${displayMode === 'video' ? 'text-white' : 'text-emerald-400'}`} />
                        {displayMode === 'video' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wide">Vídeo 5s</p>
                        <p className={`text-[9px] ${displayMode === 'video' ? 'text-white' : 'text-slate-400'} line-clamp-1`}>
                          Loop contínuo
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* 1. MODO: FOTO ÚNICA (SELEÇÃO DIRETA DE 1 FOTO OU UPLOAD/CÂMERA) */}
                {/* ============================================================ */}
                {displayMode === 'static' && (
                  <div className="space-y-2.5">
                    {/* Grupo Unificado de Ações: Biblioteca, Do dispositivo, Capturar */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Foto do Anúncio</span>
                        </span>
                        <span className="text-[9px] text-slate-400">
                          Salva em <strong className="text-emerald-400 font-semibold">{formCategory}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        {/* 1. Biblioteca */}
                        <button
                          type="button"
                          onClick={() => {
                            hapticLight();
                            setMediaLibraryCategory(formCategory || 'Todas');
                            setIsMediaLibraryModalOpen(true);
                          }}
                          className={`py-2 px-1 rounded border font-bold text-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-98 ${
                            isDark
                              ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500 hover:text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-[10px] whitespace-nowrap">Biblioteca</span>
                        </button>

                        {/* 2. Do dispositivo */}
                        <button
                          type="button"
                          onClick={() => devicePhotoInputRef.current?.click()}
                          className={`py-2 px-1 rounded border font-bold text-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-98 ${
                            isDark
                              ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500 hover:text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-[10px] whitespace-nowrap">Do dispositivo</span>
                        </button>

                        {/* 3. Capturar */}
                        <button
                          type="button"
                          onClick={() => cameraPhotoInputRef.current?.click()}
                          className="py-2 px-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm active:scale-98"
                        >
                          <Camera className="w-3.5 h-3.5 text-white stroke-[2.5] shrink-0" />
                          <span className="text-[10px] text-white whitespace-nowrap">Capturar</span>
                        </button>
                      </div>
                    </div>

                    {/* Foto Selecionada Atualmente */}
                    <div className="flex items-center gap-2.5 p-2 rounded bg-slate-900/80 border border-emerald-500/40">
                      <div className="w-12 h-12 rounded overflow-hidden bg-slate-950 shrink-0 relative">
                        <img 
                          src={formPhotos[0] || INITIAL_SAVED_IMAGES[0].url} 
                          alt="Foto selecionada" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[8px] font-black uppercase">
                            Foto Ativa
                          </span>
                          <span className="text-[9px] text-slate-400 truncate">
                            Exibida no anúncio
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-white truncate mt-0.5">
                          {formTitle.trim() || 'Serviço sem título'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================ */}
                {/* 2. MODO: SLIDE DE FOTOS (ATÉ 5 FOTOS COM SELEÇÃO MULTIPLA) */}
                {/* ============================================================ */}
                {displayMode === 'slideshow' && (
                  <div className="space-y-2.5">
                    {/* Grupo Unificado de Ações: Biblioteca, Do dispositivo, Capturar */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <Images className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Fotos do Slide ({formPhotos.length}/5)</span>
                        </span>
                        <span className="text-[9px] text-slate-400">
                          Salva em <strong className="text-emerald-400 font-semibold">{formCategory}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        {/* 1. Biblioteca */}
                        <button
                          type="button"
                          onClick={() => {
                            hapticLight();
                            setMediaLibraryCategory(formCategory || 'Todas');
                            setIsMediaLibraryModalOpen(true);
                          }}
                          className={`py-2 px-1 rounded border font-bold text-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-98 ${
                            isDark
                              ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500 hover:text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Images className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-[10px] whitespace-nowrap">Biblioteca</span>
                        </button>

                        {/* 2. Do dispositivo */}
                        <button
                          type="button"
                          onClick={() => {
                            if (formPhotos.length >= 5) {
                              showToast('Limite de 5 fotos atingido no slide!');
                              return;
                            }
                            devicePhotoInputRef.current?.click();
                          }}
                          className={`py-2 px-1 rounded border font-bold text-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-98 ${
                            isDark
                              ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500 hover:text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-[10px] whitespace-nowrap">Do dispositivo</span>
                        </button>

                        {/* 3. Capturar */}
                        <button
                          type="button"
                          onClick={() => {
                            if (formPhotos.length >= 5) {
                              showToast('Limite de 5 fotos atingido no slide!');
                              return;
                            }
                            cameraPhotoInputRef.current?.click();
                          }}
                          className="py-2 px-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm active:scale-98"
                        >
                          <Camera className="w-3.5 h-3.5 text-white stroke-[2.5] shrink-0" />
                          <span className="text-[10px] text-white whitespace-nowrap">Capturar</span>
                        </button>
                      </div>
                    </div>

                    {/* Strip de Fotos Atuais do Slide (Ordem 1 a 5) */}
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Images className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                            Fotos no Slide ({formPhotos.length}/5)
                          </span>
                        </div>
                        <span className="text-[9px] text-emerald-400 font-semibold">
                          Alternam a cada 2.8s
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5">
                        {formPhotos.map((photoUrl, idx) => (
                          <div 
                            key={idx} 
                            className="aspect-square rounded relative overflow-hidden bg-slate-950 border border-slate-800 group"
                          >
                            <img src={photoUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                            
                            {/* Selo com número de ordem */}
                            <div className="absolute top-0.5 left-0.5 px-1 py-0.2 rounded bg-emerald-500 text-white text-[8px] font-black">
                              {idx === 0 ? '1 (Capa)' : `${idx + 1}`}
                            </div>

                            {/* Botão de Remover Foto */}
                            <button
                              type="button"
                              onClick={() => handleRemovePhotoFromSlide(idx)}
                              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/80 hover:bg-rose-600 text-white flex items-center justify-center transition cursor-pointer"
                              title="Remover do slide"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}

                        {/* Espaço Vazio para preencher */}
                        {formPhotos.length < 5 && (
                          <div
                            onClick={() => devicePhotoInputRef.current?.click()}
                            className="aspect-square rounded border border-dashed border-slate-700 hover:border-emerald-500/80 flex flex-col items-center justify-center gap-0.5 transition cursor-pointer text-slate-500 hover:text-emerald-400 bg-slate-950/40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="text-[8px] font-bold">+ Foto</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================ */}
                {/* 3. MODO: VÍDEO 5S (VÍDEO DA BIBLIOTECA OU GRAVADO NA HORA) */}
                {/* ============================================================ */}
                {displayMode === 'video' && (
                  <div className="space-y-2.5">
                    {/* Grupo Unificado de Ações: Biblioteca, Do dispositivo, Capturar */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Vídeo do Anúncio (5s)</span>
                        </span>
                        <span className="text-[9px] text-slate-400">
                          Salva em <strong className="text-emerald-400 font-semibold">{formCategory}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        {/* 1. Biblioteca */}
                        <button
                          type="button"
                          onClick={() => {
                            hapticLight();
                            setMediaLibraryCategory(formCategory || 'Todas');
                            setIsMediaLibraryModalOpen(true);
                          }}
                          className={`py-2 px-1 rounded border font-bold text-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-98 ${
                            isDark
                              ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500 hover:text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Film className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-[10px] whitespace-nowrap">Biblioteca</span>
                        </button>

                        {/* 2. Do dispositivo */}
                        <button
                          type="button"
                          onClick={() => deviceVideoInputRef.current?.click()}
                          className={`py-2 px-1 rounded border font-bold text-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-98 ${
                            isDark
                              ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500 hover:text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-[10px] whitespace-nowrap">Do dispositivo</span>
                        </button>

                        {/* 3. Capturar */}
                        <button
                          type="button"
                          onClick={() => cameraVideoInputRef.current?.click()}
                          className="py-2 px-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm active:scale-98"
                        >
                          <Video className="w-3.5 h-3.5 text-white stroke-[2.5] shrink-0" />
                          <span className="text-[10px] text-white whitespace-nowrap">Capturar</span>
                        </button>
                      </div>
                    </div>

                    {/* Alerta se vídeo for > 5s */}
                    {videoDurationWarning && (
                      <div className="flex items-center gap-1.5 p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        <span>{videoDurationWarning}</span>
                      </div>
                    )}

                    {/* Vídeo Selecionado no Anúncio (Preview com Loop) */}
                    <div className="w-full h-28 rounded overflow-hidden relative bg-slate-950 border border-slate-800">
                      <video
                        src={formVideoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-slate-950/90 border border-emerald-500/40 text-emerald-400 text-[8px] font-black flex items-center gap-1 shadow-sm">
                        <Video className="w-2.5 h-2.5 text-emerald-400" />
                        <span>VÍDEO ATIVO ({formVideoDuration}s)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ============================================================ */}
              {/* PRÉVIA AO VIVO DO ANÚNCIO (VITRINE PÚBLICA / PORTAL VAGOU) */}
              {/* ============================================================ */}
              <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                      Prévia do Anúncio (Portal & App)
                    </span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    Ao Vivo
                  </span>
                </div>

                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-2.5`}>
                  Exibição em tempo real na vitrine de serviços e no portal público do VagouApp.
                </p>

                <div className="w-full max-w-[240px] mx-auto">
                  <ServicePublicAdPreview
                    title={formTitle}
                    category={formCategory}
                    price={formPrice}
                    duration={formDuration}
                    displayMode={displayMode}
                    image={formPhotos[0] || INITIAL_SAVED_IMAGES[0].url}
                    photos={formPhotos}
                    videoUrl={formVideoUrl}
                    className="aspect-square w-full"
                  />
                </div>
              </div>

              {/* Botão de Salvar Fixo */}
              <div className="pt-2 sticky bottom-0 z-20">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-[#20C933] hover:bg-[#1bb32d] active:scale-98 text-white font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  <span>{editingServiceId ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR SERVIÇO'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: BIBLIOTECA DE MÍDIAS SALVAS (SELEÇÃO DEDICADA) */}
      {/* ============================================================ */}
      {isMediaLibraryModalOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsMediaLibraryModalOpen(false)}
        >
          <div 
            className={`w-full max-w-md max-h-[88vh] rounded-lg flex flex-col overflow-hidden shadow-2xl border ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal da Biblioteca */}
            <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  {displayMode === 'video' ? (
                    <Film className="w-4 h-4 text-emerald-400" />
                  ) : displayMode === 'slideshow' ? (
                    <Images className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold truncate">
                    {displayMode === 'video' 
                      ? 'Biblioteca de Vídeos Salvos' 
                      : displayMode === 'slideshow' 
                      ? `Fotos para o Slide (${formPhotos.length}/5)`
                      : 'Biblioteca de Fotos Salvas'}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate">
                    {displayMode === 'video'
                      ? 'Toque para selecionar o vídeo do anúncio'
                      : displayMode === 'slideshow'
                      ? 'Selecione até 5 fotos para o slide de fundo'
                      : 'Toque para definir a foto de capa'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaLibraryModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Barra de Filtros de Categoria da Biblioteca */}
            <div className={`px-4 py-2 border-b flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 ${
              isDark ? 'border-slate-800/80 bg-slate-950' : 'border-slate-100 bg-white'
            }`}>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 shrink-0 mr-1">
                Filtro:
              </span>
              {availableLibraryCategories.map((cat) => {
                const isActive = mediaLibraryCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      hapticLight();
                      setMediaLibraryCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : isDark
                        ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Ações Rápidas no Topo da Biblioteca (Tirar na hora ou Enviar) */}
            <div className="p-3 border-b border-slate-800/60 bg-slate-900/30 shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Adicionar nova à biblioteca
                </span>
                <span className="text-[9px] text-slate-400">
                  Salva em <strong className="text-emerald-400 font-semibold">{mediaLibraryCategory === 'Todas' ? formCategory : mediaLibraryCategory}</strong>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {displayMode === 'video' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => cameraVideoInputRef.current?.click()}
                      className="py-2 px-2.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                    >
                      <Video className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                      <span>Gravar Vídeo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deviceVideoInputRef.current?.click()}
                      className={`py-2 px-2.5 rounded border font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-emerald-500 hover:text-white'
                          : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Enviar do Aparelho</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (displayMode === 'slideshow' && formPhotos.length >= 5) {
                          showToast('Limite de 5 fotos atingido no slide!');
                          return;
                        }
                        cameraPhotoInputRef.current?.click();
                      }}
                      className="py-2 px-2.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                    >
                      <Camera className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                      <span>Tirar Foto na Hora</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (displayMode === 'slideshow' && formPhotos.length >= 5) {
                          showToast('Limite de 5 fotos atingido no slide!');
                          return;
                        }
                        devicePhotoInputRef.current?.click();
                      }}
                      className={`py-2 px-2.5 rounded border font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-emerald-500 hover:text-white'
                          : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Enviar do Aparelho</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Conteúdo com Scroll da Biblioteca */}
            <div className="p-4 overflow-y-auto no-scrollbar flex-1">
              {displayMode === 'video' ? (
                filteredSavedVideos.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">
                    <Film className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-xs font-bold">Nenhum vídeo nesta categoria</p>
                    <p className="text-[10px] text-slate-500 mt-1">Grave ou envie um vídeo pelo botão acima</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredSavedVideos.map((vid) => {
                      const isSelected = formVideoUrl === vid.url;
                      return (
                        <button
                          key={vid.id}
                          type="button"
                          onClick={() => {
                            hapticSuccess();
                            setFormVideoUrl(vid.url);
                            setFormVideoDuration(vid.duration || 5);
                            setVideoDurationWarning(null);
                            setIsMediaLibraryModalOpen(false);
                            showToast(`Vídeo selecionado para o anúncio!`);
                          }}
                          className={`p-2 rounded flex flex-col gap-1.5 border transition cursor-pointer text-left relative ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/40'
                              : isDark
                              ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                              : 'border-slate-200 bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <div className="w-full aspect-video rounded overflow-hidden bg-slate-950 relative">
                            <video src={vid.url} className="w-full h-full object-cover" muted />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Play className="w-4 h-4 text-white fill-white" />
                            </div>
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-white text-[8px] font-black">
                              {vid.duration || 5}s
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold truncate text-white">
                              {vid.title}
                            </p>
                            <span className="text-[9px] text-emerald-400 font-semibold block">
                              {vid.category}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                              <Check className="w-3 h-3 text-white stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )
              ) : (
                filteredSavedImages.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-xs font-bold">Nenhuma imagem nesta categoria</p>
                    <p className="text-[10px] text-slate-500 mt-1">Tire uma foto ou faça upload pelo botão acima</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {filteredSavedImages.map((item) => {
                      if (displayMode === 'static') {
                        const isSelected = formPhotos[0] === item.url;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              hapticSuccess();
                              setFormPhotos([item.url]);
                              setIsMediaLibraryModalOpen(false);
                              showToast(`Foto de capa selecionada!`);
                            }}
                            className={`aspect-square rounded overflow-hidden relative border transition cursor-pointer text-left ${
                              isSelected
                                ? 'ring-2 ring-emerald-500 border-transparent shadow-md'
                                : isDark
                                ? 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                                : 'border-slate-200 hover:border-slate-400 opacity-85 hover:opacity-100'
                            }`}
                          >
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 px-1 py-0.5 text-[8px] text-slate-300 font-semibold truncate">
                              {item.category}
                            </div>
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                                <Check className="w-3 h-3 text-white stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      } else {
                        // Modo Slideshow (Até 5 fotos)
                        const slideIndex = formPhotos.indexOf(item.url);
                        const isInSlide = slideIndex !== -1;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              if (isInSlide) {
                                handleRemovePhotoFromSlide(slideIndex);
                              } else {
                                if (formPhotos.length >= 5) {
                                  showToast('Máximo de 5 fotos no slide atingido!');
                                  return;
                                }
                                setFormPhotos((prev) => [...prev, item.url]);
                                hapticSuccess();
                                showToast(`Foto adicionada ao slide (${formPhotos.length + 1}/5)!`);
                              }
                            }}
                            className={`aspect-square rounded overflow-hidden relative border transition cursor-pointer text-left ${
                              isInSlide
                                ? 'ring-2 ring-emerald-500 border-transparent shadow-md'
                                : isDark
                                ? 'border-slate-800 hover:border-slate-600 opacity-75 hover:opacity-100'
                                : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                            }`}
                          >
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 px-1 py-0.5 text-[8px] text-slate-300 font-semibold truncate">
                              {item.category}
                            </div>
                            {isInSlide && (
                              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center shadow-md">
                                {slideIndex === 0 ? '1' : slideIndex + 1}
                              </div>
                            )}
                          </button>
                        );
                      }
                    })}
                  </div>
                )
              )}
            </div>

            {/* Rodapé Fixo da Biblioteca */}
            <div className={`p-3 border-t flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50'
            }`}>
              {displayMode === 'slideshow' ? (
                <>
                  <span className="text-[11px] font-bold text-slate-300">
                    {formPhotos.length}/5 fotos no slide
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      hapticSuccess();
                      setIsMediaLibraryModalOpen(false);
                    }}
                    className="py-2 px-4 rounded bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md flex items-center gap-1.5 active:scale-98"
                  >
                    <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                    <span>Concluir ({formPhotos.length}/5)</span>
                  </button>
                </>
              ) : (
                <>
                  <span className="text-[10px] text-slate-400">
                    Toque em uma mídia para selecioná-la
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMediaLibraryModalOpen(false)}
                    className={`py-1.5 px-3 rounded text-xs font-bold transition cursor-pointer border ${
                      isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Fechar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: PRÉVIA DEDICADA DO ANÚNCIO (PORTAL & MODO PÚBLICO) */}
      {/* ============================================================ */}
      {previewService && (
        <div 
          className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in"
          onClick={() => setPreviewService(null)}
        >
          <div 
            className={`w-full max-w-xs rounded-xl overflow-hidden shadow-2xl border flex flex-col ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className={`p-3 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold truncate font-['Poppins']">
                    Prévia do Anúncio
                  </h3>
                  <p className="text-[9px] text-slate-400 truncate">
                    Portal VagouApp • Modo Público
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewService(null)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conteúdo: Card com Proporção Idêntica à Vitrine */}
            <div className="p-4 flex flex-col items-center justify-center">
              <div className="w-full max-w-[250px]">
                <ServicePublicAdPreview
                  title={previewService.title}
                  category={previewService.category}
                  price={previewService.price}
                  duration={previewService.duration}
                  displayMode={previewService.displayMode || (previewService.mediaType === 'video' || previewService.videoUrl ? 'video' : 'static')}
                  image={previewService.image}
                  photos={previewService.photos}
                  videoUrl={previewService.videoUrl}
                  className="aspect-square w-full"
                />
              </div>

              {/* Informações Complementares */}
              {previewService.description && (
                <div className={`mt-3 w-full p-2.5 rounded border text-[11px] ${
                  isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <span className="font-bold text-[10px] text-emerald-400 uppercase tracking-wider block mb-0.5">
                    Descrição do Procedimento
                  </span>
                  <p className="line-clamp-3 leading-relaxed">{previewService.description}</p>
                </div>
              )}
            </div>

            {/* Rodapé com Ações */}
            <div className={`p-3 border-t flex items-center justify-between gap-2 shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <button
                type="button"
                onClick={() => setPreviewService(null)}
                className={`flex-1 py-2 rounded text-xs font-bold transition cursor-pointer border ${
                  isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  const srv = previewService;
                  setPreviewService(null);
                  handleOpenEdit(srv);
                }}
                className="flex-1 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
              >
                <Edit2 className="w-3.5 h-3.5 text-white" />
                <span>Editar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
