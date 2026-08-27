# Site da Pet Sitter Amanda — Birigui-SP

Site de vitrine para a Pet Sitter Amanda (Birigui-SP): formulário de orçamento, galeria de fotos e painel administrativo protegido por senha. Backend Node.js + Express, banco SQLite (`node:sqlite`), frontend estático servido pelo próprio Express.

## Requisitos

- Node.js **>= 22.13** (usa o módulo nativo `node:sqlite` — não compila dependências nativas)

## Como rodar localmente

1. Instalar dependências e criar o `.env`:

   ```
   npm.cmd install
   Copy-Item .env.example .env
   ```

2. Definir as credenciais do painel. Gere o hash da senha e o segredo JWT:

   ```
   npm run hash-senha "sua-senha-forte"
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Cole o hash em `ADMIN_PASSWORD_HASH` e o valor aleatório em `JWT_SECRET` no `.env`.

3. Subir o servidor:

   ```
   npm run dev
   ```

4. Acessar:
   - Site: `http://localhost:3000`
   - Painel: `http://localhost:3000/admin` (usuário `admin` + a senha escolhida)

> No Windows, se o PowerShell bloquear `npm`, use `npm.cmd` (o alias `npm.ps1` pode ter a execução de scripts desabilitada).

## Testes

```
npm test
```

Rodada um teste de fumaça que sobe o app em porta efêmera e valida: páginas estáticas, envio de orçamento (inclusive rejeição de datas invertidas e anti-spam), login, listagem/status de orçamentos, upload/exclusão de imagem, galeria pública e proteção 401 das rotas admin.

## Estrutura

```
src/
  app.js          # aplicação Express (rotas, segurança, estáticos)
  server.js       # ponto de entrada — sobe o app
  db.js           # SQLite + migrações (PRAGMA user_version)
  auth.js         # JWT + bcrypt + middleware requireAuth
  middleware/     # validação zod
  routes/         # orcamentos, galeria, admin
public/           # frontend do site (css/, js/, img/, admin/)
docs/             # arquitetura.md e design-system.md
scripts/          # hash-senha e teste de fumaça
data/             # site.db (gitignored)
uploads/          # imagens da galeria (gitignored)
```

## Checklist de publicação

**Antes de publicar:**
1. Substituir as fotos placeholder (`public/img/foto-hero.*`, `public/img/foto-sobre.*`) e revisar o texto da seção "Sobre" com a Amanda. Basta trocar o `src` em `public/index.html` (as referências atuais apontam para `img/placeholder-amanda.svg`).
2. Trocar as URLs do Open Graph (`og:url` e `og:image`) pelo domínio real em `public/index.html`.
3. Trocar a senha padrão (`npm run hash-senha`) e garantir `JWT_SECRET` forte (nunca versionar o `.env`).
4. Gerar a imagem `public/img/og-capa.png` já está em `img/og-capa.png` (painéis sociais). Pode substituir por uma com a foto da Amanda se preferir.

**Deploy no Render (recomendado — SQLite exige disco persistente):**
1. Criar Web Service apontando para o repositório; comando `npm start`; Node **22.x**.
2. Criar um **Persistent Disk** (ex.: 1 GB) e montar em `/data`.
3. Variáveis de ambiente:
   - `ADMIN_USER`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET` (obrigatórias)
   - `UPLOADS_DIR=/data/uploads` (imagens ficam no disco persistente)
   - `NODE_ENV=production` (bloqueia o boot sem `JWT_SECRET`)
4. Após o primeiro deploy, HTTPS é automático (certificado do Render).

**Manutenção:**
- Backup: copie `data/site.db` (ou use snapshot do disco) — o banco fica em `data/`, as imagens em `uploads/`.
- Para esvaziar tudo: pare o servidor e apague `data/` e `uploads/` (são recriados no boot).
