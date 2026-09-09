# 📜 CHANGELOG — Vagou Pro (App Oficial do Estabelecimento)

Este documento registra todas as alterações arquiteturais, funcionais e de design do aplicativo.

---

## [2026-09-08] Remoção da Seção de Serviço/Desconto no Modal "Divulgar Vaga!" (FastPublishModal)
- **Motivo da Mudança:** Solicitação direta do usuário através da ferramenta de seleção visual de elementos (`focus-mode`) para remover os atalhos rápidos de presets e os campos de texto/inputs de preços do modal de divulgação rápida.
- **Arquivos e Componentes Afetados:**
  - `src/components/FastPublishModal.tsx`:
    - Remoção dos elementos selecionados: container de atalhos rápidos (`SERVICE_PRESETS`) e bloco de inputs de título e preços.
    - Remoção da seção 3 completa do formulário, eliminando caixas desnecessárias e atrito operacional.
    - O modal agora é ultra-ágil, contendo apenas:
      1. Seleção da Cadeira/Profissional
      2. Horário da Vaga (com cálculo automático de término)
      3. Seleção do Vídeo Stories de 5 segundos
    - A publicação da vaga agora preenche automaticamente os valores com base na especialidade do profissional selecionado.
    - Remoção de estados zumbis (`serviceTitle`, `originalPrice`, `promoPrice`, `discountPercent`, `handleSelectPreset`) e ícones não utilizados (`Tag`, `DollarSign`, `Play`, `Sparkles`).

---

## [2026-09-08] Eliminação de Excesso de Caixas/Bordas (Anti-Box Clutter) & Grid Minimalista de Horários Livres
- **Motivo da Mudança:** Correção solicitada pelo usuário para eliminar o excesso de divs aninhadas com bordas ("muitos quadrados dentro de muitos quadrados") e transformar a área de cadeiras livres em um grid minimalista de horários disponíveis, sem textos/legendas repetitivas ("Divulgar Vaga!").
- **Arquivos e Componentes Afetados:**
  - `KNOWLEDGE_BASE.md` & `ARCHITECTURE.md`:
    - Registro formal das diretrizes obrigatórias **Anti-Box Clutter**: proibição de aninhar caixas com borda dentro de contêineres que já possuem borda, eliminação de divs supérfluas e favorecimento de separação por espaçamento/contraste sutil.
    - Regra estrita de grids: proibição de slogans e legendas repetidas em cada célula de grade.
  - `src/components/PartnerAgendaScreen.tsx`:
    - Remoção do contêiner externo com borda pesada (`bg-slate-900/90 border border-slate-800 rounded-2xl`) que envolvia o seletor de profissionais, substituindo por scroll horizontal limpo e direto.
    - Remoção do contêiner externo com borda pesada e header poluído da seção de cadeiras disponíveis.
    - Implementação de **Grid Minimalista de Horários Livres** (`grid-cols-4`): botões compactos e limpos contendo exclusivamente o horário (ex: `09:00`, `10:00`, `11:00`, etc.).
    - Remoção completa de textos e subtítulos repetidos como "Divulgar Vaga!" de dentro de cada célula.
    - Ao tocar/clicar em qualquer horário do grid, o modal de publicação ("Divulgar Vaga!") é disparado imediatamente com o horário e profissional pré-selecionados.
    - Simplificação e redução de bordas nas linhas de resumo e nos cards operacionais de atendimento.
- **Resultado Visual:**
  - Layout limpo, sem efeito "caixa dentro de caixa", com navegação direta, leveza visual e foco cirúrgico na ação de abrir vagas para horários ociosos.

---

## [2026-09-08] Grid de Horários Organizados para Cadeiras Disponíveis & Modal "Divulgar Vaga!"
- **Motivo da Mudança:** Substituição dos blocos verticais repetitivos e extensos de "Cadeira disponível" por um grid responsivo e organizado de horários livres, onde a seleção de qualquer horário abre diretamente o modal "Divulgar Vaga!".
- **Arquivos e Componentes Afetados:**
  - `src/components/PartnerAgendaScreen.tsx`:
    - Separação lógica entre atendimentos/vagas ativas do dia e horários disponíveis da cadeira.
    - Substituição das divs verticais individuais de "Cadeira disponível" por um contêiner com **Grid de Horários Organizados** (`grid-cols-3 sm:grid-cols-4`).
    - Cada célula do grid apresenta o horário em destaque tipográfico (`font-mono font-black`), indicador `Divulgar Vaga!` com ícone `Zap`, feedback tátil e touch target otimizado (>= 56px).
    - Ao tocar/clicar em qualquer horário do grid, aciona `onOpenFastPublish(activeProf.id, time)` com o horário e profissional pré-preenchidos.
    - Seção dedicada para "Atendimentos & Vagas do Dia" preservando todos os controles operacionais (Sentou na Cadeira, Concluir, No-Show, WhatsApp, Simular Reserva).
    - Limpeza de imports não utilizados conforme o protocolo clean code.
  - `src/components/FastPublishModal.tsx`:
    - Atualização do título do cabeçalho para **"Divulgar Vaga!"** com subtítulo contextual e badge `Flash 5s`.
    - Atualização do botão principal de ação para **"Divulgar Vaga!"**.
- **Resumo Técnico:**
  - Redução drástica da rolagem vertical na tela de agenda da bancada, navegação ágil com padrão mobile-first e abertura instantânea do modal contextual de publicação.

---

## [2026-09-08] Alinhamento Estético Cirúrgico com a Referência Valyioo UX/UI
- **Motivo da Mudança:** O usuário solicitou que o app no lado cliente tenha como modelo, estilo e inspiração visual exata o design do aplicativo de reservas de salão de beleza da referência gráfica enviada ("Valyioo").
- **Arquivos e Componentes Afetados:**
  - `src/components/ClientAppView.tsx`: Reestruturação completa da tela do cliente final com reprodução idêntica dos elementos visuais da imagem:
    - Status bar superior com relógio `9:41`, bateria, sinal e botão discreto de alternância para o modo salão.
    - Cabeçalho limpo com monograma vetorial `V` em terracota suave, nome da marca centralizado (`Valyioo`) e ícone de notificações (`Bell`) com indicador de alerta.
    - Seção de boas-vindas com título `¡Bienvenida!`, subtítulo `Lista para tu mejor versión.`, linha sublinhada decorativa e avatar circular delicado.
    - Botão hero principal de cantos arredondados `Reservar cita` em tom terracota de assinatura (`#AF585C`) com ícone de calendário.
    - Grid de 4 ações rápidas em caixas quadradas arredondadas: `Servicios` (tesoura), `Agenda` (calendário), `Estilistas` (avatar) e `Mensajes` (balão de conversa com badge de notificação `2`).
    - Card retangular branco de `Próxima cita`: `Corte + Balayage` com miniatura de foto de cabelo loiro balayage, data `Sáb, 24 de mayo`, horário `11:00 a. m.` e miniatura de perfil da estilista `María López`.
    - Card com gradiente pêssego/rosé de `Ofertas especiales`: texto `Descubre nuestras promociones`, botão circular de navegação e imagem de cosméticos de luxo.
    - Barra inferior fixa (Bottom Navigation) com as 5 abas idênticas à referência: `Inicio`, `Reservar`, `Servicios`, `Agenda` e `Perfil`, além da barra de home indicator de smartphone.
    - Modais interativos com agendamento instantâneo em 4 passos, catálogo completo de serviços, detalhes da próxima consulta e contato direto por WhatsApp.
  - `src/types.ts` & `src/data/catalogTemplates.ts`: Inclusão do novo template oficial de destaque `valyioo_chic` (Valyioo Chic & Minimalist).
  - `src/data/initialData.ts`: Criação do salão ativo de exemplo `Valyioo Salón de Belleza` com serviços de Balayage e equipe oficial com `María López`.
  - `src/context/EcosystemContext.tsx` & `src/App.tsx`: Inicialização direta na experiência do cliente com imersão total.
- **Resumo Técnico:**
  - Layout 100% responsivo, fidedigno à imagem de inspiração enviada pelo usuário, com todas as transições, botões e ações funcionais conectadas ao ecossistema da bancada.

---

## [2026-09-08] Fábrica de Onboarding em Minutos, Catálogo de Nichos e Visão do Cliente (5 Templates)
- **Motivo da Mudança:** Atendimento à solicitação de cadastrar novos estabelecimentos em minutos, oferecendo um catálogo plug-and-play por segmento (Barbearia, Salão Feminino, Unhas, Cílios, Estética, Misto) e 5 modelos de templates visuais de referência com alternador instantâneo entre o Modo Bancada e a Visão do Cliente Final.
- **Arquivos e Componentes Afetados:**
  - `src/types.ts`: Adição dos tipos `TemplateStyle`, `BusinessNiche`, `TargetAudience` e `SalonService`.
  - `src/data/catalogTemplates.ts`: Catálogo completo por nicho com serviços padrão, duração, preços sugeridos, equipe padrão e definições completas dos 5 templates (Dark Luxury, Organic Warm Beige, Rose Boutique, Clean Editorial, Modern Tech).
  - `src/data/initialData.ts`: Enriquecimento dos estabelecimentos iniciais e mapeamento de serviços por salão (`INITIAL_SERVICES_MAP`).
  - `src/context/EcosystemContext.tsx`: Implementação de `viewMode` ('salon' | 'client'), gerenciador de serviços por salão, fábrica de cadastro instantâneo `createSalonFromOnboarding` e agendamento direto pelo cliente `bookAppointmentFromClient`.
  - `src/components/SalonOnboardingModal.tsx`: Wizard interativo em 5 etapas (Dados Básicos & WhatsApp, Identidade Visual Express, Segmento & Público, Serviços Plug & Play com edição rápida, e Escolha do Template Oficial).
  - `src/components/ClientAppView.tsx`: Experiência do cliente final inspirada nas 3 referências visuais, com banner de boas-vindas sofisticado, grid de 6 atalhos de exploração, carrossel de especialistas, clima e iluminação, catálogo de serviços e modal de agendamento em chips interativos com confirmação em tempo real.
  - `src/components/Header.tsx`: Inclusão do alternador `[👁️ Ver como Cliente / 🛠️ Modo Salão]`, seletor rápido de estabelecimentos ativos e atalho direto para cadastrar novo salão.
  - `src/components/PartnerSettingsScreen.tsx`: Adição do seletor dos 5 templates oficiais para teste imediato de layout e atalho do onboarding.
  - `src/App.tsx`: Chaveamento dinâmico entre a visão do cliente e a bancada de gestão com integração dos novos modais.
- **Resumo Técnico:**
  - O sistema permite agora que qualquer salão seja cadastrado e fique disponível no ar em menos de 5 minutos.
  - O dono do salão pode alternar a qualquer momento para ver exatamente o que seu cliente vivencia, realizar agendamentos de teste (que disparam o alarme sonoro na bancada) e alternar entre os 5 temas visuais inspirados no material de referência.

## [2026-09-08] White-Labeling Estrito & Reestruturação Mobile-First
- **Motivo da Mudança:** Adequar a aplicação para distribuição comercial como produto oficial do próprio estabelecimento, eliminando qualquer vínculo explícito ou confusão de marca, preservando exclusivamente os créditos de tecnologia no rodapé.
- **Arquivos e Componentes Afetados:**
  - `src/App.tsx`: Enquadramento mobile-first rígido (`max-w-md` centralizado) e rodapé sutil de tecnologia.
  - `src/components/Header.tsx`: Substituição de marca por "App Oficial" e nome/logo dinâmico do estabelecimento.
  - `src/components/PartnerAgendaScreen.tsx`: Renomeação de ações ("VAGA ONLINE (AO VIVO)", "Divulgar Vaga Flash").
  - `src/components/FastPublishModal.tsx`: Ajuste de labels e botões para "Publicar Vaga no App Oficial" e correção de touch-targets.
  - `src/components/IncomingBookingAlertModal.tsx`: Sanitização do aviso sonoro/urgente para "Vaga Reservada no App Oficial!".
  - `src/components/PartnerSettingsScreen.tsx`: Remoção de referências externas, adição do crédito tecnológico no rodapé.
  - `src/components/SalonMediaLibraryScreen.tsx`: Padronização de títulos para "Biblioteca de Mídia (5s Stories)" e "Divulgar Vaga".
  - `src/components/PartnerFinancialScreen.tsx`: Atualização de relatórios de ocupação e extrato para o app oficial.
  - `src/context/EcosystemContext.tsx`: Injeção dinâmica de `document.title` vinculado ao nome do estabelecimento ativo e sanitização de logs/notas.
  - `index.html` & `metadata.json`: Alinhamento de `<title>` e `<meta>` tags com o padrão White-Label.
- **Resumo Técnico:**
  - O aplicativo opera como o app oficial proprietário do salão, com personalização em tempo real de logotipo, cores primárias, secundárias, fundo e acento.
  - As únicas menções à criadora permanecem estritamente nos créditos de rodapé ("Tecnologia por Vagou").

---

## 📅 [08/09/2026] - Tradução Completa do Aplicativo para Português (pt-BR)

- **Motivo da Mudança:**
  - Atendimento à solicitação direta do usuário ("traduza o app para portugues cr/"), eliminando todos os termos residuais em espanhol e inglês em todas as telas e fluxos.
- **Arquivos e Componentes Afetados:**
  - `src/components/ClientAppView.tsx`:
    - Aba Início: Saudação "Boas-vindas! Pronta para sua melhor versão.", botão "Agendar Horário", atalhos rápidos ("Serviços", "Agenda", "Especialistas", "Mensagens"), card de "Próximo agendamento" e "Ofertas especiais".
    - Aba Serviços: Título "Catálogo de Serviços", seletor com contador de "opções" e botões de agendamento.
    - Aba Agenda: Título "Meus Agendamentos", status de agendamentos ("CONFIRMADO", "AGENDAMENTO RECENTE"), ações "Mensagem para o salão" e "Adicionar ao calendário".
    - Aba Perfil: Título "Sobre o Salão", selo "Cliente Frequente VIP", ação "Falar pelo WhatsApp".
    - Barra de Navegação Inferior: Abas "Início", "Agendar", "Serviços", "Agenda" e "Perfil".
    - Modal de Agendamento (4 Etapas): Títulos de etapas ("Escolha o Serviço", "Escolha o Profissional", "Data e Horário", "Seus Dados"), campos ("Nome Completo", "WhatsApp para Contato", "Observações"), botões ("Voltar", "Próximo", "Confirmar Agendamento"), tela de sucesso ("Agendamento Confirmado!", "Seu agendamento está pronto!", "Código de Confirmação", "Enviar no WhatsApp", "Fechar").
    - Modais Secundários: "Equipe de Especialistas", "Central de Mensagens" (lembretes e promoções), "Ofertas Especiais" (vagas de última hora e botão "Aproveitar") e "Detalhes do Agendamento" ("Confirmar Presença no WhatsApp", "Reagendar Data ou Horário").
  - `src/components/PartnerAgendaScreen.tsx`:
    - Tradução dos botões de ação de atendimento para "Falta" (antigo "No-Show") e tooltips correspondentes.
- **Resumo Técnico:**
  - Aplicação 100% harmonizada em português brasileiro claro, elegante e profissional, sem misturas linguísticas e mantendo total integridade funcional e estética.

---

## 📅 [09/09/2026] - Remoção dos Cards de Próximo Agendamento e Ofertas Especiais da Home (Focus Mode)

- **Motivo da Mudança:**
  - Atendimento à seleção direta via Focus Mode dos elementos `div:nth-of-type(3) > div:nth-of-type(4)` (card de ofertas especiais) e `div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(2)` (card de próximo agendamento), reduzindo o excesso de caixas com bordas e simplificando a tela inicial.
- **Arquivos e Componentes Afetados:**
  - `src/components/ClientAppView.tsx`:
    - Remoção dos blocos de "Próximo agendamento" e "Ofertas especiais" da aba inicial.
    - Limpeza pós-obra: remoção de estados zumbis (`isOffersModalOpen`, `isNextAppointmentModalOpen`), constante não utilizada (`defaultNextAppointmentProf`), imports não utilizados (`ChevronRight`) e modais mortos associados.
- **Resumo Técnico:**
  - Tela inicial agora apresenta um design limpo, respirado e sem acúmulo de caixas e bordas: cabeçalho de boas-vindas com avatar, botão de ação principal "Agendar Horário" e grid de 4 atalhos rápidos. Todos os agendamentos continuam acessíveis de forma dedicada na aba "Agenda".


