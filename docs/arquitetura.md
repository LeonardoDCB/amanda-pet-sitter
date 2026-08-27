# Documento de Arquitetura — Site Pet Sitter Amanda (Birigui-SP)

## 1. Visão geral

| Camada | Tecnologia |
|---|---|
| Frontend público | HTML/CSS/JS estático servido pelo Express (página única, mobile-first) |
| Backend | Node.js + Express |
| Banco de dados | SQLite nativo (`node:sqlite`, `DatabaseSync`), arquivo único `data/site.db` |
| Upload de imagens | Disco local `uploads/` + metadados no SQLite |
| Painel admin | Página `/admin` servida pelo mesmo Express, JS + chamadas à API |
| Autenticação | JWT (header Bearer) + bcryptjs |

> **Atenção (tradeoff):** SQLite exige **disco persistente**. Funciona no **Render** (Persistent Disk), mas **não** no Vercel (filesystem efêmero/read-only em serverless). **Recomendação: Render** como hospedagem do backend + uploads. O frontend pode ficar junto no mesmo serviço.

## 2. Estrutura de pastas

```
siteamanda/
├── docs/arquitetura.md
├── src/
│   ├── server.js                 # app Express + middlewares
│   ├── db.js                     # conexão SQLite + criação das tabelas no boot
│   ├── auth.js                   # login (bcrypt), JWT, middleware requireAuth
│   ├── middleware/validacao.js   # validação de entrada (zod)
│   └── routes/
│       ├── orcamentos.js         # pública (criar) + admin (ler/gerenciar)
│       ├── galeria.js            # pública (listar) + admin (upload/gerenciar)
│       └── admin.js              # /api/admin/login, logout, me
├── public/                       # frontend (index.html, css/, js/, admin/)
├── uploads/                      # imagens da galeria (gitignored)
├── data/                         # SQLite (gitignored)
├── scripts/hash-senha.js         # gera hash bcrypt para o .env
└── .env                          # credenciais (nunca versionar)
```

## 3. Modelos de dados

### Tabela `orcamentos` (formulário do site)

| Coluna | Tipo | Regras |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `nome_cliente` | TEXT NOT NULL | 2–100 chars |
| `contato` | TEXT NOT NULL | WhatsApp/email, validado por regex |
| `tipo_pet` | TEXT NOT NULL | ENUM: `cachorro`, `gato`, `outro` |
| `tipo_servico` | TEXT NOT NULL | ENUM: `visita`, `hospedagem`, `passeio`, `creche`, `banho` |
| `data_inicio` | TEXT NOT NULL | `YYYY-MM-DD` |
| `data_fim` | TEXT NULL | opcional, `YYYY-MM-DD` |
| `mensagem` | TEXT | até 2000 chars |
| `status` | TEXT DEFAULT `'novo'` | ENUM: `novo`, `lido`, `contatado`, `arquivado` |
| `criado_em` | DATETIME DEFAULT CURRENT_TIMESTAMP | |

### Tabela `galeria` (metadados das imagens)

| Coluna | Tipo | Regras |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `arquivo` | TEXT NOT NULL | nome gerado no disco: `UUID.ext` (único) |
| `nome_original` | TEXT NOT NULL | para referência no painel |
| `tipo_mime` | TEXT NOT NULL | `image/jpeg`, `image/png`, `image/webp` |
| `tamanho_bytes` | INTEGER NOT NULL | |
| `legenda` | TEXT NULL | até 200 chars |
| `status` | TEXT DEFAULT `'publicado'` | ENUM: `publicado`, `oculto` |
| `criado_em` | DATETIME DEFAULT CURRENT_TIMESTAMP | |

### Tabela `produtos` (loja)

| Coluna | Tipo | Regras |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `nome` | TEXT NOT NULL | 2–120 chars |
| `descricao` | TEXT NULL | até 2000 chars |
| `preco_centavos` | INTEGER NOT NULL | preço em centavos (evita arredondamento) |
| `arquivo` | TEXT NULL | imagem em `uploads/` (UUID.ext) |
| `tipo_mime` | TEXT NULL | |
| `estoque` | INTEGER NULL | NULL = sem controle; 0 = esgotado |
| `ativo` | TEXT DEFAULT `'sim'` | ENUM: `sim`, `nao` (visível na loja) |
| `ordem` | INTEGER DEFAULT 0 | ordem de exibição |
| `criado_em` | DATETIME DEFAULT CURRENT_TIMESTAMP | |

### Tabela `pedidos` (loja)

| Coluna | Tipo | Regras |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `nome_cliente` | TEXT NOT NULL | 2–100 chars |
| `contato` | TEXT NOT NULL | WhatsApp/email |
| `itens` | TEXT NOT NULL | JSON: `[{produto_id, nome, preco_centavos, quantidade}]` (snapshot no momento do pedido) |
| `total_centavos` | INTEGER NOT NULL | recalculado no servidor (autoridade do preço) |
| `observacoes` | TEXT NULL | |
| `status` | TEXT DEFAULT `'recebido'` | ENUM: `recebido`, `pago`, `enviado`, `concluido`, `cancelado` |
| `criado_em` | DATETIME DEFAULT CURRENT_TIMESTAMP | |

### Credencial do administrador

Sem tabela: variáveis de ambiente `ADMIN_USER` + `ADMIN_PASSWORD_HASH` (bcrypt) + `JWT_SECRET`. Simples, segura, funciona no Render. (Tabela `admins` só se precisar de múltiplos usuários no futuro.)

## 4. Rotas da API

### Públicas (sem auth)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/orcamentos` | Cria orçamento (validação + rate limit) |
| GET | `/api/galeria` | Lista imagens com `status='publicado'` |
| GET | `/uploads/:arquivo` | Arquivos da galeria (rota controlada, sem path traversal) |

### Painel admin (exigem `Authorization: Bearer <JWT>`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/admin/login` | { usuario, senha } → JWT (8h) — rate limit anti-força-bruta |
| POST | `/api/admin/logout` | Descarta a sessão (stateless: cliente remove o token) |
| GET | `/api/admin/me` | Confere sessão válida |
| GET | `/api/admin/orcamentos` | Lista + filtro por status + paginação |
| GET | `/api/admin/orcamentos/:id` | Detalhe |
| PATCH | `/api/admin/orcamentos/:id` | Altera status (`lido`/`contatado`/`arquivado`/`novo`) |
| DELETE | `/api/admin/orcamentos/:id` | Remove |
| GET | `/api/admin/galeria` | Lista todas (incl. ocultas) |
| POST | `/api/admin/galeria` | Upload multipart (multer) — 1+ imagens |
| PATCH | `/api/admin/galeria/:id` | Edita legenda / alterna `publicado`↔`oculto` |
| DELETE | `/api/admin/galeria/:id` | Remove arquivo do disco + registro |

### Loja (públicas)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/produtos` | Lista produtos ativos (`ativo='sim'`) |
| POST | `/api/pedidos` | Cria pedido (validação + honeypot); preço/total recalculados no servidor a partir dos produtos ativos |

### Loja (painel admin)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/admin/produtos` | Lista todos (incl. inativos) |
| POST | `/api/admin/produtos` | Cadastra (multipart: campos + imagem opcional) |
| PATCH | `/api/admin/produtos/:id` | Edita campos e/ou imagem; alterna `sim`↔`nao` |
| DELETE | `/api/admin/produtos/:id` | Remove produto + imagem do disco |
| GET | `/api/admin/pedidos` | Lista + filtro por status + paginação |
| GET | `/api/admin/pedidos/:id` | Detalhe |
| PATCH | `/api/admin/pedidos/:id` | Altera status |
| DELETE | `/api/admin/pedidos/:id` | Remove |

**Frontend admin:** `GET /admin` — se o JWT faltar/expirar, redireciona para a tela de login.

## 5. Lógica de autenticação do administrador

1. `POST /api/admin/login`: valida entrada → `bcrypt.compare(senha, ADMIN_PASSWORD_HASH)` → gera JWT assinado com `JWT_SECRET`, expiração 8h → retorna token.
2. `requireAuth`: middleware verifica header Bearer → `jwt.verify` → injeta `req.admin`; responde **401** se inválido/expirou.
3. Proteção: `express-rate-limit` no login (5 tentativas/15 min por IP); `helmet` no app inteiro.
4. Painel `/admin` **exige login a cada visita**: ao carregar a página, o token armazenado é descartado e a tela de login é sempre exibida; só após autenticação as chamadas usam o `Bearer` token.

## 6. Upload de imagens (Galeria)

- **Multer** (memoryStorage) com limite de **5 MB** por imagem; tipos aceitos: `jpeg`, `png`, `webp`.
- Validação por **magic bytes** (nunca confiar no `Content-Type` enviado).
- Nome no disco: `UUID.ext` → elimina conflitos e path traversal.
- Arquivos servidos via rota controlada (`/uploads/:arquivo`), que confere existência no banco.
- Opcional (fase 2): `sharp` para gerar thumbnails e reduzir peso no site.

## 7. Segurança e extras

- **WhatsApp integrado**: botão fixo `https://wa.me/5518997607771`; após enviar o orçamento, link "Confirmar no WhatsApp" pré-preenchido com os dados do formulário.
- SQL parametrizado (prepared statements do better-sqlite3), validação com zod, `helmet`, rate limits, `.env` fora do git, `uploads/` e `data/` no `.gitignore`.

## 8. Deploy (Render)

- Web Service + Persistent Disk montado em `/data` (banco) e `/uploads` (imagens).
- Variáveis de ambiente: `ADMIN_USER`, `ADMIN_PASSWORD_HASH` (gerada via `scripts/hash-senha.js`), `JWT_SECRET`, `PORT`.
