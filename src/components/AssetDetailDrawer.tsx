import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  Coins, 
  Layers, 
  Calendar,
  Building2,
  ChevronDown,
  Scale,
  ExternalLink,
  TrendingUp,
  Search
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

interface AssetDetailDrawerProps {
  ticker: string | null;
  allRecords: FiiRecord[];
  onClose: () => void;
  onSelectAnotherTicker: (ticker: string) => void;
  availableTickers: string[];
}

export const AssetDetailDrawer: React.FC<AssetDetailDrawerProps> = ({
  ticker,
  allRecords,
  onClose,
  onSelectAnotherTicker,
  availableTickers,
}) => {
  const [activeTab, setActiveTab] = useState<'price' | 'yield'>('price');
  const [searchTicker, setSearchTicker] = useState('');
  const [tickerSelectOpen, setTickerSelectOpen] = useState(false);

  // Fecha no ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!ticker) return null;

  const history = allRecords
    .filter(r => r.ticker === ticker)
    .sort((a, b) => a.periodo.localeCompare(b.periodo));

  if (history.length === 0) return null;

  const latest = history[history.length - 1];
  const pvpBadge = getPvpBadge(latest.pvp);
  const segColor = getSegmentColor(latest.segmento);

  const totalRendaAno = history.reduce((acc, curr) => acc + curr.rendaMensal, 0);
  const totalRendCotaAno = history.reduce((acc, curr) => acc + curr.rendimentoPorCota, 0);
  const avgDy = history.reduce((acc, curr) => acc + curr.dyMensal, 0) / (history.length || 1);
  const minPreco = Math.min(...history.map(r => r.precoAtual));
  const maxPreco = Math.max(...history.map(r => r.precoAtual));

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

  // Links externos de referência de mercado
  const statusInvestUrl = `https://statusinvest.com.br/fundos-imobiliarios/${ticker.toLowerCase()}`;
  const clubeFiiUrl = `https://www.clubefii.com.br/fii/${ticker.toLowerCase()}`;

  const filteredTickerList = availableTickers.filter(t => 
    t.toLowerCase().includes(searchTicker.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Backdrop com Blur suave */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Slide-over Sheet à Direita */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#0D131F] border-l border-slate-800 shadow-2xl flex flex-col transform transition-transform ease-out duration-300 animate-in slide-in-from-right">
          
          {/* Header do Drawer */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center justify-between">
              
              {/* Seletor Compacto do Ticker */}
              <div className="relative">
                <button
                  onClick={() => setTickerSelectOpen(!tickerSelectOpen)}
                  className="flex items-center space-x-2 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg text-white font-mono font-bold text-lg transition-colors group"
                >
                  <Building2 className="h-4 w-4 text-emerald-400" />
                  <span>{ticker}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>

                {/* Dropdown com Busca */}
                {tickerSelectOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-[#162032] border border-slate-700 rounded-xl shadow-2xl z-50 p-2 space-y-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar FII..."
                        value={searchTicker}
                        onChange={(e) => setSearchTicker(e.target.value)}
                        autoFocus
                        className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg pl-8 pr-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto grid grid-cols-2 gap-1">
                      {filteredTickerList.map(t => (
                        <button
                          key={t}
                          onClick={() => {
                            onSelectAnotherTicker(t);
                            setTickerSelectOpen(false);
                            setSearchTicker('');
                          }}
                          className={`px-2 py-1 text-xs font-mono rounded text-left transition-colors ${
                            t === ticker ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botão Fechar */}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Fechar (ESC)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nome do Fundo e Badges */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">
                {latest.nome}
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${segColor}20`,
                  color: segColor,
                  border: `1px solid ${segColor}40`,
                }}
              >
                {latest.segmento}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${pvpBadge.bgClass} ${pvpBadge.textClass} ${pvpBadge.borderClass}`}>
                {pvpBadge.label} (P/VP {latest.pvp.toFixed(2)})
              </span>
            </div>

            {/* Links Externos (Clube FII & Status Invest) */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center space-x-2">
              <span className="text-[10px] text-slate-400">Análise de Mercado:</span>
              <a
                href={statusInvestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] font-medium text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 px-2 py-0.5 rounded border border-sky-500/30 transition-colors"
              >
                <span>Status Invest</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={clubeFiiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 transition-colors"
              >
                <span>Clube FII</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Conteúdo com Scroll */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            
            {/* Grid 2x2 com Indicadores Chave */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#141C2E] p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-sky-400" /> Cotação Atual
                </span>
                <div className="mt-1 text-base font-bold font-mono text-white tabular-nums">
                  {formatCurrency(latest.precoAtual)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  VP: {formatCurrency(latest.vpPorCota)}
                </div>
              </div>

              <div className="bg-[#141C2E] p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <Coins className="h-3 w-3 text-emerald-400" /> Renda Total 2024
                </span>
                <div className="mt-1 text-base font-bold font-mono text-emerald-400 tabular-nums">
                  {formatCurrency(totalRendaAno)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {formatCurrency(totalRendCotaAno)} / cota no ano
                </div>
              </div>

              <div className="bg-[#141C2E] p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-teal-400" /> DY Médio Mensal
                </span>
                <div className="mt-1 text-base font-bold font-mono text-teal-300 tabular-nums">
                  {formatPercent(avgDy)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  ~{formatPercent(((Math.pow(1 + (avgDy / 100), 12) - 1) * 100))} a.a. proj.
                </div>
              </div>

              <div className="bg-[#141C2E] p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <Layers className="h-3 w-3 text-purple-400" /> Posição Investida
                </span>
                <div className="mt-1 text-base font-bold font-mono text-white tabular-nums">
                  {formatCurrency(latest.valorTotal)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {formatNumber(latest.cotas)} cotas
                </div>
              </div>
            </div>

            {/* Gráficos com Alternador de Abas */}
            <div className="bg-[#141C2E] p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-2">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                  <h5 className="text-xs font-semibold text-white">Oscilação ao Longo de 2024</h5>
                </div>

                <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveTab('price')}
                    className={`px-2 py-0.5 text-[11px] rounded font-medium transition-colors ${
                      activeTab === 'price'
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Preço vs VP
                  </button>
                  <button
                    onClick={() => setActiveTab('yield')}
                    className={`px-2 py-0.5 text-[11px] rounded font-medium transition-colors ${
                      activeTab === 'yield'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Rendimento
                  </button>
                </div>
              </div>

              {/* Área do Gráfico */}
              <div className="h-[200px] w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  {activeTab === 'price' ? (
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                      <XAxis dataKey="mes" stroke="#64748B" fontSize={10} />
                      <YAxis stroke="#64748B" fontSize={10} domain={['auto', 'auto']} tickFormatter={(v) => `R$${v}`} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const item = payload[0].payload;
                            return (
                              <div className="bg-[#0F172A] border border-slate-700 p-2 rounded-lg shadow-xl text-[11px] space-y-0.5">
                                <span className="font-bold text-white block">{item.periodo}</span>
                                <div className="text-sky-400 font-mono">Preço: {formatCurrency(item.preco)}</div>
                                <div className="text-slate-400 font-mono">VP: {formatCurrency(item.vp)}</div>
                                <div className="text-teal-300 font-mono">P/VP: {(item.preco / item.vp).toFixed(2)}</div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line type="monotone" dataKey="preco" stroke="#38BDF8" strokeWidth={2} dot={{ r: 2.5 }} />
                      <Line type="monotone" dataKey="vp" stroke="#64748B" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                    </LineChart>
                  ) : (
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                      <XAxis dataKey="mes" stroke="#64748B" fontSize={10} />
                      <YAxis stroke="#64748B" fontSize={10} domain={['auto', 'auto']} tickFormatter={(v) => `R$${v}`} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const item = payload[0].payload;
                            return (
                              <div className="bg-[#0F172A] border border-slate-700 p-2 rounded-lg shadow-xl text-[11px] space-y-0.5">
                                <span className="font-bold text-white block">{item.periodo}</span>
                                <div className="text-emerald-400 font-mono">Rend/Cota: {formatCurrency(item.rendimento)}</div>
                                <div className="text-teal-300 font-mono">DY: {formatPercent(item.dy)}</div>
                                <div className="text-white font-mono">Total Mês: {formatCurrency(item.renda)}</div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="rendimento" fill="#10B981" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800">
                <span>Mín/Máx 2024: <strong className="text-white font-mono">{formatCurrency(minPreco)} - {formatCurrency(maxPreco)}</strong></span>
                <span className="flex items-center gap-1">
                  <Scale className="h-3 w-3 text-sky-400" />
                  Oscilação: {formatPercent(((maxPreco - minPreco) / minPreco) * 100, 1)}
                </span>
              </div>
            </div>

            {/* Tabela de Histórico Mensal */}
            <div>
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Histórico Mês a Mês ({history.length} períodos)
              </h5>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#111827]">
                <table className="w-full text-left text-[11px] text-slate-200">
                  <thead className="bg-[#0D131F] text-slate-400 uppercase text-[9px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-2.5">Mês</th>
                      <th className="py-2 px-2 text-right">Preço</th>
                      <th className="py-2 px-2 text-right">VP</th>
                      <th className="py-2 px-2 text-right">P/VP</th>
                      <th className="py-2 px-2 text-right">Rend.</th>
                      <th className="py-2 px-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {history.map(row => (
                      <tr key={row.periodo} className="hover:bg-slate-800/40">
                        <td className="py-1.5 px-2.5 font-sans font-medium text-white">{formatPeriod(row.periodo)}</td>
                        <td className="py-1.5 px-2 text-right tabular-nums">{formatCurrency(row.precoAtual)}</td>
                        <td className="py-1.5 px-2 text-right text-slate-400 tabular-nums">{formatCurrency(row.vpPorCota)}</td>
                        <td className="py-1.5 px-2 text-right font-medium tabular-nums">
                          <span className={row.pvp < 1.0 ? 'text-emerald-400' : 'text-amber-400'}>
                            {row.pvp.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-1.5 px-2 text-right text-teal-300 tabular-nums">{formatCurrency(row.rendimentoPorCota)}</td>
                        <td className="py-1.5 px-2.5 text-right font-semibold text-emerald-400 tabular-nums">{formatCurrency(row.rendaMensal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

