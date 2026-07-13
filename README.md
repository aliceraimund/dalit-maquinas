# GeraPeças Brasil — Site de máquinas e equipamentos

Site institucional com catálogo de máquinas (venda e locação) e painel administrativo.

## Stack

- **Next.js 16** (App Router, React 19, Server Components)
- **Tailwind CSS 4** (via plugin PostCSS)
- **TypeScript**
- **Supabase** — banco de dados (Postgres + RLS), autenticação e storage de fotos

## Dados da empresa

Os dados da GeraPeças Brasil (nome, slogan, WhatsApp `5511995998514`, telefone, e-mail) e do Supabase (projeto `dalit-maquinas`, ref `ivnpjjuwpywsvyyguulk`) já estão aplicados no código, em `.env.local.example` e `next.config.ts`.

**Pendente**: o token `{{SITE_URL}}` (em `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts` e `app/maquina/[id]/page.tsx`) deve ser substituído pela URL definitiva do site quando o deploy for feito — ex: `https://dalit-maquinas.vercel.app` ou o domínio próprio.

## Configuração

1. **Supabase**
   - Crie um projeto em [supabase.com](https://supabase.com)
   - O SQL fica em `supabase/migrations/` — com a integração GitHub do Supabase conectada ao repositório, as migrações são aplicadas automaticamente a cada push na `main`. Sem a integração, execute os arquivos da pasta em ordem no SQL Editor (criam a tabela `maquinas`, as políticas RLS e o bucket público `maquinas`)
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
