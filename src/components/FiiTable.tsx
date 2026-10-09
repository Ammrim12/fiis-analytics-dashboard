import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  Search, 
  Building,
  CheckCircle2
} from 'lucide-react';
import { FiiRecord } from '../types/fii';
import { 
  formatCurrency, 
  formatPercent, 
  formatNumber, 
  getPvpBadge, 
  getSegmentColor 
} from '../utils/formatters';
import { Sparkline } from './common/Sparkline';

interface FiiTableProps {
  records: FiiRecord[];
  totalPatrimonio: number;
  totalRenda: number;
  priceSeriesMap: Record<string, number[]>;
  onSelectTicker: (ticker: string) => void;
  isConsolidated: boolean;
}

type SortField = 
  | 'ticker' 
  | 'nome' 
  | 'segmento' 
  | 'cotas' 
  | 'precoAtual' 
  | 'valorTotal' 
  | 'pvp' 
  | 'rendimentoPorCota' 
  | 'dyMensal' 
  | 'rendaMensal'
  | 'pesoCarteira';

export const FiiTable: React.FC<FiiTableProps> = ({
  records,
  totalPatrimonio,
  totalRenda,
  priceSeriesMap,
  onSelectTicker,
  isConsolidated,
}) => {
  const [sortField, setSortField] = useState<SortField>('valorTotal');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [tableSearch, setTableSearch] = useState('');

  // Agrupa por ticker se houver mais de um registro por ticker (ex: consolidado anual)
  const uniqueRecords = useMemo(() => {
    const map = new Map<string, FiiRecord>();
    [...records].sort((a, b) => a.periodo.localeCompare(b.periodo)).forEach(r => {
      if (isConsolidated) {
        const existing = map.get(r.ticker);
        if (existing) {
          existing.rendaMensal += r.rendaMensal;
          existing.precoAtual = r.precoAtual;
          existing.vpPorCota = r.vpPorCota;
          existing.pvp = r.pvp;
          existing.valorTotal = r.valorTotal;
          existing.cotas = r.cotas;
          existing.dyMensal = (existing.rendaMensal / existing.valorTotal) * 100 / 12;
        } else {
          map.set(r.ticker, { ...r });
        }
      } else {
        map.set(r.ticker, r);
      }
    });
    return Array.from(map.values());
  }, [records, isConsolidated]);

  // Filtro de busca local da tabela
  const filteredRecords = useMemo(() => {
    if (!tableSearch.trim()) return uniqueRecords;
    const q = tableSearch.toLowerCase().trim();
    return uniqueRecords.filter(
      r => r.ticker.toLowerCase().includes(q) ||
           r.nome.toLowerCase().includes(q) ||
           r.segmento.toLowerCase().includes(q)
    );
  }, [uniqueRecords, tableSearch]);

  // Maior % de carteira para normalizar a mini barra
  const maxPeso = useMemo(() => {
    if (uniqueRecords.length === 0 || totalPatrimonio === 0) return 1;
    return Math.max(...uniqueRecords.map(r => (r.valorTotal / totalPatrimonio) * 100));
  }, [uniqueRecords, totalPatrimonio]);

  // Ordenação
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let aVal: number | string = a[sortField as keyof FiiRecord] as number | string;
      let bVal: number | string = b[sortField as keyof FiiRecord] as number | string;

      if (sortField === 'pesoCarteira') {
        aVal = totalPatrimonio > 0 ? a.valorTotal / totalPatrimonio : 0;
        bVal = totalPatrimonio > 0 ? b.valorTotal / totalPatrimonio : 0;
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }

      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [filteredRecords, sortField, sortDirection, totalPatrimonio]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'ticker' || field === 'nome' || field === 'segmento' ? 'asc' : 'desc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 opacity-30 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-emerald-400" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-emerald-400" />
    );
  };

  return (
    <div className="card-finance overflow-hidden shadow-card-premium">
      
      {/* Header da Tabela com Busca Local e Totalizadores */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Building className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Composição da Carteira</h3>
            <p className="text-xs text-slate-400">
              {sortedRecords.length} ativos listados • Renda no período: <span className="text-emerald-400 font-mono font-medium">{formatCurrency(totalRenda)}</span>
            </p>
          </div>
        </div>

        {/* Input de Busca Rápida na Tabela */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrar tabela..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="w-full bg-[#162032] border border-slate-700/80 text-slate-100 placeholder-slate-400 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Tabela com Scroll Horizontal e Altura Otimizada */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-200">
          <thead className="bg-[#0D131F] text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th 
                className="py-3 px-3 cursor-pointer hover:text-white transition-colors group"
                onClick={() => handleSort('ticker')}
              >
                <div className="flex items-center space-x-1">
                  <span>Ticker</span>
                  {renderSortIcon('ticker')}
                </div>
              </th>

              <th 
                className="py-3 px-3 cursor-pointer hover:text-white transition-colors group"
                onClick={() => handleSort('segmento')}
              >
                <div className="flex items-center space-x-1">
                  <span>Segmento</span>
                  {renderSortIcon('segmento')}
                </div>
              </th>

              {/* Coluna Micro-Gráfico Sparkline 12M */}
              <th className="py-3 px-2 text-center">
                <span>Hist. 12M</span>
              </th>

              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors group"
                onClick={() => handleSort('cotas')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Cotas</span>
                  {renderSortIcon('cotas')}
                </div>
              </th>

              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors group"
                onClick={() => handleSort('precoAtual')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Preço</span>
                  {renderSortIcon('precoAtual')}
                </div>
              </th>

              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors group"
                onClick={() => handleSort('pvp')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>P/VP</span>
                  {renderSortIcon('pvp')}
                </div>
              </th>

              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors group"
                onClick={() => handleSort('valorTotal')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Total (R$)</span>
                  {renderSortIcon('valorTotal')}
                </div>
              </th>

              {/* Coluna % Carteira com Barra de Progresso Embutida */}
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors group min-w-[110px]"
                onClick={() => handleSort('pesoCarteira')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>% Carteira</span>
                  {renderSortIcon('pesoCarteira')}
                </div>
              </th>

              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors group"
                onClick={() => handleSort('dyMensal')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>DY Mensal</span>
                  {renderSortIcon('dyMensal')}
                </div>
              </th>

              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors group"
                onClick={() => handleSort('rendaMensal')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>{isConsolidated ? 'Renda 2024' : 'Renda Mês'}</span>
                  {renderSortIcon('rendaMensal')}
                </div>
              </th>

              <th className="py-3 px-2 text-center">
                <span>Ver</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80">
            {sortedRecords.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-500 text-sm">
                  Nenhum fundo encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              sortedRecords.map((row) => {
                const pvpBadge = getPvpBadge(row.pvp);
                const segColor = getSegmentColor(row.segmento);
                const pesoCarteira = totalPatrimonio > 0 ? (row.valorTotal / totalPatrimonio) * 100 : 0;
                const progressWidth = maxPeso > 0 ? (pesoCarteira / maxPeso) * 100 : 0;
                const tickerPrices = priceSeriesMap[row.ticker] || [];

                return (
                  <tr
                    key={row.ticker}
                    onClick={() => onSelectTicker(row.ticker)}
                    className="hover:bg-slate-800/60 transition-colors group cursor-pointer"
                  >
                    {/* Ticker / Nome */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {row.ticker}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[130px]" title={row.nome}>
                          {row.nome}
                        </span>
                      </div>
                    </td>

                    {/* Segmento */}
                    <td className="py-2.5 px-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap"
                        style={{
                          backgroundColor: `${segColor}15`,
                          color: segColor,
                          border: `1px solid ${segColor}35`,
                        }}
                      >
                        {row.segmento}
                      </span>
                    </td>

                    {/* Micro-Gráfico Sparkline 12M */}
                    <td className="py-2.5 px-2 text-center">
                      <div className="flex justify-center items-center">
                        <Sparkline
                          data={tickerPrices}
                          width={68}
                          height={18}
                          color="#10B981"
                          fillOpacity={0.2}
                          strokeWidth={1.5}
                        />
                      </div>
                    </td>

                    {/* Cotas */}
                    <td className="py-2.5 px-3 text-right font-mono text-slate-300 tabular-nums">
                      {formatNumber(row.cotas)}
                    </td>

                    {/* Preço Cota */}
                    <td className="py-2.5 px-3 text-right font-mono text-slate-200 tabular-nums">
                      {formatCurrency(row.precoAtual)}
                    </td>

                    {/* P/VP com Badge Colorida */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-mono font-bold text-white tabular-nums">
                          {row.pvp.toFixed(2)}
                        </span>
                        <span className={`text-[8.5px] px-1 py-0.1 rounded border font-medium ${pvpBadge.bgClass} ${pvpBadge.textClass} ${pvpBadge.borderClass}`}>
                          {pvpBadge.label}
                        </span>
                      </div>
                    </td>

                    {/* Valor Total */}
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-white tabular-nums">
                      {formatCurrency(row.valorTotal)}
                    </td>

                    {/* % Carteira com Barra de Progresso Embutida */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="font-mono text-slate-300 text-[11px] tabular-nums w-10 text-right">
                          {formatPercent(pesoCarteira, 1)}
                        </span>
                        <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden flex-shrink-0">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-400"
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* DY Mensal */}
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-teal-300 tabular-nums">
                      {formatPercent(row.dyMensal)}
                    </td>

                    {/* Renda Mensal / Total */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400 tabular-nums">
                      {formatCurrency(row.rendaMensal)}
                    </td>

                    {/* Ação */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicker(row.ticker);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
                        title="Ver histórico do fundo"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Rodapé Totalizador da Tabela */}
          <tfoot className="bg-[#0B0F17] font-semibold text-slate-300 border-t-2 border-slate-700/80 text-xs">
            <tr>
              <td className="py-3 px-3 text-white font-bold flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 inline" />
                <span>Total ({sortedRecords.length})</span>
              </td>
              <td className="py-3 px-3 text-slate-400">
                Diversificado
              </td>
              <td className="py-3 px-2 text-center text-slate-500 text-[10px]">
                12M
              </td>
              <td className="py-3 px-3 text-right font-mono text-white tabular-nums">
                {formatNumber(sortedRecords.reduce((acc, r) => acc + r.cotas, 0))}
              </td>
              <td className="py-3 px-3 text-right text-slate-400">
                —
              </td>
              <td className="py-3 px-3 text-right font-mono text-white tabular-nums">
                {totalPatrimonio > 0 ? (sortedRecords.reduce((acc, r) => acc + (r.pvp * r.valorTotal), 0) / totalPatrimonio).toFixed(2) : '—'}
              </td>
              <td className="py-3 px-3 text-right font-mono text-emerald-300 font-bold tabular-nums">
                {formatCurrency(sortedRecords.reduce((acc, r) => acc + r.valorTotal, 0))}
              </td>
              <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">
                100,0%
              </td>
              <td className="py-3 px-3 text-right font-mono text-teal-300 tabular-nums">
                {totalPatrimonio > 0 ? formatPercent((sortedRecords.reduce((acc, r) => acc + r.rendaMensal, 0) / totalPatrimonio) * 100) : '0%'}
              </td>
              <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold tabular-nums">
                {formatCurrency(sortedRecords.reduce((acc, r) => acc + r.rendaMensal, 0))}
              </td>
              <td className="py-3 px-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};
