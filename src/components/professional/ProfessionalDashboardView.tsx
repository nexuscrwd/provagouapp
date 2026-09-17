import React from 'react';
import { 
  Calendar, Scissors, Sparkles, Store, 
  Clock, Plus, CheckCircle2,
  LogOut, TrendingUp, AlertCircle
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

        {/* 3. Ações Rápidas em Grid */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-0.5">
            Ações Rápidas
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                hapticSuccess();
                if (onOpenNewService) onOpenNewService();
                else if (onNavigateTab) onNavigateTab('servicos');
              }}
              className="p-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Novo Serviço</span>
            </button>

            <button
              type="button"
              onClick={() => {
                hapticLight();
                if (onOpenNewAppointment) onOpenNewAppointment();
                else if (onNavigateTab) onNavigateTab('vagas');
              }}
              className={`p-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500' 
                  : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-500'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Ver Agenda</span>
            </button>
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

          {appointments.length === 0 ? (
            <div className={`p-4 rounded-lg border text-center ${
              isDark ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
            }`}>
              <Clock className="w-5 h-5 mx-auto mb-1 text-slate-500" />
              <p className="text-xs font-semibold">Nenhum agendamento pendente</p>
              <p className="text-[10px] mt-0.5 text-slate-500">Novos agendamentos aparecerão aqui em tempo real.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {appointments.slice(0, 3).map((app, idx) => (
                <div
                  key={app.protocolCode || idx}
                  className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[10px] font-black shrink-0">
                      {(app.customerName || app.clientName || 'C')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-white leading-tight">
                        {app.customerName || app.clientName || 'Cliente'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {app.service || app.serviceTitle || 'Serviço'} • {app.time || app.dateTime || 'Hoje'}
                      </p>
                    </div>
                  </div>

                  <span className="text-emerald-400 font-bold text-xs shrink-0">
                    R$ {Number(app.totalPrice || 0).toFixed(0)}
                  </span>
                </div>
              ))}
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
