import React, { useState } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, 
  Plus, Phone, User, Check, X,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { BookingAppointment, CatalogServiceItem, SalonProfessionalItem } from '../../types';
import { hapticLight, hapticSuccess, hapticMedium } from '../../utils/haptics';

export interface ProfessionalAgendaViewProps {
  appointments: BookingAppointment[];
  onUpdateAppointments: (appointments: BookingAppointment[]) => void;
  services?: CatalogServiceItem[];
  professionals?: SalonProfessionalItem[];
}

export const ProfessionalAgendaView: React.FC<ProfessionalAgendaViewProps> = ({
  appointments = [],
  onUpdateAppointments,
  services = [],
  professionals = [],
}) => {
  const { isDark } = useTheme();

  const [filter, setFilter] = useState<'todos' | 'confirmados' | 'concluidos' | 'cancelados'>('todos');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form states for manual appointment
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedService, setSelectedService] = useState(services[0]?.title || 'Corte');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [selectedPrice, setSelectedPrice] = useState(services[0]?.price?.toString() || '45');

  const filteredAppointments = appointments.filter((app) => {
    const status = (app.status || '').toUpperCase();
    if (filter === 'confirmados') return status === 'CONFIRMADO' || status === 'AGENDADO' || status === 'EM ANDAMENTO';
    if (filter === 'concluidos') return status === 'CONCLUÍDO' || status === 'CONCLUIDO';
    if (filter === 'cancelados') return status === 'CANCELADO';
    return true;
  });

  const handleStatusChange = (protocolCode: string, newStatus: string) => {
    hapticSuccess();
    const updated = appointments.map((app) => {
      if (app.protocolCode === protocolCode) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    onUpdateAppointments(updated);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    hapticSuccess();
    const newApp: BookingAppointment = {
      protocolCode: `MAN-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: clientName.trim(),
      clientName: clientName.trim(),
      customerPhone: clientPhone.trim() || undefined,
      service: selectedService,
      serviceTitle: selectedService,
      salonName: 'Barbearia Rota 99',
      dateTime: `Hoje às ${selectedTime}`,
      dayGroup: 'Hoje',
      time: selectedTime,
      totalPrice: parseFloat(selectedPrice) || 0,
      status: 'CONFIRMADO',
    };

    onUpdateAppointments([newApp, ...appointments]);
    setIsNewModalOpen(false);
    setClientName('');
    setClientPhone('');
  };

  return (
    <div className={`w-full h-full flex flex-col justify-between overflow-hidden ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 1. Topo: Título + Botão Novo Agendamento */}
      <div className={`p-3.5 border-b shrink-0 flex items-center justify-between ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold font-['Poppins']">Agenda do Dia</h2>
            <p className="text-[10px] text-slate-400">
              {appointments.length} agendamentos registrados
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            hapticLight();
            setIsNewModalOpen(true);
          }}
          className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-sm active:scale-98"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>Novo</span>
        </button>
      </div>

      {/* 2. Filtros Rápidos */}
      <div className={`px-3.5 py-2 border-b flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        {(['todos', 'confirmados', 'concluidos', 'cancelados'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              hapticLight();
              setFilter(tab);
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap border ${
              filter === tab
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab === 'todos' ? 'Todos' : tab === 'confirmados' ? 'Confirmados' : tab === 'concluidos' ? 'Concluídos' : 'Cancelados'}
          </button>
        ))}
      </div>

      {/* 3. Lista de Agendamentos */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-2">
        {filteredAppointments.length === 0 ? (
          <div className={`p-6 rounded-lg border text-center my-4 ${
            isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <Clock className="w-6 h-6 mx-auto mb-1.5 text-slate-500" />
            <p className="text-xs font-bold">Nenhum agendamento encontrado</p>
            <p className="text-[10px] mt-0.5 text-slate-500">
              {filter === 'todos' ? 'Toque em "+ Novo" para agendar manualmente.' : 'Nenhum item com este filtro.'}
            </p>
          </div>
        ) : (
          filteredAppointments.map((app) => {
            const isCompleted = (app.status || '').toUpperCase() === 'CONCLUÍDO' || (app.status || '').toUpperCase() === 'CONCLUIDO';
            const isCanceled = (app.status || '').toUpperCase() === 'CANCELADO';

            return (
              <div
                key={app.protocolCode}
                className={`p-3 rounded-lg border flex flex-col gap-2 transition ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                } ${isCanceled ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-black shrink-0 mt-0.5">
                      {(app.customerName || app.clientName || 'C')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white truncate font-['Poppins']">
                          {app.customerName || app.clientName || 'Cliente'}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-mono">
                          #{app.protocolCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-400 font-medium truncate mt-0.5">
                        {app.service || app.serviceTitle || 'Serviço'}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {app.time || app.dateTime || 'Hoje'}
                        </span>
                        {app.customerPhone && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {app.customerPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-emerald-400 font-black text-sm block">
                      R$ {Number(app.totalPrice || 0).toFixed(0)}
                    </span>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider mt-1 border ${
                      isCompleted 
                        ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' 
                        : isCanceled 
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                        : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    }`}>
                      {app.status || 'CONFIRMADO'}
                    </span>
                  </div>
                </div>

                {/* Ações Rápidas por Agendamento */}
                {!isCanceled && !isCompleted && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(app.protocolCode, 'CANCELADO')}
                      className="px-2 py-1 rounded text-[10px] font-bold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer flex items-center gap-1 border border-rose-500/20"
                    >
                      <X className="w-3 h-3 text-rose-400" />
                      <span>Cancelar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(app.protocolCode, 'CONCLUÍDO')}
                      className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3 h-3 text-white" />
                      <span>Concluir</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Novo Agendamento Manual */}
      {isNewModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsNewModalOpen(false)}
        >
          <div 
            className={`w-full max-w-sm rounded-xl overflow-hidden shadow-2xl border flex flex-col ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-3.5 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50'
            }`}>
              <h3 className="text-xs font-bold font-['Poppins']">
                Novo Agendamento Manual
              </h3>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-4 space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Roberto Gomes"
                  required
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-medium outline-hidden ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Telefone / WhatsApp (Opcional)
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-medium outline-hidden ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-xs font-medium outline-hidden ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-xs font-medium outline-hidden ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer border ${
                    isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm active:scale-98"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
