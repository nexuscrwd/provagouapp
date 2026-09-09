/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import {
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  CheckCircle2,
  Calendar,
  CreditCard,
  Download,
  Filter,
} from 'lucide-react';

export const PartnerFinancialScreen: React.FC = () => {
  const { activeSalon, appointments, offers, professionals } = useEcosystem();

  const [datePeriod, setDatePeriod] = useState<'today' | 'week' | 'month'>('today');

  // Completed or confirmed appointments
  const validAppointments = appointments.filter(
    (a) => a.status === 'CONCLUIDO' || a.status === 'EM_ATENDIMENTO' || a.status === 'CONFIRMADO'
  );

  // Financial calculations
  const totalGrossRevenue = validAppointments.reduce((sum, app) => {
    const linkedOffer = offers.find((o) => o.id === app.offer_id);
    return sum + (linkedOffer ? linkedOffer.price : 50.0);
  }, 0);

  const completedCount = appointments.filter((a) => a.status === 'CONCLUIDO').length;
  const averageTicket = validAppointments.length > 0 ? totalGrossRevenue / validAppointments.length : 0;

  // Radar occupancy rate
  const totalOffers = offers.length;
  const bookedOffers = offers.filter((o) => o.status === 'BOOKED').length + validAppointments.length;
  const occupancyRate = totalOffers > 0 ? Math.min(100, Math.round((bookedOffers / (totalOffers + 2)) * 100)) : 80;

  // Commission breakdown per professional (default 50% commission model standard in Brazil salons)
  const commissionRate = 0.5; // 50%
  const professionalStats = professionals.map((prof) => {
    const profApps = validAppointments.filter((a) => a.professional_id === prof.id);
    const gross = profApps.reduce((sum, a) => {
      const off = offers.find((o) => o.id === a.offer_id);
      return sum + (off ? off.price : 50.0);
    }, 0);
    const commission = gross * commissionRate;
    const salonCut = gross - commission;

    return {
      prof,
      count: profApps.length,
      gross,
      commission,
      salonCut,
    };
  });

  const totalCommissionsToPay = professionalStats.reduce((acc, p) => acc + p.commission, 0);
  const totalSalonNet = totalGrossRevenue - totalCommissionsToPay;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Resumo Operacional & Comissões</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Tempo Real
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Controle de faturamento bruto, vagas relâmpago convertidas e repasse da equipe
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/70 text-xs">
          <button
            onClick={() => setDatePeriod('today')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              datePeriod === 'today' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => setDatePeriod('week')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              datePeriod === 'week' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setDatePeriod('month')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              datePeriod === 'month' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Este Mês
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faturamento Bruto */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Faturamento Bruto</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-mono">
            R$ {totalGrossRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{validAppointments.length} atendimentos registrados</span>
          </div>
        </div>

        {/* Vagas Radar & Ocupação */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Taxa de Ocupação da Cadeira</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2 font-mono">
            {occupancyRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Horários ociosos preenchidos pelo app oficial
          </div>
        </div>

        {/* Comissões da Equipe */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Comissões a Pagar (50%)</span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-400 mt-2 font-mono">
            R$ {totalCommissionsToPay.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Repasse aos profissionais da bancada
          </div>
        </div>

        {/* Saldo Líquido do Salão */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Saldo Líquido Estabelecimento</span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-300 mt-2 font-mono">
            R$ {totalSalonNet.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Ticket Médio: R$ {averageTicket.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Team Breakdown Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white">Comissões Individuais da Equipe</h3>
            <p className="text-xs text-slate-400">
              Cálculo baseado nos agendamentos confirmados e concluídos de cada cadeira
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Profissional</th>
                <th className="py-3 px-3 text-center">Atendimentos</th>
                <th className="py-3 px-3 text-right">Faturamento Bruto</th>
                <th className="py-3 px-3 text-center">% Comissão</th>
                <th className="py-3 px-3 text-right text-blue-400">Repasse Profissional</th>
                <th className="py-3 px-4 rounded-r-xl text-right text-emerald-400">Líquido Salão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {professionalStats.map(({ prof, count, gross, commission, salonCut }) => (
                <tr key={prof.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <img
                      src={prof.avatar_url}
                      alt={prof.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-xl object-cover border"
                      style={{ borderColor: prof.color_hex }}
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{prof.name}</div>
                      <div className="text-[11px] text-slate-400 capitalize">{prof.specialties.join(', ')}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold">{count}</td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                    R$ {gross.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[11px] text-slate-300">
                      50%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-blue-400">
                    R$ {commission.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                    R$ {salonCut.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Protocol History Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white">Extrato de Agendamentos & Protocolos</h3>
            <p className="text-xs text-slate-400">
              Tabela de correspondência das reservas realizadas pelo app do estabelecimento
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {appointments.map((app) => {
            const linkedOffer = offers.find((o) => o.id === app.offer_id);
            const prof = professionals.find((p) => p.id === app.professional_id);

            return (
              <div
                key={app.id}
                className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                    {app.protocol_code}
                  </span>
                  <div>
                    <div className="font-bold text-white text-sm">{app.client_name}</div>
                    <div className="text-xs text-slate-400">
                      {linkedOffer?.service_title || 'Serviço Relâmpago'} • {prof?.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="font-mono font-bold text-white text-sm">
                      R$ {linkedOffer ? linkedOffer.price.toFixed(2) : '50.00'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(app.booked_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {app.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
