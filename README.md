# Amanda Pet Sitter

Site estático da Amanda Pet Sitter para Birigui e Araçatuba-SP.

## Como visualizar

No Windows, execute `ver-site.bat`. Ele abre um servidor local usando Python e acessa o site em `http://localhost:8000`.

Também é possível abrir `public/index.html` diretamente no navegador, mas o servidor local reproduz melhor o comportamento publicado.

## Publicação

O site é publicado pelo GitHub Pages através de `.github/workflows/pages.yml`. O workflow publica a pasta `public` automaticamente a cada push na branch `main`.

Enquanto usa o endereço temporário do GitHub Pages, acesse `https://leonardodcb.github.io/amanda-pet-sitter/`. Depois de comprar um domínio, configure-o em **Settings > Pages > Custom domain**, atualize as URLs de SEO e crie novamente o arquivo `public/CNAME` com o domínio escolhido.

## Conteúdo

- HTML, CSS, JavaScript e imagens ficam versionados no repositório.
- Produtos e preços são cadastrados em `public/js/site.js`.
- Fotos dos produtos ficam em `public/img/produtos/`.
- A loja usa carrinho local e monta o pedido completo para o WhatsApp.
- O formulário de orçamento também monta a mensagem completa para o WhatsApp.
- Não existe banco de dados, painel administrativo, upload ou armazenamento no servidor.

Para alterar produtos, fotos, preços ou textos, edite os arquivos, faça commit e execute `git push`.

## SEO antes de publicar

- Se for usar Analytics, adicione o ID real da propriedade do Google Analytics.
- Confirmar a URL publicada no Google Search Console.
- Enviar `https://leonardodcb.github.io/amanda-pet-sitter/sitemap.xml`.
- Atualizar `public/sitemap.xml` se novas páginas forem criadas.
