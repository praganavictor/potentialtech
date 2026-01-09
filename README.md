# Potencial Tech API

API para gerenciamento de contas e transações bancárias desenvolvida com NestJS, Prisma e PostgreSQL.

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **NestJS** - Framework para construção de aplicações server-side
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Prisma** - ORM para acesso ao banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização do banco de dados
- **Swagger** - Documentação interativa da API
- **JWT** - Autenticação via tokens
- **Bcrypt** - Criptografia de senhas

## Requisitos Mínimos

- **Node.js** >= 18.x
- **npm** ou **yarn** ou **pnpm**
- **Docker** e **Docker Compose** (para o banco de dados)

## Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd potentialtech
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

O arquivo `.env` deve conter:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/banking_api"
JWT_SECRET="seu-secret-aqui"
JWT_EXPIRATION="1d"
BRASILAPI_BASE_URL="https://brasilapi.com.br/api"
```

## Setup do Banco de Dados com Docker

### Inicie o container do PostgreSQL

```bash
docker-compose up -d
```

Este comando irá:
- Criar um container do PostgreSQL
- Expor a porta `5432` para acesso local
- Criar o banco de dados `banking_api`

### Verifique se o container está rodando

```bash
docker-compose ps
```

### Para parar o container

```bash
docker-compose down
```

## Configuração do Prisma

### 1. Execute as migrations

```bash
npm run prisma:migrate
```

Este comando irá criar todas as tabelas no banco de dados baseado no schema do Prisma.

### 2. (Opcional) Abra o Prisma Studio

Para visualizar e editar os dados do banco de dados através de uma interface gráfica:

```bash
npm run prisma:studio
```

O Prisma Studio estará disponível em `http://localhost:5555`

## Iniciando a Aplicação

### Modo de desenvolvimento (com hot-reload)

```bash
npm run dev
```

### Modo de produção

```bash
# Build da aplicação
npm run build

# Inicie a aplicação
npm run start:prod
```

A aplicação estará disponível em `http://localhost:3000`

## Documentação da API - Swagger

A documentação interativa da API está disponível através do Swagger UI.

### Acesse o Swagger

Após iniciar a aplicação, acesse:

```
http://localhost:3000/docs
```

### Como usar o Swagger

1. **Explore os endpoints**: Todos os endpoints da API estão listados e organizados por módulos
2. **Teste as rotas**: Clique em qualquer endpoint e depois em "Try it out" para testar
3. **Autenticação**: Para endpoints protegidos:
   - Primeiro, faça login através do endpoint `/auth/login`
   - Copie o token JWT retornado
   - Clique no botão "Authorize" no topo da página
   - Cole o token
   - Agora você pode acessar endpoints protegidos

### Principais Endpoints

- **POST /auth/register** - Criar nova conta de usuário
- **POST /auth/login** - Fazer login e obter token JWT
- **GET /accounts** - Listar contas (requer autenticação)
- **POST /transactions/deposit** - Realizar depósito (requer autenticação)
- **POST /transactions/withdraw** - Realizar saque (requer autenticação)
- **POST /transactions/transfer** - Realizar transferência (requer autenticação)

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev                  # Inicia em modo desenvolvimento com hot-reload
npm run start                # Inicia a aplicação
npm run start:debug          # Inicia em modo debug

# Build
npm run build                # Compila a aplicação para produção

# Testes
npm run test                 # Executa os testes
npm run test:watch           # Executa os testes em modo watch
npm run test:cov             # Executa os testes com cobertura
npm run test:e2e             # Executa os testes end-to-end

# Prisma
npm run prisma:generate      # Gera o Prisma Client
npm run prisma:migrate       # Executa as migrations
npm run prisma:studio        # Abre o Prisma Studio

# Qualidade de código
npm run lint                 # Executa o ESLint
npm run format               # Formata o código com Prettier
```

## Estrutura do Projeto

```
src/
├── auth/                    # Módulo de autenticação
├── users/                   # Módulo de usuários
├── accounts/                # Módulo de contas bancárias
├── transactions/            # Módulo de transações
├── common/                  # Recursos compartilhados (filters, guards, etc)
└── main.ts                  # Arquivo principal da aplicação

prisma/
└── schema.prisma            # Schema do banco de dados
```

## Modelo de Dados

### User
- Informações do usuário (nome, email, CPF, senha)
- Roles: USER, ADMIN
- Relação 1:1 com Account

### Account
- Conta bancária do usuário
- Saldo, número da conta
- Status: ACTIVE, BLOCKED

### Transaction
- Histórico de transações
- Tipos: DEPOSIT, WITHDRAWAL, INTERNAL_TRANSFER, EXTERNAL_TRANSFER
- Suporta transferências internas e para bancos externos

### AuditLog
- Log de auditoria de ações dos usuários
- Registra ações críticas no sistema

## Licença

UNLICENSED
