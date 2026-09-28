# Segurança

## Escopo atual

O site publicado é estático no GitHub Pages. Não há API, autenticação, banco de dados, upload, painel administrativo ou processamento de pagamentos. Orçamentos e pedidos são montados no navegador e enviados pelo visitante ao WhatsApp.

## Proteções no repositório

- A publicação envia somente a pasta `public` ao GitHub Pages.
- O workflow usa permissões mínimas para a publicação e actions fixadas por commit.
- A Content Security Policy do site só permite recursos do próprio site, incluindo fontes hospedadas localmente.
- Dados do carrinho salvos no navegador são normalizados pelo catálogo estático antes de serem usados.

## Configurações obrigatórias no GitHub

Quem administra o repositório deve manter a autenticação em dois fatores ou passkey ativada e proteger a branch `main` com:

1. bloqueio de force-push e de exclusão;
2. revisão obrigatória por outra pessoa, quando houver colaboradores;
3. exigência de workflow concluído antes do merge;
4. acesso de escrita apenas para pessoas necessárias;
5. ambiente `github-pages` com aprovação obrigatória, quando houver mais de um administrador.

Revise periodicamente chaves SSH, tokens pessoais, acessos de colaboradores e o histórico de ações do GitHub.

## Limitações do GitHub Pages

O GitHub Pages não permite definir todos os cabeçalhos HTTP de segurança. A CSP no HTML protege navegadores modernos, mas cabeçalhos como `X-Content-Type-Options` e `frame-ancestors` exigem uma camada à frente do Pages. Ao usar domínio próprio, prefira um proxy como Cloudflare para configurar pelo menos:

- `Content-Security-Policy` como cabeçalho HTTP;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`;
- proteção contra incorporação em frames (`frame-ancestors 'none'` ou equivalente);
- regras de WAF e limitação de requisições.

## Conteúdo e imagens

Antes de publicar fotos, remova metadados EXIF (especialmente localização e data), confirme a autorização das pessoas retratadas e não publique informações de clientes, endereços ou rotina de atendimento.

## Relato de vulnerabilidade

Não publique detalhes de uma possível vulnerabilidade em issue aberta. Avise o administrador do repositório de forma privada, incluindo a URL afetada, passos mínimos de reprodução e impacto observado.
