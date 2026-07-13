-- Campos específicos de grupos geradores (motor e alternador aparecem
-- em praticamente todos os anúncios da Gera Brasil).
ALTER TABLE maquinas ADD COLUMN IF NOT EXISTS motor text;
ALTER TABLE maquinas ADD COLUMN IF NOT EXISTS alternador text;
