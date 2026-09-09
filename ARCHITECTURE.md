# 🏛️ Arquitetura do Sistema — Vagou

## 1. Visão Geral
- **Plataforma:** Sistema web mobile-first de agendamento e radar de vagas ociosas para salões e barbearias.
- **Ambientes de Uso:**
  - **Modo Bancada / Salão (`salon`):** Dashboard ultra-ágil para o profissional gerenciar horários, atendimentos do dia e publicar vagas relâmpago em 5 segundos.
  - **Modo Cliente (`client`):** Experiência inspirada em UI de alto padrão (Valyioo Chic), com navegação limpa, catálogo de serviços e reserva rápida.

## 2. Princípios de Construção de UI & Clean DOM
- **Flatten Depth (Achatar a Profundidade do DOM):**
  - Proibido empilhar `div` sobre `div` sem função estrutural estrita.
  - Eliminar bordas redundantes (`border border-slate-800` excessivos).
  - Usar layout fluído com `space-y-*` e `gap-*`.
- **Cadeiras Disponíveis & Grade Operacional:**
  - Exibição em grid limpo contendo unicamente os horários livres.
  - Clique direto no chip de horário para abrir o modal de publicação ("Divulgar Vaga!").
  - Sem repetição de textos ou slogans internos nos chips.
