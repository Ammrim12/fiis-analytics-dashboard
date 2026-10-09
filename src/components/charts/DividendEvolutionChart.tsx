import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { MonthlyDividendData } from '../../types/fii';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { TrendingUp, BarChart2, Coins } from 'lucide-react';

interface DividendEvolutionChartProps {
  data: MonthlyDividendData[];
  selectedPeriod: string;
  onSelectPeriod?: (period: string) => void;
}

export const DividendEvolutionChart: React.FC<DividendEvolutionChartProps> = ({
  data,
  selectedPeriod,
  onSelectPeriod,
}) => {
  const [metric, setMetric] = useState<'renda' | 'patrimonio'>('renda');

  if (data.length === 0) {
    return (
      <div className="card-finance p-6 flex flex-col items-center justify-center min-h-[360px] text-slate-500">
        <TrendingUp className="h-10 w-10 mb-2 stroke-[1.5]" />
        <p className="text-sm">Sem dados de evolução temporal</p>
      </div>
    );
  }

  // Média de renda mensal em 2024
  const mediaRenda = data.reduce((acc, curr) => acc + curr.rendaTotal, 0) / (data.length || 1);
  const totalRendaAno = data.reduce((acc, curr) => acc + curr.rendaTotal, 0);

  return (
    <div className="card-finance p-5 flex flex-col h-full shadow-card-premium">
      
      {/* Header do Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Coins className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Evolução dos Proventos Mensais (2024)
            </h3>
            <p className="text-xs text-slate-400">
              Total acumulado no ano: <span className="text-emerald-400 font-mono font-medium">{formatCurrency(totalRendaAno)}</span>
            </p>
          </div>
        </div>

        {/* Alternador de Métrica (Renda vs Patrimônio) */}
        <div className="flex items-center space-x-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setMetric('renda')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              metric === 'renda'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Renda (R$)
          </button>
          <button
            onClick={() => setMetric('patrimonio')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              metric === 'patrimonio'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Patrimônio (R$)
          </button>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-[240px] sm:h-[280px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis
              dataKey="mesFormatado"
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1F2937' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => metric === 'renda' ? `R$${v}` : `R$${(v/1000).toFixed(0)}k`}
              domain={metric === 'renda' ? [1000, 'auto'] : [130000, 'auto']}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as MonthlyDividendData;
                  const isCurrent = selectedPeriod === item.periodo;
                  return (
                    <div className="bg-[#162032] border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5 z-50">
                      <div className="flex items-center justify-between gap-3 border-b border-slate-700/60 pb-1">
                        <span className="font-semibold text-white">{item.mesFormatado}</span>
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded">
                            Mês Selecionado
                          </span>
                        )}
                      </div>
                      <div className="text-emerald-400 font-mono font-semibold">
                        Renda: {formatCurrency(item.rendaTotal)}
                      </div>
                      <div className="text-sky-300 font-mono">
                        Patrimônio: {formatCurrency(item.patrimonioTotal)}
                      </div>
                      <div className="text-slate-300 text-[11px] flex items-center justify-between">
                        <span>DY Médio:</span>
                        <span className="font-mono text-teal-400 font-medium">{formatPercent(item.dyMedio)}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Cotas: {item.cotasTotal.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {metric === 'renda' && (
              <ReferenceLine
                y={mediaRenda}
                stroke="#10B981"
                strokeDasharray="4 4"
                label={{
                  value: `Média: ${formatCurrency(mediaRenda)}`,
                  fill: '#10B981',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            {metric === 'renda' ? (
              <Bar
                dataKey="rendaTotal"
                name="Renda Mensal"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                onClick={(entry) => onSelectPeriod && onSelectPeriod(entry.periodo)}
                cursor="pointer"
              />
            ) : (
              <Line
                type="monotone"
                dataKey="patrimonioTotal"
                name="Patrimônio"
                stroke="#38BDF8"
                strokeWidth={3}
                dot={{ fill: '#38BDF8', r: 4 }}
                activeDot={{ r: 6, fill: '#0284C7' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Rodapé do Gráfico */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <BarChart2 className="h-3 w-3 text-emerald-400" />
          <span>Clique nas barras para alternar o mês do dashboard</span>
        </div>
        <div className="font-mono text-slate-300 hidden sm:block">
          Média 2024: <span className="text-emerald-400 font-semibold">{formatCurrency(mediaRenda)}/mês</span>
        </div>
      </div>

    </div>
  );
};

