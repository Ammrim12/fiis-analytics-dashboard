import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { SegmentAllocation } from '../../types/fii';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { PieChart as PieIcon, Layers } from 'lucide-react';

interface AllocationChartProps {
  allocations: SegmentAllocation[];
  totalPatrimonio: number;
  onSelectSegment?: (segment: string) => void;
  selectedSegments?: string[];
}

export const AllocationChart: React.FC<AllocationChartProps> = ({
  allocations,
  totalPatrimonio,
  onSelectSegment,
  selectedSegments = [],
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (allocations.length === 0) {
    return (
      <div className="card-finance p-6 flex flex-col items-center justify-center min-h-[360px] text-slate-500">
        <PieIcon className="h-10 w-10 mb-2 stroke-[1.5]" />
        <p className="text-sm">Nenhum segmento para exibir</p>
      </div>
    );
  }

  const activeItem = activeIndex !== null ? allocations[activeIndex] : null;

  return (
    <div className="card-finance p-5 flex flex-col h-full shadow-card-premium">
      
      {/* Header do Card */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <PieIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Alocação por Segmento</h3>
            <p className="text-xs text-slate-400">Distribuição percentual do patrimônio</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
          <Layers className="h-3 w-3 text-sky-400" />
          <span>{allocations.length} segmentos</span>
        </div>
      </div>

      {/* Conteúdo: Donut + Legenda */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center flex-1 py-2">
        
        {/* Gráfico Donut */}
        <div className="md:col-span-6 relative h-[240px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocations}
                dataKey="valorTotal"
                nameKey="segmento"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={(entry) => onSelectSegment && onSelectSegment(entry.segmento)}
                cursor="pointer"
              >
                {allocations.map((entry, index) => {
                  const isFiltered = selectedSegments.length > 0 && !selectedSegments.includes(entry.segmento);
                  const isHovered = activeIndex === index;
                  return (
                    <Cell
                      key={`cell-${entry.segmento}`}
                      fill={entry.color}
                      opacity={isFiltered ? 0.3 : isHovered ? 1 : 0.85}
                      stroke={isHovered ? '#ffffff' : '#0F172A'}
                      strokeWidth={isHovered ? 2 : 1}
                    />
                  );
                })}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as SegmentAllocation;
                    return (
                      <div className="bg-[#162032] border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
                        <div className="flex items-center space-x-1.5 font-semibold text-white">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                          <span>{data.segmento}</span>
                        </div>
                        <div className="text-slate-300 font-mono font-medium">
                          {formatCurrency(data.valorTotal)} ({formatPercent(data.percentual)})
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          Renda do segmento: {formatCurrency(data.rendaMensal)}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {data.ativosCount} ativo(s) na carteira
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centro do Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {activeItem ? (
              <>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {activeItem.segmento}
                </span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {formatPercent(activeItem.percentual)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {formatCurrency(activeItem.valorTotal)}
                </span>
              </>
            ) : (
              <>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Total
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-white">
                  {formatCurrency(totalPatrimonio)}
                </span>
                <span className="text-[9px] text-slate-500">100% da carteira</span>
              </>
            )}
          </div>
        </div>

        {/* Legenda Customizada Interativa */}
        <div className="md:col-span-6 flex flex-col justify-center space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
          {allocations.map((item, idx) => {
            const isSelected = selectedSegments.includes(item.segmento);
            const isHovered = activeIndex === idx;

            return (
              <button
                key={item.segmento}
                onClick={() => onSelectSegment && onSelectSegment(item.segmento)}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition-all text-left ${
                  isHovered || isSelected
                    ? 'bg-slate-800 border border-slate-700'
                    : 'hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2 truncate mr-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={`truncate text-xs ${isHovered || isSelected ? 'text-white font-medium' : 'text-slate-300'}`}>
                    {item.segmento}
                  </span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 text-right">
                  <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                    {formatCurrency(item.valorTotal)}
                  </span>
                  <span className="text-xs font-mono font-semibold text-emerald-400 w-12 text-right">
                    {formatPercent(item.percentual, 1)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};

