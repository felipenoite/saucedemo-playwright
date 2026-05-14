# Análise de Bugs — Sauce Demo

> **Nota:** O Sauce Demo é uma aplicação de demonstração que **intencionalmente** contém bugs para fins de treinamento. Os bugs abaixo estão divididos entre **bugs intencionais** (por design) e **bugs confirmados** identificados durante os testes. Itens de melhoria de UX e features ausentes foram movidos para [sugestoes-de-melhoria.md](sugestoes-de-melhoria.md).

---

## Bugs Intencionais por Tipo de Usuário

### BUG-001: problem_user — Imagens de produtos incorretas

| Atributo | Detalhe |
|----------|---------|
| **ID** | BUG-001 |
| **Tipo** | Intencional (por design) |
| **Usuário** | `problem_user` |
| **Severidade** | Alta |
| **Componente** | Página de Inventário |

**Descrição:** Ao logar com `problem_user`, todas as imagens dos produtos exibem a mesma imagem (cachorro), independente do produto real.

**Passos para Reproduzir:**
1. Acessar `https://www.saucedemo.com`
2. Fazer login com `problem_user` / `secret_sauce`
3. Observar as imagens na listagem de produtos

**Resultado Atual:** Todas as imagens mostram a foto de um cachorro
**Resultado Esperado:** Cada produto deve exibir sua própria imagem

**Impacto:** Usuários não conseguem identificar os produtos visualmente, prejudicando a experiência de compra.

---

### BUG-002: problem_user — Ordenação por nome não funciona

| Atributo | Detalhe |
|----------|---------|
| **ID** | BUG-002 |
| **Tipo** | Intencional (por design) |
| **Usuário** | `problem_user` |
| **Severidade** | Média |
| **Componente** | Dropdown de ordenação |

**Descrição:** Para o `problem_user`, selecionar "Name (Z to A)" não reordena os produtos corretamente.

**Impacto:** Usuários não conseguem localizar produtos por nome de forma eficiente.

---

### BUG-003: problem_user — Botão "Add to cart" de alguns produtos não funciona

| Atributo | Detalhe |
|----------|---------|
| **ID** | BUG-003 |
| **Tipo** | Intencional (por design) |
| **Usuário** | `problem_user` |
| **Severidade** | Crítica |
| **Componente** | Botão Add to Cart |

**Descrição:** Para produtos específicos (ex.: Sauce Labs Fleece Jacket), o botão "Add to cart" não adiciona o item ao carrinho.

**Impacto:** Usuário não consegue completar a jornada de compra.

---

### BUG-004: performance_glitch_user — Latência no login

| Atributo | Detalhe |
|----------|---------|
| **ID** | BUG-004 |
| **Tipo** | Intencional (por design) |
| **Usuário** | `performance_glitch_user` |
| **Severidade** | Média |
| **Componente** | Autenticação |

**Descrição:** O login demora entre 3 a 5 segundos além do tempo normal.

**Impacto:** Pode ser confundido com falha de autenticação em ambientes com timeout baixo.

---

### BUG-005: visual_user — Botão de carrinho mal posicionado

| Atributo | Detalhe |
|----------|---------|
| **ID** | BUG-005 |
| **Tipo** | Intencional (por design) |
| **Usuário** | `visual_user` |
| **Severidade** | Baixa |
| **Componente** | Botão Add to Cart |

**Descrição:** O botão "Add to cart" de alguns produtos aparece desalinhado ou com estilos CSS incorretos.

---

## Bugs Confirmados (Não Intencionais)

### BUG-006: Título da página não usa tag semântica `<h1>`

| Atributo | Detalhe |
|----------|---------|
| **ID** | BUG-006 |
| **Tipo** | Acessibilidade / SEO |
| **Usuário** | Todos |
| **Severidade** | Baixa |
| **Componente** | Todas as páginas |
| **Evidência** | `tag do .title: SPAN` (verificado via Playwright) |

**Descrição:** O título "Products" usa `<span class="title">` em vez de um elemento semântico. Isso afeta leitores de tela e SEO.

**Resultado Atual:** `<span class="title">Products</span>`
**Resultado Esperado:** `<h1 class="title">Products</h1>` ou equivalente com `role="heading"`

---

### BUG-007: Campo Postal Code aceita qualquer valor sem validação

| Atributo | Detalhe |
|----------|---------|
| **ID** | BUG-007 |
| **Tipo** | Validação / Negócio |
| **Usuário** | Todos |
| **Severidade** | Média |
| **Componente** | Checkout Step 1 |
| **Evidência** | CEP `!!!INVALIDO!!!` → URL `checkout-step-two.html`, sem erro exibido |

**Descrição:** O campo "Postal Code" aceita qualquer string sem validação de formato.

**Passos para Reproduzir:**
1. Adicionar produto ao carrinho e ir ao checkout
2. Preencher Postal Code com `!!!INVALIDO!!!`
3. Clicar em Continue

**Resultado Atual:** Avança para o step 2 sem qualquer erro
**Resultado Esperado:** Validação de formato com mensagem de erro

---

### BUG-008: Carrinho persiste via localStorage após logout

| Atributo | Detalhe |
|----------|---------|
| **ID** | BUG-008 |
| **Tipo** | Segurança / Privacidade |
| **Usuário** | Todos |
| **Severidade** | Média |
| **Componente** | Autenticação / Carrinho |
| **Evidência** | `cart-contents` presente no localStorage antes e após logout |

**Descrição:** O estado do carrinho persiste na chave `cart-contents` do `localStorage` após o logout e é restaurado ao fazer login novamente na mesma sessão.

**Passos para Reproduzir:**
1. Fazer login com `standard_user`
2. Adicionar produto ao carrinho
3. Fazer logout
4. Fazer login novamente

**Resultado Atual:** Produto ainda está no carrinho após re-login
**Resultado Esperado:** Carrinho limpo ao fazer logout

**Impacto de Segurança:** Em dispositivos compartilhados, um usuário pode ver itens adicionados por sessão anterior.

---

### BUG-009: Dropdown de ordenação sem label acessível (`select-name`)

| Atributo | Detalhe |
|----------|---------|
| **ID** | BUG-009 |
| **Tipo** | Acessibilidade |
| **Usuário** | Todos |
| **Severidade** | Alta |
| **Componente** | Página de Inventário — dropdown de ordenação |
| **Regra axe-core** | `select-name` |
| **Padrão violado** | WCAG 2.1 — Critério 4.1.2 (Name, Role, Value) |
| **Evidência** | Confirmado pelo axe-core (impacto `critical`) |

**Descrição:** O `<select data-test="product-sort-container">` não possui `<label>`, `aria-label`, `aria-labelledby` nem `title`.

**HTML atual:**
```html
<select class="product_sort_container" data-test="product-sort-container">
  <option value="az">Name (A to Z)</option>
  ...
</select>
```

**Correção sugerida:**
```html
<!-- Opção 1: aria-label direto -->
<select aria-label="Ordenar produtos por" data-test="product-sort-container">

<!-- Opção 2: label visível -->
<label for="sort">Ordenar por</label>
<select id="sort" data-test="product-sort-container">
```

**Impacto:** Usuários de leitores de tela não conseguem identificar a finalidade do campo.

**Tratamento nos testes:** Registrado em `KNOWN_CRITICAL_VIOLATIONS` em [accessibility.spec.ts](../tests/accessibility/accessibility.spec.ts) para não gerar falso positivo enquanto o bug não for corrigido.

---

## Resumo de Severidades

| Severidade | Tipo | Bugs |
|-----------|------|------|
| Crítica | Bug real | BUG-003 (intencional), BUG-009 (acessibilidade) |
| Alta | Bug real | BUG-001 (intencional), BUG-009 |
| Média | Bug real | BUG-002 (intencional), BUG-004 (intencional), BUG-007, BUG-008 |
| Baixa | Bug real | BUG-005 (intencional), BUG-006 |

---

## Matriz de Impacto x Probabilidade

```
Alto    |  BUG-001  |           |           |
        |  BUG-003  |           |           |
        |-----------|-----------|-----------|
Médio   |  BUG-002  |  BUG-007  |  BUG-004  |
        |  BUG-009  |  BUG-008  |           |
        |-----------|-----------|-----------|
Baixo   |  BUG-006  |           |  BUG-005  |
        |-----------|-----------|-----------|
           Alta        Média        Baixa
         Probabilidade de Ocorrência
```
