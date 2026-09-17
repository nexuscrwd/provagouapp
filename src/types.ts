export interface ServiceOffer {
  id: string;
  salonName: string;
  salonLogo?: string;
  professionalName: string;
  professionalAvatar?: string;
  serviceTitle: string;
  serviceCategory: 'cabelo' | 'barba' | 'unhas' | 'beleza' | 'estetica';
  price: number;
  originalPrice?: number;
  rating: number;
  ratingCount: number;
  distance: string;
  distanceMeters?: number;
  neighborhood: string;
  timeSlot: string;
  dayLabel: string;
  duration: string;
  imageUrl: string;
  lat: number;
  lng: number;
  featured?: boolean;

  // Extensões de mídia e urgência
  mediaLevel?: 1 | 2 | 3;
  videoUrl?: string;
  galleryImages?: string[];
  expiresInMinutes?: number;
  expiresTimestamp?: number;
  activeViewers?: number;
  isFlashDeal?: boolean;
  isRecurring?: boolean;
  recurringCount?: number;
  brandColor?: string;
  brandGradient?: string;
  categoryIconKey?: 'cabelo' | 'barba' | 'unhas' | 'sobrancelha' | 'estetica' | 'beleza';
  description?: string;
}

export interface BookingAppointment {
  id?: string;
  protocolCode: string;
  service?: string;
  serviceTitle?: string;
  professional?: string;
  professionalName?: string;
  salonName: string;
  dateTime: string;
  dayGroup?: string;
  time?: string;
  duration?: string;
  totalPrice: number;
  status: 'EM ANDAMENTO' | 'CONFIRMADO' | 'AGENDADO' | 'CONCLUÍDO' | 'CANCELADO' | 'PENDENTE' | 'ALTERADO' | 'concluido' | 'confirmado' | 'cancelado' | 'agendado' | 'em andamento' | 'pendente' | 'alterado' | string;
  address?: string;
  qrCodeMock?: string;
  customerName?: string;
  clientName?: string;
  customerPhone?: string;
  clientPhone?: string;
  customerEmail?: string;
  dateIso?: string;
  createdAt?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string;
}

export interface SalonAdminSettings {
  salonName: string;
  salonPhone: string;
  salonAddress: string;
  openingHours: string;
  isOpenNow: boolean;
  pinCode: string;
}

export interface ServiceCategoryItem {
  id: string;
  name: string;
  description?: string;
  iconKey?: string;
  color?: string;
  sortOrder?: number;
  isCustom?: boolean;
}

export interface SalonProfessionalItem {
  id?: string;
  name: string;
  role?: string;
  avatar?: string;
  avatarUrl?: string;
  rating?: number;
}

export interface CatalogServiceItem {
  id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
  category: string;
  categoryId?: string;
  image?: string;
  photos?: string[];
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  videoDurationSeconds?: number;
  displayMode?: 'static' | 'slideshow' | 'video';
  aspectRatio?: string;
  professionalId?: string; // Multi-tenant RBAC: vincula o serviço a um profissional específico
}

export type ProfessionalRole = 'admin' | 'professional' | 'receptionist';

export interface ProfessionalTeamMember {
  id: string;
  name: string;
  role: ProfessionalRole;
  avatarUrl?: string;
  phone?: string;
  specialties: string[];
  isActive: boolean;
  joinedAt: string;
}

// Utilitários de feedback tátil e fallbacks determinísticos
export const hapticLight = () => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(10); } catch {}
  }
};

export const hapticMedium = () => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(25); } catch {}
  }
};

export const hapticSuccess = () => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate([15, 50, 20]); } catch {}
  }
};

export const getSalonLogo = (_salonName?: string, logoUrl?: string): string => {
  if (logoUrl) return logoUrl;
  return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=200&q=80';
};


