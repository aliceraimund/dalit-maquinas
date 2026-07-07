# {{NOME_EMPRESA}} — Site de máquinas e equipamentos

Site institucional com catálogo de máquinas (venda e locação) e painel administrativo.

## Stack

- **Next.js 16** (App Router, React 19, Server Components)
- **Tailwind CSS 4** (via plugin PostCSS)
- **TypeScript**
- **Supabase** — banco de dados (Postgres + RLS), autenticação e storage de fotos

## Variáveis do projeto (find & replace)

Antes de rodar, substitua os tokens abaixo em todo o projeto (um find & replace por token resolve — VS Code ou `grep -rl '{{TOKEN}}' . | xargs sed -i 's/.../.../g'`):

| Token | Descrição |
| --- | --- |
| `{{NOME_EMPRESA}}` | Nome da empresa |
| `{{SLOGAN}}` | Tagline exibida no hero |
| `{{SITE_URL}}` | URL pública do site (ex: `https://empresa.com.br`) |
| `{{WHATSAPP}}` | WhatsApp no formato `55XXXXXXXXXXX` |
| `{{TELEFONE}}` | Telefone exibido no rodapé |
| `{{EMAIL}}` | E-mail exibido no rodapé |
| `{{SUPABASE_URL}}` | URL do projeto Supabase |
| `{{SUPABASE_ANON_KEY}}` | Chave anônima (publishable) do Supabase |
| `{{SUPABASE_HOSTNAME}}` | Hostname do Supabase (ex: `xxxx.supabase.co`) — usado no `next.config.ts` |

## Configuração

1. **Supabase**
   - Crie um projeto em [supabase.com](https://supabase.com)
   - Execute o SQL de `supabase/schema.sql` no SQL Editor (cria a tabela `maquinas`, as políticas RLS e o bucket público `maquinas`)
   - Crie o usuário admin em *Authentication → Users → Add user* (email + senha)

2. **Ambiente**
   ```bash
   cp .env.local.example .env.local
   # preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

3. **Rodar**
   ```bash
   npm install
   npm run dev
   ```

## Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Homepage — hero, filtros por categoria/modalidade, grid de máquinas |
| `/maquina/[id]` | Página da máquina — galeria, especificações, preços, WhatsApp |
| `/sitemap.xml` | Sitemap dinâmico com as máquinas publicadas |
| `/robots.txt` | Permite tudo exceto `/admin` |
| `/admin/login` | Login do painel (email/senha via Supabase Auth) |
| `/admin` | Listagem com ações: publicar/ocultar, visualizar, editar, duplicar, excluir |
| `/admin/maquinas/novo` | Cadastro de máquina |
| `/admin/maquinas/[id]/editar` | Edição de máquina |
