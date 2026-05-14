# Análise de Riscos — Sauce Demo

Riscos avaliados por **Probabilidade** (P) e **Impacto** (I) em escala de 1 a 5. Exposição = P × I.

---

## Riscos de Produto

### RISCO-P01: Falha no fluxo de checkout
- **P:** 2 | **I:** 5 | **Exposição:** 10 (Alto)
- **Descrição:** Defeito no checkout impede finalização de compras, resultando em perda direta de receita.
- **Mitigação:** Testes E2E cobrindo todos os cenários de checkout (CT-CHK-001 a CT-CHK-010); regressão a cada deploy.

---

### RISCO-P02: Bloqueio de usuários legítimos
- **P:** 1 | **I:** 5 | **Exposição:** 5 (Médio)
- **Descrição:** Usuários válidos podem ser bloqueados inadvertidamente por mecanismo similar ao `locked_out_user`.
- **Mitigação:** Testes com todos os tipos de usuário (CT-AUTH-001 a CT-AUTH-006).

---

### RISCO-P03: Persistência indevida do carrinho entre sessões
- **P:** 3 | **I:** 3 | **Exposição:** 9 (Médio)
- **Descrição:** O carrinho persiste na chave `cart-contents` do `localStorage` após o logout (BUG-008). Em dispositivos compartilhados, um usuário pode visualizar itens adicionados por sessão anterior.
- **Mitigação:** CT-AUTH-015 documenta o comportamento; correção sugerida em `sugestoes-de-melhoria.md` (SM-F02).

---

### RISCO-P04: Validação insuficiente de campos de formulário
- **P:** 4 | **I:** 3 | **Exposição:** 12 (Alto)
- **Descrição:** O campo Postal Code aceita qualquer valor sem validação de formato (BUG-007). Em produção real, causaria falhas de entrega.
- **Mitigação:** Implementar validação de formato por país; revisar todos os campos de entrada.

---

### RISCO-P05: Problemas de acessibilidade excluindo usuários com deficiência
- **P:** 4 | **I:** 4 | **Exposição:** 16 (Muito Alto)
- **Descrição:** Violações WCAG identificadas (BUG-006, BUG-009) podem excluir usuários com deficiência visual e expor a empresa a riscos legais.
- **Mitigação:** Testes automatizados com axe-core (CT-A11Y-001 a CT-A11Y-016); adotar WCAG 2.1 AA como requisito obrigatório.

---

### RISCO-P06: Performance degradada com múltiplos usuários
- **P:** 3 | **I:** 4 | **Exposição:** 12 (Alto)
- **Descrição:** A latência do `performance_glitch_user` simula comportamento real sob carga. Em produção, pode haver degradação em horários de pico.
- **Mitigação:** Testes de carga com ferramentas dedicadas (k6, JMeter); definir SLAs de tempo de resposta.

---

## Riscos de Processo

### RISCO-T01: Flakiness em testes automatizados
- **P:** 3 | **I:** 2 | **Exposição:** 6 (Médio)
- **Descrição:** Testes E2E podem ser instáveis por race conditions, variações de rede ou animações.
- **Mitigação:** `waitForURL`/`waitForSelector` explícitos; retries configurados no `playwright.config.ts`.

---

### RISCO-T02: Cobertura insuficiente de edge cases
- **P:** 2 | **I:** 3 | **Exposição:** 6 (Médio)
- **Descrição:** Cenários com caracteres especiais, strings longas ou valores extremos podem não estar cobertos.
- **Mitigação:** Boundary value analysis; fuzz testing em iterações futuras.

---

### RISCO-T03: Dependência de ambiente externo
- **P:** 2 | **I:** 5 | **Exposição:** 10 (Alto)
- **Descrição:** Todos os testes dependem de `saucedemo.com`. Indisponibilidade causa falha em 100% dos testes.
- **Mitigação:** Retries configurados; monitoramento de uptime; distinção entre falha de ambiente e falha de teste em CI/CD.

---

## Resumo

| Risco | Exposição | Prioridade |
|-------|-----------|-----------|
| RISCO-P05 — Acessibilidade | 16 | Alta |
| RISCO-P04 — Validação de campos | 12 | Alta |
| RISCO-P06 — Performance | 12 | Alta |
| RISCO-P01 — Checkout | 10 | Alta |
| RISCO-T03 — Dependência externa | 10 | Alta |
| RISCO-P03 — Persistência do carrinho | 9 | Média |
| RISCO-T01 — Flakiness | 6 | Média |
| RISCO-T02 — Cobertura | 6 | Média |
| RISCO-P02 — Bloqueio de usuário | 5 | Baixa |
