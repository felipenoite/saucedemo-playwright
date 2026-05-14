# Playwright SauceDemo — Teste Prático QA

Projeto de automação de testes end-to-end para a plataforma de e-commerce [Sauce Demo](https://www.saucedemo.com) utilizando **Playwright** e **TypeScript**.

---

## Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar os Testes](#como-executar-os-testes)
- [Evidências de Execução](#evidências-de-execução)
- [Relatórios](#relatórios)
- [Cobertura de Testes](#cobertura-de-testes)
- [Premissas Assumidas](#premissas-assumidas)
- [Ferramentas Utilizadas](#ferramentas-utilizadas)
- [Documentação Técnica](#documentação-técnica)

---

## Visão Geral

Este projeto implementa uma suíte completa de testes automatizados E2E cobrindo:

- **Nível 1 (Obrigatório):** Login, Ordenação/Filtragem de Produtos, Fluxo de Compra, Carrinho, Navegação e Logout
- **Nível 2 (Diferencial):** Testes de Responsividade (mobile/tablet/desktop) e Acessibilidade (WCAG 2.1 AA via axe-core)

### Arquitetura

O projeto segue o padrão **Page Object Model (POM)** para separar a lógica dos testes das implementações de interação com a UI, facilitando manutenção e legibilidade.

---

## Pré-requisitos

| Ferramenta | Versão Mínima |
|-----------|--------------|
| [Node.js](https://nodejs.org/) | 18.x |
| [npm](https://www.npmjs.com/) | 9.x |
| Acesso à internet | — |

> **Windows:** Certifique-se de executar o terminal como Administrador caso encontre erros de permissão.

---

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/felipenoite/saucedemo-playwright.git
cd saucedemo-playwright
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Instalar os browsers do Playwright

```bash
npx playwright install
```

Para instalar apenas browsers específicos:
```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

---

## Estrutura do Projeto

```
playwright-saucedemo/
├── playwright.config.ts          # Configuração principal do Playwright
├── tsconfig.json                 # Configuração TypeScript
├── package.json
│
├── pages/                        # Page Objects (POM)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── ProductDetailPage.ts
│   └── NavigationMenu.ts
│
├── fixtures/
│   └── auth.fixture.ts           # Fixture customizada com usuário autenticado
│
├── utils/
│   └── constants.ts              # Constantes: usuários, URLs, mensagens de erro
│
├── tests/
│   ├── auth/
│   │   └── login.spec.ts         # 12 casos: login, logout, validações
│   ├── products/
│   │   └── products.spec.ts      # 10 casos: listagem, ordenação, detalhe
│   ├── cart/
│   │   └── cart.spec.ts          # 9 casos: adicionar, remover, persistência
│   ├── checkout/
│   │   └── checkout.spec.ts      # 8 casos: fluxo completo, validações
│   ├── navigation/
│   │   └── navigation.spec.ts    # 7 casos: menu, rotas, redirecionamentos
│   ├── responsiveness/
│   │   └── responsiveness.spec.ts # 8 casos: mobile, tablet
│   └── accessibility/
│       └── accessibility.spec.ts  # 11 casos: WCAG AA, teclado, axe-core
│
├── docs/
│   ├── plano-de-testes.md        # Plano de Testes completo
│   ├── casos-de-teste.md         # Casos de teste com resultados
│   ├── analise-de-bugs.md        # Análise detalhada de bugs
│   ├── analise-de-riscos.md      # Matriz de riscos
│   └── sugestoes-de-melhoria.md  # Sugestões de melhoria
│
├── playwright-report/            # Relatório HTML (gerado após execução)
└── test-results/                 # Resultados JSON, screenshots, traces
```

---

## Como Executar os Testes

### Executar todos os testes (todos os browsers)

```bash
npx playwright test
```

### Executar apenas em Chromium

```bash
npx playwright test --project=chromium
```

### Executar apenas em Firefox

```bash
npx playwright test --project=firefox
```

### Executar apenas em WebKit (Safari)

```bash
npx playwright test --project=webkit
```

### Executar um módulo específico

```bash
# Apenas testes de autenticação
npx playwright test tests/auth/

# Apenas testes de produtos
npx playwright test tests/products/

# Apenas testes de carrinho
npx playwright test tests/cart/

# Apenas testes de checkout
npx playwright test tests/checkout/

# Apenas testes de navegação
npx playwright test tests/navigation/

# Apenas testes de responsividade (Nível 2)
npx playwright test tests/responsiveness/

# Apenas testes de acessibilidade (Nível 2)
npx playwright test tests/accessibility/
```

### Executar apenas testes de Nível 1 (Obrigatório)

```bash
npx playwright test tests/auth/ tests/products/ tests/cart/ tests/checkout/ tests/navigation/
```

### Executar em modo headed (com browser visível)

```bash
npx playwright test --headed
```

### Executar no modo UI (interface visual do Playwright)

```bash
npx playwright test --ui
```

### Executar em modo debug (step-by-step)

```bash
npx playwright test --debug
```

### Executar por tag/grep (filtro por nome do teste)

```bash
# Executar apenas casos de login
npx playwright test --grep "CT-AUTH"

# Executar apenas casos de checkout
npx playwright test --grep "CT-CHK"

# Executar apenas testes de acessibilidade
npx playwright test --grep "CT-A11Y"
```

### Executar testes de responsividade (mobile/tablet)

```bash
npx playwright test tests/responsiveness/ --project=mobile-chrome
npx playwright test tests/responsiveness/ --project=mobile-safari
npx playwright test tests/responsiveness/ --project=tablet
```

---

## Evidências de Execução

A suíte foi executada com os browsers Chromium e Firefox. Os artefatos gerados estão disponíveis localmente:

| Artefato | Localização | Descrição |
|----------|------------|-----------|
| Relatório HTML | `playwright-report/index.html` | Visão completa por teste, browser e grupo |
| Screenshots por teste | `test-results/*/test-finished-1.png` | Captura do estado final de cada caso |
| Traces | `test-results/*/trace.zip` | Gravação completa para debug (quando ativado) |

### Resumo de execução

| Browser / Projeto | Casos executados | Observação |
|-------------------|:----------------:|-----------|
| chromium | 65 | Todos os módulos |
| firefox | 65 | Todos os módulos |
| webkit | 65 | Todos os módulos |
| mobile-chrome | 8 | Apenas responsividade (Pixel 5) |
| mobile-safari | 8 | Apenas responsividade (iPhone 13) |
| tablet | 8 | Apenas responsividade (iPad gen 7) |
| **Total de instâncias** | **219** | 65×3 desktop + 8×3 mobile/tablet |

> Para visualizar o relatório interativo após uma execução: `npx playwright show-report`

---

## Relatórios

### Visualizar relatório HTML após execução

```bash
npx playwright show-report
```

O relatório é gerado em `playwright-report/index.html` e inclui:
- Resultado de cada caso de teste
- Screenshots em caso de falha
- Vídeos em caso de falha (primeira retry)
- Traces para debug detalhado

### Relatório JSON

Disponível em `test-results/results.json` após a execução.

---

## Cobertura de Testes

| Módulo | Casos de Teste | Nível |
|--------|---------------|-------|
| Autenticação / Login | 12 | Nível 1 ✅ |
| Produtos (listagem + detalhe) | 10 | Nível 1 ✅ |
| Carrinho | 9 | Nível 1 ✅ |
| Checkout (fluxo completo) | 8 | Nível 1 ✅ |
| Navegação | 7 | Nível 1 ✅ |
| Responsividade | 8 | Nível 2 ✅ |
| Acessibilidade | 11 | Nível 2 ✅ |
| **Total** | **65** | — |

### Usuários Testados

| Usuário | Cenários Cobertos |
|---------|-----------------|
| `standard_user` | Todos os fluxos principais |
| `locked_out_user` | Validação de bloqueio |
| `problem_user` | Login + identificação de bugs intencionais |
| `performance_glitch_user` | Login com timeout aumentado |
| `error_user` | Login |
| `visual_user` | Login |

---

## Premissas Assumidas

1. **Ambiente:** Os testes são executados contra o ambiente de produção do Sauce Demo (`https://www.saucedemo.com`), que é uma aplicação pública de demonstração.

2. **Bugs Intencionais:** A aplicação contém bugs propositais para certos usuários (`problem_user`, `visual_user`, `error_user`). Os testes para esses usuários são escritos para **documentar** o comportamento existente, não para reprová-lo como falha.

3. **Estado inicial:** Cada teste que requer autenticação utiliza a fixture `authenticatedPage`, que faz login como `standard_user` antes de cada teste. O estado do carrinho é resetado via "Reset App State" quando necessário.

4. **Sem Mock:** Todos os testes interagem com a aplicação real. Não há mocking de APIs.

5. **Persistência de sessão:** O carrinho persiste via `localStorage` e **não é limpo ao fazer logout** — o item permanece ao fazer login novamente na mesma sessão do browser. Este comportamento está documentado como BUG-008 (veja [docs/analise-de-bugs.md](docs/analise-de-bugs.md)).

6. **Taxa de imposto:** A taxa (~8%) é calculada automaticamente pela aplicação. Os testes validam a consistência matemática (total = subtotal + tax), não o valor exato da taxa.

7. **Formato de CEP:** O campo aceita qualquer string sem validação de formato. Este comportamento foi documentado como bug (BUG-007) e sugestão de melhoria (SM-F03).

8. **Cross-browser:** Os testes de Nível 1 e 2 são executados em Chromium, Firefox e WebKit. Os testes de responsividade têm projetos dedicados para mobile e tablet.

---

## Ferramentas Utilizadas

| Ferramenta | Versão | Finalidade |
|-----------|--------|-----------|
| [Playwright](https://playwright.dev/) | ^1.52 | Framework de automação E2E |
| [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) | ^4.x | Testes de acessibilidade automatizados |
| [TypeScript](https://www.typescriptlang.org/) | ^5.x | Tipagem estática e melhor DX |
| [Node.js](https://nodejs.org/) | 18+ | Runtime |

### Por que Playwright?

- Suporte nativo a múltiplos browsers (Chromium, Firefox, WebKit)
- Auto-waiting integrado (reduz flakiness)
- Excelente suporte a TypeScript
- Relatórios HTML built-in
- Suporte a tracing, screenshots e vídeos
- Padrão de mercado para automação web moderna

### Por que axe-core?

- Biblioteca de acessibilidade mais usada na indústria
- Integração oficial com Playwright
- Cobre regras WCAG 2.0, 2.1 e 2.2
- Relatórios detalhados com descrição e sugestões de correção

---

## Documentação Técnica

| Documento | Localização | Descrição |
|-----------|------------|-----------|
| Plano de Testes | [docs/plano-de-testes.md](docs/plano-de-testes.md) | Estratégia, escopo, critérios e cronograma |
| Casos de Teste | [docs/casos-de-teste.md](docs/casos-de-teste.md) | 65 casos com resultados esperados e reais |
| Análise de Bugs | [docs/analise-de-bugs.md](docs/analise-de-bugs.md) | 12 bugs documentados com severidade |
| Análise de Riscos | [docs/analise-de-riscos.md](docs/analise-de-riscos.md) | Matriz de riscos com mitigações |
| Sugestões de Melhoria | [docs/sugestoes-de-melhoria.md](docs/sugestoes-de-melhoria.md) | 12 sugestões priorizadas |

---

## Contato e Dúvidas

**Autor:** Felipe Noite  
**E-mail:** felipeasnoite@gmail.com

---

> Este projeto foi desenvolvido como parte de um teste prático de QA Engineering, demonstrando habilidades em automação de testes, documentação técnica e pensamento crítico sobre qualidade de software.
