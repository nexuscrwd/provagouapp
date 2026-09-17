import React from 'react';
import { 
  Store, Clock, LogOut,
  Calendar, CalendarDays, CalendarRange
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SalonAdminSettings, CatalogServiceItem, BookingAppointment } from '../../types';
import { hapticLight, hapticSuccess } from '../../utils/haptics';

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
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-bold truncate leading-tight font-['Poppins']">
              {salonName}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-rose-500'}`} />
              <span className={`text-[10px] font-semibold uppercase tracking-wide ${isOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
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
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30' 
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

      {/* 2. Métricas Rápidas em Grid - Filtros Interativos em Duas Linhas */}
      <div className="p-3.5 space-y-2.5 flex-1 min-h-0 overflow-y-auto">
        {/* Primeira Linha: Período (Próximo, Hoje, Semana, Mês) */}
        <div className="grid grid-cols-4 gap-1.5">
          {(
            [
              { id: 'proximo', label: 'Próximo', icon: Clock },
              { id: 'hoje', label: 'Hoje', icon: Calendar },
              { id: 'semana', label: 'Semana', icon: CalendarDays },
              { id: 'mes', label: 'Mês', icon: CalendarRange },
            ] as const
          ).map((tTab) => {
            const IconComp = tTab.icon;
            const isActive = timeFilter === tTab.id;

            // Calcular contagem de atendimentos para este período específico
            const count = appointments.filter((app) => {
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

              if (tTab.id === 'hoje') {
                return appDate >= todayStart && appDate <= todayEnd;
              } else if (tTab.id === 'proximo') {
                return appDate >= todayStart;
              } else if (tTab.id === 'semana') {
                const sunday = new Date(todayStart);
                sunday.setDate(todayStart.getDate() - todayStart.getDay());
                const saturday = new Date(sunday);
                saturday.setDate(sunday.getDate() + 6);
                saturday.setHours(23, 59, 59, 999);
                return appDate >= sunday && appDate <= saturday;
              } else if (tTab.id === 'mes') {
                return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
              }
              return true;
            }).length;

            return (
              <button
                key={tTab.id}
                type="button"
                onClick={() => {
                  hapticLight();
                  setTimeFilter(tTab.id);
                }}
                className={`p-2 rounded-lg border flex flex-col justify-between items-start text-left transition cursor-pointer active:scale-97 select-none aspect-square w-full ${
                  isActive
                    ? 'bg-emerald-500 border-emerald-500 text-white font-bold shadow-xs'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-0.5 min-w-0">
                  <span className="text-[8.5px] font-bold uppercase tracking-tight whitespace-nowrap truncate">
                    {tTab.label}
                  </span>
                  <IconComp className={`w-2.5 h-2.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <p className={`text-xl font-black leading-none ${isActive ? 'text-white' : isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {count}
                </p>
              </button>
            );
          })}
        </div>

        {/* Segunda Linha: Status (Confirmado, Pendentes, Concluidos, Cancelados) */}
        <div className="grid grid-cols-4 gap-1.5">
          {(
            [
              { id: 'confirmados', label: 'Confirmado' },
              { id: 'pendentes', label: 'Pendentes' },
              { id: 'concluidos', label: 'Concluído' },
              { id: 'cancelados', label: 'Cancelados' },
            ] as const
          ).map((sTab) => {
            const isActive = statusFilter === sTab.id;
            const count = categoryCounts[sTab.id] || 0;

            // Cores de destaques e contraste oposto rígido
            let activeClass = 'bg-emerald-500 border-emerald-500 text-white font-bold shadow-xs';
            if (sTab.id === 'pendentes') {
              activeClass = 'bg-amber-500 border-amber-500 text-slate-950 font-bold shadow-xs';
            } else if (sTab.id === 'cancelados') {
              activeClass = 'bg-rose-500 border-rose-500 text-white font-bold shadow-xs';
            } else if (sTab.id === 'concluidos') {
              activeClass = 'bg-slate-700 border-slate-600 text-white font-bold shadow-xs';
            }

            return (
              <button
                key={sTab.id}
                type="button"
                onClick={() => {
                  hapticLight();
                  setStatusFilter(sTab.id);
                }}
                className={`p-2 rounded-lg border flex flex-col justify-between items-start text-left transition cursor-pointer active:scale-97 select-none aspect-square w-full ${
                  isActive
                    ? activeClass
                    : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-0.5 min-w-0">
                  <span className="text-[8.5px] font-bold uppercase tracking-tight whitespace-nowrap truncate">
                    {sTab.label}
                  </span>
                </div>
                <p className={`text-xl font-black leading-none ${
                  isActive
                    ? sTab.id === 'pendentes' ? 'text-slate-950' : 'text-white'
                    : isDark ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {count}
                </p>
              </button>
            );
          })}
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
            <div className="grid grid-cols-2 gap-2">
              {filteredDashboardAppointments.slice(0, 8).map((app, idx) => {
                const stUpper = (app.status || '').toUpperCase();
                const isPending = stUpper === 'PENDENTE';
                const isAlteracao = stUpper.includes('ALTER') || stUpper.includes('REMANEJ') || stUpper.includes('REAGEND');
                const timeLabel = app.time || '14:00';
                const remainingTime = getRemainingTimeText(timeLabel);

                return (
                  <div
                    key={app.protocolCode || idx}
                    className={`p-2.5 rounded-[4px] border flex flex-col justify-between gap-2 transition relative overflow-hidden ${
                      isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    {/* Cabeçalho do Card: Destaque da Próxima Hora & Badge de Status */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-[4px] text-emerald-400 font-black text-[11px] shrink-0">
                        <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{timeLabel}</span>
                      </div>

                      <span className={`px-1.5 py-0.5 rounded-[4px] text-[8.5px] font-bold uppercase tracking-wide shrink-0 ${
                        isAlteracao
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                          : isPending
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : stUpper === 'CANCELADO'
                          ? 'bg-rose-500/25 text-rose-400 border border-rose-500/35'
                          : stUpper === 'CONCLUÍDO' || stUpper === 'CONCLUIDO'
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isAlteracao ? 'Alteração' : isPending ? 'Pendente' : stUpper === 'CANCELADO' ? 'Cancelado' : stUpper === 'CONCLUÍDO' || stUpper === 'CONCLUIDO' ? 'Concluído' : 'Confirmado'}
                      </span>
                    </div>

                    {/* Informações do Cliente & Descrição do Serviço */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-5 h-5 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[9px] font-black shrink-0">
                          {(app.customerName || app.clientName || 'C')[0].toUpperCase()}
                        </div>
                        <p className={`text-xs font-bold truncate leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {app.customerName || app.clientName || 'Cliente'}
                        </p>
                      </div>

                      <p className="text-[10px] text-slate-400 truncate font-medium">
                        {app.service || app.serviceTitle || 'Serviço do Cliente'}
                      </p>
                    </div>

                    {/* Rodapé: Tempo Restante Formatado (Sem valor R$) */}
                    <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                      <span className="font-bold text-emerald-400 truncate tracking-tight font-mono text-[10px]">
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

      {/* 5. Rodapé Informativo */}
      <div className={`p-2.5 border-t text-center shrink-0 ${
        isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-100'
      }`}>
        <p className="text-[9px] text-slate-400 font-medium">
          Painel do Profissional • VagouApp v3.0
        </p>
      </div>
    </div>
  );
};
