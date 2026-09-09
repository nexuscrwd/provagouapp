/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { Professional } from '../types';
import {
  Clock,
  Users,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Calendar,
  Volume2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const WEEK_DAYS = [
  { day: 1, label: 'Segunda-feira', short: 'Seg' },
  { day: 2, label: 'Terça-feira', short: 'Ter' },
  { day: 3, label: 'Quarta-feira', short: 'Qua' },
  { day: 4, label: 'Quinta-feira', short: 'Qui' },
  { day: 5, label: 'Sexta-feira', short: 'Sex' },
  { day: 6, label: 'Sábado', short: 'Sáb' },
  { day: 0, label: 'Domingo', short: 'Dom' },
];

export const PartnerScheduleConfigScreen: React.FC = () => {
  const {
    activeSalon,
    scheduleConfig,
    updateScheduleConfig,
    professionals,
    addProfessional,
    updateProfessional,
    deleteProfessional,
  } = useEcosystem();

  const [openTime, setOpenTime] = useState(scheduleConfig.open_time);
  const [closeTime, setCloseTime] = useState(scheduleConfig.close_time);
  const [lunchStart, setLunchStart] = useState(scheduleConfig.lunch_start);
  const [lunchEnd, setLunchEnd] = useState(scheduleConfig.lunch_end);
  const [workDays, setWorkDays] = useState<number[]>(scheduleConfig.work_days);
  const [autoSound, setAutoSound] = useState(scheduleConfig.auto_sound_alert);

  // Edit or Add Professional Modal state
  const [isProfModalOpen, setIsProfModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState<Professional | null>(null);
  const [profName, setProfName] = useState('');
  const [profAvatar, setProfAvatar] = useState('');
  const [profSpecialties, setProfSpecialties] = useState<string[]>(['cabelo']);
  const [profColor, setProfColor] = useState('#F59E0B');
  const [profSlotMinutes, setProfSlotMinutes] = useState(45);

  const toggleDay = (day: number) => {
    if (workDays.includes(day)) {
      setWorkDays(workDays.filter((d) => d !== day));
    } else {
      setWorkDays([...workDays, day]);
    }
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    updateScheduleConfig({
      open_time: openTime,
      close_time: closeTime,
      lunch_start: lunchStart,
      lunch_end: lunchEnd,
      work_days: workDays,
      auto_sound_alert: autoSound,
    });
  };

  const openAddProfModal = () => {
    setEditingProf(null);
    setProfName('');
    setProfAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    setProfSpecialties(['cabelo']);
    setProfColor('#3B82F6');
    setProfSlotMinutes(45);
    setIsProfModalOpen(true);
  };

  const openEditProfModal = (prof: Professional) => {
    setEditingProf(prof);
    setProfName(prof.name);
    setProfAvatar(prof.avatar_url);
    setProfSpecialties(prof.specialties);
    setProfColor(prof.color_hex);
    setProfSlotMinutes(prof.slot_minutes);
    setIsProfModalOpen(true);
  };

  const handleProfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName) return;

    if (editingProf) {
      updateProfessional({
        ...editingProf,
        name: profName,
        avatar_url: profAvatar,
        specialties: profSpecialties,
        color_hex: profColor,
        slot_minutes: profSlotMinutes,
      });
    } else {
      addProfessional({
        name: profName,
        avatar_url: profAvatar,
        specialties: profSpecialties,
        color_hex: profColor,
        slot_minutes: profSlotMinutes,
        is_active: true,
      });
    }
    setIsProfModalOpen(false);
  };

  const toggleSpecialty = (spec: string) => {
    if (profSpecialties.includes(spec)) {
      setProfSpecialties(profSpecialties.filter((s) => s !== spec));
    } else {
      setProfSpecialties([...profSpecialties, spec]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Expediente Geral do Salão */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${activeSalon.branding.primary_color}25` }}
            >
              <Clock className="w-5 h-5" style={{ color: activeSalon.branding.accent_color }} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Configuração de Expediente & Escala</h3>
              <p className="text-xs text-slate-400">
                Determina os horários de atendimento da equipe e vagas disponíveis no aplicativo
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveSchedule}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition shadow cursor-pointer"
          >
            Salvar Horários
          </button>
        </div>

        <form onSubmit={handleSaveSchedule} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Horários de Funcionamento */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Horário de Abertura e Fechamento
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Abertura</label>
                <input
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Fechamento</label>
                <input
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider pt-2 border-t border-slate-800">
              Pausa de Almoço / Intervalo Geral
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Início da Pausa</label>
                <input
                  type="time"
                  value={lunchStart}
                  onChange={(e) => setLunchStart(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Retorno</label>
                <input
                  type="time"
                  value={lunchEnd}
                  onChange={(e) => setLunchEnd(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Dias de Funcionamento & Alerta Sonoro */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Dias de Atendimento na Semana
              </h4>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((w) => {
                  const isActive = workDays.includes(w.day);
                  return (
                    <button
                      key={w.day}
                      type="button"
                      onClick={() => toggleDay(w.day)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white'
                      }`}
                    >
                      {w.short}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSound}
                  onChange={(e) => setAutoSound(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-0"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Disparo Sonoro Automático de Agendamento Relâmpago</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Emite alerta sonoro de alta prioridade na bancada quando o cliente reserva.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Equipe de Profissionais & Cadeiras */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${activeSalon.branding.primary_color}25` }}
            >
              <Users className="w-5 h-5" style={{ color: activeSalon.branding.accent_color }} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Equipe & Cadeiras de Atendimento</h3>
              <p className="text-xs text-slate-400">
                Defina os profissionais, duração padrão de cada atendimento e identificação visual na grade
              </p>
            </div>
          </div>

          <button
            id="btn-add-prof"
            onClick={openAddProfModal}
            className="touch-target flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Adicionar Profissional</span>
          </button>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {professionals.map((prof) => (
            <div
              key={prof.id}
              className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition"
              style={{
                borderLeft: `4px solid ${prof.color_hex}`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={prof.avatar_url}
                    alt={prof.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-2xl object-cover border-2 shadow"
                    style={{ borderColor: prof.color_hex }}
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{prof.name}</h4>
                    <span className="text-xs font-mono font-semibold text-amber-400">
                      {prof.slot_minutes} minutos / vaga
                    </span>
                  </div>
                </div>

                <div
                  className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: prof.color_hex }}
                  title="Cor na grade"
                />
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5">
                {prof.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-700/80 text-slate-300 capitalize"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      updateProfessional({ ...prof, is_active: !prof.is_active })
                    }
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                      prof.is_active
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {prof.is_active ? 'Ativo na Escala' : 'Inativo'}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditProfModal(prof)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProfessional(prof.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add / Edit Professional */}
      {isProfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">
                {editingProf ? 'Editar Profissional' : 'Novo Membro da Equipe'}
              </h3>
              <button
                onClick={() => setIsProfModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProfSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  placeholder="Ex: Matheus Navalha"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Foto de Perfil (URL)
                </label>
                <input
                  type="url"
                  value={profAvatar}
                  onChange={(e) => setProfAvatar(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Duração do Atendimento
                  </label>
                  <select
                    value={profSlotMinutes}
                    onChange={(e) => setProfSlotMinutes(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value={30}>30 minutos</option>
                    <option value={40}>40 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={50}>50 minutos</option>
                    <option value={60}>60 minutos</option>
                    <option value={90}>90 minutos</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Cor na Grade da Agenda
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={profColor}
                      onChange={(e) => setProfColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-slate-700 bg-slate-800 p-0.5 cursor-pointer"
                    />
                    <span className="font-mono text-xs text-slate-300 uppercase">{profColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Especialidades do Profissional
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['cabelo', 'barba', 'unhas', 'estetica', 'beleza'].map((spec) => {
                    const isSelected = profSpecialties.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialty(spec)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                        }`}
                      >
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-xs text-slate-950 shadow cursor-pointer"
                >
                  Salvar Profissional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
