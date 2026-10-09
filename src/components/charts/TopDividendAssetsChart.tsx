import React, { useState } from 'react';
import { Trophy, Award, TrendingUp, ChevronRight } from 'lucide-react';
import { formatCurrency, formatPercent, getSegmentColor } from '../../utils/formatters';

interface TopAsset {
  ticker: string;
  nome: string;
  segmento: string;
  rendaTotal: number;
  valorTotal: number;
  cotas: number;
  participacaoRenda: number;
}

interface TopDividendAssetsChartProps {
  assets: TopAsset[];
  onSelectTicker?: (ticker: string) => void;
  isConsolidated: boolean;
}

export const TopDividendAssetsChart: React.FC<TopDividendAssetsChartProps> = ({
  assets,
  onSelectTicker,
  isConsolidated,
}) => {
  const [limit, setLimit] = useState<5 | 10>(5);

  const displayedAssets = assets.slice(0, limit);
  const maxRenda = displayedAssets.length > 0 ? displayedAssets[0].rendaTotal : 1;

  return (
    <div className="card-finance p-5 flex flex-col h-full shadow-card-premium">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Top Ativos por Renda Gerada
            </h3>
            <p className="text-xs text-slate-400">
              {isConsolidated ? 'Maior geração de proventos em 2024' : 'Maiores pagadores no mês'}
            </p>
          </div>
        </div>

        {/* Toggle Top 5 vs Top 10 */}
        <div className="flex items-center space-x-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setLimit(5)}
            className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
              limit === 5
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top 5
          </button>
          <button
            onClick={() => setLimit(10)}
            className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
              limit === 10
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top 10
          </button>
        </div>
      </div>

      {/* Lista de Ranking */}
      <div className="space-y-3 flex-1 pt-3">
        {displayedAssets.map((asset, index) => {
          const percentWidth = maxRenda > 0 ? (asset.rendaTotal / maxRenda) * 100 : 0;
          const segColor = getSegmentColor(asset.segmento);

          return (
            <div
              key={asset.ticker}
              onClick={() => onSelectTicker && onSelectTicker(asset.ticker)}
              className="group p-2 rounded-xl hover:bg-slate-800/60 transition-all cursor-pointer border border-transparent hover:border-slate-700/60"
            >
              <div className="flex items-center justify-between mb-1.5">
                {/* Posição + Ticker + Segmento */}
                <div className="flex items-center space-x-2.5 truncate mr-2">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold font-mono ${
                    index === 0
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : index === 1
                      ? 'bg-slate-400/20 text-slate-300 border border-slate-400/30'
                      : index === 2
                      ? 'bg-amber-700/20 text-amber-500 border border-amber-700/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {index + 1}
                  </div>

                  <span className="font-mono font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                    {asset.ticker}
                  </span>

                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium truncate hidden sm:inline-block"
                    style={{
                      backgroundColor: `${segColor}15`,
                      color: segColor,
                      border: `1px solid ${segColor}30`,
                    }}
                  >
                    {asset.segmento}
                  </span>
                </div>

                {/* Valor + Participação */}
                <div className="flex items-center space-x-2 text-right flex-shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="font-mono font-bold text-xs sm:text-sm text-emerald-400">
                      {formatCurrency(asset.rendaTotal)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatPercent(asset.participacaoRenda, 1)} da carteira
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>

              {/* Barra de Progresso Visual */}
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-teal-400"
                  style={{ width: `${percentWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé com Destaque */}
      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-1">
          <Award className="h-3.5 w-3.5 text-amber-400" />
          <span>Líder de proventos: <strong className="text-white font-mono">{displayedAssets[0]?.ticker}</strong></span>
        </div>
        <div className="flex items-center space-x-1 text-emerald-400">
          <TrendingUp className="h-3 w-3" />
          <span className="font-mono">{formatPercent(displayedAssets.slice(0, 3).reduce((acc, c) => acc + c.participacaoRenda, 0))}% em 3 fundos</span>
        </div>
      </div>

    </div>
  );
};

