import React, { useState } from 'react';
import { 
  Store, Phone, MapPin, Clock, 
  KeyRound, Users, Plus, Trash2, 
  Save, CheckCircle2, ShieldCheck, Check
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SalonAdminSettings, SalonProfessionalItem } from '../../types';
import { hapticSuccess, hapticLight } from '../../utils/haptics';

export interface ProfessionalSpaceManagerProps {
  adminSettings: SalonAdminSettings;
  onUpdateSettings: (settings: Partial<SalonAdminSettings>) => void;
  professionals: SalonProfessionalItem[];
  onUpdateProfessionals: (professionals: SalonProfessionalItem[]) => void;
}

export const ProfessionalSpaceManager: React.FC<ProfessionalSpaceManagerProps> = ({
  adminSettings,
  onUpdateSettings,
  professionals = [],
  onUpdateProfessionals,
}) => {
  const { isDark } = useTheme();

  // Settings form states
  const [salonName, setSalonName] = useState(adminSettings.salonName || 'Barbearia Rota 99');
  const [salonPhone, setSalonPhone] = useState(adminSettings.salonPhone || '(11) 98765-4321');
  const [salonAddress, setSalonAddress] = useState(adminSettings.salonAddress || 'Rua Harmonia, 123 - Vila Madalena');
  const [openingHours, setOpeningHours] = useState(adminSettings.openingHours || 'Seg a Sáb • 09:00 às 20:00');
  const [pinCode, setPinCode] = useState(adminSettings.pinCode || '1234');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Team state
  const [newProName, setNewProName] = useState('');
  const [newProRole, setNewProRole] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    hapticSuccess();
    onUpdateSettings({
      salonName,
      salonPhone,
      salonAddress,
      openingHours,
      pinCode,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddProfessional = () => {
    if (!newProName.trim()) return;
    hapticSuccess();
    const newPro: SalonProfessionalItem = {
      id: `pro-${Date.now()}`,
      name: newProName.trim(),
      role: newProRole.trim() || 'Especialista',
      rating: 5.0,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };
    onUpdateProfessionals([...professionals, newPro]);
    setNewProName('');
    setNewProRole('');
  };

  const handleRemoveProfessional = (identifier: string) => {
    hapticLight();
    onUpdateProfessionals(professionals.filter((p, idx) => (p.id || p.name || `pro-${idx}`) !== identifier));
  };


  return (
    <div className={`w-full h-full flex flex-col justify-between overflow-y-auto p-3.5 space-y-4 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 1. Informações do Estabelecimento */}
      <form onSubmit={handleSaveSettings} className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-['Poppins']">
              Dados do Espaço
            </h3>
          </div>

          {savedSuccess && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              <Check className="w-3 h-3 text-emerald-400" />
              Salvo com Sucesso
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Nome do Estabelecimento
            </label>
            <input
              type="text"
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs font-medium outline-hidden ${
                isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                WhatsApp / Contato
              </label>
              <input
                type="text"
                value={salonPhone}
                onChange={(e) => setSalonPhone(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-xs font-medium outline-hidden ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                PIN de Acesso
              </label>
              <input
                type="text"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-xs font-medium outline-hidden ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Endereço Completo
            </label>
            <input
              type="text"
              value={salonAddress}
              onChange={(e) => setSalonAddress(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs font-medium outline-hidden ${
                isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
              }`}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Horário de Funcionamento
            </label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs font-medium outline-hidden ${
                isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
              }`}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
        >
          <Save className="w-3.5 h-3.5 text-white" />
          <span>Salvar Alterações</span>
        </button>
      </form>

      {/* 2. Gestão da Equipe */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-['Poppins']">
              Equipe & Profissionais
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">
            {professionals.length} ativos
          </span>
        </div>

        {/* Lista de Profissionais */}
        <div className="space-y-1.5">
          {professionals.map((pro, idx) => {
            const proKey = pro.id || `${pro.name}-${idx}`;
            return (
              <div
                key={proKey}
                className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={pro.avatarUrl || pro.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={pro.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500/40 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{pro.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{pro.role || 'Profissional'}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveProfessional(proKey)}
                  className="p-1 rounded text-slate-400 hover:text-rose-400 transition cursor-pointer"
                  title="Remover profissional"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>


        {/* Adicionar Novo Profissional */}
        <div className={`p-2.5 rounded-lg border space-y-2 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Adicionar Integrante
          </span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={newProName}
              onChange={(e) => setNewProName(e.target.value)}
              placeholder="Nome"
              className={`w-full px-2.5 py-1.5 rounded border text-xs outline-hidden ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
            <input
              type="text"
              value={newProRole}
              onChange={(e) => setNewProRole(e.target.value)}
              placeholder="Cargo / Função"
              className={`w-full px-2.5 py-1.5 rounded border text-xs outline-hidden ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>
          <button
            type="button"
            onClick={handleAddProfessional}
            className="w-full py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider transition cursor-pointer border border-emerald-500/30 flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Adicionar à Equipe</span>
          </button>
        </div>
      </div>
    </div>
  );
};
