import React, { useState, useMemo, useEffect } from 'react';
import rawData from './data/fiis-data.json';
import { FiiRecord, FilterState, ViewMode } from './types/fii';
import { 
  filterFiiRecords, 
  calculatePortfolioKpis, 
  calculateSegmentAllocation, 
  calculateMonthlyEvolution,
  calculateTopAssetsByIncome,
  calculateValuationOpportunities,
  calculateDividendProjection,
  calculateTickerPriceSeries
} from './utils/calculations';
import { formatPeriod } from './utils/formatters';

import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { KpiCards } from './components/KpiCards';
import { AnalyticsSidebar } from './components/sidebar/AnalyticsSidebar';
import { DividendEvolutionChart } from './components/charts/DividendEvolutionChart';
import { RiskReturnScatterChart } from './components/charts/RiskReturnScatterChart';
import { FiiTable } from './components/FiiTable';
import { AssetDetailDrawer } from './components/AssetDetailDrawer';
import { ExportModal } from './components/ExportModal';
import { MethodologyModal } from './components/MethodologyModal';
import { StockTicker } from './components/StockTicker';

const allRecords = rawData as FiiRecord[];

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedTickerDrawer, setSelectedTickerDrawer] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Períodos, Segmentos e Tickers disponíveis
  const availablePeriods = useMemo(() => {
    return Array.from(new Set(allRecords.map(r => r.periodo))).sort();
  }, []);

  const availableSegmentos = useMemo(() => {
    return Array.from(new Set(allRecords.map(r => r.segmento))).sort();
  }, []);

  const availableTickers = useMemo(() => {
    return Array.from(new Set(allRecords.map(r => r.ticker))).sort();
  }, []);

  // Série histórica de preços para cada ticker (para as sparklines da tabela)
  const tickerPriceSeries = useMemo(() => {
    return calculateTickerPriceSeries(allRecords);
  }, []);

  // Estado dos filtros
  const [filters, setFilters] = useState<FilterState>({
    periodo: 'all', // Consolidado 2024 Completo por padrão
    segmentos: [],
    tickers: [],
    searchQuery: '',
  });

  // Simulação de skeleton loading rápido ao alternar filtros para sensação de live app
  useEffect(() => {
    setIsFilterLoading(true);
    const timer = setTimeout(() => setIsFilterLoading(false), 150);
    return () => clearTimeout(timer);
  }, [filters.periodo, filters.segmentos, filters.tickers]);

  const isConsolidated = filters.periodo === 'all';

  // Registros filtrados
  const filteredRecords = useMemo(() => {
    return filterFiiRecords(
      allRecords,
      filters.periodo,
      filters.segmentos,
      filters.tickers,
      filters.searchQuery
    );
  }, [filters]);

  // Cálculos consolidados da carteira
  const kpis = useMemo(() => {
    return calculatePortfolioKpis(
      filteredRecords, 
      allRecords, 
      isConsolidated, 
      filters.periodo,
      filters.segmentos,
      filters.tickers
    );
  }, [filteredRecords, isConsolidated, filters.periodo, filters.segmentos, filters.tickers]);

  const segmentAllocations = useMemo(() => {
    return calculateSegmentAllocation(filteredRecords);
  }, [filteredRecords]);

  const monthlyEvolution = useMemo(() => {
    return calculateMonthlyEvolution(allRecords, filters.segmentos, filters.tickers);
  }, [filters.segmentos, filters.tickers]);

  const topPayers = useMemo(() => {
    return calculateTopAssetsByIncome(filteredRecords, 3);
  }, [filteredRecords]);

  const valuationOpportunities = useMemo(() => {
    return calculateValuationOpportunities(filteredRecords, 3);
  }, [filteredRecords]);

  const dividendProjection = useMemo(() => {
    return calculateDividendProjection(kpis);
  }, [kpis]);

  // Reset de filtros
  const handleResetFilters = () => {
    setFilters({
      periodo: 'all',
      segmentos: [],
      tickers: [],
      searchQuery: '',
    });
  };

  // Toggle de segmento a partir do Donut Chart
  const handleToggleSegmentFromChart = (segmento: string) => {
    setFilters(prev => {
      const exists = prev.segmentos.includes(segmento);
      return {
        ...prev,
        segmentos: exists ? prev.segmentos.filter(s => s !== segmento) : [...prev.segmentos, segmento],
      };
    });
  };

  const totalAtivosFiltrados = useMemo(() => {
    return new Set(filteredRecords.map(r => r.ticker)).size;
  }, [filteredRecords]);

  return (
    <div className="min-h-screen bg-[#0A0E17] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* 1. Topbar Fixa */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onResetFilters={handleResetFilters}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        totalAtivosFiltrados={totalAtivosFiltrados}
        totalAtivosGeral={availableTickers.length}
      />

      {/* 2. Barra de Filtros Compacta e Inteligente */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        availablePeriods={availablePeriods}
        availableSegmentos={availableSegmentos}
        availableTickers={availableTickers}
        onReset={handleResetFilters}
        isLoading={isFilterLoading}
      />

      {/* 3. Letreiro de Bolsa (Ticker Móvel Contínuo Estilo Marquee) */}
      <StockTicker onSelectTicker={(ticker) => setSelectedTickerDrawer(ticker)} />

      {/* Conteúdo Principal com Container Full Width Fluid */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        
        {/* Banner Informativo de Período e Metadados */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 bg-[#111827]/70 border border-slate-800/80 px-4 py-2 rounded-xl backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200 font-medium">
              Recorte: <strong className="text-white">{formatPeriod(filters.periodo, true)}</strong>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-400">
              {filteredRecords.length} registros analisados
            </span>
          </div>

          <div className="mt-1 sm:mt-0 font-mono text-[11px] text-slate-400 flex items-center space-x-3">
            <span>IFIX 2024: <strong className="text-emerald-400 font-semibold">+1,2% a.m. ref</strong></span>
            <span className="text-slate-600">•</span>
            {isConsolidated ? (
              <span className="text-emerald-400 font-medium">Acumulado 12M</span>
            ) : (
              <span className="text-sky-400 font-medium">Fechamento Mensal</span>
            )}
          </div>
        </div>

        {/* 3. KPI CARDS com Sparklines e Contexto Comparativo */}
        <KpiCards kpis={kpis} isConsolidated={isConsolidated} />

        {/* 4. LAYOUT ASSIMÉTRICO (DASHBOARD SPLIT) */}
        {viewMode === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* COLUNA PRINCIPAL (68% - lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Gráfico de Evolução Temporal dos Proventos (Jan a Dez) */}
              <DividendEvolutionChart
                data={monthlyEvolution}
                selectedPeriod={filters.periodo}
                onSelectPeriod={(period) => setFilters(prev => ({ ...prev, periodo: period }))}
              />

              {/* Tabela Interativa da Carteira com Sparklines e Barra de Peso */}
              <FiiTable
                records={filteredRecords}
                totalPatrimonio={kpis.patrimonioTotal}
                totalRenda={kpis.rendaMensalTotal}
                priceSeriesMap={tickerPriceSeries}
                onSelectTicker={(ticker) => setSelectedTickerDrawer(ticker)}
                isConsolidated={isConsolidated}
              />
            </div>

            {/* COLUNA LATERAL / SIDEBAR ANALÍTICA (32% - lg:col-span-4) */}
            <div className="lg:col-span-4">
              <AnalyticsSidebar
                allocations={segmentAllocations}
                totalPatrimonio={kpis.patrimonioTotal}
                selectedSegments={filters.segmentos}
                onSelectSegment={handleToggleSegmentFromChart}
                topPayers={topPayers}
                opportunities={valuationOpportunities}
                projection={dividendProjection}
                onSelectTicker={(ticker) => setSelectedTickerDrawer(ticker)}
                isConsolidated={isConsolidated}
              />
            </div>

          </div>
        )}

        {/* 5. VISÃO DE ANÁLISE DE VALUATION E RISCO x RETORNO */}
        {viewMode === 'analytics' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              <div className="lg:col-span-8 space-y-5">
                {/* Matriz de Valuation Scatter Plot */}
                <RiskReturnScatterChart
                  records={filteredRecords}
                  onSelectTicker={(ticker) => setSelectedTickerDrawer(ticker)}
                />

                {/* Tabela da Carteira */}
                <FiiTable
                  records={filteredRecords}
                  totalPatrimonio={kpis.patrimonioTotal}
                  totalRenda={kpis.rendaMensalTotal}
                  priceSeriesMap={tickerPriceSeries}
                  onSelectTicker={(ticker) => setSelectedTickerDrawer(ticker)}
                  isConsolidated={isConsolidated}
                />
              </div>

              <div className="lg:col-span-4">
                <AnalyticsSidebar
                  allocations={segmentAllocations}
                  totalPatrimonio={kpis.patrimonioTotal}
                  selectedSegments={filters.segmentos}
                  onSelectSegment={handleToggleSegmentFromChart}
                  topPayers={topPayers}
                  opportunities={valuationOpportunities}
                  projection={dividendProjection}
                  onSelectTicker={(ticker) => setSelectedTickerDrawer(ticker)}
                  isConsolidated={isConsolidated}
                />
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer Profissional */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F17] py-6 text-xs text-slate-400 mt-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">FIIs Analytics 2024</span>
            <span>•</span>
            <span>Plataforma de Inteligência em Fundos Imobiliários B3</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>React 18 • Vite 6 • Tailwind CSS • Recharts</span>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="text-emerald-400 hover:underline"
            >
              Fórmulas e Metodologia
            </button>
          </div>
        </div>
      </footer>

      {/* 6. SLIDE-OVER SHEET LATERAL (DETALHES DO FUNDO COM LINKS EXTERNOS) */}
      <AssetDetailDrawer
        ticker={selectedTickerDrawer}
        allRecords={allRecords}
        onClose={() => setSelectedTickerDrawer(null)}
        onSelectAnotherTicker={(ticker) => setSelectedTickerDrawer(ticker)}
        availableTickers={availableTickers}
      />

      {/* Modal de Exportação (CSV, JSON, PDF) */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        records={filteredRecords}
        periodo={filters.periodo}
      />

      {/* Modal de Metodologia */}
      <MethodologyModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

    </div>
  );
};

export default App;
