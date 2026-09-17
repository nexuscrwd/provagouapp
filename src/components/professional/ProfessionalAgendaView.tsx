import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, 
  Plus, Phone, User, Check, X,
  AlertCircle, MessageSquare, ExternalLink,
  DollarSign, Scissors, Mail,
  ChevronLeft, ChevronRight, RefreshCw, Send, ShieldCheck
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

export type DemandStatusKey = 'confirmados' | 'pendentes' | 'concluidos' | 'cancelados';

export const getStatusCategory = (statusRaw?: string): { 
  key: DemandStatusKey; 
  order: number; 
  label: string; 
  shortLabel: string;
  badgeBg: string; 
  badgeText: string; 
  badgeBorder: string;
  badgeFullClass: string;
  dotColor: string;
} => {
  const status = (statusRaw || '').toUpperCase().trim();

  // 2. ALTERAÇÃO (entram na categoria PENDENTE em amarelo até ambos aceitarem a alteração)
  if (status.includes('ALTER') || status.includes('REMANEJ') || status.includes('REAGEND')) {
    return {
      key: 'pendentes',
      order: 2,
      label: 'Alteração (Aguardando Aceite Mútuo)',
      shortLabel: 'Alteração',
      badgeBg: 'bg-amber-500/15',
      badgeText: 'text-amber-400',
      badgeBorder: 'border-amber-500/30',
      badgeFullClass: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      dotColor: 'bg-amber-400'
    };
  }

  // 2. PENDENTES (aguarda confirmação do profissional)
  if (status.includes('PEND') || status.includes('AGUARD')) {
    return {
      key: 'pendentes',
      order: 2,
      label: 'Pendentes (Aguardando Confirmação)',
      shortLabel: 'Pendente',
      badgeBg: 'bg-amber-500/15',
      badgeText: 'text-amber-400',
      badgeBorder: 'border-amber-500/30',
      badgeFullClass: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      dotColor: 'bg-amber-400'
    };
  }

  // 3. CONCLUÍDOS
  if (status.includes('CONCLU')) {
    return {
      key: 'concluidos',
      order: 3,
      label: 'Concluídos',
      shortLabel: 'Concluído',
      badgeBg: 'bg-blue-500/15',
      badgeText: 'text-blue-400',
      badgeBorder: 'border-blue-500/30',
      badgeFullClass: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
      dotColor: 'bg-blue-400'
    };
  }

  // 5. CANCELADOS
  if (status.includes('CANCEL')) {
    return {
      key: 'cancelados',
      order: 5,
      label: 'Cancelados',
      shortLabel: 'Cancelado',
      badgeBg: 'bg-rose-500/15',
      badgeText: 'text-rose-400',
      badgeBorder: 'border-rose-500/30',
      badgeFullClass: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      dotColor: 'bg-rose-400'
    };
  }

  // 1. CONFIRMADOS (Padrão)
  return {
    key: 'confirmados',
    order: 1,
    label: 'Confirmados',
    shortLabel: 'Confirmado',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
    badgeFullClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    dotColor: 'bg-emerald-400'
  };
};

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export const ProfessionalAgendaView: React.FC<ProfessionalAgendaViewProps> = ({
  appointments = [],
  onUpdateAppointments,
  services = [],
  professionals = [],
}) => {
  const { isDark } = useTheme();

  // Estados de Data Selecionada e Calendário do Mês
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarViewDate, setCalendarViewDate] = useState<Date>(new Date());
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const [timeFilter, setTimeFilter] = useState<'proximo' | 'hoje' | 'semana' | 'mes'>('hoje');
  const [filter, setFilter] = useState<'todos' | 'confirmados' | 'pendentes' | 'concluidos' | 'cancelados'>('todos');
  
  // Modais
  const [selectedAppointment, setSelectedAppointment] = useState<BookingAppointment | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Estados do Chat Interno no App
  const [activeChatAppointment, setActiveChatAppointment] = useState<BookingAppointment | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'professional' | 'client' | 'system'; text: string; timestamp: string }>>([]);
  const [inputChatMessage, setInputChatMessage] = useState('');

  const openChatForAppointment = (app: BookingAppointment) => {
    setActiveChatAppointment(app);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setChatMessages([
      {
        id: 'sys-1',
        sender: 'system',
        text: `Atendimento de "${app.service || app.serviceTitle || 'Serviço'}" em ${app.time || '14:00'}. Protocolo #${app.protocolCode || 'VG-001'}. Chat seguro do Vagou.`,
        timestamp: timeStr,
      },
      {
        id: 'client-1',
        sender: 'client',
        text: `Olá! Gostaria de confirmar detalhes sobre meu agendamento (#${app.protocolCode || 'VG-001'}).`,
        timestamp: timeStr,
      }
    ]);
  };

  const handleSendChatMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputChatMessage.trim()) return;
    hapticSuccess();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg = {
      id: `prof-${Date.now()}`,
      sender: 'professional' as const,
      text: inputChatMessage.trim(),
      timestamp: timeStr,
    };
    setChatMessages(prev => [...prev, newMsg]);
    setInputChatMessage('');

    setTimeout(() => {
      const replyTime = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
      setChatMessages(prev => [
        ...prev,
        {
          id: `client-${Date.now()}`,
          sender: 'client',
          text: 'Perfeito! Obrigado pelas informações. Nos vemos no horário agendado!',
          timestamp: replyTime,
        }
      ]);
    }, 1100);
  };

  // Estados do Formulário de Novo Agendamento
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedService, setSelectedService] = useState(services[0]?.title || 'Corte Masculino');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [selectedDuration, setSelectedDuration] = useState('40 min');
  const [selectedPrice, setSelectedPrice] = useState(services[0]?.price?.toString() || '50');

  const isSelectedDateToday = useMemo(() => {
    const today = new Date();
    return isSameDay(selectedDate, today);
  }, [selectedDate]);

  // Grid do Calendário do Mês
  const monthGridDays = useMemo(() => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const grid = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      grid.push({ date: null });
    }

    for (let d = 1; d <= totalDays; d++) {
      grid.push({ date: new Date(year, month, d) });
    }

    return grid;
  }, [calendarViewDate]);

  // 1. Agendamentos filtrados pela data/intervalo selecionado (Próximo, Hoje, Semana, Mês)
  const dayAppointments = useMemo(() => {
    return appointments.filter((app) => {
      let appDate = new Date();
      if (app.dateIso) {
        appDate = new Date(app.dateIso + 'T00:00:00');
      } else {
        const match = app.dateTime?.match(/(\d{2})\/(\d{2})/);
        if (match) {
          const day = parseInt(match[1], 10);
          const month = parseInt(match[2], 10) - 1;
          const year = new Date().getFullYear();
          appDate = new Date(year, month, day);
        } else if (app.dayGroup === 'Hoje' || app.dateTime?.includes('Hoje')) {
          appDate = new Date();
        }
      }

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      if (timeFilter === 'hoje') {
        return appDate >= todayStart && appDate <= todayEnd;
      }

      if (timeFilter === 'proximo') {
        return appDate >= todayStart;
      }

      if (timeFilter === 'semana') {
        const sunday = new Date(todayStart);
        sunday.setDate(todayStart.getDate() - todayStart.getDay());
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        saturday.setHours(23, 59, 59, 999);
        return appDate >= sunday && appDate <= saturday;
      }

      if (timeFilter === 'mes') {
        return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [appointments, timeFilter]);

  // 2. Contadores para as abas de demanda do dia
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      todos: dayAppointments.length,
      confirmados: 0,
      pendentes: 0,
      concluidos: 0,
      cancelados: 0,
    };

    dayAppointments.forEach((app) => {
      const catKey = getStatusCategory(app.status).key;
      if (counts[catKey] !== undefined) {
        counts[catKey]++;
      }
    });

    return counts;
  }, [dayAppointments]);

  // 3. Agendamentos filtrados pela aba de status selecionada
  const filteredAppointments = useMemo(() => {
    if (filter === 'todos') {
      return dayAppointments;
    }
    return dayAppointments.filter((app) => getStatusCategory(app.status).key === filter);
  }, [dayAppointments, filter]);

  // 4. Lista Ordenada pela hierarquia da Demanda do Dia:
  // 1º Confirmados (próximos aos últimos)
  // 2º Pendentes & Alterações (próximos aos últimos)
  // 3º Concluídos (próximos aos últimos)
  // 4º Cancelados (próximos aos últimos)
  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      const catA = getStatusCategory(a.status);
      const catB = getStatusCategory(b.status);

      if (filter === 'todos' && catA.order !== catB.order) {
        return catA.order - catB.order;
      }

      const timeA = a.time || '00:00';
      const timeB = b.time || '00:00';
      return timeA.localeCompare(timeB);
    });
  }, [filteredAppointments, filter]);

  const handleStatusChange = (protocolCode: string, newStatus: string) => {
    hapticSuccess();
    const updated = appointments.map((app) => {
      if (app.protocolCode === protocolCode) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    onUpdateAppointments(updated);
    
    if (selectedAppointment && selectedAppointment.protocolCode === protocolCode) {
      setSelectedAppointment({ ...selectedAppointment, status: newStatus });
    }
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    hapticSuccess();
    const now = new Date();
    const formattedCreatedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const dayNum = selectedDate.getDate().toString().padStart(2, '0');
    const monthNum = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const selectedDateStr = isSelectedDateToday ? 'Hoje' : `${dayNum}/${monthNum}`;

    const newApp: BookingAppointment = {
      protocolCode: `VG-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: clientName.trim(),
      clientName: clientName.trim(),
      customerPhone: clientPhone.trim() || undefined,
      clientPhone: clientPhone.trim() || undefined,
      service: selectedService,
      serviceTitle: selectedService,
      duration: selectedDuration,
      salonName: 'Barbearia Rota 99',
      dateTime: `${selectedDateStr}, ${selectedTime}`,
      dayGroup: selectedDateStr,
      time: selectedTime,
      totalPrice: parseFloat(selectedPrice) || 0,
      status: 'CONFIRMADO',
      createdAt: formattedCreatedDate,
      dateIso: selectedDate.toISOString().split('T')[0],
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
      {/* Cabeçalho da Seção: Título na Esquerda | "Hoje" + Ícone de Agenda do Mês na Direita */}
      <div className={`p-3.5 border-b shrink-0 flex items-center justify-between gap-2 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold font-['Poppins'] truncate">Agenda de Atendimentos</h2>
              <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-[4px] border ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                {isSelectedDateToday 
                  ? 'Hoje' 
                  : selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {sortedAppointments.length} horários listados
            </p>
          </div>
        </div>

        {/* Lado Direito: Botão "Hoje" e ao lado direito dele o Ícone de Agenda do Mês */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              hapticLight();
              setSelectedDate(new Date());
            }}
            className={`px-3 py-1.5 rounded-[4px] border text-xs font-bold transition cursor-pointer flex items-center gap-1 active:scale-98 ${
              isSelectedDateToday
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-500/50'
                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500/50'
            }`}
          >
            <span>Hoje</span>
          </button>

          <button
            type="button"
            onClick={() => {
              hapticLight();
              setCalendarViewDate(new Date(selectedDate));
              setIsCalendarModalOpen(true);
            }}
            title="Agenda do Mês / Calendário"
            className={`p-1.5 rounded-[4px] border transition cursor-pointer flex items-center justify-center active:scale-98 ${
              isCalendarModalOpen
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50'
                : 'bg-white border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-500/50'
            }`}
          >
            <Calendar className={`w-4 h-4 ${isCalendarModalOpen ? 'text-white' : 'text-emerald-400'}`} />
          </button>
        </div>
      </div>

      {/* 3. Filtros Duplos de Data (Período) e Status da Demanda */}
      <div className={`px-3.5 py-2 border-b flex flex-col gap-2 shrink-0 ${
        isDark ? 'bg-slate-950 border-slate-800/60' : 'bg-slate-50 border-slate-200'
      }`}>
        {/* Primeira Linha: Período (Próximo, Hoje, Semana, Mês) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'proximo', label: 'Próximo' },
              { id: 'hoje', label: 'Hoje' },
              { id: 'semana', label: 'Semana' },
              { id: 'mes', label: 'Mês' },
            ] as const
          ).map((tTab) => {
            return (
              <button
                key={tTab.id}
                type="button"
                onClick={() => {
                  hapticLight();
                  setTimeFilter(tTab.id);
                }}
                className={`px-2.5 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap border flex items-center gap-1 active:scale-98 ${
                  timeFilter === tTab.id
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {tTab.label}
              </button>
            );
          })}
        </div>

        {/* Segunda Linha: Status (Concluído, Confirmado, Pendentes, Cancelados) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'todos', label: 'Todos' },
              { id: 'concluidos', label: 'Concluído' },
              { id: 'confirmados', label: 'Confirmado' },
              { id: 'pendentes', label: 'Pendentes' },
              { id: 'cancelados', label: 'Cancelados' },
            ] as const
          ).map((sTab) => {
            const count = categoryCounts[sTab.id] || 0;
            return (
              <button
                key={sTab.id}
                type="button"
                onClick={() => {
                  hapticLight();
                  setFilter(sTab.id);
                }}
                className={`px-2.5 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap border flex items-center gap-1 active:scale-98 ${
                  filter === sTab.id
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{sTab.label}</span>
                <span className={`px-1 py-0.2 rounded-[4px] text-[8.5px] font-mono font-bold ${
                  filter === sTab.id
                    ? 'bg-emerald-600 text-white'
                    : isDark
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Lista Ordenada pela Demanda do Dia (Confirmados -> Pendentes -> Concluídos -> Cancelados) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1.5">
        {sortedAppointments.length === 0 ? (
          <div className={`p-6 rounded-[4px] border text-center my-4 ${
            isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <Clock className="w-6 h-6 mx-auto mb-1.5 text-slate-500" />
            <p className="text-xs font-bold">Nenhum agendamento nesta categoria</p>
            <p className="text-[10px] mt-0.5 text-slate-500">
              {filter === 'todos' ? 'Toque em "+ Novo" para cadastrar um atendimento.' : 'Nenhum item encontrado para este filtro.'}
            </p>
          </div>
        ) : (
          sortedAppointments.map((app, index) => {
            const catInfo = getStatusCategory(app.status);
            const prevCatKey = index > 0 ? getStatusCategory(sortedAppointments[index - 1].status).key : null;
            const isCategoryHeader = filter === 'todos' && catInfo.key !== prevCatKey;

            const clientDisplayName = app.customerName || app.clientName || 'Cliente';
            const serviceDisplayName = app.service || app.serviceTitle || 'Serviço';
            const appointmentTime = app.time || (app.dateTime ? app.dateTime.split('às')[1] : '09:00') || '09:00';

            return (
              <React.Fragment key={app.protocolCode || app.id || index}>
                {/* Banner divisor de categoria no modo 'todos' */}
                {isCategoryHeader && (
                  <div className={`mt-2.5 mb-1 px-2.5 py-1 rounded-[4px] border flex items-center justify-between ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${catInfo.dotColor}`} />
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider ${catInfo.badgeText}`}>
                        {catInfo.label}
                      </span>
                    </div>
                    <span className="text-[9.5px] font-mono font-bold text-slate-400">
                      {categoryCounts[catInfo.key]} {categoryCounts[catInfo.key] === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                )}

                <div
                  onClick={() => {
                    hapticLight();
                    setSelectedAppointment(app);
                  }}
                  className={`p-2.5 rounded-[4px] border grid grid-cols-12 gap-2 items-center transition cursor-pointer group ${
                    isDark 
                      ? 'bg-slate-900/90 border-slate-800/90 hover:border-emerald-500/60 hover:bg-slate-900' 
                      : 'bg-white border-slate-200 hover:border-emerald-500/60 hover:bg-slate-50 shadow-2xs'
                  } ${catInfo.key === 'cancelados' ? 'opacity-60' : ''}`}
                >
                  {/* Coluna 1: Horário */}
                  <div className="col-span-3 shrink-0 flex flex-col items-start justify-center">
                    <div className={`px-2.5 py-1.5 rounded-[4px] border transition flex items-center justify-center ${
                      isDark 
                        ? 'bg-slate-900/90 border-emerald-500/30 group-hover:border-emerald-500/60' 
                        : 'bg-emerald-50/60 border-emerald-200 group-hover:border-emerald-400'
                    }`}>
                      <span className="text-base font-black font-mono tracking-tight text-emerald-400 leading-none">
                        {appointmentTime.trim()}
                      </span>
                    </div>
                  </div>

                  {/* Coluna 2: Cliente */}
                  <div className="col-span-4 min-w-0 flex items-center">
                    <h4 className={`text-xs font-bold truncate group-hover:text-emerald-400 transition ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {clientDisplayName}
                    </h4>
                  </div>

                  {/* Coluna 3: Serviço & Selo de Status da Demanda */}
                  <div className="col-span-5 min-w-0 flex items-center justify-end">
                    <div className="min-w-0 text-right">
                      <p className={`text-[11px] font-bold truncate ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        {serviceDisplayName}
                      </p>
                      <span className={`inline-block px-1.5 py-0.2 rounded-[4px] text-[8px] font-extrabold uppercase tracking-wider border ${catInfo.badgeFullClass}`}>
                        {catInfo.shortLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* MODAL: Calendário do Mês */}
      {isCalendarModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsCalendarModalOpen(false)}
        >
          <div 
            className={`w-full max-w-sm rounded-[4px] overflow-hidden shadow-2xl border flex flex-col ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Calendário */}
            <div className={`p-3.5 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold font-['Poppins']">
                  Calendário da Agenda
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCalendarModalOpen(false)}
                className="p-1 rounded-[4px] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navegação de Mês */}
            <div className="p-3 border-b border-slate-800/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  hapticLight();
                  const prev = new Date(calendarViewDate);
                  prev.setMonth(prev.getMonth() - 1);
                  setCalendarViewDate(prev);
                }}
                className={`p-1.5 rounded-[4px] border text-slate-400 hover:text-white cursor-pointer ${
                  isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-bold font-['Poppins'] uppercase tracking-wider text-emerald-400">
                {MONTH_NAMES[calendarViewDate.getMonth()]} {calendarViewDate.getFullYear()}
              </span>

              <button
                type="button"
                onClick={() => {
                  hapticLight();
                  const next = new Date(calendarViewDate);
                  next.setMonth(next.getMonth() + 1);
                  setCalendarViewDate(next);
                }}
                className={`p-1.5 rounded-[4px] border text-slate-400 hover:text-white cursor-pointer ${
                  isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-100'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Grid do Calendário */}
            <div className="p-3">
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dayName) => (
                  <div key={dayName}>{dayName}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {monthGridDays.map((gridItem, idx) => {
                  if (!gridItem.date) {
                    return <div key={`empty-${idx}`} className="h-8" />;
                  }

                  const isSel = isSameDay(gridItem.date, selectedDate);
                  const isTod = isSameDay(gridItem.date, new Date());

                  return (
                    <button
                      key={gridItem.date.toISOString()}
                      type="button"
                      onClick={() => {
                        hapticSuccess();
                        setSelectedDate(gridItem.date!);
                        setIsCalendarModalOpen(false);
                      }}
                      className={`h-8 rounded-[4px] text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                        isSel
                          ? 'bg-emerald-500 text-white font-extrabold shadow-xs'
                          : isTod
                          ? 'border-2 border-emerald-500 text-emerald-400 font-bold'
                          : isDark
                          ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {gridItem.date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className={`p-3 border-t flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
            }`}>
              <button
                type="button"
                onClick={() => {
                  hapticLight();
                  const today = new Date();
                  setSelectedDate(today);
                  setCalendarViewDate(today);
                  setIsCalendarModalOpen(false);
                }}
                className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
              >
                Ir para Hoje
              </button>

              <button
                type="button"
                onClick={() => setIsCalendarModalOpen(false)}
                className={`px-3 py-1.5 rounded-[4px] border text-xs font-bold cursor-pointer ${
                  isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-900' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: Detalhes Completos do Serviço e Atendimento */}
      {selectedAppointment && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedAppointment(null)}
        >
          <div 
            className={`w-full max-w-md rounded-[4px] overflow-hidden shadow-2xl border flex flex-col max-h-[90vh] ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Topo do Modal */}
            <div className={`p-3.5 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                {(() => {
                  const cat = getStatusCategory(selectedAppointment.status);
                  return (
                    <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-wider border ${cat.badgeFullClass}`}>
                      {cat.shortLabel}
                    </span>
                  );
                })()}
                <span className="text-xs font-mono font-bold text-slate-400">
                  #{selectedAppointment.protocolCode}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 rounded-[4px] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conteúdo Rolável do Modal */}
            <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
              {/* Contexto especial para Pendentes ou Alterações */}
              {(() => {
                const stUpper = (selectedAppointment.status || '').toUpperCase();
                const isAlter = stUpper.includes('ALTER') || stUpper.includes('REMANEJ') || stUpper.includes('REAGEND');

                if (isAlter) {
                  return (
                    <div className="p-2.5 rounded-[4px] bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>Solicitação de alteração de horário. Aguardando aceite mútuo para ser confirmado.</span>
                    </div>
                  );
                }

                const catKey = getStatusCategory(selectedAppointment.status).key;
                if (catKey === 'pendentes') {
                  return (
                    <div className="p-2.5 rounded-[4px] bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>Agendamento realizado pelo cliente. Aguardando sua confirmação.</span>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Bloco 1: Serviço & Valor */}
              <div className={`p-3 rounded-[4px] border space-y-1.5 ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                      Serviço Agendado
                    </span>
                    <h3 className="text-sm font-bold font-['Poppins'] text-emerald-400 mt-0.5">
                      {selectedAppointment.serviceTitle || selectedAppointment.service || 'Serviço'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                      Valor
                    </span>
                    <span className="text-sm font-black text-emerald-400 block">
                      R$ {Number(selectedAppointment.totalPrice || 0).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Duração Estimada</span>
                    <span className="font-bold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {selectedAppointment.duration || '40 min'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Profissional</span>
                    <span className="font-bold flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3 text-emerald-400" />
                      {selectedAppointment.professionalName || selectedAppointment.professional || 'Carlos Henrique'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloco 2: Horário Agendado para Atendimento */}
              <div className={`p-3 rounded-[4px] border space-y-1 ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                  Data e Horário do Atendimento
                </span>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedAppointment.dateTime || selectedAppointment.dayGroup || 'Hoje'}</span>
                  {selectedAppointment.time && (
                    <span className="text-emerald-400 font-mono">({selectedAppointment.time})</span>
                  )}
                </div>
              </div>

              {/* Bloco 3: Registro de Agendamento (Reserva) */}
              <div className={`p-3 rounded-[4px] border space-y-1 ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                  Data/Hora da Realização do Agendamento
                </span>
                <p className="text-xs font-medium text-slate-300">
                  {selectedAppointment.createdAt || '15/09/2026 às 14:32'}
                </p>
              </div>

              {/* Bloco 4: Dados de Contato do Cliente */}
              <div className={`p-3 rounded-[4px] border space-y-2 ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                  Contato do Cliente
                </span>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-black shrink-0">
                      {(selectedAppointment.customerName || selectedAppointment.clientName || 'C')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs truncate text-white">
                        {selectedAppointment.customerName || selectedAppointment.clientName || 'Cliente sem nome'}
                      </p>
                      <p className="text-[10.5px] text-slate-400 truncate flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {selectedAppointment.customerPhone || selectedAppointment.clientPhone || '(41) 99123-4567'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ações de Contato Rápido (Chat Interno no App & Ligação) */}
                {(selectedAppointment.customerPhone || selectedAppointment.clientPhone) && (
                  <div className="pt-2 border-t border-slate-800/60 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        hapticLight();
                        openChatForAppointment(selectedAppointment);
                      }}
                      className="py-1.5 px-2 rounded-[4px] bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10.5px] flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-white" />
                      <span>Mensagem no App</span>
                    </button>
                    <a
                      href={`tel:${(selectedAppointment.customerPhone || selectedAppointment.clientPhone || '').replace(/\D/g, '')}`}
                      className={`py-1.5 px-2 rounded-[4px] border font-bold text-[10.5px] flex items-center justify-center gap-1.5 transition ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-600' : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ligar</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Rodapé Fixo de Ação do Modal */}
            <div className={`p-3 border-t sticky bottom-0 z-20 flex flex-col gap-2 ${
              isDark ? 'border-slate-800 bg-slate-950/95' : 'border-slate-200 bg-white/95'
            } backdrop-blur-xs`}>
              {(() => {
                const stUpper = (selectedAppointment.status || '').toUpperCase();
                const isAlter = stUpper.includes('ALTER') || stUpper.includes('REMANEJ') || stUpper.includes('REAGEND');

                if (isAlter) {
                  return (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedAppointment.protocolCode, 'CANCELADO')}
                        className="flex-1 py-2 rounded-[4px] border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5 text-rose-400" />
                        <span>Recusar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedAppointment.protocolCode, 'CONFIRMADO')}
                        className="flex-1 py-2 rounded-[4px] bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                        <span>Aceitar Alteração</span>
                      </button>
                    </div>
                  );
                }

                const catKey = getStatusCategory(selectedAppointment.status).key;

                if (catKey === 'pendentes') {
                  return (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedAppointment.protocolCode, 'CANCELADO')}
                        className="flex-1 py-2 rounded-[4px] border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5 text-rose-400" />
                        <span>Recusar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedAppointment.protocolCode, 'CONFIRMADO')}
                        className="flex-1 py-2 rounded-[4px] bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                        <span>Confirmar</span>
                      </button>
                    </div>
                  );
                }

                if (catKey === 'confirmados') {
                  return (
                    <div className="grid grid-cols-3 gap-1.5 w-full">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedAppointment.protocolCode, 'ALTERAÇÃO')}
                        className="py-2 px-1 rounded-[4px] border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10.5px] font-bold transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3 text-amber-400" />
                        <span>Remanejar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedAppointment.protocolCode, 'CANCELADO')}
                        className="py-2 px-1 rounded-[4px] border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10.5px] font-bold transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <X className="w-3 h-3 text-rose-400" />
                        <span>Cancelar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedAppointment.protocolCode, 'CONCLUÍDO')}
                        className="py-2 px-1 rounded-[4px] bg-emerald-500 hover:bg-emerald-600 text-white text-[10.5px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Check className="w-3 h-3 text-white stroke-[2.5]" />
                        <span>Concluir</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedAppointment.protocolCode, 'CONFIRMADO')}
                    className="w-full py-2 rounded-[4px] border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Reativar Agendamento</span>
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Agendamento Manual */}
      {isNewModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsNewModalOpen(false)}
        >
          <div 
            className={`w-full max-w-sm rounded-[4px] overflow-hidden shadow-2xl border flex flex-col ${
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
                className="p-1 rounded-[4px] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-4 space-y-3 text-xs">
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
                  className={`w-full px-3 py-2 rounded-[4px] border text-xs font-medium outline-hidden ${
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
                  className={`w-full px-3 py-2 rounded-[4px] border text-xs font-medium outline-hidden ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Serviço
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => {
                    setSelectedService(e.target.value);
                    const matchedSrv = services.find((s) => s.title === e.target.value);
                    if (matchedSrv) {
                      setSelectedPrice(matchedSrv.price.toString());
                      setSelectedDuration(matchedSrv.duration);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-[4px] border text-xs font-medium outline-hidden ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {services.length > 0 ? (
                    services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title} ({s.duration}) - R$ {s.price}
                      </option>
                    ))
                  ) : (
                    <option value="Corte Masculino">Corte Masculino (40 min) - R$ 50</option>
                  )}
                </select>
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
                    className={`w-full px-3 py-2 rounded-[4px] border text-xs font-medium outline-hidden ${
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
                    className={`w-full px-3 py-2 rounded-[4px] border text-xs font-medium outline-hidden ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className={`flex-1 py-2 rounded-[4px] text-xs font-bold transition cursor-pointer border ${
                    isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-[4px] bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-xs active:scale-98"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal do Chat Interno do App */}
      {activeChatAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className={`w-full max-w-md h-[85vh] sm:h-[550px] rounded-t-[4px] sm:rounded-[4px] border flex flex-col overflow-hidden shadow-2xl ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {/* Cabeçalho do Chat */}
            <div className={`p-3 border-b shrink-0 flex items-center justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black shrink-0">
                  {(activeChatAppointment.customerName || activeChatAppointment.clientName || 'C')[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {activeChatAppointment.customerName || activeChatAppointment.clientName || 'Cliente'}
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Online no Vagou" />
                  </div>
                  <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Chat Seguro Vagou • #{activeChatAppointment.protocolCode}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveChatAppointment(null)}
                className={`p-1.5 rounded-[4px] border transition cursor-pointer ${
                  isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Área de Mensagens */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 bg-slate-950/40">
              {chatMessages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="my-2 p-2 rounded-[4px] bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{msg.text}</span>
                    </div>
                  );
                }

                const isProf = msg.sender === 'professional';

                return (
                  <div key={msg.id} className={`flex flex-col ${isProf ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-2.5 rounded-[4px] text-xs ${
                      isProf
                        ? 'bg-emerald-500 text-white font-medium'
                        : isDark
                        ? 'bg-slate-800 text-slate-100 border border-slate-700 font-medium'
                        : 'bg-slate-100 text-slate-900 border border-slate-200 font-medium'
                    }`}>
                      <p>{msg.text}</p>
                      <span className={`block text-[9px] mt-1 text-right font-mono ${
                        isProf ? 'text-white/80' : 'text-slate-400'
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chips de Resposta Rápida */}
            <div className={`px-2.5 py-1.5 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 ${
              isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
            }`}>
              {[
                'Confirmo seu horário!',
                'Estou te aguardando!',
                'Gostaria de remarcar?'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    hapticLight();
                    setInputChatMessage(chip);
                  }}
                  className={`px-2 py-1 rounded-[4px] text-[10px] font-bold border transition cursor-pointer whitespace-nowrap ${
                    isDark 
                      ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500/50'
                      : 'bg-white border-slate-300 text-slate-700 hover:text-emerald-600 hover:border-emerald-500'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Formuário de Envio */}
            <form onSubmit={handleSendChatMessage} className={`p-2.5 border-t shrink-0 flex items-center gap-2 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <input
                type="text"
                value={inputChatMessage}
                onChange={(e) => setInputChatMessage(e.target.value)}
                placeholder="Escreva sua mensagem no app..."
                className={`flex-1 px-3 py-2 rounded-[4px] border text-xs font-medium outline-hidden transition ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500'
                }`}
              />
              <button
                type="submit"
                disabled={!inputChatMessage.trim()}
                className="py-2 px-3 rounded-[4px] bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer active:scale-98"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
