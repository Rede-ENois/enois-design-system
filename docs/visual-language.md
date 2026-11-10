# Visual language: "Boteco"

The default Énóis look: the community's evening after the meetup. Same identity (dark + violet +
Manrope), warm surfaces, soft corners, and shapes that mean something. Gallery themes keep their own
surfaces; these are the brand defaults in `src/styles.css` (`:root` and `.dark`).

## Surfaces

- Dark ground is a warm aubergine (`--background: #15111c`), not blue-black; cards are "table tops"
  (`--surface-card`) with `--shadow-table` (inset highlight + soft offset shadow) instead of a hard
  border. The `surface-card` utility and `PostCard` use it. Dark `--card` and `--popover` share the
  same aubergine (`#1f1929`), so every table reads as one material.
- Things that float over the page (the dock, the drawer, the account menu) use `--shadow-float`,
  tuned per mode: a warm low shadow in light, a deeper one in dark.
- `--lamp` is a faint amber light over the top of the page, painted by `AppLayout`. Batata mode turns
  `--lamp`, `--shadow-table` and `--shadow-float` off and draws a hairline outline around tables so
  they still separate from the ground.
- Body text is 16px (15px in dense rows), meta 13px; secondary inks are warm (`--text-subtle`,
  `--text-date`) and pass AA on the ground.

## Semantic contours

The shape tells where something came from before it is read:

| Shape                                  | Means                | Component       |
| -------------------------------------- | -------------------- | --------------- |
| Circle                                 | a person             | `UserAvatar`    |
| Squircle ("mesa") in the place's color | a community or group | `CommunityMark` |
| Ticket with side notches               | an event             | `EventTicket`   |

## Signals

One component, `Signal`, with four shapes. None of them blink.

| Shape                 | Kind       | Use                                            |
| --------------------- | ---------- | ---------------------------------------------- |
| Pill with a number    | `count`    | things to handle: notices, connection requests |
| Balloon with a number | `messages` | unread messages                                |
| Dot with a soft halo  | `new`      | there is news there                            |
| Amber "hoje" tag      | `today`    | something happens today (an event)             |

Counts use the theme-checked `bg-primary` / `text-primary-foreground` pair. The amber has its own
`--signal-today-foreground`, and `signal-contrast.test.ts` keeps it AA in both modes. The phone's
menu button carries a `new` dot when a place behind the menu (not on the dock) has news
(`AuthenticatedAppHeader.navigationHasNews`). `CommunityMark` is decorative: every use prints the
name beside it.

Menu entries (`NavigationItemData.signal`), dock items (`MobileDockItem.signal`), community
shortcuts (`hasNews`) and Explore rooms (`ExploreItemData.signal`) all take the same vocabulary. The
app derives them from one source (the unread notifications summary), so the menu and the bell never
disagree.

## Shell

- Phone: `MobileDock` (floating, four destinations around the publish action), `NavigationDrawer`
  as a soft floating panel, menu grouped by `NavigationSection` (`you`, `community`, `work`,
  `explore`).
- Account menu: six quick entries (profile, wallet, account page, help, theme, sign out); every
  other account, privacy and preference item lives in `AccountSettings`.
- Explore: `ExploreHub` lists every room that is not on the dock or in the menu, with a filter that
  matches names, descriptions and keywords.
- Composer at rest: `ComposerLauncher`; the full composer only opens when the person starts.

## Temas da galeria

Um tema é **dado**, não componente: cada entrada de `THEME_COLLECTIONS` declara tokens por modo
(`light` e, quando existe, `dark`) e, se precisar de estrutura própria, CSS escopado. Quem respeita
os tokens respeita todos os temas — uma coleção nova entra na lista e não toca em componente nenhum.

- **Motor** (`src/lib/theme/theme-palette.ts`): `palette(spec)` expande a especificação nos tokens da
  marca (superfícies derivadas, tints, raios coerentes com o raio do tema, `--on-foreground` escolhido
  pela leitura contra o preenchimento) e `scopedCss(id, rules)` prefixa regras estruturais com
  `html:root[data-theme="id"]`. Ele mora fora das listas: as duas gerações o usam e as listas não
  podem se importar em ciclo.
- **Listas**: `theme-collections-extra.ts` (coleções da casa), `theme-collections.ts` (sistema retrô e
  a montagem final), `theme-collections-generations.ts` (25 temas de desktop clássico, internet da
  virada do milênio, jogos e terminal).
- **Famílias** (`ThemeCategory`): seis, uma por jeito de olhar a tela — `casa`, `retro` (sistemas com
  cara de desktop, inclusive Java Swing e Windows clássico), `web2000` (internet da época), `jogos`
  (fliperama, 8/16 bits, dungeon, estratégia), `maquinas` (computação: terminal, workstation,
  industrial) e `papel`. A geração nova não abriu categoria própria: duas famílias com o mesmo
  sentido só dividiam o que a pessoa procura. A galeria as apresenta nessa ordem, com busca e
  carregamento em lotes de 18.
- **Identidade não é paleta.** Temas com cara própria declaram CSS estrutural: relevo (bevel), pixel,
  scanlines de CRT, mosaico de dungeon, painel técnico. O relevo referencia variáveis
  (`--bevel-*`) definidas por modo, então o mesmo desenho acerta no claro e no escuro.

## Vitrine com tema próprio

O perfil pode ser vestido com um tema **diferente** do que a pessoa usa para navegar, e os lados
social e profissional são independentes.

- `ProfileLook` guarda as escolhas prontas (`theme`, `accent`, `font`, `header`, `textures`,
  `borders`, `decoration`) — nenhum CSS digitado pela pessoa.
- `buildProfileCss(collection, look, mode)` emite os tokens **no container**, não em `html:root`, e
  reescreve o CSS estrutural do preset para esse escopo. `ProfileThemeScope` renderiza o `<style>`
  junto com `div.profile-scope[data-profile-theme][data-profile-header][data-profile-textures]`, de
  modo que a prévia chega no primeiro paint (SSR) e o visual do perfil não vaza para o menu, as
  notificações ou qualquer diálogo por cima.
- Fundo em gradiente leva a cor sólida do topo por baixo; `textures: false` tira o padrão do fundo
  da vitrine e das superfícies e deixa essa cor.
- `ProfileLookDialog` recebe `onDraftChange` a cada mudança: o diálogo não mostra miniatura, veste a
  **página real** com o rascunho antes do "Salvar". Ali os dois botões do cartão só mexem no
  rascunho, então o tema do rascunho aparece "Em uso" e nenhum cartão fica "Em prévia".

## Modo econômico dentro da vitrine

`html[data-lite]` corta animação, transição e desfoque de fundo; `html[data-batata]` também corta
sombra, filtro, gradiente e raio e troca a tipografia pela do sistema. Como os tokens de um perfil
têmático vivem no container, o BATATA repete ali a achatagem de raio e fonte; sem isso um perfil
vestido de tema escuro apareceria com a fonte da marca (ou com raio) em aparelho que pediu economia.
`batata-mode-styles.test.ts` garante a regra.
