import React from 'react';
import { 
  Wallet, 
  Coins, 
  Percent, 
  Scale, 
  Layers, 
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { PortfolioKpis } from '../types/fii';
import { formatCurrency, formatPercent, formatNumber, getPvpBadge } from '../utils/formatters';
import { Sparkline } from './common/Sparkline';

interface KpiCardsProps {
  kpis: PortfolioKpis;
  isConsolidated: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis, isConsolidated }) => {
  const pvpBadge = getPvpBadge(kpis.pvpMedioPonderado);

  const renderChangeBadge = (pct: number, label: string) => {
    if (Math.abs(pct) < 0.05) {
      return (
        <span className="inline-flex items-center text-[10px] text-slate-400 font-mono">
          <Minus className="h-2.5 w-2.5 mr-0.5" /> 0.0% {label}
        </span>
      );
    }
    const isPositive = pct > 0;
    return (
      <span className={`inline-flex items-center text-[10px] font-mono font-medium ${
        isPositive ? 'text-emerald-400' : 'text-rose-400'
      }`}>
        {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
        {isPositive ? '+' : ''}{pct.toFixed(1)}% {label}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      
      {/* 1. Patrimônio Total Investido */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#131D2E] to-[#162032] border border-slate-800/90 rounded-2xl p-4 hover:border-sky-500/40 transition-all duration-300 group shadow-card-premium flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Patrimônio
            </span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 group-hover:scale-105 transition-transform">
              <Wallet className="h-3.5 w-3.5" />
            </div>
          </div>
          
          <div className="mt-2">
            <div className="text-xl font-bold font-mono tracking-tight text-white tabular-nums">
              {formatCurrency(kpis.patrimonioTotal)}
            </div>
          </div>
        </div>

        {/* Rodapé com Sparkline e Comparativo */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-end justify-between">
          <div className="flex flex-col">
            {isConsolidated ? (
              <span className="text-[10px] text-slate-400">Posição final 2024</span>
            ) : (
              renderChangeBadge(kpis.patrimonioChangePct, 'vs anterior')
            )}
            <span className="text-[9px] text-slate-500">Curva Jan-Dez</span>
          </div>

          <div className="opacity-80 group-hover:opacity-100 transition-opacity">
            <Sparkline
              data={kpis.patrimonioSeries}
              width={75}
              height={22}
              color="#38BDF8"
              fillOpacity={0.2}
            />
          </div>
        </div>
      </div>

      {/* 2. Renda Mensal Total */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#131D2E] to-[#162032] border border-slate-800/90 rounded-2xl p-4 hover:border-emerald-500/40 transition-all duration-300 group shadow-card-premium flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isConsolidated ? 'Renda Média/Mês' : 'Renda do Mês'}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform shadow-glow-emerald">
              <Coins className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-2">
            <div className="text-xl font-bold font-mono tracking-tight text-emerald-400 tabular-nums">
              {formatCurrency(kpis.rendaMensalTotal)}
            </div>
          </div>
        </div>

        {/* Rodapé com Sparkline e Comparativo */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-end justify-between">
          <div className="flex flex-col">
            {isConsolidated ? (
              <span className="text-[10px] font-mono text-emerald-400 font-medium">
                12M: {formatCurrency(kpis.rendaAcumuladaAno)}
              </span>
            ) : (
              renderChangeBadge(kpis.rendaChangePct, 'vs anterior')
            )}
            <span className="text-[9px] text-slate-500">Histórico proventos</span>
          </div>

          <div className="opacity-80 group-hover:opacity-100 transition-opacity">
            <Sparkline
              data={kpis.rendaSeries}
              width={75}
              height={22}
              color="#10B981"
              fillOpacity={0.25}
            />
          </div>
        </div>
      </div>

      {/* 3. Dividend Yield Médio Ponderado */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#131D2E] to-[#162032] border border-slate-800/90 rounded-2xl p-4 hover:border-teal-500/40 transition-all duration-300 group shadow-card-premium flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              DY Ponderado
            </span>
            <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 group-hover:scale-105 transition-transform">
              <Percent className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-xl font-bold font-mono tracking-tight text-teal-300 tabular-nums">
              {formatPercent(kpis.dyMedioPonderado)}
            </span>
            <span className="text-xs text-slate-400 font-sans">a.m.</span>
          </div>
        </div>

        {/* Rodapé com Sparkline e Projeção */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-teal-300 font-mono font-medium">
              ~{formatPercent(kpis.dyAnualizadoProjetado)} a.a.
            </span>
            <span className="text-[9px] text-slate-500">Projeção composta</span>
          </div>

          <div className="opacity-80 group-hover:opacity-100 transition-opacity">
            <Sparkline
              data={kpis.dySeries}
              width={75}
              height={22}
              color="#14B8A6"
              fillOpacity={0.2}
            />
          </div>
        </div>
      </div>

      {/* 4. Preço / Valor Patrimonial (P/VP Médio) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#131D2E] to-[#162032] border border-slate-800/90 rounded-2xl p-4 hover:border-indigo-500/40 transition-all duration-300 group shadow-card-premium flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              P/VP Carteira
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform">
              <Scale className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-xl font-bold font-mono tracking-tight text-white tabular-nums">
              {kpis.pvpMedioPonderado.toFixed(2)}
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${pvpBadge.bgClass} ${pvpBadge.textClass} ${pvpBadge.borderClass}`}>
              {pvpBadge.label}
            </span>
          </div>
        </div>

        {/* Rodapé com Sparkline e Desconto */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-300 font-mono">
              {kpis.pvpMedioPonderado < 1.00 
                ? `-${formatPercent((1 - kpis.pvpMedioPonderado) * 100, 1)} desc.`
                : `+${formatPercent((kpis.pvpMedioPonderado - 1) * 100, 1)} ágio`}
            </span>
            <span className="text-[9px] text-slate-500">Paridade = 1.00</span>
          </div>

          <div className="opacity-80 group-hover:opacity-100 transition-opacity">
            <Sparkline
              data={kpis.pvpSeries}
              width={75}
              height={22}
              color="#818CF8"
              fillOpacity={0.2}
            />
          </div>
        </div>
      </div>

      {/* 5. Composição e Quantidade de Cotas */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#131D2E] to-[#162032] border border-slate-800/90 rounded-2xl p-4 hover:border-purple-500/40 transition-all duration-300 group shadow-card-premium flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Cotas & Ativos
            </span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform">
              <Layers className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-2">
            <div className="text-xl font-bold font-mono tracking-tight text-white tabular-nums">
              {formatNumber(kpis.totalCotas)} <span className="text-xs font-normal text-slate-400 font-sans">cotas</span>
            </div>
          </div>
        </div>

        {/* Rodapé com Ativos e Segmentos */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-purple-300 font-medium">
              {kpis.totalAtivos} FIIs em {kpis.totalSegmentos} setores
            </span>
            <span className="text-[9px] text-slate-500">Diversificação B3</span>
          </div>

          <div className="opacity-80 group-hover:opacity-100 transition-opacity">
            <Sparkline
              data={kpis.cotasSeries}
              width={75}
              height={22}
              color="#A855F7"
              fillOpacity={0.2}
            />
          </div>
        </div>
      </div>

    </div>
  );
};
