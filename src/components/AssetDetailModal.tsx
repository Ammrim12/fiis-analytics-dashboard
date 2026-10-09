import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  DollarSign, 
  Coins, 
  Layers, 
  Calendar,
  Building2,
  ChevronDown,
  Scale
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { FiiRecord } from '../types/fii';
import { 
  formatCurrency, 
  formatPercent, 
  formatNumber, 
  formatPeriod, 
  getPvpBadge, 
  getSegmentColor,
  MONTH_NAMES_SHORT 
} from '../utils/formatters';

interface AssetDetailModalProps {
  ticker: string | null;
  allRecords: FiiRecord[];
  onClose: () => void;
  onSelectAnotherTicker?: (ticker: string) => void;
  availableTickers: string[];
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  ticker,
  allRecords,
  onClose,
  onSelectAnotherTicker,
  availableTickers,
}) => {
  const [activeTab, setActiveTab] = useState<'price' | 'yield'>('price');

  if (!ticker) return null;

  // Filtra todos os registros desse ticker em 2024 ordenados por período
  const history = allRecords
    .filter(r => r.ticker === ticker)
    .sort((a, b) => a.periodo.localeCompare(b.periodo));

  if (history.length === 0) return null;

  const latest = history[history.length - 1];
  const pvpBadge = getPvpBadge(latest.pvp);
  const segColor = getSegmentColor(latest.segmento);

  // Métricas do ativo no ano
  const totalRendaAno = history.reduce((acc, curr) => acc + curr.rendaMensal, 0);
  const totalRendCotaAno = history.reduce((acc, curr) => acc + curr.rendimentoPorCota, 0);
  const avgDy = history.reduce((acc, curr) => acc + curr.dyMensal, 0) / (history.length || 1);
  const minPreco = Math.min(...history.map(r => r.precoAtual));
  const maxPreco = Math.max(...history.map(r => r.precoAtual));

  // Dados para gráficos formatados
  const chartData = history.map(item => {
    const parts = item.periodo.split('-');
    const m = parts[1] || '01';
    return {
      mes: MONTH_NAMES_SHORT[m] || m,
      periodo: item.periodo,
      preco: item.precoAtual,
      vp: item.vpPorCota,
      rendimento: item.rendimentoPorCota,
      dy: item.dyMensal,
      renda: item.rendaMensal,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header do Modal */}
        <div className="sticky top-0 bg-[#0F172A]/95 backdrop-blur-md p-5 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <select
                    value={ticker}
                    onChange={(e) => onSelectAnotherTicker && onSelectAnotherTicker(e.target.value)}
                    className="font-mono text-xl font-bold text-white bg-slate-800/80 border border-slate-700 rounded-lg px-2 py-0.5 pr-7 appearance-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
                  >
                    {availableTickers.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="h-4 w-4 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: `${segColor}20`,
                    color: segColor,
                    border: `1px solid ${segColor}40`,
                  }}
                >
                  {latest.segmento}
                </span>

                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${pvpBadge.bgClass} ${pvpBadge.textClass} ${pvpBadge.borderClass}`}>
                  {pvpBadge.label} (P/VP {latest.pvp.toFixed(2)})
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-0.5">{latest.nome}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* Métricas Principais do Fundo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#162032] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-medium flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-sky-400" /> Cotação Atual
              </span>
              <div className="mt-1 text-lg font-bold font-mono text-white">
                {formatCurrency(latest.precoAtual)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                VP: {formatCurrency(latest.vpPorCota)}
              </div>
            </div>

            <div className="bg-[#162032] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-medium flex items-center gap-1">
                <Coins className="h-3 w-3 text-emerald-400" /> Renda Total em 2024
              </span>
              <div className="mt-1 text-lg font-bold font-mono text-emerald-400">
                {formatCurrency(totalRendaAno)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {formatCurrency(totalRendCotaAno)} por cota acumulado
              </div>
            </div>

            <div className="bg-[#162032] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-teal-400" /> DY Médio Mensal
              </span>
              <div className="mt-1 text-lg font-bold font-mono text-teal-300">
                {formatPercent(avgDy)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                ~{formatPercent(((Math.pow(1 + (avgDy / 100), 12) - 1) * 100))} a.a. projetado
              </div>
            </div>

            <div className="bg-[#162032] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-medium flex items-center gap-1">
                <Layers className="h-3 w-3 text-purple-400" /> Posição na Carteira
              </span>
              <div className="mt-1 text-lg font-bold font-mono text-white">
                {formatCurrency(latest.valorTotal)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {formatNumber(latest.cotas)} cotas possuídas
              </div>
            </div>
          </div>

          {/* Gráfico Histórico com Abas */}
          <div className="bg-[#162032] p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-white">Histórico ao longo de 2024</h4>
              </div>

              {/* Botões de Métrica */}
              <div className="flex items-center space-x-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-700">
                <button
                  onClick={() => setActiveTab('price')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    activeTab === 'price'
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cotação vs. VP
                </button>
                <button
                  onClick={() => setActiveTab('yield')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    activeTab === 'yield'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Rendimento / Cota
                </button>
              </div>
            </div>

            {/* Container do Gráfico */}
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'price' ? (
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                    <XAxis dataKey="mes" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} domain={['auto', 'auto']} tickFormatter={(v) => `R$${v}`} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-[#0F172A] border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                              <span className="font-bold text-white block">{item.periodo}</span>
                              <div className="text-sky-400 font-mono">Preço Cota: {formatCurrency(item.preco)}</div>
                              <div className="text-slate-400 font-mono">VP Cota: {formatCurrency(item.vp)}</div>
                              <div className="text-teal-300 font-mono">P/VP: {(item.preco / item.vp).toFixed(2)}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line type="monotone" dataKey="preco" name="Preço Atual" stroke="#38BDF8" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="vp" name="VP por Cota" stroke="#94A3B8" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2 }} />
                  </LineChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                    <XAxis dataKey="mes" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} domain={['auto', 'auto']} tickFormatter={(v) => `R$${v}`} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-[#0F172A] border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                              <span className="font-bold text-white block">{item.periodo}</span>
                              <div className="text-emerald-400 font-mono">Rendimento: {formatCurrency(item.rendimento)}</div>
                              <div className="text-teal-300 font-mono">DY Mensal: {formatPercent(item.dy)}</div>
                              <div className="text-white font-mono">Renda Total: {formatCurrency(item.renda)}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="rendimento" name="Rendimento por Cota" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Faixa de preço em 2024: <strong className="text-white font-mono">{formatCurrency(minPreco)} - {formatCurrency(maxPreco)}</strong></span>
              <span className="flex items-center gap-1">
                <Scale className="h-3 w-3 text-sky-400" />
                Desvio máx/mín: {formatPercent(((maxPreco - minPreco) / minPreco) * 100, 1)}
              </span>
            </div>
          </div>

          {/* Tabela do Histórico Mensal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Histórico Mensal Completo ({history.length} meses registrados)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-[#0D131F] text-slate-400 text-[10px] uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Mês</th>
                    <th className="py-2.5 px-3 text-right">Cotação</th>
                    <th className="py-2.5 px-3 text-right">VP Cota</th>
                    <th className="py-2.5 px-3 text-right">P/VP</th>
                    <th className="py-2.5 px-3 text-right">Rend./Cota</th>
                    <th className="py-2.5 px-3 text-right">DY Mensal</th>
                    <th className="py-2.5 px-3 text-right">Renda Mensal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {history.map(row => (
                    <tr key={row.periodo} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-medium text-white">
                        {formatPeriod(row.periodo, true)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono">{formatCurrency(row.precoAtual)}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-400">{formatCurrency(row.vpPorCota)}</td>
                      <td className="py-2 px-3 text-right font-mono font-medium">
                        <span className={row.pvp < 1.0 ? 'text-emerald-400' : 'text-amber-400'}>
                          {row.pvp.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono">{formatCurrency(row.rendimentoPorCota)}</td>
                      <td className="py-2 px-3 text-right font-mono text-teal-300">{formatPercent(row.dyMensal)}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-400">{formatCurrency(row.rendaMensal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
