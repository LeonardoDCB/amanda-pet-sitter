# Design System — Site Pet Sitter Amanda (Blush & Sálvia)

## 1. Conceito

**"Delicadeza profissional"** — o site deve parecer cuidado como uma boa pet sitter cuida dos pets: macio, acolhedor e confiável, mas sem parecer amador. Três pilares visuais:

- **Amor** → rosés e blush suaves, formas orgânicas, serifada elegante
- **Cuidado** → cremes quentes, arredondamentos generosos, hierarquia calma
- **Segurança** → verde-sálvia pontual (confirmações, selos, footer), consistência de tokens

## 2. Paleta de cores (HEX)

### Tons de marca

| Token | HEX | Uso |
|---|---|---|
| `--vela` | `#FFFDFB` | Fundo principal (branco quente) |
| `--duna` | `#FBF5F0` | Fundo de seções alternadas (Sobre, Galeria) |
| `--blush-claro` | `#F8EEE9` | Fundo de cards/painéis de destaque |
| `--blush` | `#F3E3DE` | Chips, badges, fundo do card de contato |
| `--rosa-poeira` | `#D9B8B0` | Bordas decorativas, contornos orgânicos, divisórias suaves |
| `--rosé` | `#C98F83` | Superfícies primárias suaves, gradientes, ícones |
| `--rosé-meio` | `#B87C70` | **Primária** — botões principais, foco |
| `--rosé-escuro` | `#9E665B` | Hover de botões, links/textos de ênfase |
| `--sálvia-claro` | `#E7EFEA` | Badges "disponível", fundo de faixas de diferenciais |
| `--sálvia` | `#7B968C` | Ícones secundários, chips de etiqueta |
| `--sálvia-escuro` | `#54736A` | **Títulos**, links de texto, botão secundário |
| `--sálvia-fundo` | `#3F5A51` | Fundo do rodapé, hover do botão secundário |

### Neutros e feedback

| Token | HEX | Uso |
|---|---|---|
| `--texto` | `#3E3A3D` | Corpo de texto principal |
| `--texto-suave` | `#77717A` | Parágrafos secundários, placeholders |
| `--borda` | `#EFE5DD` | Bordas de cards e inputs |
| `--whatsapp` | `#25D366` | CTAs de WhatsApp (oficial, reconhecimento imediato) |
| `--whatsapp-hover` | `#1EB659` | Hover dos CTAs de WhatsApp |
| `--erro` | `#B3695E` | Mensagens de erro em tom terracota |
| `--sucesso` | `#4F7A5E` | Mensagens de sucesso |

**Regras de uso:** nunca mais de 60% de área em rosé; sálvia fica reservado a títulos, selos de segurança e rodapé; WhatsApp sempre no verde oficial; fundo principal sempre `--vela`.

## 3. Tipografia

- **Títulos:** `Playfair Display` (600/700, itálico para palavras-chave)
- **Corpo:** `Nunito Sans` (400/600/700/800)
- **Fallbacks:** `Georgia, serif` e `Segoe UI, system-ui` (Google Fonts com `preconnect`)

| Nome | Tamanho | Uso |
|---|---|---|
| `display` | `clamp(2.5rem, 6vw, 3.75rem)` | H1 do hero |
| `h2` | `clamp(1.75rem, 4vw, 2.5rem)` | Títulos de seção |
| `h3` | `1.25rem` | Títulos de card |
| `corpo` | `1rem` (lh 1.6) | Textos gerais |
| `corpo-pequeno` | `0.875rem` | Captions, mensagens |
| `eyebrow` | `0.8125rem`, 800, `uppercase`, tracking `0.08em` | Etiquetas de seção (sálvia) |

## 4. Tokens de forma e ritmo

- **Espaçamento:** escala de 4px — `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`; seções com 96px (72px mobile); container máx. **1120px**
- **Raio:** `sm 8 · md 16 · lg 24 · xl 32`; pill para botões e chips
- **Moldura orgânica** (fotos): `border-radius: 24px 72px 24px 72px` com contorno em `--rosa-poeira` deslocado 10px
- **Sombras:**
  - Suave (cards): `0 2px 12px rgba(62,58,61,0.06)`
  - Elevada (cards principais/serviços): `0 12px 32px rgba(184,124,112,0.14)`
  - Flutuante (WhatsApp): `0 8px 24px rgba(37,211,102,0.35)`
- **Transições:** `0.25s ease`; gradiente de marca: `linear-gradient(135deg, #C98F83, #B87C70)`

## 5. Layout de cada seção

### Header (global)
Sticky com fundo `--vela` translúcido + blur ao rolar. Logo — pegada em círculo sálvia + nome em Playfair. Links + CTA WhatsApp pill. Mobile: hambúrguer com drawer deslizante (acessível, `aria-expanded`).

### 1. Principal (Hero)
- Gradiente `Vela → Duna → Blush` + blobs em blur + paw prints sutis
- Grid 2 colunas (1:1), min-height 90vh:
  - **Texto:** chip `Birigui-SP · Pet Sitter em domicílio` → H1 Playfair com destaque em itálico rosé → parágrafo → CTAs `Falar no WhatsApp` (verde) + `Conhecer os serviços` (fantasma) → mini-selos com ícones
  - **Foto:** slot 4:5 (moldura orgânica + contorno rosa-poeira) + chip `✅ Disponível para novas reservas`
- Botão WhatsApp flutuante (56px, pulse suave)

### 2. Sobre
Fundo `--duna`. Grid 2 colunas (45/55): foto com moldura orgânica + círculo decorativo; lado texto com eyebrow, história, lista com checks, assinatura *"Com carinho, Amanda 🐾"* e link de texto para WhatsApp.

### 3. Serviços (os 2 principais)
Fundo `--vela`. SectionHeader + grid de 2 cards grandes (xl, sombra elevada). Cada card: ícone em chip blush, H3 serifado, descrição, lista com checks, CTA `Pedir orçamento →`. Faixa inferior (bg sálvia claro) com 3 chips: `📱 Atualizações diárias · 🧍 Ambiente familiar · 🔒 Pet sempre supervisionado`.

### 4. Galeria
Fundo `--duna`. Masonry em 3 colunas (2 tablet / 1 mobile), hover com overlay e legenda, lightbox ao clicar. Estado vazio e erro com retry.

### 5. Orçamento
Grid 2 colunas (40/60): card de contato (bg blush) + card do formulário, validação inline, botão primário gradiente. Sucesso substitui o form por resumo + `Confirmar no WhatsApp` + `Enviar outro`.

### Rodapé
Bg `--sálvia-fundo`, texto vela. 3 colunas: marca · contato · navegação. Linha final: © · *Feito com 🐾* · link `/admin`.

## 6. Biblioteca de componentes

| Componente | Variantes / estados |
|---|---|
| `Botão` | primária · secundária · whatsapp · fantasma · link-com-seta; sm/md/lg; hover, active, focus ring |
| `Chip` | pill blush, eyebrow, badges, etiquetas |
| `Card` | superfície + borda + sombra; `destaque` com contorno blush |
| `Input` | text/select/date/textarea com label; foco (ring sálvia), erro, sucesso |
| `Aviso` | inline erro/sucesso com ícone |
| `ListaComChecks` | checks em círculo blush |
| `GaleriaItem` + `Lightbox` | masonry, overlay, modal acessível |
| `WhatsAppFlutuante` | circular fixo com pulse |
| `Header` + `MenuMobile` | sticky blur, drawer acessível |
| `SectionHeader` | eyebrow + título + subtítulo centralizados |
| `CartaoSobreposto` | mini-card sobre fotos |
| `EstadoVazio` / `EstadoErro` | galeria com retry |
| `Spinner` | botões em loading |

**Arquivos:** `public/css/tokens.css` (variáveis) → `base.css` (reset, tipografia, utilitários) → `componentes.css`. Ícones em SVG inline. Breakpoints: `640 / 900 / 1120`px. O painel admin mantém estilo utilitário próprio (`public/css/style.css` + `admin.css`).

## 7. Qualidade

- Acessibilidade: contraste AA, `focus-visible`, labels reais, `aria` em lightbox/drawer, `prefers-reduced-motion`
- Performance: fontes com `preconnect` + `display=swap`, imagens `loading="lazy"`, galeria com cache 24h
- Textos da história da Amanda: placeholders a revisar por ela (nada de fatos inventados)