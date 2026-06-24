# Controle de Lavanderia — App (Projeto 02)

Front-end em **React (Next.js, Pages Router)** que consome a API REST do projeto.
Desenvolvido para a disciplina de Desenvolvimento de Aplicações II — UNESC.

## Tecnologias

- React + Next.js (Pages Router)
- Axios (consumo da API REST)
- JSX
- bcryptjs (hash de senha)

## Como rodar

### 1. Suba a API primeiro (pasta `api/`)

```bash
cd api
npm install
node index.js
```

A API sobe em `http://localhost:3000`. O Swagger fica em `http://localhost:3000/api-docs`.

### 2. Suba o front (pasta `app/`)

```bash
cd app
npm install
npm run dev -- -p 3001
```

O front sobe em `http://localhost:3001`.

### 3. Acesso

- **E-mail:** `admin@lavanderia.com`
- **Senha:** `123456`

Também é possível criar novas contas pela tela **/cadastro**.

## Estrutura de páginas

Cada entidade tem sua própria pasta dentro de `pages/admin/`:

```
pages/admin/<entidade>/
  index.js          → listagem
  create.js         → cadastro
  read/[id].js      → detalhes
  update/[id].js    → edição
  delete/[id].js    → confirmação de remoção
```

## Divisão por entidade

| Entidade                    | Responsável      | Pasta                             |
|-----------------------------|------------------|-----------------------------------|
| Usuários                    | Vinicius Cardoso | `pages/admin/usuarios`            |
| Clientes                    | Gabriel Borges   | `pages/admin/clientes`            |
| Tipos de roupa              | Vinicius Cardoso | `pages/admin/tipos-roupa`         |
| Serviços                    | João             | `pages/admin/servicos`            |
| Pedidos                     | João             | `pages/admin/pedidos`             |
| Itens do pedido             | Matheus Lenz     | `pages/admin/pedido-itens`        |
| Serviços do item do pedido  | Vilson Vinicius  | `pages/admin/pedido-item-servicos`|

## Estrutura de pastas

```
app/
  components/   → componentes reutilizáveis de UI
  contexts/     → AuthContext (login, sessão)
  services/     → um arquivo por entidade, encapsulando chamadas Axios
  pages/
    login.js
    cadastro.js
    admin/
      index.js  → dashboard
      <entidade>/...
  styles/       → CSS Modules
```
