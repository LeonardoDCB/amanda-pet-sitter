# Amanda Pet Sitter

Site estático da Amanda Pet Sitter para Birigui e Araçatuba-SP.

## Como visualizar

No Windows, execute `ver-site.bat`. Ele abre um servidor local usando Python e acessa o site em `http://localhost:8000`.

Também é possível abrir `public/index.html` diretamente no navegador, mas o servidor local reproduz melhor o comportamento publicado.

## Publicação

O site é publicado pelo GitHub Pages através de `.github/workflows/pages.yml`. O workflow publica a pasta `public` automaticamente a cada push na branch `main`.

O domínio personalizado está definido em `public/CNAME`. Depois de comprar o domínio, configure no provedor DNS os registros indicados pelo GitHub Pages e ative HTTPS nas configurações do repositório.

## Conteúdo

- HTML, CSS, JavaScript e imagens ficam versionados no repositório.
- Produtos e preços são cadastrados em `public/js/site.js`.
- Fotos dos produtos ficam em `public/img/produtos/`.
- A loja usa carrinho local e monta o pedido completo para o WhatsApp.
- O formulário de orçamento também monta a mensagem completa para o WhatsApp.
- Não existe banco de dados, painel administrativo, upload ou armazenamento no servidor.

Para alterar produtos, fotos, preços ou textos, edite os arquivos, faça commit e execute `git push`.

## SEO antes de publicar

- Trocar `G-XXXXXXXXXX` pelo ID real do Google Analytics, se for usar Analytics.
- Confirmar o domínio no Google Search Console.
- Enviar `https://amandapetsitter.com/sitemap.xml`.
- Atualizar `public/sitemap.xml` se novas páginas forem criadas.
