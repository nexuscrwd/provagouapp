import React from 'react';
import { 
  Calendar, Scissors, Sparkles, Store, 
  Clock, Plus, CheckCircle2,
  LogOut, TrendingUp, AlertCircle, User
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

  const todayAppointments = appointments.filter((a) => {
    const dt = (a.dateTime || a.dayGroup || '').toLowerCase();
    return dt.includes('hoje') || dt.includes(new Date().getDate().toString());
  });

  const confirmedCount = appointments.filter((a) => 
    (a.status || '').toUpperCase() === 'CONFIRMADO' || (a.status || '').toUpperCase() === 'AGENDADO'
  ).length;

  const totalRevenue = appointments
    .filter((a) => (a.status || '').toUpperCase() !== 'CANCELADO')
    .reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0);

  const isOpen = adminSettings?.isOpenNow ?? true;

  const handleToggleOpen = () => {
    hapticLight();
    if (onUpdateSettings) {
      onUpdateSettings({ isOpenNow: !isOpen });
    }
  };

  // Filtragem de Próximos Clientes (Confirmados + Pendentes + Alterados)
  const activeNextAppointments = appointments.filter((a) => {
    const st = (a.status || '').toUpperCase();
    return st !== 'CANCELADO' && st !== 'CONCLUÍDO' && st !== 'CONCLUIDO';
  });

  // Cálculo do tempo restante até o atendimento
  const getRemainingTimeText = (timeStr?: string) => {
    if (!timeStr) return 'Em breve';
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return timeStr;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    const diffMs = target.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));

    if (diffMins < 0) {
      if (Math.abs(diffMins) < 60) return `Em andamento (+${Math.abs(diffMins)}m)`;
      return 'Atendimento passado';
    }
    if (diffMins === 0) return 'Agora';
    if (diffMins < 60) return `Faltam ${diffMins} min`;
    const h = Math.floor(diffMins / 60);
    const m = diffMins % 60;
    return m > 0 ? `Faltam ${h}h ${m}m` : `Faltam ${h}h`;
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

      {/* 2. Métricas Rápidas em Grid */}
      <div className="p-3.5 space-y-3 flex-1 min-h-0">
        <div className="grid grid-cols-3 gap-2">
          {/* Card 1: Hoje */}
          <div className={`p-2.5 rounded-lg border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[9px] font-bold uppercase tracking-wider">Hoje</span>
              <Calendar className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="text-base font-black text-emerald-400 leading-none">
              {todayAppointments.length}
            </p>
            <p className="text-[8px] text-slate-400 mt-1 truncate">
              {confirmedCount} confirmados
            </p>
          </div>

          {/* Card 2: Serviços */}
          <div className={`p-2.5 rounded-lg border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[9px] font-bold uppercase tracking-wider">Serviços</span>
              <Scissors className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="text-base font-black text-white leading-none">
              {services.length}
            </p>
            <p className="text-[8px] text-slate-400 mt-1 truncate">
              no catálogo
            </p>
          </div>

          {/* Card 3: Faturamento Estimado */}
          <div className={`p-2.5 rounded-lg border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[9px] font-bold uppercase tracking-wider">Total</span>
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="text-sm font-black text-emerald-400 leading-none truncate">
              R$ {totalRevenue.toFixed(0)}
            </p>
            <p className="text-[8px] text-slate-400 mt-1 truncate">
              previsto
            </p>
          </div>
        </div>

        {/* 4. Próximos Atendimentos */}
        <div className="space-y-2">
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

          {activeNextAppointments.length === 0 ? (
            <div className={`p-4 rounded-[4px] border text-center ${
              isDark ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
            }`}>
              <Clock className="w-5 h-5 mx-auto mb-1 text-slate-500" />
              <p className="text-xs font-semibold">Nenhum agendamento na fila</p>
              <p className="text-[10px] mt-0.5 text-slate-500">Novos agendamentos e pendências aparecerão aqui.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {activeNextAppointments.slice(0, 4).map((app, idx) => {
                const stUpper = (app.status || '').toUpperCase();
                const isPending = stUpper === 'PENDENTE';
                const isAlterado = stUpper === 'ALTERADO';
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
                        isPending 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                          : isAlterado
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isPending ? 'Pendente' : isAlterado ? 'Alterado' : 'Confirmado'}
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

                    {/* Rodapé: Tempo Restante (Sem o valor R$) */}
                    <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9.5px]">
                      <span className="text-slate-400 font-medium">Tempo:</span>
                      <span className="font-bold text-emerald-400 truncate">
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
