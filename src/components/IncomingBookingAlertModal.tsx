/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import {
  BellRing,
  CheckCircle2,
  Clock,
  Phone,
  Play,
  User,
  Volume2,
  X,
  Zap,
} from 'lucide-react';

export const IncomingBookingAlertModal: React.FC = () => {
  const {
    incomingBooking,
    dismissIncomingBooking,
    updateAppointmentStatus,
    offers,
    professionals,
    activeSalon,
  } = useEcosystem();

  if (!incomingBooking) return null;

  const linkedOffer = offers.find((o) => o.id === incomingBooking.offer_id);
  const prof = professionals.find((p) => p.id === incomingBooking.professional_id);

  const handleAttendNow = () => {
    updateAppointmentStatus(incomingBooking.id, 'EM_ATENDIMENTO');
    dismissIncomingBooking();
  };

  const handleConfirm = () => {
    updateAppointmentStatus(incomingBooking.id, 'CONFIRMADO');
    dismissIncomingBooking();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-slate-900 border-2 rounded-3xl p-6 text-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
        style={{
          borderColor: activeSalon.branding.primary_color,
          boxShadow: `0 0 50px ${activeSalon.branding.primary_color}40`,
        }}
      >
        {/* Urgent Animated Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg animate-bounce"
                style={{ backgroundColor: activeSalon.branding.primary_color }}
              >
                <BellRing className="w-6 h-6" />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 animate-ping" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                Vaga Relâmpago Reservada no Vagou!
              </span>
              <h2 className="text-xl font-black text-white">Nova Reserva Imediata</h2>
            </div>
          </div>

          <button
            onClick={dismissIncomingBooking}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protocol & Details Box */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <span className="text-xs text-slate-400">Código do Protocolo:</span>
            <span className="font-mono text-sm font-black text-amber-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-700">
              {incomingBooking.protocol_code}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5" />
                Cliente
              </span>
              <div className="font-bold text-white text-sm">{incomingBooking.client_name}</div>
              <div className="text-emerald-400 text-xs mt-0.5">{incomingBooking.client_phone}</div>
            </div>

            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5" />
                Cadeira & Horário
              </span>
              <div className="font-bold text-white text-sm">{prof?.name || 'Profissional'}</div>
              <div className="text-amber-400 font-mono text-xs mt-0.5">
                {linkedOffer ? `${linkedOffer.start_time} - ${linkedOffer.end_time}` : 'Hoje'}
              </div>
            </div>
          </div>

          {linkedOffer && (
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">{linkedOffer.service_title}</span>
              <span className="font-bold text-sm text-amber-400">
                R$ {linkedOffer.price.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Countertop Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            id="btn-attend-incoming"
            onClick={handleAttendNow}
            className="touch-target flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm text-white shadow-xl transition active:scale-95 cursor-pointer"
            style={{
              backgroundColor: activeSalon.branding.primary_color,
            }}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Colocar na Cadeira Agora</span>
          </button>

          <button
            id="btn-confirm-incoming"
            onClick={handleConfirm}
            className="touch-target flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow transition active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Confirmar Horário</span>
          </button>
        </div>
      </div>
    </div>
  );
};
