/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { Calendar, Clapperboard, Users, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen, activeSalon } = useEcosystem();

  const NAV_ITEMS = [
    {
      id: 'agenda' as const,
      label: 'Agenda',
      icon: Calendar,
    },
    {
      id: 'media' as const,
      label: 'Vídeos 5s',
      icon: Clapperboard,
    },
    {
      id: 'schedule' as const,
      label: 'Equipe',
      icon: Users,
    },
    {
      id: 'settings' as const,
      label: 'Configurações',
      icon: Settings,
    },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      className="w-full px-2 py-1 flex items-center justify-around"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeScreen === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            id={`nav-item-${item.id}`}
            onClick={() => setActiveScreen(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
              isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                isActive ? 'scale-110 shadow-sm' : ''
              }`}
              style={{
                backgroundColor: isActive ? `${activeSalon.branding.primary_color}25` : undefined,
                color: isActive ? activeSalon.branding.primary_color : undefined,
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${
                isActive ? 'font-bold' : 'font-medium'
              }`}
              style={{
                color: isActive ? activeSalon.branding.primary_color : undefined,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
