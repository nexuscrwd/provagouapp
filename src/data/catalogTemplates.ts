/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusinessNiche, TemplateStyle, SalonBranding } from '../types';

export interface CatalogServiceItem {
  id: string;
  title: string;
  category: string;
  duration_minutes: number;
  price: number;
  description: string;
  rules: string;
  image_url: string;
}

export interface TemplateDefinition {
  id: TemplateStyle;
  name: string;
  tagline: string;
  description: string;
  referenceNote: string;
  branding: SalonBranding;
  cardBackground: string;
  badgeClass: string;
  accentIcon: string;
}

export const TEMPLATE_DEFINITIONS: Record<TemplateStyle, TemplateDefinition> = {
  valyioo_chic: {
    id: 'valyioo_chic',
    name: 'Valyioo Chic & Minimalist',
    tagline: 'Design acolhedor, tons terracota & estética clean',
    description: 'Inspirado na referência de UX/UI Valyioo: cards brancos puros, botões de cantos suaves e navegação impecável em 5 abas.',
    referenceNote: 'Inspirado na Referência Oficial Valyioo UX/UI',
    branding: {
      logo_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80',
      primary_color: '#AF585C', // Terracota / Rosé Queimado de Valyioo
      secondary_color: '#332D2B',
      background_color: '#FAF7F6', // Off-white quente e acolhedor
      accent_color: '#E8C5BE',
      text_primary: '#1F1A18',
      text_muted: '#786F6B',
    },
    cardBackground: 'bg-white border-[#ECE4E1]',
    badgeClass: 'bg-[#AF585C]/15 text-[#AF585C] border-[#AF585C]/30',
    accentIcon: 'Sparkles',
  },
  dark_luxury: {
    id: 'dark_luxury',
    name: 'Atmosfera Dark Luxury',
    tagline: 'Elegância noturna com iluminação âmbar',
    description: 'Fundo preto aveludado, acabamentos em latão/ouro e iluminação intimista inspirada em clubes privativos.',
    referenceNote: 'Inspirado na Referência 1 (DesignNest/Luxury)',
    branding: {
      logo_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80',
      primary_color: '#D97706', // Âmbar rico
      secondary_color: '#1C1917', // Stone escuro
      background_color: '#0C0A09', // Preto aveludado
      accent_color: '#F59E0B',
      text_primary: '#FAFAF9',
      text_muted: '#A8A29E',
    },
    cardBackground: 'bg-stone-900/90 border-stone-800',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accentIcon: 'Sparkles',
  },
  organic_beige: {
    id: 'organic_beige',
    name: 'Organic Warm Beige',
    tagline: 'Tons terrosos, acolhimento & spa natural',
    description: 'Paleta areia e terracota suave, foco em bem-estar, natureza e agendamento limpo em calendário.',
    referenceNote: 'Inspirado na Referência 2 (Glow & Grace/Kamila)',
    branding: {
      logo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      primary_color: '#C27838', // Terracota aconchegante
      secondary_color: '#26221E', // Marrom café profundo
      background_color: '#141210', // Fundo aveludado orgânico
      accent_color: '#E09855',
      text_primary: '#FBF9F5',
      text_muted: '#B0A79E',
    },
    cardBackground: 'bg-[#1C1814] border-[#2E2822]',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    accentIcon: 'Heart',
  },
  rose_boutique: {
    id: 'rose_boutique',
    name: 'Rose Boutique Chic',
    tagline: 'Feminino premium, rosa blush e unhas de luxo',
    description: 'Estética cosmopolita com nuances rosa quartzo, atalhos circulares em 6 botões e cardápio de preços estruturado.',
    referenceNote: 'Inspirado na Referência 3 (Melanny Nails)',
    branding: {
      logo_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80',
      primary_color: '#E1708A', // Rosa quartzo vibrante
      secondary_color: '#24141A', // Vinho profundo
      background_color: '#12080D', // Fundo rosa noturno
      accent_color: '#F472B6',
      text_primary: '#FFF1F4',
      text_muted: '#C49CAE',
    },
    cardBackground: 'bg-[#201018] border-[#381C2A]',
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    accentIcon: 'Crown',
  },
  clean_editorial: {
    id: 'clean_editorial',
    name: 'Clean Editorial Minimalist',
    tagline: 'Alta costura, visagismo e linhas puras',
    description: 'Design de revista de moda europeia, fotos monumentais em tela cheia e tipografia de alto impacto.',
    referenceNote: 'Padrão Editorial & High Fashion',
    branding: {
      logo_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80',
      primary_color: '#E2E8F0', // Prata / Branco gelo de alto contraste
      secondary_color: '#1E293B',
      background_color: '#090D14',
      accent_color: '#94A3B8',
      text_primary: '#F8FAFC',
      text_muted: '#94A3B8',
    },
    cardBackground: 'bg-slate-900 border-slate-800',
    badgeClass: 'bg-slate-700/60 text-slate-200 border-slate-600',
    accentIcon: 'Scissors',
  },
  modern_tech: {
    id: 'modern_tech',
    name: 'Modern Vibrant Tech',
    tagline: 'Atendimento ágil, jovem e conectado',
    description: 'Visual tecnológico de alta performance com toques esmeralda elétrico, ideal para estúdios dinâmicos.',
    referenceNote: 'Padrão Fast-Booking & Tech',
    branding: {
      logo_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&auto=format&fit=crop&q=80',
      primary_color: '#10B981', // Esmeralda vibrante
      secondary_color: '#064E3B',
      background_color: '#05130E',
      accent_color: '#34D399',
      text_primary: '#ECFDF5',
      text_muted: '#6EE7B7',
    },
    cardBackground: 'bg-[#091F18] border-[#103D2E]',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    accentIcon: 'Zap',
  },
};

export const NICHE_CATALOG: Record<BusinessNiche, {
  name: string;
  icon: string;
  defaultTemplate: TemplateStyle;
  services: CatalogServiceItem[];
  defaultTeam: { name: string; role: string; avatar: string }[];
}> = {
  barbearia: {
    name: 'Barbearia & Grooming Masculino',
    icon: 'Scissors',
    defaultTemplate: 'dark_luxury',
    defaultTeam: [
      {
        name: 'Matheus "Navalha" Silva',
        role: 'Mestre Barbeiro',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Diego Barber',
        role: 'Especialista em Degradê',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Carlos Santos',
        role: 'Barboterapeuta',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      },
    ],
    services: [
      {
        id: 'srv-barb-01',
        title: 'Corte Degradê / Fade Completo',
        category: 'cabelo',
        duration_minutes: 40,
        price: 50.0,
        description: 'Fade milimétrico (Low, Mid ou High), navalhado ou tesoura, com lavagem refrescante e finalização com pomada matte.',
        rules: 'Tolerância de 10 min de atraso. Cabelo lavado no local.',
        image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-barb-02',
        title: 'Barboterapia Completa com Toalha Quente',
        category: 'barba',
        duration_minutes: 45,
        price: 45.0,
        description: 'Vapor de ozônio, óleos essenciais terapêuticos, toalha aromática aquecida, navalha descartável e pós-barba balsâmico.',
        rules: 'Avisar caso possua foliculite ou sensibilidade extrema.',
        image_url: 'https://images.unsplash.com/photo-1517832606589-7629c3395907?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-barb-03',
        title: 'Combo Cabelo + Barba Alinhada',
        category: 'cabelo',
        duration_minutes: 70,
        price: 85.0,
        description: 'Experiência completa com corte personalizado e desenho perfeito da barba com toalha quente.',
        rules: 'Economia de R$ 10 no combo.',
        image_url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-barb-04',
        title: 'Acabamento / Pezinho & Sobrancelha',
        category: 'cabelo',
        duration_minutes: 20,
        price: 25.0,
        description: 'Alinhamento com navalha afiada nos contornos do cabelo e limpeza rápida das sobrancelhas.',
        rules: 'Serviço expresso de manutenção.',
        image_url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-barb-05',
        title: 'Camuflagem de Fios Brancos na Barba',
        category: 'barba',
        duration_minutes: 30,
        price: 40.0,
        description: 'Pigmentação natural com tonalizante especial que disfarça falhas e rejuvenesce sem ficar artificial.',
        rules: 'Duração estimada de 15 a 20 dias.',
        image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop&q=80',
      },
    ],
  },
  salao_feminino: {
    name: 'Salão de Beleza & Cabelo Feminino',
    icon: 'Sparkles',
    defaultTemplate: 'clean_editorial',
    defaultTeam: [
      {
        name: 'Camila Hair Stylist',
        role: 'Master Colorista',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Juliana Visagista',
        role: 'Cortes & Terapia Capilar',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      },
    ],
    services: [
      {
        id: 'srv-hair-01',
        title: 'Corte Visagista + Lavagem Especial + Escova',
        category: 'cabelo',
        duration_minutes: 60,
        price: 120.0,
        description: 'Análise do formato do rosto, higienização com shampoo de tratamento, massagem capilar e escova modelada.',
        rules: 'Chegar com cabelo desembaraçado se possível.',
        image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-hair-02',
        title: 'Morena Iluminada / Mechas Suaves',
        category: 'cabelo',
        duration_minutes: 180,
        price: 350.0,
        description: 'Clareamento harmônico sem agredir a fibra capilar, tonalização personalizada e tratamento pós-química.',
        rules: 'Requer teste de mecha prévio em caso de coloração anterior.',
        image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-hair-03',
        title: 'Cronograma Nutritivo Kérastase Fusio-Dose',
        category: 'cabelo',
        duration_minutes: 45,
        price: 110.0,
        description: 'Tratamento sob medida com ampolas ultraconcentradas que restauram o brilho, maleabilidade e força.',
        rules: 'Inclui secagem rápida dos fios.',
        image_url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-hair-04',
        title: 'Botox Capilar Orgânico Antifrizz',
        category: 'cabelo',
        duration_minutes: 90,
        price: 160.0,
        description: 'Alinhamento das cutículas, eliminação do frizz e reposição de massa capilar com brilho espelhado.',
        rules: 'Sem formol, compatível com a maioria das químicas.',
        image_url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&auto=format&fit=crop&q=80',
      },
    ],
  },
  unhas: {
    name: 'Esmalteria & Nail Studio',
    icon: 'Heart',
    defaultTemplate: 'rose_boutique',
    defaultTeam: [
      {
        name: 'Melanny Silva',
        role: 'Master Nail Designer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Beatriz Nail Care',
        role: 'Especialista em Fibra & Gel',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      },
    ],
    services: [
      {
        id: 'srv-nail-01',
        title: 'Alongamento em Fibra de Vidro (Aplicação)',
        category: 'unhas',
        duration_minutes: 120,
        price: 160.0,
        description: 'Estrutura finíssima, natural e ultrarresistente com acabamento impecável no formato desejado (Almond, Bailarina, Quadrada).',
        rules: 'Chegar sem esmalte comum se possível.',
        image_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-nail-02',
        title: 'Manutenção de Fibra de Vidro / Gel',
        category: 'unhas',
        duration_minutes: 90,
        price: 95.0,
        description: 'Nivelamento da raiz, reposição de estrutura, nova cutilagem russa e esmaltação duradoura.',
        rules: 'Válido para unhas com até 25 dias desde a última aplicação.',
        image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-nail-03',
        title: 'Esmaltação em Gel (Secagem em Cabine LED)',
        category: 'unhas',
        duration_minutes: 45,
        price: 65.0,
        description: 'Unhas secas na hora, brilho intenso que dura de 15 a 21 dias sem lascar nem perder o brilho.',
        rules: 'Não sai com acetona comum.',
        image_url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-nail-04',
        title: 'Spa dos Pés + Pedicure Tradicional',
        category: 'unhas',
        duration_minutes: 50,
        price: 70.0,
        description: 'Esfoliação com sais marinhos, hidratação profunda em parafina morna, cutilagem e esmaltação perfeita.',
        rules: 'Ideal para alívio do cansaço e calosidades.',
        image_url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&auto=format&fit=crop&q=80',
      },
    ],
  },
  cilios_sobrancelhas: {
    name: 'Lash & Brow Studio (Cílios & Sobrancelhas)',
    icon: 'Eye',
    defaultTemplate: 'organic_beige',
    defaultTeam: [
      {
        name: 'Kamila Holloway',
        role: 'Lash Designer Master',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Fernanda Brow',
        role: 'Visagista de Olhar',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
    ],
    services: [
      {
        id: 'srv-lash-01',
        title: 'Extensão de Cílios Volume Brasileiro',
        category: 'beleza',
        duration_minutes: 120,
        price: 150.0,
        description: 'Fios em formato Y que garantem preenchimento marcante, leveza e retenção prolongada.',
        rules: 'Não molhar por 24h e não utilizar produtos oleosos.',
        image_url: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-lash-02',
        title: 'Lash Lifting com Coloração & Queratina',
        category: 'beleza',
        duration_minutes: 50,
        price: 100.0,
        description: 'Curvatura e efeito rímel nos próprios cílios naturais sem necessidade de extensões coladas.',
        rules: 'Duração média de 6 a 8 semanas.',
        image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-lash-03',
        title: 'Design Personalizado com Henna Premium',
        category: 'beleza',
        duration_minutes: 40,
        price: 55.0,
        description: 'Mapeamento facial que realça o formato dos seus olhos, finalizado com henna de alta fixação degradê.',
        rules: 'Fórmula hipoalergênica.',
        image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-lash-04',
        title: 'Brow Lamination (Alinhamento de Fios Selvagens)',
        category: 'beleza',
        duration_minutes: 50,
        price: 120.0,
        description: 'Tendência mundial que doma fios rebeldes, dando aspecto volumoso, alinhado e moderno às sobrancelhas.',
        rules: 'Inclui nutrição com óleos essenciais.',
        image_url: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=500&auto=format&fit=crop&q=80',
      },
    ],
  },
  estetica_spa: {
    name: 'Estética Facial, Corporal & Spa',
    icon: 'Sparkles',
    defaultTemplate: 'organic_beige',
    defaultTeam: [
      {
        name: 'Dra. Vanessa Costa',
        role: 'Fisioterapeuta Dermato-Funcional',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      },
    ],
    services: [
      {
        id: 'srv-spa-01',
        title: 'Limpeza de Pele Profunda com Extração & LED',
        category: 'estetica',
        duration_minutes: 75,
        price: 130.0,
        description: 'Remoção minuciosa de cravos e impurezas, alta frequência antibacteriana e fototerapia com LED calmante.',
        rules: 'Evitar exposição solar direta por 48 horas.',
        image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-spa-02',
        title: 'Massagem Relaxante com Aromaterapia',
        category: 'estetica',
        duration_minutes: 50,
        price: 95.0,
        description: 'Manobras suaves com óleos aquecidos de lavanda que aliviam tensões musculares, estresse e ansiedade.',
        rules: 'Ambiente climatizado e som ambiente relaxante.',
        image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-spa-03',
        title: 'Drenagem Linfática Método Exclusivo',
        category: 'estetica',
        duration_minutes: 50,
        price: 90.0,
        description: 'Estímulo ao sistema linfático para redução de retenção de líquidos, desinchaço corporal e alívio de peso.',
        rules: 'Recomenda-se ingestão de água após o procedimento.',
        image_url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=500&auto=format&fit=crop&q=80',
      },
    ],
  },
  unissex: {
    name: 'Salão Completo & Unissex',
    icon: 'Crown',
    defaultTemplate: 'modern_tech',
    defaultTeam: [
      {
        name: 'Alexandre Prado',
        role: 'Diretor Criativo',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Natália Rezende',
        role: 'Cabeleireira & Visagista',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
    ],
    services: [
      {
        id: 'srv-uni-01',
        title: 'Corte de Cabelo (Masculino ou Feminino)',
        category: 'cabelo',
        duration_minutes: 45,
        price: 60.0,
        description: 'Corte moderno personalizado com lavagem e styling de acabamento.',
        rules: 'Todos os tipos de cabelo.',
        image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-uni-02',
        title: 'Lavagem Especial com Massagem Craniana',
        category: 'cabelo',
        duration_minutes: 25,
        price: 35.0,
        description: 'Higienização profunda com tônico revigorante e massagem relaxante no couro cabeludo.',
        rules: 'Procedimento calmante e estimulante do crescimento.',
        image_url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'srv-uni-03',
        title: 'Manicure Express',
        category: 'unhas',
        duration_minutes: 30,
        price: 30.0,
        description: 'Cutilagem rápida, lixamento e base fortalecedora ou esmaltação clássica.',
        rules: 'Sem esmaltação em gel.',
        image_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&auto=format&fit=crop&q=80',
      },
    ],
  },
};
