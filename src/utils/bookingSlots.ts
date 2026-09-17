export interface AvailableSlot {
  time: string;
  period: 'manha' | 'tarde' | 'noite';
  available: boolean;
}

export const getAvailableSlotsForDate = (
  dateIso: string,
  _professional?: string
): AvailableSlot[] => {
  const baseSlots: AvailableSlot[] = [
    // Manhã
    { time: '09:00', period: 'manha', available: true },
    { time: '09:45', period: 'manha', available: true },
    { time: '10:30', period: 'manha', available: false },
    { time: '11:15', period: 'manha', available: true },
    // Tarde
    { time: '13:00', period: 'tarde', available: true },
    { time: '13:45', period: 'tarde', available: true },
    { time: '14:30', period: 'tarde', available: true },
    { time: '15:15', period: 'tarde', available: false },
    { time: '16:00', period: 'tarde', available: true },
    { time: '16:45', period: 'tarde', available: true },
    { time: '17:30', period: 'tarde', available: true },
    // Noite
    { time: '18:15', period: 'noite', available: true },
    { time: '19:00', period: 'noite', available: true },
    { time: '19:45', period: 'noite', available: false },
    { time: '20:30', period: 'noite', available: true },
  ];

  // Pequena variação determinística baseada na data para realismo
  if (dateIso) {
    const charCodeSum = dateIso.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return baseSlots.map((slot, idx) => ({
      ...slot,
      available: (charCodeSum + idx) % 5 !== 0,
    }));
  }

  return baseSlots;
};
