import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { FiiRecord } from '../../types/fii';
import { formatCurrency, formatPercent, getSegmentColor } from '../../utils/formatters';
import { Activity, Sparkles } from 'lucide-react';

interface RiskReturnScatterChartProps {
  records: FiiRecord[];
  onSelectTicker?: (ticker: string) => void;
}

export const RiskReturnScatterChart: React.FC<RiskReturnScatterChartProps> = ({
  records,
  onSelectTicker,
}) => {
  if (records.length === 0) {
    return (
      <div className="card-finance p-6 flex flex-col items-center justify-center min-h-[360px] text-slate-500">
        <Activity className="h-10 w-10 mb-2 stroke-[1.5]" />
        <p className="text-sm">Sem ativos para matriz de valuation</p>
      </div>
    );
  }

  // Se houver registros repetidos por mês, pegar o mais recente por ticker
  const latestByTicker = new Map<string, FiiRecord>();
  [...records].sort((a, b) => a.periodo.localeCompare(b.periodo)).forEach(r => {
    latestByTicker.set(r.ticker, r);
  });
  const data = Array.from(latestByTicker.values());

  const avgDy = data.reduce((acc, curr) => acc + curr.dyMensal, 0) / (data.length || 1);

  return (
    <div className="card-finance p-5 flex flex-col h-full shadow-card-premium">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Matriz de Valuation: P/VP vs. Dividend Yield
            </h3>
            <p className="text-xs text-slate-400">
              Oportunidade (P/VP &lt; 1,00 com DY elevado) vs. Ativos com Ágio
            </p>
          </div>
        </div>

        {/* Legenda de Quadrante */}
        <div className="flex items-center space-x-1.5 text-[11px] bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
          <Sparkles className="h-3 w-3 text-emerald-400" />
          <span>Linha Vertical = 1,00 (Preço Justo)</span>
        </div>
      </div>

      {/* Gráfico de Dispersão */}
      <div className="h-[280px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            
            <XAxis
              type="number"
              dataKey="pvp"
              name="P/VP"
              unit=""
              domain={[0.85, 1.15]}
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => v.toFixed(2)}
            />

            <YAxis
              type="number"
              dataKey="dyMensal"
              name="DY Mensal"
              unit="%"
              domain={[0.5, 1.2]}
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `${v.toFixed(2)}%`}
            />

            <ZAxis
              type="number"
              dataKey="valorTotal"
              range={[60, 320]}
              name="Valor Total"
            />

            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: '#475569' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as FiiRecord;
                  return (
                    <div className="bg-[#162032] border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5 z-50 min-w-[200px]">
                      <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                        <span className="font-bold text-white font-mono text-sm">{item.ticker}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full" style={{
                          backgroundColor: `${getSegmentColor(item.segmento)}20`,
                          color: getSegmentColor(item.segmento),
                        }}>
                          {item.segmento}
                        </span>
                      </div>
                      <div className="text-slate-300 font-medium truncate max-w-[210px]">
                        {item.nome}
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px]">
                        <div>
                          <span className="text-slate-400 block">P/VP:</span>
                          <span className={`font-mono font-bold ${item.pvp < 1.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {item.pvp.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">DY Mensal:</span>
                          <span className="font-mono font-bold text-teal-300">
                            {formatPercent(item.dyMensal)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Cotas:</span>
                          <span className="font-mono text-slate-200">{item.cotas}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Investido:</span>
                          <span className="font-mono text-sky-400">{formatCurrency(item.valorTotal)}</span>
                        </div>
                      </div>
                      <div className="pt-1 text-[10px] text-emerald-400/90 text-center font-medium">
                        Clique para abrir histórico do ativo
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Linha de Referência P/VP = 1.00 */}
            <ReferenceLine
              x={1.00}
              stroke="#94A3B8"
              strokeDasharray="4 4"
              label={{
                value: 'P/VP = 1.00',
                fill: '#94A3B8',
                fontSize: 10,
                position: 'insideTopLeft',
              }}
            />

            {/* Linha de Referência DY Médio */}
            <ReferenceLine
              y={avgDy}
              stroke="#10B981"
              strokeDasharray="4 4"
              label={{
                value: `Média DY: ${formatPercent(avgDy)}`,
                fill: '#10B981',
                fontSize: 10,
                position: 'insideBottomRight',
              }}
            />

            <Scatter
              name="FIIs"
              data={data}
              onClick={(entry) => onSelectTicker && onSelectTicker(entry.ticker)}
              cursor="pointer"
            >
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry.ticker}`}
                  fill={getSegmentColor(entry.segmento)}
                  stroke="#FFFFFF"
                  strokeWidth={1}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda dos 4 Quadrantes */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
        <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300">
          <span className="font-bold block">Superior Esquerdo</span>
          Desconto + DY Alto (Sweet Spot)
        </div>
        <div className="p-1.5 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-300">
          <span className="font-bold block">Superior Direito</span>
          Ágio + DY Alto (Renda com Prêmio)
        </div>
        <div className="p-1.5 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-300">
          <span className="font-bold block">Inferior Esquerdo</span>
          Desconto Patrimonial (Valor)
        </div>
        <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300">
          <span className="font-bold block">Inferior Direito</span>
          Ágio + Menor DY (Avaliar Peso)
        </div>
      </div>

    </div>
  );
};

