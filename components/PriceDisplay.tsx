import { formatCurrency } from '@/lib/utils'
import type { Maquina } from '@/types/maquina'

interface PriceDisplayProps {
  maquina: Pick<
    Maquina,
    'disponivel_para' | 'preco_venda' | 'preco_locacao' | 'venda_sob_consulta' | 'locacao_sob_consulta'
  >
  compact?: boolean
}

export default function PriceDisplay({ maquina, compact = false }: PriceDisplayProps) {
  const mostraVenda = maquina.disponivel_para === 'venda' || maquina.disponivel_para === 'ambos'
  const mostraLocacao = maquina.disponivel_para === 'locacao' || maquina.disponivel_para === 'ambos'

  // Cada preço pode estar "sob consulta" de forma independente
  const vendaConsultar = maquina.venda_sob_consulta || maquina.preco_venda == null
  const locacaoConsultar = maquina.locacao_sob_consulta || maquina.preco_locacao == null

  if (!mostraVenda && !mostraLocacao) {
    return (
      <p className={`italic text-[var(--cor-texto-suave)] ${compact ? 'text-sm' : 'text-lg'}`}>
        Consultar
      </p>
    )
  }

  if (compact) {
    return (
      <div className="space-y-0.5">
        {mostraVenda &&
          (vendaConsultar ? (
            <p className="text-sm italic text-[var(--cor-texto-suave)]">
              {mostraLocacao ? 'Venda: ' : ''}Consultar
            </p>
          ) : (
            <p className="text-sm font-bold text-[var(--cor-texto)]">
              {formatCurrency(maquina.preco_venda!)}
            </p>
          ))}
        {mostraLocacao &&
          (locacaoConsultar ? (
            <p className="text-xs italic text-[var(--cor-texto-suave)]">Locação: Consultar</p>
          ) : (
            <p className="text-xs text-[var(--cor-texto-suave)]">
              Locação:{' '}
              <span className="font-semibold text-[var(--cor-texto)]">
                {formatCurrency(maquina.preco_locacao!)}
              </span>
            </p>
          ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {mostraVenda && (
        <div>
          <p className="text-sm text-[var(--cor-texto-suave)]">Preço de venda</p>
          {vendaConsultar ? (
            <p className="text-lg italic text-[var(--cor-texto-suave)]">Consultar</p>
          ) : (
            <p className="text-2xl font-bold text-[var(--cor-texto)]">
              {formatCurrency(maquina.preco_venda!)}
            </p>
          )}
        </div>
      )}
      {mostraLocacao && (
        <div>
          <p className="text-sm text-[var(--cor-texto-suave)]">Locação</p>
          {locacaoConsultar ? (
            <p className="text-lg italic text-[var(--cor-texto-suave)]">Consultar</p>
          ) : (
            <p className="text-2xl font-bold text-[var(--cor-texto)]">
              {formatCurrency(maquina.preco_locacao!)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
