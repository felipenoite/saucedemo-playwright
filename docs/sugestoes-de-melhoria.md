# Sugestões de Melhoria — Sauce Demo

## 1. Melhorias de Funcionalidade

### SM-F01: Controle de quantidade no carrinho

**Problema:** Atualmente não é possível alterar a quantidade de um item; o usuário só pode remover completamente e adicionar novamente.

**Sugestão:** Adicionar controles de quantidade (+ / −) diretamente nos itens do carrinho, com validação mínima de 1.

**Impacto:** Alta melhoria de UX; redução de abandono de carrinho.

---

### SM-F02: Limpar carrinho ao fazer logout

**Problema:** O carrinho persiste na chave `cart-contents` do `localStorage` após o logout e é restaurado ao fazer login novamente na mesma sessão do browser (BUG-008). Em dispositivos compartilhados, um usuário pode visualizar itens adicionados por uma sessão anterior.

**Sugestão:** Limpar a chave `cart-contents` do `localStorage` durante o processo de logout, garantindo privacidade entre sessões distintas.

**Impacto:** Melhoria de privacidade, especialmente em dispositivos compartilhados.

---

### SM-F03: Validação de formato do CEP/Postal Code

**Problema:** O campo Postal Code aceita qualquer string sem validação (BUG-007).

**Sugestão:**
- Validar formato por país (ex.: Brasil: `XXXXX-XXX`, EUA: `XXXXX` ou `XXXXX-XXXX`)
- Exibir mensagem de erro específica para formato inválido

---

### SM-F04: Filtros de categoria/tipo de produto

**Problema:** Existe apenas ordenação, não há filtros por categoria ou faixa de preço.

**Sugestão:** Adicionar painel de filtros com:
- Filtro por categoria (apparel, accessories, etc.)
- Filtro por faixa de preço

---

### SM-F05: Toast notification ao adicionar ao carrinho

**Problema:** Sem feedback visual imediato ao adicionar produto, especialmente em mobile.

**Sugestão:** Exibir uma notificação temporária (toast) confirmando a ação:

```
✅ "Sauce Labs Backpack" adicionado ao carrinho  [Ver Carrinho]
```

---

### SM-F06: Busca de produtos

**Problema:** Não há mecanismo de busca por nome ou descrição de produto.

**Sugestão:** Adicionar campo de busca no header da página de inventário, com filtro em tempo real.

---

## 2. Melhorias de UX/UI

### SM-U01: Confirmação antes de finalizar compra

**Problema:** Clique acidental em "Finish" finaliza a compra sem confirmação.

**Sugestão:** Exibir modal de confirmação antes de finalizar, com resumo do valor total e opções de cancelar ou confirmar.

---

### SM-U02: Histórico de pedidos

**Sugestão:** Após completar uma compra, oferecer acesso a histórico de pedidos no perfil do usuário, com status de rastreamento.

---

### SM-U03: Página de erro amigável

**Sugestão:** Substituir páginas de erro genéricas por páginas customizadas com:
- Mensagem clara do problema
- Sugestões de ação (voltar, tentar novamente, contato)
- Link para a página inicial

---

## 3. Melhorias de Qualidade do Código / Testabilidade

### SM-Q01: Manter atributos `data-test` em todos os elementos interativos

**Observação Positiva:** O Sauce Demo já utiliza atributos `data-test` na maioria dos elementos. Esta prática é excelente para automação de testes.

**Sugestão:** Estender o uso para todos os elementos relevantes, incluindo mensagens de estado e elementos dinâmicos.

---

## 4. Priorização das Melhorias

| ID | Sugestão | Esforço | Impacto | Prioridade |
|----|---------|---------|---------|-----------|
| SM-F03 | Validação CEP | Baixo | Alto | 🔴 Alta |
| SM-F02 | Limpar carrinho no logout | Baixo | Alto | 🔴 Alta |
| SM-F05 | Toast notification | Baixo | Médio | 🟡 Média |
| SM-F01 | Quantidade no carrinho | Médio | Alto | 🟡 Média |
| SM-U01 | Confirmação de compra | Baixo | Médio | 🟡 Média |
| SM-U03 | Página de erro amigável | Baixo | Médio | 🟡 Média |
| SM-F04 | Filtros de categoria | Alto | Médio | 🟢 Baixa |
| SM-F06 | Busca de produtos | Alto | Médio | 🟢 Baixa |
| SM-U02 | Histórico de pedidos | Alto | Médio | 🟢 Baixa |
| SM-Q01 | Atributos data-test | Baixo | Baixo | 🟢 Baixa |
