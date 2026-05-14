# Casos de Teste — Sauce Demo

> **Legenda:** ✅ Passou | ❌ Falhou | ⚠️ Bug Intencional | 🔶 Comportamento Inesperado
>
> Os IDs são preservados para rastreabilidade com os testes automatizados.

---

## Módulo 1: Autenticação (AUTH)

| CT | Descrição | Resultado | Observação |
|----|-----------|-----------|------------|
| CT-AUTH-001 | Login com standard_user | ✅ | Redireciona para `/inventory.html` |
| CT-AUTH-002 | Login com locked_out_user | ✅ | "Epic sadface: Sorry, this user has been locked out." |
| CT-AUTH-003 | Login com problem_user | ⚠️ | Login efetuado; imagens incorretas (BUG-001) |
| CT-AUTH-004 | Login com performance_glitch_user | ⚠️ | Login efetuado com ~3-5s de latência (BUG-004) |
| CT-AUTH-005 | Login com error_user | ⚠️ | Login efetuado; alguns botões geram erros |
| CT-AUTH-006 | Login com visual_user | ⚠️ | Login efetuado; inconsistências de CSS (BUG-005) |
| CT-AUTH-007 | Login sem username | ✅ | "Epic sadface: Username is required" |
| CT-AUTH-008 | Login sem password | ✅ | "Epic sadface: Password is required" |
| CT-AUTH-009 | Login com credenciais inválidas | ✅ | Mensagem de credenciais inválidas exibida |
| CT-AUTH-013 | Logout com sucesso | ✅ | Redireciona para `/` |
| CT-AUTH-014 | Área restrita inacessível após logout | ✅ | Acesso a `/inventory.html` redireciona para login |
| CT-AUTH-015 | Estado do carrinho após logout e re-login | 🔶 | Carrinho persiste via localStorage (BUG-008) |

---

## Módulo 2: Produtos (PROD)

| CT | Descrição | Resultado | Observação |
|----|-----------|-----------|------------|
| CT-PROD-002 | Ordenação A-Z | ✅ | |
| CT-PROD-003 | Ordenação Z-A | ✅ | |
| CT-PROD-004 | Ordenação por preço crescente | ✅ | |
| CT-PROD-005 | Ordenação por preço decrescente | ✅ | |
| CT-PROD-007 | Produtos com nome, descrição, preço e imagem | ✅ | ⚠️ Imagens incorretas para problem_user (BUG-001) |
| CT-PROD-009 | Clique no nome navega para página de detalhe | ✅ | URL: `/inventory-item.html?id=X` |
| CT-PROD-011 | Adicionar produto a partir da listagem | ✅ | Badge do carrinho incrementado |
| CT-PROD-013 | Remover produto a partir da listagem | ✅ | Badge decrementado |
| CT-PROD-014 | Página de detalhe exibe informações corretas | ✅ | |
| CT-PROD-015 | Adicionar produto a partir do detalhe | ✅ | Badge atualizado |

---

## Módulo 3: Carrinho (CART)

| CT | Descrição | Resultado | Observação |
|----|-----------|-----------|------------|
| CT-CART-001 | Carrinho vazio não exibe badge | ✅ | |
| CT-CART-002 | Badge atualizado ao adicionar 1 produto | ✅ | Exibe "1" |
| CT-CART-003 | Múltiplos produtos atualizam o badge corretamente | ✅ | |
| CT-CART-005 | Produto adicionado aparece no carrinho | ✅ | |
| CT-CART-006 | Remover produto do carrinho | ✅ | Carrinho fica vazio |
| CT-CART-007 | Remoção parcial mantém outros itens | ✅ | Apenas o produto selecionado é removido |
| CT-CART-008 | Carrinho persiste ao navegar entre páginas | ✅ | |
| CT-CART-011 | Todos os 6 produtos podem ser adicionados | ✅ | Badge exibe "6" |
| CT-CART-012 | Badge desaparece ao esvaziar o carrinho | ✅ | |

---

## Módulo 4: Checkout (CHK)

| CT | Descrição | Resultado | Observação |
|----|-----------|-----------|------------|
| CT-CHK-001 | Fluxo completo com 1 produto | ✅ | Mensagem de confirmação exibida |
| CT-CHK-002 | Fluxo com múltiplos produtos | ✅ | Total = Subtotal + Tax |
| CT-CHK-003 | Erro ao omitir First Name | ✅ | "Error: First Name is required" |
| CT-CHK-004 | Erro ao omitir Last Name | ✅ | "Error: Last Name is required" |
| CT-CHK-005 | Erro ao omitir Postal Code | ✅ | "Error: Postal Code is required" |
| CT-CHK-006 | Cancelar no Step 1 retorna ao carrinho | ✅ | Redireciona para `/cart.html` |
| CT-CHK-009 | Cálculo do total está correto | ✅ | Diferença < $0.01 |
| CT-CHK-010 | Carrinho vazio após finalizar compra | ✅ | Badge desaparece |

---

## Módulo 5: Navegação (NAV)

| CT | Descrição | Resultado | Observação |
|----|-----------|-----------|------------|
| CT-NAV-001 | Menu hambúrguer abre | ✅ | |
| CT-NAV-002 | Menu exibe todas as opções | ✅ | |
| CT-NAV-004 | "All Items" navega para o inventário | ✅ | |
| CT-NAV-006 | "Reset App State" limpa o carrinho | ✅ | |
| CT-NAV-009 | Acesso a `/inventory.html` sem login redireciona | ✅ | |
| CT-NAV-010 | Acesso a `/cart.html` sem login redireciona | ✅ | |
| CT-NAV-011 | Acesso a `/checkout` sem login redireciona | ✅ | |

---

## Módulo 6: Responsividade (RESP)

| CT | Viewport | Descrição | Resultado |
|----|----------|-----------|-----------|
| CT-RESP-001 | 375×667 (Mobile) | Login funciona | ✅ |
| CT-RESP-002 | 375×667 | Inventário usável | ✅ |
| CT-RESP-003 | 375×667 | Menu hambúrguer abre | ✅ |
| CT-RESP-004 | 375×667 | Adicionar produto ao carrinho | ✅ |
| CT-RESP-005 | 375×667 | Fluxo de checkout completo | ✅ |
| CT-RESP-007 | 375×667 | Botões com área de toque mínima | ✅ |
| CT-RESP-008 | 768×1024 (Tablet) | Login funciona | ✅ |
| CT-RESP-010 | 768×1024 | Checkout funcional | ✅ |

---

## Módulo 7: Acessibilidade (A11Y)

| CT | Descrição | Resultado | Observação |
|----|-----------|-----------|------------|
| CT-A11Y-001 | Página de login sem violações críticas (WCAG AA) | ✅ | 0 violações críticas |
| CT-A11Y-004 | Navegação por teclado na página de login | ✅ | Tab flow correto |
| CT-A11Y-005 | Login realizado apenas com teclado | ✅ | Enter submete o formulário |
| CT-A11Y-006 | Página de inventário sem violações críticas | ✅ | select-name documentado (BUG-009) |
| CT-A11Y-007 | Imagens dos produtos com texto alternativo | 🔶 | Alt presente, mas genérico |
| CT-A11Y-010 | Ícone do carrinho acessível | ✅ | Sem violações link-name |
| CT-A11Y-011 | Contraste de cores | 🔶 | Violações "serious" presentes |
| CT-A11Y-012 | Estrutura de headings semântica | 🔶 | `.title` é `<span>`, não `<h1>` (BUG-006) |
| CT-A11Y-013 | Página do carrinho sem violações críticas | ✅ | 0 violações críticas |
| CT-A11Y-015 | Checkout step 1 sem violações críticas | ✅ | 0 violações críticas |
| CT-A11Y-016 | Campos do checkout acessíveis por teclado | ✅ | |
