export type Categoria = 'construcao' | 'industrial' | 'agricola' | 'transporte'

export type DisponivelPara = 'venda' | 'locacao' | 'ambos'

export type Status = 'disponivel' | 'reservado' | 'vendido' | 'em_manutencao'

export interface Maquina {
  id: string
  nome: string
  tipo: string
  categoria: Categoria | null
  marca: string | null
  modelo: string | null
  ano: number | null
  horas_uso: number | null
  potencia: string | null
  capacidade: string | null
  peso_kg: number | null
  disponivel_para: DisponivelPara | null
  preco_venda: number | null
  preco_locacao: number | null
  valor_consultar: boolean
  status: Status | null
  fotos: string[] | null
  descricao: string | null
  destaque: boolean
  publicado: boolean
  criado_em: string
}

export type MaquinaInsert = Omit<Maquina, 'id' | 'criado_em'>
