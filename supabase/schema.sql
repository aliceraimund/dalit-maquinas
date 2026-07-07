-- ============================================================
-- Tabela `maquinas` + políticas RLS
-- Execute no SQL Editor do Supabase.
-- ============================================================

CREATE TABLE maquinas (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            text NOT NULL,
  tipo            text NOT NULL,
  categoria       text CHECK (categoria IN ('construcao','industrial','agricola','transporte')),
  marca           text,
  modelo          text,
  ano             integer,
  horas_uso       numeric,
  potencia        text,
  capacidade      text,
  peso_kg         numeric,
  disponivel_para text CHECK (disponivel_para IN ('venda','locacao','ambos')),
  preco_venda     numeric,
  preco_locacao   numeric,
  valor_consultar boolean DEFAULT false,
  status          text CHECK (status IN ('disponivel','reservado','vendido','em_manutencao')),
  fotos           text[],
  descricao       text,
  destaque        boolean DEFAULT false,
  publicado       boolean DEFAULT true,
  criado_em       timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE maquinas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leitura publica" ON maquinas FOR SELECT USING (publicado = true);
CREATE POLICY "admin total" ON maquinas USING (auth.role() = 'authenticated');

-- ============================================================
-- Storage: bucket público `maquinas` para as fotos
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('maquinas', 'maquinas', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "fotos leitura publica"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'maquinas');

CREATE POLICY "fotos upload admin"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'maquinas' AND auth.role() = 'authenticated');

CREATE POLICY "fotos exclusao admin"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'maquinas' AND auth.role() = 'authenticated');
