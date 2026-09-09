# 📚 Base de Conhecimento e Diretrizes de UI/UX — Vagou

## 🚫 1. Regra de Ouro: Anti-Box Clutter & Proibição de Excesso de Bordas
**Princípio:** Menos caixas, menos bordas e mais respiro visual.

1. **Proibido Aninhar Caixas com Borda ("Quadrado dentro de Quadrado"):**
   - Nunca coloque elementos com borda (`border border-...`) dentro de contêineres que já possuem borda externa pesada.
   - Se o contêiner pai agrupa os itens, use espaçamento (`gap`, `padding`) e fundo limpo.
   - Evite "div dentro de div dentro de div" puramente decorativas. Achate a árvore de nós sempre que possível.

2. **Hierarquia por Espaçamento e Contraste Sutil:**
   - Em vez de desenhar linhas e bordas cinzas em todos os cantos, utilize sutileza de fundo (`bg-slate-900/50`, `bg-slate-900/30`) ou apenas espaçamento limpo sobre o fundo dark (`slate-950`).
   - Elementos secundários não devem competir visualmente com o conteúdo principal.

3. **Grids de Ação e Horários (Simplicidade Absoluta):**
   - Em grids repetitivos (como os horários livres da cadeira), exiba **apenas a informação essencial** (ex: `09:00`, `10:00`, `11:00`).
   - **JAMAIS repita legendas ou slogans dentro de cada célula** (como "Divulgar Vaga!" repetido 12 vezes).
   - O clique na célula do horário já dispara a ação esperada (abertura do modal de divulgação).

4. **Síntese Mobile e Velocidade:**
   - Telas de bancada de salão são usadas em ritmo acelerado pelo profissional.
   - Menos poluição visual = menor carga cognitiva e agilidade instantânea.
