import { 
  Trophy, 
  Sparkles, 
  CalendarClock, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { 
  SegmentAllocation, 
  ValuationOpportunity, 
  DividendProjection 
} from '../../types/fii';
import { formatCurrency, formatPercent, getSegmentColor } from '../../utils/formatters';
import { AllocationChart } from '../charts/AllocationChart';

interface TopAsset {
  ticker: string;
  nome: string;
  segmento: string;
  rendaTotal: number;
  valorTotal: number;
  cotas: number;
  participacaoRenda: number;
}

interface AnalyticsSidebarProps {
  allocations: SegmentAllocation[];
  totalPatrimonio: number;
  selectedSegments: string[];
  onSelectSegment: (segment: string) => void;
  topPayers: TopAsset[];
  opportunities: ValuationOpportunity[];
  projection: DividendProjection;
  onSelectTicker: (ticker: string) => void;
  isConsolidated: boolean;
}

export const AnalyticsSidebar: React.FC<AnalyticsSidebarProps> = ({
  allocations,
  totalPatrimonio,
  selectedSegments,
  onSelectSegment,
  topPayers,
  opportunities,
  projection,
  onSelectTicker,
  isConsolidated,
}) => {
  return (
    <div className="space-y-4">
      
      {/* 1. Alocação por Segmento (Donut Chart) */}
      <AllocationChart
        allocations={allocations}
        totalPatrimonio={totalPatrimonio}
        onSelectSegment={onSelectSegment}
        selectedSegments={selectedSegments}
      />

      {/* 2. Top 3 Melhores Pagadores de Proventos */}
      <div className="card-finance p-4 shadow-card-premium">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Top 3 Maiores Pagadores
              </h4>
              <p className="text-[11px] text-slate-400">
                {isConsolidated ? 'Maior fluxo no ano de 2024' : 'Líderes de renda no mês'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Líderes
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {topPayers.slice(0, 3).map((item, idx) => {
            const segColor = getSegmentColor(item.segmento);
            const medals = ['🥇', '🥈', '🥉'];

            return (
              <div
                key={item.ticker}
                onClick={() => onSelectTicker(item.ticker)}
                className="group flex items-center justify-between p-2 rounded-xl bg-[#162032]/60 hover:bg-slate-800 transition-all cursor-pointer border border-slate-800/80 hover:border-slate-700"
              >
                <div className="flex items-center space-x-2.5 truncate mr-2">
                  <span className="text-sm select-none">{medals[idx] || `${idx + 1}º`}</span>
                  <div className="truncate">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">
                        {item.ticker}
                      </span>
                      <span
                        className="text-[9px] px-1.5 py-0.1 rounded font-medium"
                        style={{
                          backgroundColor: `${segColor}15`,
                          color: segColor,
                        }}
                      >
                        {item.segmento}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatPercent(item.participacaoRenda, 1)} da renda total
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <span className="font-mono font-bold text-xs text-emerald-400 tabular-nums">
                    {formatCurrency(item.rendaTotal)}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Top Oportunidades de Valuation (Menor P/VP com Desconto) */}
      <div className="card-finance p-4 shadow-card-premium">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Top Oportunidades (P/VP)
              </h4>
              <p className="text-[11px] text-slate-400">
                Ativos negociando com maior desconto patrimonial
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-sky-400 font-semibold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
            Desconto
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {opportunities.map((item) => {
            const segColor = getSegmentColor(item.segmento);

            return (
              <div
                key={item.ticker}
                onClick={() => onSelectTicker(item.ticker)}
                className="group flex items-center justify-between p-2 rounded-xl bg-[#162032]/60 hover:bg-slate-800 transition-all cursor-pointer border border-slate-800/80 hover:border-slate-700"
              >
                <div className="flex items-center space-x-2.5 truncate mr-2">
                  <div className="truncate">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono font-bold text-xs text-white group-hover:text-sky-400 transition-colors">
                        {item.ticker}
                      </span>
                      <span
                        className="text-[9px] px-1.5 py-0.1 rounded font-medium"
                        style={{
                          backgroundColor: `${segColor}15`,
                          color: segColor,
                        }}
                      >
                        {item.segmento}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      DY: {formatPercent(item.dyMensal)} a.m.
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-mono font-bold text-xs text-white tabular-nums">
                      P/VP {item.pvp.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-emerald-400">
                      -{formatPercent(item.descontoPct, 1)} desc.
                    </span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Projeção de Próximos Proventos */}
      <div className="relative overflow-hidden card-finance p-4 shadow-card-premium border-emerald-500/30 bg-gradient-to-br from-[#111827] via-[#131F2E] to-[#111827]">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CalendarClock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Projeção de Proventos
              </h4>
              <p className="text-[11px] text-slate-400">
                Estimativa recorrente para o próximo ciclo
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
            30 dias
          </span>
        </div>

        <div className="mt-3 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-300">Renda Estimada:</span>
            <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
              {formatCurrency(projection.rendaMensalEstimada)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
            <div className="bg-[#162032] p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Projeção 12M:</span>
              <span className="font-mono font-semibold text-white">
                {formatCurrency(projection.rendaAnualEstimada)}
              </span>
            </div>

            <div className="bg-[#162032] p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Médio / Cota:</span>
              <span className="font-mono font-semibold text-teal-300">
                {formatCurrency(projection.valorPorCotaMedio)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 pt-1">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>Baseado no histórico do ano de 2024 com {projection.dyMedioPonderado.toFixed(2)}% a.m.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
