import { formatCurrency } from '@/lib/utils'
import type { Maquina } from '@/types/maquina'

interface PriceDisplayProps {
  maquina: Pick<Maquina, 'disponivel_para' | 'preco_venda' | 'preco_locacao' | 'valor_consultar'>
  compact?: boolean
}

export default function PriceDisplay({ maquina, compact = false }: PriceDisplayProps) {
  const { disponivel_para, preco_venda, preco_locacao, valor_consultar } = maquina

  const mostraVenda = disponivel_para === 'venda' || disponivel_para === 'ambos'
  const mostraLocacao = disponivel_para === 'locacao' || disponivel_para === 'ambos'

  if (valor_consultar) {
    return (
      <p className={`italic text-[var(--cor-texto-suave)] ${compact ? 'text-sm' : 'text-lg'}`}>
        Consultar
      </p>
    )
  }

  if (compact) {
    return (
      <div className="space-y-0.5">
        {mostraVenda && preco_venda != null && (
          <p className="text-sm font-bold text-[var(--cor-texto)]">{formatCurrency(preco_venda)}</p>
        )}
        {mostraLocacao && preco_locacao != null && (
          <p className="text-xs text-[var(--cor-texto-suave)]">
            Locação: <span className="font-semibold text-[var(--cor-texto)]">{formatCurrency(preco_locacao)}</span>
          </p>
        )}
        {((mostraVenda && preco_venda == null) || (mostraLocacao && preco_locacao == null)) &&
          preco_venda == null &&
          preco_locacao == null && (
            <p className="text-sm italic text-[var(--cor-texto-suave)]">Consultar</p>
          )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {mostraVenda && (
        <div>
          <p className="text-sm text-[var(--cor-texto-suave)]">Preço de venda</p>
          {preco_venda != null ? (
            <p className="text-2xl font-bold text-[var(--cor-texto)]">{formatCurrency(preco_venda)}</p>
          ) : (
            <p className="text-lg italic text-[var(--cor-texto-suave)]">Consultar</p>
          )}
        </div>
      )}
      {mostraLocacao && (
        <div>
          <p className="text-sm text-[var(--cor-texto-suave)]">Locação</p>
          {preco_locacao != null ? (
            <p className="text-2xl font-bold text-[var(--cor-texto)]">{formatCurrency(preco_locacao)}</p>
          ) : (
            <p className="text-lg italic text-[var(--cor-texto-suave)]">Consultar</p>
          )}
        </div>
      )}
    </div>
  )
}
