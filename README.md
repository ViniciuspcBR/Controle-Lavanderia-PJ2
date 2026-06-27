# Controle de Lavanderia — Projeto 02

Sistema de controle de lavanderia desenvolvido com Next.js, Node.js, Express e MongoDB, utilizando API REST documentada com Swagger.

Desenvolvido para a disciplina de Desenvolvimento de Aplicações II — UNESC.

## Tecnologias

**Front-end (app/)**
- React + Next.js (Pages Router)
- Axios
- JSX
- bcryptjs

**Back-end (api/)**
- Node.js
- Express + Express.Router
- Mongoose
- MongoDB
- Cors
- Swagger

## Requisitos

| Programa | Versão | Download |
|----------|--------|----------|
| Node.js | 18+ (LTS) | https://nodejs.org |
| MongoDB Community | 8.x | https://www.mongodb.com/try/download/community |

Durante a instalação do MongoDB, marcar a opção **"Install MongoDB as a Service"** para que ele inicie automaticamente com o Windows.

Para verificar se o MongoDB está rodando:
```powershell
Get-Service -Name MongoDB
```
Deve aparecer `Running`.

## Como rodar

### 1. Clonar o repositório

```bash
git clone https://github.com/ViniciuspcBR/Controle-Lavanderia-PJ2.git
cd Controle-Lavanderia-PJ2
```

### 2. Suba a API (pasta `api/`)

```bash
cd api
npm install
node index.js
```

A API sobe em `http://localhost:3000`. O Swagger fica em `http://localhost:3000/api-docs`.

### 3. Suba o front (pasta `app/`)

Em outro terminal:

```bash
cd app
npm install
npm run dev -- -p 3001
```

O front sobe em `http://localhost:3001`.

### 4. Acesso

- **E-mail:** `admin@lavanderia.com`
- **Senha:** `123456`

Também é possível criar novas contas pela tela **/cadastro**.

## Como contribuir (git)

```bash
# Fazer alterações nos arquivos...

# Adicionar as alterações
git add .

# Criar um commit
git commit -m "descrição do que foi alterado"

# Enviar para o GitHub
git push
```

## Estrutura de páginas

Cada entidade tem sua própria pasta dentro de `pages/admin/`:
pages/admin/<entidade>/

index.js       → listagem

create.js      → cadastro

read/[id].js   → detalhes

update/[id].js → edição

delete/[id].js → confirmação de remoção

## Divisão por entidade

| Entidade                   | Responsável      | Pasta                              |
|----------------------------|------------------|------------------------------------|
| Usuários                   | Vinicius Cardoso | `pages/admin/usuarios`             |
| Clientes                   | Gabriel Borges   | `pages/admin/clientes`             |
| Tipos de roupa             | Vinicius Cardoso | `pages/admin/tipos-roupa`          |
| Serviços                   | João             | `pages/admin/servicos`             |
| Pedidos                    | João             | `pages/admin/pedidos`              |
| Itens do pedido            | Matheus Lenz     | `pages/admin/pedido-itens`         |
| Serviços do item do pedido | Vilson Vinicius  | `pages/admin/pedido-item-servicos` |

## Estrutura de pastas
controle-lavanderia/

api/

src/

db/        → conexão com MongoDB

models/    → schemas Mongoose

routes/    → rotas Express por entidade

index.js

package.json

app/

components/  → componentes reutilizáveis de UI

contexts/    → AuthContext (login, sessão)

services/    → chamadas Axios por entidade

pages/

login.js

cadastro.js

admin/

index.js → dashboard

<entidade>/...

styles/      → CSS Modules

package.json

## Portas utilizadas

| Porta | Serviço |
|-------|---------|
| 3000  | API (back-end) |
| 3001  | Front-end |
| 27017 | MongoDB |