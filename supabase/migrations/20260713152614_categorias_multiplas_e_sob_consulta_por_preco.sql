-- Categoria passa a aceitar múltiplos valores
ALTER TABLE maquinas ADD COLUMN IF NOT EXISTS categorias text[];
UPDATE maquinas SET categorias = ARRAY[categoria] WHERE categoria IS NOT NULL AND categorias IS NULL;
ALTER TABLE maquinas DROP COLUMN IF EXISTS categoria;
ALTER TABLE maquinas ADD CONSTRAINT categorias_validas
  CHECK (categorias IS NULL OR categorias <@ ARRAY['construcao','industrial','agricola','transporte']);

-- "Sob consulta" independente para cada preço (venda e locação)
ALTER TABLE maquinas ADD COLUMN IF NOT EXISTS venda_sob_consulta boolean DEFAULT false;
ALTER TABLE maquinas ADD COLUMN IF NOT EXISTS locacao_sob_consulta boolean DEFAULT false;
UPDATE maquinas SET venda_sob_consulta = true, locacao_sob_consulta = true WHERE valor_consultar = true;
ALTER TABLE maquinas DROP COLUMN IF EXISTS valor_consultar;
