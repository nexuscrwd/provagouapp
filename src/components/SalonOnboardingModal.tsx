/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Store,
  Palette,
  Layers,
  Sparkles,
  Scissors,
  Eye,
  Heart,
  Crown,
  Zap,
  Plus,
  Trash2,
  Upload,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { BusinessNiche, TargetAudience, TemplateStyle, SalonBranding } from '../types';
import { NICHE_CATALOG, TEMPLATE_DEFINITIONS, CatalogServiceItem } from '../data/catalogTemplates';
import { useEcosystem, NewSalonOnboardingData } from '../context/EcosystemContext';

const COLOR_PRESETS: { name: string; branding: SalonBranding }[] = [
  {
    name: 'Dark Amber Luxury',
    branding: {
      logo_url: '',
      primary_color: '#D97706',
      secondary_color: '#1C1917',
      background_color: '#0C0A09',
      accent_color: '#F59E0B',
      text_primary: '#FAFAF9',
      text_muted: '#A8A29E',
    },
  },
  {
    name: 'Rose Quartzo Boutique',
    branding: {
      logo_url: '',
      primary_color: '#E1708A',
      secondary_color: '#24141A',
      background_color: '#12080D',
      accent_color: '#F472B6',
      text_primary: '#FFF1F4',
      text_muted: '#C49CAE',
    },
  },
  {
    name: 'Organic Warm Beige',
    branding: {
      logo_url: '',
      primary_color: '#C27838',
      secondary_color: '#26221E',
      background_color: '#141210',
      accent_color: '#E09855',
      text_primary: '#FBF9F5',
      text_muted: '#B0A79E',
    },
  },
  {
    name: 'Emerald Spa & Glow',
    branding: {
      logo_url: '',
      primary_color: '#10B981',
      secondary_color: '#064E3B',
      background_color: '#05130E',
      accent_color: '#34D399',
      text_primary: '#ECFDF5',
      text_muted: '#6EE7B7',
    },
  },
  {
    name: 'Midnight Editorial P&B',
    branding: {
      logo_url: '',
      primary_color: '#F8FAFC',
      secondary_color: '#1E293B',
      background_color: '#090D14',
      accent_color: '#94A3B8',
      text_primary: '#FFFFFF',
      text_muted: '#94A3B8',
    },
  },
];

interface ServiceItemState {
  enabled: boolean;
  title: string;
  category: string;
  duration_minutes: number;
  price: number;
  description?: string;
  rules?: string;
  image_url?: string;
}

export const SalonOnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, createSalonFromOnboarding } = useEcosystem();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Basic Info
  const [salonName, setSalonName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [phoneLandline, setPhoneLandline] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('São Paulo - SP');

  // Step 2: Visual Identity
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80');
  const [branding, setBranding] = useState<SalonBranding>(COLOR_PRESETS[0].branding);

  // Step 3: Niche & Audience
  const [niche, setNiche] = useState<BusinessNiche>('barbearia');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('adulto');

  // Step 4: Services
  const [selectedServices, setSelectedServices] = useState<Record<string, ServiceItemState>>(() => {
    const initial: Record<string, ServiceItemState> = {};
    NICHE_CATALOG.barbearia.services.forEach((s) => {
      initial[s.id] = {
        enabled: true,
        title: s.title,
        category: s.category,
        duration_minutes: s.duration_minutes,
        price: s.price,
        description: s.description,
        rules: s.rules,
        image_url: s.image_url,
      };
    });
    return initial;
  });

  const [customServices, setCustomServices] = useState<Array<{
    id: string;
    title: string;
    category: string;
    duration_minutes: number;
    price: number;
    description: string;
    rules: string;
  }>>([]);

  const [showAddCustomForm, setShowAddCustomForm] = useState(false);
  const [newSrvTitle, setNewSrvTitle] = useState('');
  const [newSrvDuration, setNewSrvDuration] = useState(30);
  const [newSrvPrice, setNewSrvPrice] = useState(50);
  const [newSrvDesc, setNewSrvDesc] = useState('');

  // Step 5: Template
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('dark_luxury');

  if (!isOnboardingOpen) return null;

  // Handle Niche change and populate default services
  const handleSelectNiche = (newNiche: BusinessNiche) => {
    setNiche(newNiche);
    const catalog = NICHE_CATALOG[newNiche];
    setSelectedTemplate(catalog.defaultTemplate);

    // Update branding to match default template
    const defTemplate = TEMPLATE_DEFINITIONS[catalog.defaultTemplate];
    setBranding(defTemplate.branding);
    setLogoUrl(defTemplate.branding.logo_url);

    // Populate services
    const nextServices: Record<string, ServiceItemState> = {};
    catalog.services.forEach((s) => {
      nextServices[s.id] = {
        enabled: true,
        title: s.title,
        category: s.category,
        duration_minutes: s.duration_minutes,
        price: s.price,
        description: s.description,
        rules: s.rules,
        image_url: s.image_url,
      };
    });
    setSelectedServices(nextServices);
  };

  const handleAddCustomService = () => {
    if (!newSrvTitle.trim()) return;
    const customId = `custom-${Date.now()}`;
    const newService = {
      id: customId,
      title: newSrvTitle.trim(),
      category: 'cabelo',
      duration_minutes: Number(newSrvDuration) || 30,
      price: Number(newSrvPrice) || 0,
      description: newSrvDesc.trim(),
      rules: 'Agendamento com antecedência mínima de 1h.',
    };
    setCustomServices((prev) => [...prev, newService]);
    setNewSrvTitle('');
    setNewSrvDesc('');
    setShowAddCustomForm(false);
  };

  const handleFinishOnboarding = () => {
    if (!salonName.trim()) {
      alert('Por favor, informe o Nome do Estabelecimento.');
      setStep(1);
      return;
    }

    // Collect all active services
    const finalServices: Array<{
      title: string;
      category: string;
      duration_minutes: number;
      price: number;
      description?: string;
      rules?: string;
      image_url?: string;
    }> = [];

    (Object.values(selectedServices) as ServiceItemState[]).forEach((s) => {
      if (s.enabled) {
        finalServices.push({
          title: s.title,
          category: s.category,
          duration_minutes: s.duration_minutes,
          price: s.price,
          description: s.description,
          rules: s.rules,
          image_url: s.image_url,
        });
      }
    });

    customServices.forEach((c) => {
      finalServices.push({
        title: c.title,
        category: c.category,
        duration_minutes: c.duration_minutes,
        price: c.price,
        description: c.description,
        rules: c.rules,
      });
    });

    const payload: NewSalonOnboardingData = {
      name: salonName.trim(),
      owner_name: ownerName.trim() || 'Gestor Responsável',
      owner_email: ownerEmail.trim() || 'contato@salao.com.br',
      phone_whatsapp: phoneWhatsapp.trim() || '(11) 98765-4321',
      phone_landline: phoneLandline.trim() || undefined,
      address: address.trim() || 'Rua Principal, 100',
      neighborhood: neighborhood.trim() || 'Centro',
      city: city.trim() || 'São Paulo - SP',
      niche,
      target_audience: targetAudience,
      template_id: selectedTemplate,
      branding: {
        ...branding,
        logo_url: logoUrl,
      },
      services: finalServices.length > 0 ? finalServices : [
        {
          title: 'Atendimento Personalizado',
          category: 'cabelo',
          duration_minutes: 30,
          price: 50,
          description: 'Serviço sob medida para você.',
        },
      ],
    };

    createSalonFromOnboarding(payload);
  };

  return (
    <div
      id="modal-salon-onboarding-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        id="modal-salon-onboarding-card"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200"
      >
        {/* Top Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Cadastrar Novo Estabelecimento
              </h2>
              <p className="text-[11px] text-slate-400">
                Passo {step} de 5 — {
                  step === 1 ? 'Dados Básicos' :
                  step === 2 ? 'Identidade Visual' :
                  step === 3 ? 'Segmento & Público' :
                  step === 4 ? 'Serviços Plug & Play' : 'Template & Ativação'
                }
              </p>
            </div>
          </div>
          <button
            id="btn-close-onboarding"
            onClick={() => setIsOnboardingOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="h-1 w-full bg-slate-800 flex shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-full flex-1 transition-all duration-300 ${
                s <= step ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-200">
          {/* ================= STEP 1: DADOS BÁSICOS ================= */}
          {step === 1 && (
            <div className="space-y-3.5">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-xs text-slate-300">
                Cadastre os dados do salão para disponibilizar o app próprio em minutos.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome do Estabelecimento *
                </label>
                <input
                  id="input-onboarding-name"
                  type="text"
                  placeholder="Ex: Imperial Barber Club, Studio Rose..."
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome do Proprietário
                  </label>
                  <input
                    id="input-onboarding-owner"
                    type="text"
                    placeholder="Ex: Carlos Silva"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp Comercial *
                  </label>
                  <input
                    id="input-onboarding-whatsapp"
                    type="text"
                    placeholder="(11) 98765-4321"
                    value={phoneWhatsapp}
                    onChange={(e) => setPhoneWhatsapp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Telefone Fixo
                  </label>
                  <input
                    id="input-onboarding-landline"
                    type="text"
                    placeholder="(11) 3255-0012"
                    value={phoneLandline}
                    onChange={(e) => setPhoneLandline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    E-mail / Gmail
                  </label>
                  <input
                    id="input-onboarding-email"
                    type="email"
                    placeholder="contato@empresa.com"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Endereço Completo
                </label>
                <input
                  id="input-onboarding-address"
                  type="text"
                  placeholder="Rua, número e complemento"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bairro
                  </label>
                  <input
                    id="input-onboarding-neighborhood"
                    type="text"
                    placeholder="Bairro"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cidade - UF
                  </label>
                  <input
                    id="input-onboarding-city"
                    type="text"
                    placeholder="Cidade - UF"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: IDENTIDADE VISUAL ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Logotipo do Estabelecimento
                </label>
                <div className="flex items-center gap-3.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <img
                    src={logoUrl || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150'}
                    alt="Logo preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/50 shadow-md shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {salonName || 'App do Estabelecimento'}
                    </p>
                    <p className="text-[11px] text-slate-400 mb-2">
                      Pré-visualização do ícone oficial
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const urls = [
                            'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80',
                            'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80',
                            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80',
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
                          ];
                          const next = urls[(urls.indexOf(logoUrl) + 1) % urls.length];
                          setLogoUrl(next);
                        }}
                        className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        Alternar Exemplo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Paleta de Cores em 1 Toque
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = branding.primary_color === preset.branding.primary_color;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setBranding(preset.branding)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                          isSelected
                            ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center -space-x-1.5">
                            <span
                              className="w-5 h-5 rounded-full border border-slate-800 shadow"
                              style={{ backgroundColor: preset.branding.primary_color }}
                            />
                            <span
                              className="w-5 h-5 rounded-full border border-slate-800 shadow"
                              style={{ backgroundColor: preset.branding.accent_color }}
                            />
                            <span
                              className="w-5 h-5 rounded-full border border-slate-800 shadow"
                              style={{ backgroundColor: preset.branding.background_color }}
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{preset.name}</p>
                            <p className="text-[10px] text-slate-400">Tom primário: {preset.branding.primary_color}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hex Customizer */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-emerald-400" />
                  Ajuste Fino de Cor
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.primary_color}
                    onChange={(e) =>
                      setBranding((prev) => ({
                        ...prev,
                        primary_color: e.target.value,
                        accent_color: e.target.value,
                      }))
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={branding.primary_color}
                    onChange={(e) =>
                      setBranding((prev) => ({
                        ...prev,
                        primary_color: e.target.value,
                        accent_color: e.target.value,
                      }))
                    }
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: NICHO & PÚBLICO ================= */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Qual é o segmento principal do estabelecimento?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'barbearia', label: 'Barbearia Masculina', icon: Scissors },
                      { id: 'salao_feminino', label: 'Cabelo Feminino', icon: Sparkles },
                      { id: 'unhas', label: 'Esmalteria & Unhas', icon: Heart },
                      { id: 'cilios_sobrancelhas', label: 'Lash & Sobrancelhas', icon: Eye },
                      { id: 'estetica_spa', label: 'Estética & Spa', icon: Crown },
                      { id: 'unissex', label: 'Salão Completo Misto', icon: Zap },
                    ] as const
                  ).map((item) => {
                    const isSelected = niche === item.id;
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectNiche(item.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-white leading-tight">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Público Atendido
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'adulto', label: 'Adulto' },
                    { id: 'infantil', label: 'Infantil (Kids)' },
                    { id: 'adulto_infantil', label: 'Adulto & Kids' },
                  ].map((aud) => {
                    const isSelected = targetAudience === aud.id;
                    return (
                      <button
                        key={aud.id}
                        type="button"
                        onClick={() => setTargetAudience(aud.id as TargetAudience)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {aud.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: SERVIÇOS PLUG & PLAY ================= */}
          {step === 4 && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Serviços Pré-Configurados</p>
                  <p className="text-[11px] text-slate-400">
                    Ajuste os valores e tempos médios conforme sua tabela.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddCustomForm((prev) => !prev)}
                  className="px-2.5 py-1 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar Outro
                </button>
              </div>

              {showAddCustomForm && (
                <div className="p-3 bg-slate-950 border border-emerald-500/40 rounded-xl space-y-2.5">
                  <p className="text-xs font-bold text-emerald-400">Novo Serviço Personalizado</p>
                  <input
                    type="text"
                    placeholder="Nome do serviço (ex: Selagem Premium)"
                    value={newSrvTitle}
                    onChange={(e) => setNewSrvTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Duração (min)"
                      value={newSrvDuration}
                      onChange={(e) => setNewSrvDuration(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="number"
                      placeholder="Preço (R$)"
                      value={newSrvPrice}
                      onChange={(e) => setNewSrvPrice(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Descrição rápida (opcional)"
                    value={newSrvDesc}
                    onChange={(e) => setNewSrvDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomService}
                    className="w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Salvar Serviço
                  </button>
                </div>
              )}

              {/* Services List */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {(Object.entries(selectedServices) as [string, ServiceItemState][]).map(([id, srv]) => (
                  <div
                    key={id}
                    className={`p-3 rounded-xl border transition-all ${
                      srv.enabled
                        ? 'bg-slate-800/80 border-slate-700'
                        : 'bg-slate-950/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={srv.enabled}
                        onChange={(e) =>
                          setSelectedServices((prev) => ({
                            ...prev,
                            [id]: { ...prev[id], enabled: e.target.checked },
                          }))
                        }
                        className="mt-1 w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
                      />
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) =>
                            setSelectedServices((prev) => ({
                              ...prev,
                              [id]: { ...prev[id], title: e.target.value },
                            }))
                          }
                          className="w-full bg-transparent font-bold text-xs text-white focus:outline-none focus:border-b border-emerald-500"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
                            <span className="text-slate-400">Tempo:</span>
                            <input
                              type="number"
                              value={srv.duration_minutes}
                              onChange={(e) =>
                                setSelectedServices((prev) => ({
                                  ...prev,
                                  [id]: { ...prev[id], duration_minutes: Number(e.target.value) },
                                }))
                              }
                              className="w-10 bg-transparent text-white font-semibold text-center focus:outline-none"
                            />
                            <span className="text-slate-400">m</span>
                          </div>

                          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
                            <span className="text-slate-400">R$</span>
                            <input
                              type="number"
                              value={srv.price}
                              onChange={(e) =>
                                setSelectedServices((prev) => ({
                                  ...prev,
                                  [id]: { ...prev[id], price: Number(e.target.value) },
                                }))
                              }
                              className="w-12 bg-transparent text-emerald-400 font-bold text-center focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Custom Services Added */}
                {customServices.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border bg-slate-800/80 border-emerald-500/30 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{c.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {c.duration_minutes} min • R$ {c.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCustomServices((prev) => prev.filter((item) => item.id !== c.id))}
                      className="p-1.5 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 5: ESCOLHA DO TEMPLATE ================= */}
          {step === 5 && (
            <div className="space-y-3.5">
              <div>
                <p className="text-xs font-bold text-white">Escolha o Modelo de Template</p>
                <p className="text-[11px] text-slate-400">
                  Baseado nas referências visuais para encantar seus clientes.
                </p>
              </div>

              <div className="space-y-2.5">
                {(Object.values(TEMPLATE_DEFINITIONS) as typeof TEMPLATE_DEFINITIONS[TemplateStyle][]).map((tpl) => {
                  const isSelected = selectedTemplate === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplate(tpl.id);
                        setBranding(tpl.branding);
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-500 shadow-lg ring-1 ring-emerald-500'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{tpl.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${tpl.badgeClass}`}>
                              {tpl.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                            {tpl.tagline}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {tpl.referenceNote}
                          </p>
                        </div>
                        <div
                          className="w-5 h-5 rounded-full border border-slate-700 shrink-0"
                          style={{ backgroundColor: tpl.branding.primary_color }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Summary Box */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1.5">
                <p className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Pronto para Disponibilizar!
                </p>
                <p className="text-[11px] text-slate-300">
                  Ao concluir, o aplicativo do salão será configurado com o template{' '}
                  <strong className="text-white">{TEMPLATE_DEFINITIONS[selectedTemplate]?.name}</strong>, equipe inicial e os serviços selecionados.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              id="btn-onboarding-back"
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          ) : (
            <button
              id="btn-onboarding-cancel"
              type="button"
              onClick={() => setIsOnboardingOpen(false)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-medium"
            >
              Cancelar
            </button>
          )}

          {step < 5 ? (
            <button
              id="btn-onboarding-next"
              type="button"
              onClick={() => {
                if (step === 1 && !salonName.trim()) {
                  alert('Informe o Nome do Estabelecimento para prosseguir.');
                  return;
                }
                setStep((prev) => (prev + 1) as any);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-onboarding-finish"
              type="button"
              onClick={handleFinishOnboarding}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg active:scale-95"
            >
              <Check className="w-4 h-4" />
              Publicar App Oficial
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
