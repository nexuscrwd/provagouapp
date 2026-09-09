/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Check,
  CheckCircle2,
  X,
  User,
  Scissors,
  CalendarDays,
  CalendarCheck,
  CalendarPlus,
  Home,
  Bell,
  MessageSquare,
  Sparkles,
  Phone,
  Zap,
  Star,
  Share2,
} from 'lucide-react';
import { useEcosystem } from '../context/EcosystemContext';
import { SalonService, Professional } from '../types';

export const ClientAppView: React.FC = () => {
  const {
    activeSalon,
    salonServices,
    professionals,
    bookAppointmentFromClient,
    toggleViewMode,
  } = useEcosystem();

  // Cores da identidade visual inspirada em Valyioo
  const primaryColor = activeSalon.branding.primary_color || '#AF585C';
  const bgColor = '#FAF7F6';

  // Abas de navegação do cliente: 'inicio' | 'reservar' | 'servicos' | 'agenda' | 'perfil'
  const [activeTab, setActiveTab] = useState<'inicio' | 'reservar' | 'servicos' | 'agenda' | 'perfil'>('inicio');

  // Modais auxiliares acionados pelos atalhos
  const [isStylistsModalOpen, setIsStylistsModalOpen] = useState(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);

  // Fluxo de Agendamento (Modal e Etapas)
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1); // 1: Serviço, 2: Especialista, 3: Data/Hora, 4: Confirmação
  const [selectedService, setSelectedService] = useState<SalonService | null>(null);
  const [selectedProf, setSelectedProf] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('11:00');
  const [clientName, setClientName] = useState<string>('Valentina Rossi');
  const [clientPhone, setClientPhone] = useState<string>('(11) 98877-6655');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [confirmedProtocol, setConfirmedProtocol] = useState<string | null>(null);

  // Horários disponíveis para seleção em chips
  const availableHours = [
    '09:00', '09:30', '10:15', '11:00', '11:30', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30', '18:15', '19:00'
  ];

  // Iniciar fluxo de agendamento
  const handleStartBooking = (srv?: SalonService) => {
    if (srv) {
      setSelectedService(srv);
      setBookingStep(2);
    } else {
      setSelectedService(salonServices[0] || null);
      setBookingStep(1);
    }
    if (!selectedProf && professionals.length > 0) {
      setSelectedProf(professionals[0]);
    }
    setConfirmedProtocol(null);
    setBookingModalOpen(true);
  };

  // Confirmar agendamento
  const handleConfirmBooking = () => {
    if (!clientName.trim()) {
      alert('Por favor, informe seu nome para confirmar o agendamento.');
      return;
    }

    const appt = bookAppointmentFromClient({
      serviceTitle: selectedService?.title || 'Corte + Balayage',
      servicePrice: selectedService?.price || 280,
      professionalId: selectedProf?.id || professionals[0]?.id || 'prof-val-01',
      dateStr: selectedDate,
      timeStr: selectedTime,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || '(11) 98877-6655',
      notes: clientNotes.trim(),
    });

    setConfirmedProtocol(appt.protocol_code);
  };

  return (
    <div
      id="valyioo-client-container"
      className="flex-1 flex flex-col overflow-hidden relative select-none pt-2"
      style={{ backgroundColor: bgColor }}
    >
      {/* 1. HEADER DA MARCA (Inspirado exatamente em Valyioo) */}
      <div className="px-5 py-2.5 flex items-center justify-between shrink-0">
        {/* Monograma Estilizado à Esquerda */}
        <div className="w-8 flex items-center">
          <svg
            className="w-6 h-6"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8C8.5 14 12 24 16 25C20 24 23.5 14 26 8"
              stroke={primaryColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 12C12.5 17 14.5 21 16 21.5"
              stroke={primaryColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Nome da Marca / Salão Centralizado */}
        <h1 className="text-base font-extrabold tracking-wide text-stone-900 capitalize font-sans">
          {activeSalon.name.toLowerCase().includes('valyioo') ? 'Valyioo' : activeSalon.name}
        </h1>

        {/* Ícone de Notificação com Alerta à Direita */}
        <button
          onClick={() => setIsMessagesModalOpen(true)}
          className="w-8 flex items-center justify-end relative text-stone-900 hover:text-stone-700 transition"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          <span
            className="w-2 h-2 rounded-full absolute top-0.5 right-0.5 border border-white"
            style={{ backgroundColor: primaryColor }}
          />
        </button>
      </div>

      {/* 3. CONTEÚDO PRINCIPAL (ROLÁVEL) */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 pt-2 pb-6 space-y-4">
        {/* ABA: INÍCIO (O LAYOUT EXATO DA IMAGEM VALYIOO) */}
        {activeTab === 'inicio' && (
          <>
            {/* SEÇÃO BOAS-VINDAS ("Boas-vindas! Pronta para sua melhor versão.") */}
            <div className="flex items-start justify-between pt-1">
              <div>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight leading-tight">
                  Boas-vindas!
                </h2>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Pronta para sua melhor versão.
                </p>
                {/* Linha sublinhada em tom terracota/rosé queimado */}
                <div
                  className="w-11 h-[2.5px] rounded-full mt-2"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>

              {/* Avatar de Perfil Circular Elegante com Silhueta Delicada */}
              <button
                onClick={() => setActiveTab('perfil')}
                className="w-13 h-13 rounded-full bg-[#EAD4CF] border border-[#DFC4BE] flex items-center justify-center overflow-hidden shadow-sm hover:scale-105 transition-transform"
                title="Ver meu perfil"
              >
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F2DFDB] to-[#E3C8C2]">
                  <User className="w-6 h-6 text-white/90 stroke-[2.2]" />
                </div>
              </button>
            </div>

            {/* BOTÃO PRINCIPAL DE AÇÃO HERO ("Agendar Horário") */}
            <button
              id="btn-valyioo-hero-book"
              onClick={() => handleStartBooking()}
              className="w-full py-3.5 px-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-[0_4px_12px_rgba(175,88,92,0.25)] hover:opacity-95 active:scale-[0.98] transition-all"
              style={{ backgroundColor: primaryColor }}
            >
              <Calendar className="w-4 h-4 stroke-[2.2]" />
              <span>Agendar Horário</span>
            </button>

            {/* GRID DE 4 AÇÕES RÁPIDAS (Serviços, Agenda, Especialistas, Mensagens com Badge 2) */}
            <div className="grid grid-cols-4 gap-3 pt-1">
              {/* 1. Serviços */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('servicos')}
                  className="w-15 h-15 rounded-2xl bg-[#FFF6F4] border border-[#F3E2DF] flex items-center justify-center text-stone-800 shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#E8CBC6] hover:scale-105 active:scale-95 transition-all"
                >
                  <Scissors className="w-5 h-5 stroke-[1.9]" style={{ color: primaryColor }} />
                </button>
                <span className="text-[11px] font-semibold text-stone-800 tracking-tight">
                  Serviços
                </span>
              </div>

              {/* 2. Agenda */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('agenda')}
                  className="w-15 h-15 rounded-2xl bg-[#FFF6F4] border border-[#F3E2DF] flex items-center justify-center text-stone-800 shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#E8CBC6] hover:scale-105 active:scale-95 transition-all"
                >
                  <CalendarDays className="w-5 h-5 stroke-[1.9]" style={{ color: primaryColor }} />
                </button>
                <span className="text-[11px] font-semibold text-stone-800 tracking-tight">
                  Agenda
                </span>
              </div>

              {/* 3. Especialistas */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => setIsStylistsModalOpen(true)}
                  className="w-15 h-15 rounded-2xl bg-[#FFF6F4] border border-[#F3E2DF] flex items-center justify-center text-stone-800 shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#E8CBC6] hover:scale-105 active:scale-95 transition-all"
                >
                  <User className="w-5 h-5 stroke-[1.9]" style={{ color: primaryColor }} />
                </button>
                <span className="text-[11px] font-semibold text-stone-800 tracking-tight">
                  Especialistas
                </span>
              </div>

              {/* 4. Mensagens (com Badge 2 de novidades) */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => setIsMessagesModalOpen(true)}
                  className="w-15 h-15 rounded-2xl bg-[#FFF6F4] border border-[#F3E2DF] flex items-center justify-center text-stone-800 shadow-[0_2px_6px_rgba(0,0,0,0.02)] relative hover:border-[#E8CBC6] hover:scale-105 active:scale-95 transition-all"
                >
                  <MessageSquare className="w-5 h-5 stroke-[1.9]" style={{ color: primaryColor }} />
                  {/* Badge circular 2 */}
                  <span
                    className="w-4 h-4 rounded-full text-white text-[9px] font-extrabold flex items-center justify-center absolute -top-1.5 -right-1.5 shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    2
                  </span>
                </button>
                <span className="text-[11px] font-semibold text-stone-800 tracking-tight">
                  Mensagens
                </span>
              </div>
            </div>
          </>
        )}

        {/* ABA: SERVIÇOS (CATÁLOGO COMPLETO NO ESTILO VALYIOO) */}
        {activeTab === 'servicos' && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="text-base font-black text-stone-900">Catálogo de Serviços</h2>
                <p className="text-xs text-stone-500">Escolha o serviço desejado</p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#AF585C]/10 text-[#AF585C]">
                {salonServices.length} opções
              </span>
            </div>

            <div className="space-y-2.5">
              {salonServices.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white rounded-2xl p-3 border border-[#ECE4E1] shadow-[0_2px_6px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3 hover:border-[#DFC4BE] transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-stone-900 truncate">{srv.title}</h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {srv.description || 'Atendimento profissional personalizado.'}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-stone-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {srv.duration_minutes} min
                      </span>
                      <span className="font-extrabold text-stone-900">
                        R$ {srv.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartBooking(srv)}
                    className="px-3.5 py-2 rounded-xl text-white text-xs font-bold shadow-sm transition active:scale-95 shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Agendar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA: AGENDA (PRÓXIMOS AGENDAMENTOS E HISTÓRICO) */}
        {activeTab === 'agenda' && (
          <div className="space-y-3 pt-1">
            <div>
              <h2 className="text-base font-black text-stone-900">Meus Agendamentos</h2>
              <p className="text-xs text-stone-500">Consulte seus próximos horários confirmados</p>
            </div>

            {/* Agendamento Ativo 1 */}
            <div className="bg-white rounded-2xl p-3.5 border border-[#ECE4E1] shadow-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700">
                  CONFIRMADO
                </span>
                <span className="text-[11px] text-stone-400 font-mono">VG-2026</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=300&auto=format&fit=crop&q=80"
                  alt="Corte + Balayage"
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Corte + Balayage</h4>
                  <p className="text-[11px] text-stone-500">Sábado, 24 de Maio • 11:00</p>
                  <p className="text-[11px] font-medium text-stone-700 mt-0.5">
                    Especialista: <strong>María López</strong>
                  </p>
                </div>
              </div>

              <div className="pt-1 flex gap-2">
                <a
                  href={`https://wa.me/${activeSalon.phone_whatsapp.replace(/\D/g, '')}?text=Olá, gostaria de confirmar meu agendamento de Corte + Balayage`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Mensagem para o salão
                </a>
                <button
                  onClick={() => alert('Lembrete sincronizado com a agenda do seu aparelho.')}
                  className="px-3 py-2 rounded-xl text-white text-[11px] font-bold transition"
                  style={{ backgroundColor: primaryColor }}
                >
                  Adicionar ao calendário
                </button>
              </div>
            </div>

            {/* Novo agendamento realizado nesta sessão */}
            {confirmedProtocol && (
              <div className="bg-white rounded-2xl p-3.5 border border-emerald-500/30 shadow-sm space-y-2">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    AGENDAMENTO RECENTE
                  </span>
                  <span className="text-[11px] text-emerald-700 font-mono font-bold">
                    {confirmedProtocol}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{selectedService?.title}</h4>
                  <p className="text-[11px] text-stone-500">{selectedDate} às {selectedTime}</p>
                  <p className="text-[11px] text-stone-700">Com {selectedProf?.name}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ABA: PERFIL (DADOS DA CLIENTE & INFORMAÇÕES DO SALÃO) */}
        {activeTab === 'perfil' && (
          <div className="space-y-3 pt-1">
            {/* Card de Usuário */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECE4E1] shadow-sm flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-[#EAD4CF] flex items-center justify-center text-white border border-[#DFC4BE]">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">{clientName || 'Valentina Rossi'}</h3>
                <p className="text-xs text-stone-500">{clientPhone || '(11) 98877-6655'}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#AF585C]/10 text-[#AF585C]">
                  Cliente Frequente VIP
                </span>
              </div>
            </div>

            {/* Informações do Salão & Localização */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECE4E1] shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                Sobre o Salão
              </h4>

              <div className="text-xs space-y-1 text-stone-600">
                <p className="font-bold text-stone-900">{activeSalon.name}</p>
                <p>{activeSalon.address}</p>
                <p>{activeSalon.neighborhood}, {activeSalon.city}</p>
              </div>

              {/* Botões de Ação */}
              <div className="pt-1 flex flex-col gap-2">
                <a
                  href={`https://wa.me/${activeSalon.phone_whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Falar pelo WhatsApp
                </a>

                <button
                  onClick={toggleViewMode}
                  className="w-full py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-600 text-xs font-semibold hover:bg-stone-100 transition active:scale-98"
                >
                  Alternar para Modo Salão (Bancada)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM NAVIGATION FIXA (5 ABAS COM DESIGN IDÊNTICO À IMAGEM) */}
      <div className="bg-white border-t border-[#ECE4E1] pt-2 pb-1.5 px-3 shrink-0 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-around">
          {/* 1. Início */}
          <button
            onClick={() => setActiveTab('inicio')}
            className="flex flex-col items-center gap-1 py-1 px-2 transition-transform active:scale-95"
          >
            <Home
              className="w-5 h-5 stroke-[2.2]"
              style={{ color: activeTab === 'inicio' ? primaryColor : '#8E8580' }}
            />
            <span
              className={`text-[10px] tracking-tight leading-none ${
                activeTab === 'inicio' ? 'font-bold' : 'font-medium text-[#8E8580]'
              }`}
              style={{ color: activeTab === 'inicio' ? primaryColor : '#8E8580' }}
            >
              Início
            </span>
          </button>

          {/* 2. Reservar */}
          <button
            onClick={() => handleStartBooking()}
            className="flex flex-col items-center gap-1 py-1 px-2 transition-transform active:scale-95"
          >
            <CalendarPlus
              className="w-5 h-5 stroke-[2.2]"
              style={{ color: activeTab === 'reservar' ? primaryColor : '#8E8580' }}
            />
            <span
              className={`text-[10px] tracking-tight leading-none ${
                activeTab === 'reservar' ? 'font-bold' : 'font-medium text-[#8E8580]'
              }`}
              style={{ color: activeTab === 'reservar' ? primaryColor : '#8E8580' }}
            >
              Agendar
            </span>
          </button>

          {/* 3. Serviços */}
          <button
            onClick={() => setActiveTab('servicos')}
            className="flex flex-col items-center gap-1 py-1 px-2 transition-transform active:scale-95"
          >
            <Scissors
              className="w-5 h-5 stroke-[2.2]"
              style={{ color: activeTab === 'servicos' ? primaryColor : '#8E8580' }}
            />
            <span
              className={`text-[10px] tracking-tight leading-none ${
                activeTab === 'servicos' ? 'font-bold' : 'font-medium text-[#8E8580]'
              }`}
              style={{ color: activeTab === 'servicos' ? primaryColor : '#8E8580' }}
            >
              Serviços
            </span>
          </button>

          {/* 4. Agenda */}
          <button
            onClick={() => setActiveTab('agenda')}
            className="flex flex-col items-center gap-1 py-1 px-2 transition-transform active:scale-95"
          >
            <CalendarCheck
              className="w-5 h-5 stroke-[2.2]"
              style={{ color: activeTab === 'agenda' ? primaryColor : '#8E8580' }}
            />
            <span
              className={`text-[10px] tracking-tight leading-none ${
                activeTab === 'agenda' ? 'font-bold' : 'font-medium text-[#8E8580]'
              }`}
              style={{ color: activeTab === 'agenda' ? primaryColor : '#8E8580' }}
            >
              Agenda
            </span>
          </button>

          {/* 5. Perfil */}
          <button
            onClick={() => setActiveTab('perfil')}
            className="flex flex-col items-center gap-1 py-1 px-2 transition-transform active:scale-95"
          >
            <User
              className="w-5 h-5 stroke-[2.2]"
              style={{ color: activeTab === 'perfil' ? primaryColor : '#8E8580' }}
            />
            <span
              className={`text-[10px] tracking-tight leading-none ${
                activeTab === 'perfil' ? 'font-bold' : 'font-medium text-[#8E8580]'
              }`}
              style={{ color: activeTab === 'perfil' ? primaryColor : '#8E8580' }}
            >
              Perfil
            </span>
          </button>
        </div>

        {/* Barra de Home Indicator do Smartphone */}
        <div className="w-32 h-1 bg-stone-800/80 rounded-full mx-auto mt-2 mb-0.5" />
      </div>

      {/* ================= MODAL DE FLUXO DE AGENDAMENTO ("Agendar Horário") ================= */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#FAF7F6] border border-[#ECE4E1] rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header do Modal */}
            <div className="px-5 py-3.5 bg-white border-b border-[#ECE4E1] flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {confirmedProtocol ? 'Agendamento Confirmado!' : 'Agendar Horário'}
                </h3>
                <p className="text-[10.5px] text-stone-500">
                  {confirmedProtocol
                    ? 'Seu horário foi confirmado com sucesso no salão'
                    : `Etapa ${bookingStep} de 4 — ${
                        bookingStep === 1
                          ? 'Escolha o Serviço'
                          : bookingStep === 2
                          ? 'Escolha o Profissional'
                          : bookingStep === 3
                          ? 'Data e Horário'
                          : 'Seus Dados'
                      }`}
                </p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Confirmação com Sucesso */}
              {confirmedProtocol ? (
                <div className="text-center py-4 space-y-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white shadow-md"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <div>
                    <h4 className="text-base font-black text-stone-900">Seu agendamento está pronto!</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Reservamos seu horário com confirmação imediata.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-[#ECE4E1] space-y-2 text-left shadow-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                      <span className="text-[11px] text-stone-500">Código de Confirmação:</span>
                      <span className="text-xs font-black" style={{ color: primaryColor }}>
                        {confirmedProtocol}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-stone-500">Serviço:</span>
                      <span className="font-bold text-stone-900">{selectedService?.title}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-500">Especialista:</span>
                      <span className="font-semibold text-stone-800">{selectedProf?.name}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-500">Data e Horário:</span>
                      <span className="font-bold text-stone-900">{selectedDate} às {selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-2 border-t border-stone-100">
                      <span className="text-stone-500">Total:</span>
                      <span className="font-black text-sm text-stone-900">
                        R$ {selectedService?.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 flex gap-2">
                    <a
                      href={`https://wa.me/${activeSalon.phone_whatsapp.replace(/\D/g, '')}?text=Olá, confirmo meu agendamento de ${selectedService?.title} com código ${confirmedProtocol}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Enviar no WhatsApp
                    </a>
                    <button
                      onClick={() => setBookingModalOpen(false)}
                      className="px-4 py-3 rounded-xl bg-white border border-[#ECE4E1] text-stone-700 font-semibold text-xs"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* PASSO 1: SELEÇÃO DE SERVIÇO */}
                  {bookingStep === 1 && (
                    <div className="space-y-2.5">
                      <p className="text-xs font-bold text-stone-900">1. Selecione o Serviço</p>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {salonServices.map((s) => {
                          const isSelected = selectedService?.id === s.id;
                          return (
                            <div
                              key={s.id}
                              onClick={() => setSelectedService(s)}
                              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-white border-[#AF585C] shadow-sm ring-1 ring-[#AF585C]'
                                  : 'bg-white border-[#ECE4E1] hover:border-stone-300'
                              }`}
                            >
                              <div>
                                <h5 className="text-xs font-bold text-stone-900">{s.title}</h5>
                                <p className="text-[10.5px] text-stone-500">
                                  {s.duration_minutes} min • R$ {s.price.toFixed(2)}
                                </p>
                              </div>
                              {isSelected && (
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                                  style={{ backgroundColor: primaryColor }}
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PASSO 2: SELEÇÃO DE PROFISSIONAL */}
                  {bookingStep === 2 && (
                    <div className="space-y-2.5">
                      <p className="text-xs font-bold text-stone-900">2. Escolha o Especialista</p>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {professionals.map((p) => {
                          const isSelected = selectedProf?.id === p.id;
                          return (
                            <div
                              key={p.id}
                              onClick={() => setSelectedProf(p)}
                              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-white border-[#AF585C] shadow-sm ring-1 ring-[#AF585C]'
                                  : 'bg-white border-[#ECE4E1] hover:border-stone-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.avatar_url}
                                  alt={p.name}
                                  className="w-11 h-11 rounded-full object-cover border border-stone-200 shadow-sm"
                                />
                                <div>
                                  <h5 className="text-xs font-bold text-stone-900">{p.name}</h5>
                                  <p className="text-[10.5px] text-stone-500">
                                    {p.specialties[0] || 'Especialista em Cabelo'}
                                  </p>
                                </div>
                              </div>
                              {isSelected && (
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                                  style={{ backgroundColor: primaryColor }}
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PASSO 3: DATA E HORÁRIO EM CHIPS */}
                  {bookingStep === 3 && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-stone-900 mb-1.5">
                          Data do Atendimento
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full bg-white border border-[#ECE4E1] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#AF585C] shadow-sm"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-stone-900">
                            Horários Disponíveis
                          </label>
                          <span className="text-[10.5px] text-stone-400">Toque para escolher</span>
                        </div>
                        {/* Grid de Chips de Horários */}
                        <div className="grid grid-cols-4 gap-2 max-h-[160px] overflow-y-auto pr-1">
                          {availableHours.map((hr) => {
                            const isSelected = selectedTime === hr;
                            return (
                              <button
                                key={hr}
                                type="button"
                                onClick={() => setSelectedTime(hr)}
                                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                  isSelected
                                    ? 'text-white border-[#AF585C] shadow-sm'
                                    : 'bg-white border-[#ECE4E1] text-stone-700 hover:border-stone-300'
                                }`}
                                style={isSelected ? { backgroundColor: primaryColor } : {}}
                              >
                                {hr}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-2xl border border-[#ECE4E1] flex justify-between text-xs shadow-sm">
                        <span className="text-stone-500">Serviço selecionado:</span>
                        <span className="font-bold text-stone-900">
                          {selectedService?.title} • R$ {selectedService?.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* PASSO 4: DADOS DO CLIENTE */}
                  {bookingStep === 4 && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Seu nome completo"
                          className="w-full bg-white border border-[#ECE4E1] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#AF585C] shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          WhatsApp de Contato *
                        </label>
                        <input
                          type="text"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="(11) 98877-6655"
                          className="w-full bg-white border border-[#ECE4E1] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#AF585C] shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Observações (opcional)
                        </label>
                        <input
                          type="text"
                          value={clientNotes}
                          onChange={(e) => setClientNotes(e.target.value)}
                          placeholder="Ex: Cabelo com química prévia..."
                          className="w-full bg-white border border-[#ECE4E1] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#AF585C] shadow-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Botões de Navegação entre Etapas */}
                  <div className="pt-2 border-t border-[#ECE4E1] flex items-center justify-between">
                    {bookingStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => setBookingStep((prev) => (prev - 1) as any)}
                        className="px-4 py-2 rounded-xl bg-white border border-[#ECE4E1] text-xs text-stone-600 font-semibold"
                      >
                        Voltar
                      </button>
                    ) : (
                      <div />
                    )}

                    {bookingStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => setBookingStep((prev) => (prev + 1) as any)}
                        className="px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm transition active:scale-95"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Próximo
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConfirmBooking}
                        className="px-5 py-2.5 rounded-xl text-white text-xs font-black shadow-md transition active:scale-95 flex items-center gap-1.5"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        Confirmar Agendamento
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DE ESTILISTAS (ACIONADO PELO BOTÃO ESPECIALISTAS) ================= */}
      {isStylistsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#FAF7F6] border border-[#ECE4E1] rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
            <div className="px-5 py-3.5 bg-white border-b border-[#ECE4E1] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Equipe de Especialistas</h3>
                <p className="text-[10.5px] text-stone-500">Profissionais qualificadas do salão</p>
              </div>
              <button
                onClick={() => setIsStylistsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 overflow-y-auto flex-1">
              {professionals.map((prof) => (
                <div
                  key={prof.id}
                  className="bg-white rounded-2xl p-3.5 border border-[#ECE4E1] shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prof.avatar_url}
                      alt={prof.name}
                      className="w-12 h-12 rounded-full object-cover border border-stone-200 shadow-sm"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900">{prof.name}</h4>
                      <p className="text-[10.5px] text-stone-500">{prof.specialties.join(' • ')}</p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-500 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold">4.9</span>
                        <span className="text-stone-400">(120+ avaliações)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsStylistsModalOpen(false);
                      setSelectedProf(prof);
                      handleStartBooking();
                      setBookingStep(3);
                    }}
                    className="px-3 py-2 rounded-xl text-white text-xs font-bold shadow-sm shrink-0 active:scale-95 transition"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Agendar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DE MENSAGENS (ACIONADO PELO BOTÃO MENSAGENS COM BADGE 2) ================= */}
      {isMessagesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#FAF7F6] border border-[#ECE4E1] rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
            <div className="px-5 py-3.5 bg-white border-b border-[#ECE4E1] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Central de Mensagens</h3>
                <p className="text-[10.5px] text-stone-500">2 notificações recentes do salão</p>
              </div>
              <button
                onClick={() => setIsMessagesModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 overflow-y-auto flex-1">
              {/* Notificação 1 */}
              <div className="bg-white rounded-2xl p-3.5 border border-[#ECE4E1] shadow-sm space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-[#AF585C]">Lembrete Oficial</span>
                  <span className="text-stone-400">Há 15 min</span>
                </div>
                <h4 className="text-xs font-bold text-stone-900">Seu agendamento de Balayage está chegando!</h4>
                <p className="text-[11px] text-stone-600">
                  Olá Valentina, esperamos por você neste sábado às 11:00 com María López. Lembre-se de vir com o cabelo seco.
                </p>
              </div>

              {/* Notificação 2 */}
              <div className="bg-white rounded-2xl p-3.5 border border-[#ECE4E1] shadow-sm space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-[#AF585C]">Promoção Exclusiva</span>
                  <span className="text-stone-400">Ontem</span>
                </div>
                <h4 className="text-xs font-bold text-stone-900">Desconto em Tratamento Capilar</h4>
                <p className="text-[11px] text-stone-600">
                  Aproveite 20% de desconto no Spa Capilar ao realizar seu corte durante esta semana.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${activeSalon.phone_whatsapp.replace(/\D/g, '')}?text=Olá! Gostaria de tirar uma dúvida sobre meus agendamentos`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Chamar no WhatsApp do Salão
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
