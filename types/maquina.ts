export type Categoria = 'construcao' | 'industrial' | 'agricola' | 'transporte'

export type DisponivelPara = 'venda' | 'locacao' | 'ambos'

export type Status = 'disponivel' | 'reservado' | 'vendido' | 'em_manutencao'

export interface Maquina {
  id: string
  nome: string
  tipo: string
  categorias: Categoria[] | null
  marca: string | null
  modelo: string | null
  ano: number | null
  horas_uso: number | null
  potencia: string | null
  motor: string | null
  alternador: string | null
  capacidade: string | null
  peso_kg: number | null
  disponivel_para: DisponivelPara | null
  preco_venda: number | null
  preco_locacao: number | null
  venda_sob_consulta: boolean
  locacao_sob_consulta: boolean
  status: Status | null
  fotos: string[] | null
  descricao: string | null
  destaque: boolean
  publicado: boolean
  criado_em: string
}

export type MaquinaInsert = Omit<Maquina, 'id' | 'criado_em'>
