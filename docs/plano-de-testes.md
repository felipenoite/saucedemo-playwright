# Plano de Testes — Sauce Demo

## 1. Objetivo

Validar a qualidade funcional, de usabilidade, responsividade e acessibilidade da plataforma Sauce Demo (`https://www.saucedemo.com`), garantindo que os fluxos críticos de negócio funcionem corretamente para todos os tipos de usuário suportados.

---

## 2. Escopo

### Em Escopo

| Área | Funcionalidades |
|------|----------------|
| Autenticação | Login, Logout, Validação de credenciais |
| Produtos | Listagem, Ordenação, Detalhes |
| Carrinho | Adicionar, Remover, Persistência |
| Checkout | Preenchimento de dados, Validações, Finalização |
| Navegação | Menu lateral, Rotas, Redirecionamentos |
| Responsividade | Mobile, Tablet, Desktop, Widescreen |
| Acessibilidade | WCAG 2.1 AA, Navegação por teclado |

### Fora do Escopo

- Testes de performance de carga (JMeter, k6)
- Penetration testing
- Testes de integração com sistemas de pagamento reais
- Testes de banco de dados

---

## 3. Tipos de Usuários

| Usuário | Senha | Comportamento |
|---------|-------|---------------|
| `standard_user` | `secret_sauce` | Fluxo normal |
| `locked_out_user` | `secret_sauce` | Bloqueado — não consegue fazer login |
| `problem_user` | `secret_sauce` | Bugs simulados: imagens erradas, filtros quebrados |
| `performance_glitch_user` | `secret_sauce` | Login com ~5s de latência adicional |
| `error_user` | `secret_sauce` | Alguns botões/ações geram erros simulados |
| `visual_user` | `secret_sauce` | Bugs visuais/CSS |

---

## 4. Abordagem

- **Caixa Preta (Black Box):** testes focados no comportamento externo da aplicação
- **Orientado a Fluxo:** prioridade para jornadas completas do usuário
- **Cross-Browser:** execução em Chromium, Firefox e WebKit

---

## 5. Ambiente de Testes

| Item | Valor |
|------|-------|
| URL Base | `https://www.saucedemo.com` |
| Framework | Playwright v1.52 |
| Linguagem | TypeScript |
| Browsers | Chromium, Firefox, WebKit |
| Viewports | 375px, 768px, 1280px, 1920px |
| Node.js | v18+ |

---

## 6. Critérios de Entrada e Saída

**Entrada:**
- Ambiente disponível e acessível
- Dependências instaladas (`npm install` e `npx playwright install`)

**Saída:**
- 100% dos casos executados com taxa de aprovação ≥ 90%
- Relatório HTML gerado em `playwright-report/`
- Bugs documentados com severidade e passos de reprodução

---

## 7. Distribuição dos Casos de Teste

| Módulo | Casos | Nível |
|--------|-------|-------|
| Autenticação / Login | 12 | Nível 1 |
| Produtos | 10 | Nível 1 |
| Carrinho | 9 | Nível 1 |
| Checkout | 8 | Nível 1 |
| Navegação | 7 | Nível 1 |
| Responsividade | 8 | Nível 2 |
| Acessibilidade | 11 | Nível 2 |
| **Total** | **65** | — |

---

## 8. Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Indisponibilidade do ambiente externo | Média | Alto | Retries automáticos configurados |
| Mudanças no layout | Baixa | Médio | Seletores `data-test` estáveis |
| Flakiness por race conditions | Média | Médio | `waitForURL`, `waitForSelector` |
| Bugs intencionais do `problem_user` | Alta | Baixo | Testes isolados por tipo de usuário |

---

## 9. Ferramentas

| Ferramenta | Versão | Finalidade |
|-----------|--------|-----------|
| Playwright | ^1.52 | Automação E2E |
| @axe-core/playwright | ^4.x | Acessibilidade automatizada |
| TypeScript | ^5.x | Tipagem estática |
| Node.js | 18+ | Runtime |

---

## 10. Premissas

1. O Sauce Demo é uma aplicação de demonstração — alguns comportamentos defeituosos são **intencionais**
2. Não há autenticação de dois fatores (2FA)
3. Os dados de produtos e preços são fixos entre sessões
4. O ambiente de execução tem acesso à internet
5. A taxa de imposto (~8%) é calculada automaticamente pela aplicação
