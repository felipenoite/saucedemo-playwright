# Sugestões de Melhoria — Sauce Demo

## 1. Melhorias de Funcionalidade

### SM-F01: Controle de quantidade no carrinho

**Problema:** Atualmente não é possível alterar a quantidade de um item; o usuário só pode remover completamente e adicionar novamente.

**Sugestão:** Adicionar controles de quantidade (+ / −) diretamente nos itens do carrinho, com validação mínima de 1.

**Impacto:** Alta melhoria de UX; redução de abandono de carrinho.

---

### SM-F02: Limpar carrinho ao fazer logout

**Problema:** O carrinho persiste na chave `cart-contents` do `localStorage` após o logout e é restaurado ao fazer login novamente na mesma sessão (BUG-008). Em dispositivos compartilhados, um usuário pode visualizar itens adicionados por uma sessão anterior.

**Sugestão:** Limpar a chave `cart-contents` do `localStorage` durante o processo de logout, garantindo privacidade entre sessões distintas.

**Impacto:** Melhoria de privacidade e segurança, especialmente em dispositivos compartilhados.

---

### SM-F03: Validação de formato do CEP/Postal Code

**Problema:** O campo Postal Code aceita qualquer string sem validação (BUG-007).

**Sugestão:**
- Validar formato por país (ex.: Brasil: `XXXXX-XXX`, EUA: `XXXXX` ou `XXXXX-XXXX`)
- Exibir mensagem de erro específica para formato inválido
- Considerar integração com API de CEP (ex.: ViaCEP) para preenchimento automático de endereço

---

### SM-F04: Filtros de categoria/tipo de produto

**Problema:** Existe apenas ordenação, não há filtros por categoria ou faixa de preço.

**Sugestão:** Adicionar painel de filtros lateral com:
- Filtro por categoria (apparel, accessories, etc.)
- Filtro por faixa de preço (slider ou checkboxes)
- Combinação de múltiplos filtros

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

**Sugestão:** Adicionar campo de busca no header da página de inventário, com filtro em tempo real (client-side) ou via API.

---

## 2. Melhorias de Acessibilidade (WCAG 2.1)

### SM-A01: Usar elementos semânticos para títulos de página

**Problema:** O título "Products" usa `<span class="title">` em vez de `<h1>`.

**Sugestão:**
```html
<!-- Atual -->
<span class="title">Products</span>

<!-- Proposto -->
<h1 class="title">Products</h1>
```

**Referência:** WCAG 2.1 — Critério 1.3.1 (Info and Relationships)

---

### SM-A02: Melhorar contraste de cores

**Problema:** Alguns elementos não atingem proporção de contraste mínima de 4.5:1 (WCAG AA).

**Sugestão:**
- Auditar paleta de cores com ferramentas como Colour Contrast Analyser
- Ajustar cores de texto secundário, placeholders e botões desabilitados
- Adicionar modo de alto contraste (prefers-contrast media query)

---

### SM-A03: Adicionar `aria-live` para feedback dinâmico

**Problema:** Mudanças dinâmicas (badge do carrinho, mensagens de erro) não são anunciadas por leitores de tela.

**Sugestão:**
```html
<span class="shopping_cart_badge" aria-live="polite" aria-label="Itens no carrinho: 3">3</span>
```

---

### SM-A04: Links externos com indicação visual e atributos corretos

**Problema:** Link "About" abre saucelabs.com na mesma aba sem aviso ao usuário.

**Sugestão:**
```html
<a href="https://saucelabs.com" target="_blank" rel="noopener noreferrer" 
   aria-label="About Sauce Labs (abre em nova aba)">
  About
  <span class="sr-only">(abre em nova aba)</span>
</a>
```

---

### SM-A05: Skip link para conteúdo principal

**Problema:** Usuários de teclado precisam navegar por todo o header em cada página.

**Sugestão:** Adicionar link "Pular para o conteúdo" como primeiro elemento focável:
```html
<a href="#main-content" class="skip-link">Pular para o conteúdo principal</a>
```

---

## 3. Melhorias de UX/UI

### SM-U01: Confirmação antes de finalizar compra

**Problema:** Clique acidental em "Finish" finaliza a compra sem confirmação (BUG-008).

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

## 4. Melhorias de Segurança

### SM-S01: Rate limiting no login

**Sugestão:** Implementar bloqueio temporário após N tentativas falhas de login (ex.: 5 tentativas em 15 minutos), com CAPTCHA opcional.

---

### SM-S02: Tokens CSRF nos formulários

**Sugestão:** Adicionar tokens CSRF em todos os formulários POST para prevenir ataques de Cross-Site Request Forgery.

---

### SM-S03: Headers de segurança HTTP

**Sugestão:** Implementar headers de segurança:
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
```

---

## 5. Melhorias de Qualidade do Código / Testabilidade

### SM-Q01: Manter atributos `data-test` em todos os elementos interativos

**Observação Positiva:** O Sauce Demo já utiliza atributos `data-test` na maioria dos elementos. Esta prática é excelente para automação de testes.

**Sugestão:** Estender o uso para todos os elementos relevantes, incluindo mensagens de estado e elementos dinâmicos.

---

### SM-Q02: Implementar API para testes de integração

**Sugestão:** Expor endpoints de API para setup/teardown de estado de testes, permitindo:
- Reset de carrinho via API
- Criação de usuários de teste programaticamente
- Verificação de estado do servidor

---

### SM-Q03: Adicionar variável de ambiente para URL base

**Sugestão:** Permitir configuração da URL base via variável de ambiente para facilitar testes em diferentes ambientes (dev, staging, prod):
```bash
BASE_URL=https://staging.saucedemo.com npx playwright test
```

---

## 6. Priorização das Melhorias

| ID | Sugestão | Esforço | Impacto | Prioridade |
|----|---------|---------|---------|-----------|
| SM-A01 | Headings semânticos | Baixo | Médio | 🔴 Alta |
| SM-A02 | Contraste de cores | Médio | Alto | 🔴 Alta |
| SM-F03 | Validação CEP | Baixo | Alto | 🔴 Alta |
| SM-F05 | Toast notification | Baixo | Médio | 🟡 Média |
| SM-A03 | aria-live dinâmico | Baixo | Médio | 🟡 Média |
| SM-F01 | Quantidade no carrinho | Médio | Alto | 🟡 Média |
| SM-U01 | Confirmação de compra | Baixo | Médio | 🟡 Média |
| SM-A05 | Skip link | Baixo | Baixo | 🟢 Baixa |
| SM-F02 | Limpar carrinho no logout | Baixo | Alto | 🔴 Alta |
| SM-F04 | Filtros de categoria | Alto | Médio | 🟢 Baixa |
| SM-F06 | Busca de produtos | Alto | Médio | 🟢 Baixa |
| SM-S01 | Rate limiting | Médio | Alto | 🟡 Média |
