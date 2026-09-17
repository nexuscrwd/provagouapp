import React, { useState } from 'react';
import { 
  Store, Phone, MapPin, Clock, 
  KeyRound, Users, Plus, Trash2, 
  Save, CheckCircle2, ShieldCheck, Check, Camera, Palette
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SalonAdminSettings, SalonProfessionalItem } from '../../types';
import { hapticSuccess, hapticLight } from '../../utils/haptics';

// Definição dos presets de cores
const COLOR_PRESETS = [
  { name: 'emerald', class: 'bg-emerald-500', shadow: 'shadow-emerald-500/50' },
  { name: 'blue', class: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
  { name: 'rose', class: 'bg-rose-500', shadow: 'shadow-rose-500/50' },
  { name: 'amber', class: 'bg-amber-500', shadow: 'shadow-amber-500/50' },
  { name: 'violet', class: 'bg-violet-500', shadow: 'shadow-violet-500/50' },
];

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
  const { isDark, setAccentColor: setAccentColorContext } = useTheme();

  // Settings form states
  const [salonName, setSalonName] = useState(adminSettings.salonName || 'Barbearia Rota 99');
  const [salonPhone, setSalonPhone] = useState(adminSettings.salonPhone || '(11) 98765-4321');
  const [salonAddress, setSalonAddress] = useState(adminSettings.salonAddress || 'Rua Harmonia, 123 - Vila Madalena');
  const [openingHours, setOpeningHours] = useState(adminSettings.openingHours || 'Seg a Sáb • 09:00 às 20:00');
  const [pinCode, setPinCode] = useState(adminSettings.pinCode || '1234');
  const [salonLogo, setSalonLogo] = useState(adminSettings.salonLogo || '');
  const [accentColor, setAccentColor] = useState(adminSettings.accentColor || 'emerald');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Team state
  const [newProName, setNewProName] = useState('');
  const [newProRole, setNewProRole] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSalonLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    hapticSuccess();
    onUpdateSettings({
      salonName,
      salonPhone,
      salonAddress,
      openingHours,
      pinCode,
      salonLogo,
      accentColor,
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

        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          <div className="w-24 h-24 rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center relative overflow-hidden">
            {salonLogo ? (
              <img src={salonLogo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Store className="w-10 h-10 text-slate-500" />
            )}
          </div>
          <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition">
            Alterar Logo
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        {/* Seletor de Cor de Destaque */}
        <div className="mb-6 p-4 rounded-xl border border-slate-800/50 bg-slate-900/30">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Cor de Destaque</h4>
          </div>
          <div className="flex items-center justify-between gap-2">
            {COLOR_PRESETS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => {
                    setAccentColor(color.name);
                    setAccentColorContext(color.name);
                  }}
                  className={`w-10 h-10 rounded-full transition-all border-2 ${
                    accentColor === color.name 
                      ? `border-white scale-110 shadow-lg ${color.shadow}` 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  } ${color.class}`}
                />
            ))}
          </div>
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
          className="w-full py-2 rounded-lg bg-accent hover:bg-accent text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
        >
          <Save className="w-3.5 h-3.5 text-white" />
          <span>Salvar Alterações</span>
        </button>
      </form>
    </div>
  );
};
