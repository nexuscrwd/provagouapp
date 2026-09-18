import React from 'react';
import { 
  Store, Clock, LogOut, Calendar
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SalonAdminSettings, CatalogServiceItem, BookingAppointment } from '../../types';
import { hapticLight } from '../../utils/haptics';

export interface ProfessionalDashboardViewProps {
  adminSettings?: SalonAdminSettings;
  onUpdateSettings?: (settings: Partial<SalonAdminSettings>) => void;
  services?: CatalogServiceItem[];
  appointments?: BookingAppointment[];
  onNavigateTab?: (tab: 'home' | 'servicos' | 'vagas' | 'espaco') => void;
  onOpenNewService?: () => void;
  onOpenNewAppointment?: () => void;
  onLogout?: () => void;
  salonName?: string;
}

export const ProfessionalDashboardView: React.FC<ProfessionalDashboardViewProps> = ({
  adminSettings,
  onUpdateSettings,
  services = [],
  appointments = [],
  onNavigateTab,
  onOpenNewService,
  onOpenNewAppointment,
  onLogout,
  salonName = 'Barbearia Rota 99',
}) => {
  const { isDark } = useTheme();

  const isOpen = adminSettings?.isOpenNow ?? true;

  const handleToggleOpen = () => {
    hapticLight();
    if (onUpdateSettings) {
      onUpdateSettings({ isOpenNow: !isOpen });
    }
  };

  // Estados de Filtro para os Atendimentos do Painel
  const [timeFilter, setTimeFilter] = React.useState<'proximo' | 'hoje' | 'semana' | 'mes'>('proximo');
  const [statusFilter, setStatusFilter] = React.useState<'concluidos' | 'confirmados' | 'pendentes' | 'cancelados'>('confirmados');

  // Filtragem Dinâmica de Próximos Clientes com base nos filtros selecionados
  const filteredDashboardAppointments = React.useMemo(() => {
    return appointments.filter((app) => {
      // 1. Filtragem por Período de Tempo
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

      let matchesTime = true;
      if (timeFilter === 'hoje') {
        matchesTime = appDate >= todayStart && appDate <= todayEnd;
      } else if (timeFilter === 'proximo') {
        matchesTime = appDate >= todayStart;
      } else if (timeFilter === 'semana') {
        const sunday = new Date(todayStart);
        sunday.setDate(todayStart.getDate() - todayStart.getDay());
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        saturday.setHours(23, 59, 59, 999);
        matchesTime = appDate >= sunday && appDate <= saturday;
      } else if (timeFilter === 'mes') {
        matchesTime = appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
      }

      if (!matchesTime) return false;

      // 2. Filtragem por Status
      const st = (app.status || '').toUpperCase();
      if (statusFilter === 'concluidos') {
        return st === 'CONCLUÍDO' || st === 'CONCLUIDO';
      }
      if (statusFilter === 'confirmados') {
        return st === 'CONFIRMADO' || st === 'AGENDADO';
      }
      if (statusFilter === 'pendentes') {
        return st === 'PENDENTE' || st === 'ALTERADO';
      }
      if (statusFilter === 'cancelados') {
        return st === 'CANCELADO';
      }

      return true;
    });
  }, [appointments, timeFilter, statusFilter]);

  // Contagem para Badges das categorias no período selecionado
  const categoryCounts = React.useMemo(() => {
    const counts = {
      concluidos: 0,
      confirmados: 0,
      pendentes: 0,
      cancelados: 0,
    };

    appointments.forEach((app) => {
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

      let matchesTime = true;
      if (timeFilter === 'hoje') {
        matchesTime = appDate >= todayStart && appDate <= todayEnd;
      } else if (timeFilter === 'proximo') {
        matchesTime = appDate >= todayStart;
      } else if (timeFilter === 'semana') {
        const sunday = new Date(todayStart);
        sunday.setDate(todayStart.getDate() - todayStart.getDay());
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        saturday.setHours(23, 59, 59, 999);
        matchesTime = appDate >= sunday && appDate <= saturday;
      } else if (timeFilter === 'mes') {
        matchesTime = appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
      }

      if (matchesTime) {
        const st = (app.status || '').toUpperCase();
        if (st === 'CONCLUÍDO' || st === 'CONCLUIDO') {
          counts.concluidos++;
        } else if (st === 'CONFIRMADO' || st === 'AGENDADO') {
          counts.confirmados++;
        } else if (st === 'PENDENTE' || st === 'ALTERADO') {
          counts.pendentes++;
        } else if (st === 'CANCELADO') {
          counts.cancelados++;
        }
      }
    });

    return counts;
  }, [appointments, timeFilter]);

  // Cálculo do tempo restante até o atendimento formatado em Temp Rest. XXHXX
  const getRemainingTimeText = (timeStr?: string) => {
    if (!timeStr) return 'Temp Rest. --H--';
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return `Temp Rest. ${timeStr}`;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    const diffMs = target.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));

    if (diffMins <= 0) {
      return 'Temp Rest. 00H00';
    }

    const h = Math.floor(diffMins / 60);
    const m = diffMins % 60;
    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    return `Temp Rest. ${hStr}H${mStr}`;
  };

  return (
    <div className={`w-full h-full flex flex-col justify-between overflow-y-auto ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 1. Cabeçalho de Status Operacional */}
      <div className={`p-3.5 border-b shrink-0 flex items-center justify-between ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
            isDark
              ? 'bg-emerald-500/20 border-emerald-500/40 text-white'
              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600'
          }`}>
            <Store className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-bold truncate leading-tight font-['Poppins']">
              {salonName}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-rose-500'}`} />
              <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                isOpen 
                  ? isDark ? 'text-white' : 'text-emerald-600'
                  : 'text-rose-400'
              }`}>
                {isOpen ? 'Aberto para Atendimento' : 'Fechado no Momento'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleOpen}
            className={`px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border ${
              isOpen 
                ? isDark
                  ? 'bg-emerald-500/25 border-emerald-500/50 text-white hover:bg-emerald-500/35'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/30' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isOpen ? 'Pausar' : 'Abrir'}
          </button>
          {onLogout && (
            <button
              type="button"
              onClick={() => {
                hapticLight();
                onLogout();
              }}
              className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              title="Sair do Modo Profissional"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Métricas Rápidas em Grid */}
      <div className="p-2 flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto">
        
        {/* Nova seção: Linha com Card do Cliente em Destaque (Coluna 1) e Grid 2x2 de Status (Coluna 2) */}
        <div className="grid grid-cols-2 gap-1 items-stretch">
          {/* Coluna 1: Card do Próximo Cliente (Div Memorizada) */}
          <div className="flex flex-col">
            {filteredDashboardAppointments.length > 0 ? (() => {
              const app = filteredDashboardAppointments[0];
              const stUpper = (app.status || '').toUpperCase();
              const isPending = stUpper === 'PENDENTE';
              const isAlteracao = stUpper.includes('ALTER') || stUpper.includes('REMANEJ') || stUpper.includes('REAGEND');
              const timeLabel = app.time || '14:00';
              const remainingTime = getRemainingTimeText(timeLabel);

              return (
                <div
                  key={app.protocolCode || 'featured-top'}
                  className={`p-2 rounded-lg border flex flex-col justify-between gap-1 h-full select-none transition relative overflow-hidden ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-white'
                      : 'bg-white border-slate-200 shadow-xs text-slate-900'
                  }`}
                >
                  {/* Top: Hora & Status */}
                  <div className="flex items-center justify-between gap-1">
                    <div className={`flex items-center gap-1 font-black text-[10px] shrink-0 ${
                      isDark
                        ? 'bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded text-white'
                        : 'text-emerald-600 bg-transparent border-0 px-0 py-0'
                    }`}>
                      <Clock className={`w-2.5 h-2.5 shrink-0 ${isDark ? 'text-white' : 'text-emerald-600'}`} />
                      <span>{timeLabel}</span>
                    </div>

                    <span className={`text-[8.5px] font-bold uppercase tracking-wide shrink-0 ${
                      isDark
                        ? isAlteracao || isPending
                          ? 'px-1.5 py-0.5 rounded bg-amber-500/20 text-white border border-amber-500/40 font-extrabold'
                          : stUpper === 'CANCELADO'
                          ? 'px-1.5 py-0.5 rounded bg-rose-500/25 text-white border border-rose-500/40 font-extrabold'
                          : stUpper === 'CONCLUÍDO' || stUpper === 'CONCLUIDO'
                          ? 'px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold'
                          : 'px-1.5 py-0.5 rounded bg-emerald-500/20 text-white border border-emerald-500/40 font-extrabold'
                        : isAlteracao || isPending
                        ? 'text-amber-600 font-extrabold bg-transparent border-0 px-0 py-0'
                        : stUpper === 'CANCELADO'
                        ? 'text-rose-600 font-extrabold bg-transparent border-0 px-0 py-0'
                        : stUpper === 'CONCLUÍDO' || stUpper === 'CONCLUIDO'
                        ? 'text-slate-500 font-bold bg-transparent border-0 px-0 py-0'
                        : 'text-emerald-600 font-extrabold bg-transparent border-0 px-0 py-0'
                    }`}>
                      {isAlteracao ? 'Alteração' : isPending ? 'Pendente' : stUpper === 'CANCELADO' ? 'Cancelado' : stUpper === 'CONCLUÍDO' || stUpper === 'CONCLUIDO' ? 'Concluído' : 'Confirmado'}
                    </span>
                  </div>

                  {/* Cliente e Serviço */}
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black shrink-0 ${
                        isDark
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-white'
                          : 'bg-slate-900 text-white shadow-2xs'
                      }`}>
                        {(app.customerName || app.clientName || 'C')[0].toUpperCase()}
                      </div>
                      <p className={`text-[12px] font-black truncate leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {app.customerName || app.clientName || 'Cliente'}
                      </p>
                    </div>

                    <p className={`text-[9.5px] truncate font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                      {app.service || app.serviceTitle || 'Serviço'}
                    </p>
                  </div>

                  {/* Rodapé: Tempo Restante */}
                  <div className={`pt-1 border-t flex items-center justify-between text-[9px] ${
                    isDark ? 'border-slate-800/80' : 'border-slate-100'
                  }`}>
                    <span className={`font-bold truncate font-mono text-[9px] ${
                      isDark ? 'text-white' : 'text-slate-700'
                    }`}>
                      {remainingTime}
                    </span>
                  </div>
                </div>
              );
            })() : (
              <div className={`p-2 rounded-lg border flex flex-col items-center justify-center text-center h-full ${
                isDark ? 'bg-slate-900/50 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
              }`}>
                <Clock className="w-4 h-4 mb-0.5 opacity-50" />
                <p className="text-[10px] font-semibold">Sem atendimento</p>
              </div>
            )}
          </div>

          {/* Coluna 2: Contêiner dos 4 Indicadores de Status (Grid 2x2) */}
          <div 
            id="professional-status-indicators-container" 
            className={`grid grid-cols-2 gap-1 p-1 rounded-lg border ${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-100/70 border-slate-200'
            }`}
          >
            {(
              [
                { id: 'hoje', label: 'Hoje', icon: Calendar },
                { id: 'confirmados', label: 'Confirmado' },
                { id: 'pendentes', label: 'Pendentes' },
                { id: 'cancelados', label: 'Cancelados' },
              ] as const
            ).map((item) => {
              const isTimeFilter = item.id === 'hoje';
              const isActive = isTimeFilter ? timeFilter === item.id : statusFilter === item.id;
              
              let count = 0;
              if (isTimeFilter) {
                 count = appointments.filter((app) => {
                  const appDate = app.dateIso ? new Date(app.dateIso + 'T00:00:00') : new Date();
                  const now = new Date();
                  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
                  return appDate >= todayStart && appDate <= todayEnd;
                 }).length;
              } else {
                 count = categoryCounts[item.id] || 0;
              }

              // Definição de cores de fundo vibrantes por item no Tema Claro
              let lightCardClass = '';
              let lightNumberClass = '';
              let lightLabelClass = '';

              if (item.id === 'hoje') {
                // Azul
                lightCardClass = 'status-blue-bg shadow-xs';
                lightLabelClass = 'text-blue-100';
                lightNumberClass = 'text-white';
              } else if (item.id === 'confirmados') {
                // Verde (REGRA INEGOCIÁVEL: FUNDO VERDE = TEXTO BRANCO)
                lightCardClass = 'status-green-bg shadow-xs';
                lightLabelClass = 'text-emerald-100';
                lightNumberClass = 'text-white';
              } else if (item.id === 'pendentes') {
                // Amarelo
                lightCardClass = 'status-amber-bg shadow-xs';
                lightLabelClass = 'text-amber-950 font-extrabold';
                lightNumberClass = 'text-slate-950';
              } else if (item.id === 'cancelados') {
                // Vermelho
                lightCardClass = 'status-rose-bg shadow-xs';
                lightLabelClass = 'text-rose-100';
                lightNumberClass = 'text-white';
              }

              // Estilos no Dark Mode (fundos temáticos com transparência elegante para manter harmonia dark)
              let darkCardClass = 'bg-slate-900 border-slate-800';
              let darkLabelClass = 'text-slate-400';
              let darkNumberClass = 'text-slate-100';

              if (item.id === 'hoje') {
                darkCardClass = 'bg-blue-950/60 border-blue-800/80';
                darkLabelClass = 'text-blue-300';
                darkNumberClass = 'text-blue-100';
              } else if (item.id === 'confirmados') {
                darkCardClass = 'bg-emerald-950/60 border-emerald-800/80';
                darkLabelClass = 'text-emerald-300';
                darkNumberClass = 'text-emerald-100';
              } else if (item.id === 'pendentes') {
                darkCardClass = 'bg-amber-950/60 border-amber-800/80';
                darkLabelClass = 'text-amber-300';
                darkNumberClass = 'text-amber-100';
              } else if (item.id === 'cancelados') {
                darkCardClass = 'bg-rose-950/60 border-rose-800/80';
                darkLabelClass = 'text-rose-300';
                darkNumberClass = 'text-rose-100';
              }

              return (
                <div
                  key={item.id}
                  className={`p-1.5 rounded-lg border flex flex-col justify-between items-start text-left select-none w-full h-16 ${
                    isDark ? darkCardClass : lightCardClass
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[8px] font-bold uppercase tracking-tight ${
                      isDark ? darkLabelClass : lightLabelClass
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  <p className={`text-lg font-black leading-none ${
                    isDark ? darkNumberClass : lightNumberClass
                  }`}>
                    {count}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Próximos Atendimentos */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Próximos Clientes
            </span>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('vagas')}
                className="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer"
              >
                Ver todos
              </button>
            )}
          </div>

          {filteredDashboardAppointments.length === 0 ? (
            <div className={`p-4 rounded-[4px] border text-center ${
              isDark ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
            }`}>
              <Clock className="w-5 h-5 mx-auto mb-1 text-slate-500" />
              <p className="text-xs font-semibold">Nenhum cliente nesta lista</p>
              <p className="text-[10px] mt-0.5 text-slate-500">Altere os filtros acima para ver outros atendimentos.</p>
            </div>
          ) : (
            <div className="flex items-stretch gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar snap-x snap-mandatory scroll-smooth touch-pan-x">
              {filteredDashboardAppointments.slice(0, 8).map((app, idx) => {
                const stUpper = (app.status || '').toUpperCase();
                const isPending = stUpper === 'PENDENTE';
                const isAlteracao = stUpper.includes('ALTER') || stUpper.includes('REMANEJ') || stUpper.includes('REAGEND');
                const timeLabel = app.time || '14:00';
                const remainingTime = getRemainingTimeText(timeLabel);

                return (
                  <div
                    key={app.protocolCode || idx}
                    className={`w-[175px] shrink-0 p-2.5 rounded-[4px] border flex flex-col justify-between gap-2 transition relative overflow-hidden snap-start ${
                      isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    {/* Cabeçalho do Card: Destaque da Próxima Hora & Badge de Status */}
                    <div className="flex items-center justify-between gap-1">
                      <div className={`flex items-center gap-1 font-black text-[11px] shrink-0 ${
                        isDark
                          ? 'bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-[4px] text-white'
                          : 'text-emerald-600 bg-transparent border-0 px-0 py-0'
                      }`}>
                        <Clock className={`w-3 h-3 shrink-0 ${isDark ? 'text-white' : 'text-emerald-600'}`} />
                        <span>{timeLabel}</span>
                      </div>

                      <span className={`text-[9px] font-bold uppercase tracking-wide shrink-0 ${
                        isDark
                          ? isAlteracao
                            ? 'px-1.5 py-0.5 rounded-[4px] bg-amber-500/20 text-white border border-amber-500/40 font-extrabold' 
                            : isPending
                            ? 'px-1.5 py-0.5 rounded-[4px] bg-amber-500/20 text-white border border-amber-500/40 font-extrabold'
                            : stUpper === 'CANCELADO'
                            ? 'px-1.5 py-0.5 rounded-[4px] bg-rose-500/25 text-white border border-rose-500/40 font-extrabold'
                            : stUpper === 'CONCLUÍDO' || stUpper === 'CONCLUIDO'
                            ? 'px-1.5 py-0.5 rounded-[4px] bg-slate-800 text-slate-300 border border-slate-700 font-bold'
                            : 'px-1.5 py-0.5 rounded-[4px] bg-emerald-500/20 text-white border border-emerald-500/40 font-extrabold'
                          : isAlteracao
                          ? 'text-amber-600 font-extrabold bg-transparent border-0 px-0 py-0'
                          : isPending
                          ? 'text-amber-600 font-extrabold bg-transparent border-0 px-0 py-0'
                          : stUpper === 'CANCELADO'
                          ? 'text-rose-600 font-extrabold bg-transparent border-0 px-0 py-0'
                          : stUpper === 'CONCLUÍDO' || stUpper === 'CONCLUIDO'
                          ? 'text-slate-500 font-bold bg-transparent border-0 px-0 py-0'
                          : 'text-emerald-600 font-extrabold bg-transparent border-0 px-0 py-0'
                      }`}>
                        {isAlteracao ? 'Alteração' : isPending ? 'Pendente' : stUpper === 'CANCELADO' ? 'Cancelado' : stUpper === 'CONCLUÍDO' || stUpper === 'CONCLUIDO' ? 'Concluído' : 'Confirmado'}
                      </span>
                    </div>

                    {/* Informações do Cliente & Descrição do Serviço */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className={`w-5 h-5 rounded-[4px] border flex items-center justify-center text-[9px] font-black shrink-0 ${
                          isDark
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-white'
                            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600'
                        }`}>
                          {(app.customerName || app.clientName || 'C')[0].toUpperCase()}
                        </div>
                        <p className={`text-xs font-bold truncate leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {app.customerName || app.clientName || 'Cliente'}
                        </p>
                      </div>

                      <p className={`text-[10px] truncate font-medium ${isDark ? 'text-slate-300' : 'text-slate-400'}`}>
                        {app.service || app.serviceTitle || 'Serviço do Cliente'}
                      </p>
                    </div>

                    {/* Rodapé: Tempo Restante Formatado (Sem valor R$) */}
                    <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                      <span className={`font-bold truncate tracking-tight font-mono text-[10px] ${
                        isDark ? 'text-white' : 'text-emerald-600'
                      }`}>
                        {remainingTime}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
