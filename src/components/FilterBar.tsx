import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  PieChart, 
  Tag, 
  X, 
  ChevronDown, 
  Check, 
  Filter
} from 'lucide-react';
import { FilterState } from '../types/fii';
import { MONTH_NAMES_FULL, getSegmentColor } from '../utils/formatters';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availablePeriods: string[];
  availableSegmentos: string[];
  availableTickers: string[];
  onReset: () => void;
  isLoading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  availablePeriods,
  availableSegmentos,
  availableTickers,
  onReset,
  isLoading = false,
}) => {
  const [segmentDropdownOpen, setSegmentDropdownOpen] = useState(false);
  const [tickerDropdownOpen, setTickerDropdownOpen] = useState(false);
  const [tickerSearchInput, setTickerSearchInput] = useState('');

  const segmentRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (segmentRef.current && !segmentRef.current.contains(event.target as Node)) {
        setSegmentDropdownOpen(false);
      }
      if (tickerRef.current && !tickerRef.current.contains(event.target as Node)) {
        setTickerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, periodo: e.target.value }));
  };

  const toggleSegment = (segmento: string) => {
    setFilters(prev => {
      const exists = prev.segmentos.includes(segmento);
      const newSegments = exists
        ? prev.segmentos.filter(s => s !== segmento)
        : [...prev.segmentos, segmento];
      return { ...prev, segmentos: newSegments };
    });
  };

  const toggleTicker = (ticker: string) => {
    setFilters(prev => {
      const exists = prev.tickers.includes(ticker);
      const newTickers = exists
        ? prev.tickers.filter(t => t !== ticker)
        : [...prev.tickers, ticker];
      return { ...prev, tickers: newTickers };
    });
  };

  const filteredTickersList = availableTickers.filter(t =>
    t.toLowerCase().includes(tickerSearchInput.toLowerCase().trim())
  );

  const hasActiveFilters = 
    filters.periodo !== 'all' ||
    filters.segmentos.length > 0 ||
    filters.tickers.length > 0 ||
    filters.searchQuery !== '';

  return (
    <div className="bg-[#111827]/90 backdrop-blur-md border-y border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2.5 shadow-sm sticky top-16 z-30">
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        
        {/* Lado Esquerdo: Controles Compactos */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          
          {/* Seletor de Período Compacto */}
          <div className="relative min-w-[190px] flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-emerald-400">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.periodo}
              onChange={handlePeriodChange}
              className="w-full bg-[#162032] border border-slate-700/80 text-slate-100 text-xs rounded-lg pl-8 pr-7 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 appearance-none font-medium transition-colors cursor-pointer"
            >
              <option value="all">Consolidado 2024 (12 Meses)</option>
              <optgroup label="Meses Específicos">
                {availablePeriods.map(p => {
                  const parts = p.split('-');
                  const mesCode = parts[1] || '01';
                  const mesNome = MONTH_NAMES_FULL[mesCode] || mesCode;
                  return (
                    <option key={p} value={p}>
                      {mesNome} de 2024
                    </option>
                  );
                })}
              </optgroup>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Campo de Busca Compacto */}
          <div className="relative min-w-[160px] flex-1 max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              placeholder="Buscar ticker ou nome..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full bg-[#162032] border border-slate-700/80 text-slate-100 placeholder-slate-400 text-xs rounded-lg pl-8 pr-7 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown Multi-Select: Segmento */}
          <div className="relative" ref={segmentRef}>
            <button
              onClick={() => setSegmentDropdownOpen(!segmentDropdownOpen)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filters.segmentos.length > 0
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-[#162032] border-slate-700/80 text-slate-300 hover:border-slate-600'
              }`}
            >
              <PieChart className="h-3.5 w-3.5 text-emerald-400" />
              <span>Segmentos</span>
              {filters.segmentos.length > 0 && (
                <span className="px-1.5 py-0.2 bg-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-300">
                  {filters.segmentos.length}
                </span>
              )}
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {segmentDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-[#162032] border border-slate-700 rounded-xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-slate-700/60 px-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Filtrar por Segmento
                  </span>
                  {filters.segmentos.length > 0 && (
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, segmentos: [] }))}
                      className="text-[10px] text-emerald-400 hover:underline"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {availableSegmentos.map(seg => {
                    const isChecked = filters.segmentos.includes(seg);
                    const color = getSegmentColor(seg);
                    return (
                      <button
                        key={seg}
                        onClick={() => toggleSegment(seg)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          isChecked ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <span className="truncate">{seg}</span>
                        </div>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                          isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-900' : 'border-slate-600'
                        }`}>
                          {isChecked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Seletor Compacto Inteligente: Ticker com Busca */}
          <div className="relative" ref={tickerRef}>
            <button
              onClick={() => setTickerDropdownOpen(!tickerDropdownOpen)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filters.tickers.length > 0
                  ? 'bg-sky-500/10 border-sky-500/40 text-sky-300'
                  : 'bg-[#162032] border-slate-700/80 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Tag className="h-3.5 w-3.5 text-sky-400" />
              <span>Tickers</span>
              {filters.tickers.length > 0 && (
                <span className="px-1.5 py-0.2 bg-sky-500/20 rounded-full text-[10px] font-bold text-sky-300">
                  {filters.tickers.length}
                </span>
              )}
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {tickerDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-[#162032] border border-slate-700 rounded-xl shadow-xl z-50 p-2 space-y-2 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-1 border-b border-slate-700/60 px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Seletor de Ticker
                  </span>
                  {filters.tickers.length > 0 && (
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, tickers: [] }))}
                      className="text-[10px] text-sky-400 hover:underline"
                    >
                      Limpar ({filters.tickers.length})
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filtrar por código..."
                    value={tickerSearchInput}
                    onChange={(e) => setTickerSearchInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg pl-7 pr-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="max-h-52 overflow-y-auto grid grid-cols-2 gap-1 p-0.5">
                  {filteredTickersList.map(ticker => {
                    const isChecked = filters.tickers.includes(ticker);
                    return (
                      <button
                        key={ticker}
                        onClick={() => toggleTicker(ticker)}
                        className={`flex items-center justify-between px-2 py-1 rounded text-xs font-mono transition-colors ${
                          isChecked ? 'bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{ticker}</span>
                        {isChecked && <Check className="h-3 w-3 text-sky-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 animate-pulse pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px]">Atualizando...</span>
            </div>
          )}

        </div>

        {/* Lado Direito: Limpar Filtros */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1 px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
            >
              <Filter className="h-3 w-3" />
              <span>Resetar</span>
            </button>
          )}
        </div>

      </div>

      {/* Chips Rápidos de Filtros Ativos */}
      {(filters.segmentos.length > 0 || filters.tickers.length > 0) && (
        <div className="w-full mt-2 pt-1.5 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-slate-400 mr-1">Ativos:</span>
          {filters.segmentos.map(seg => (
            <span
              key={seg}
              className="inline-flex items-center space-x-1 px-2 py-0.2 rounded-full text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
            >
              <span>{seg}</span>
              <button onClick={() => toggleSegment(seg)} className="hover:text-white">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
          {filters.tickers.map(ticker => (
            <span
              key={ticker}
              className="inline-flex items-center space-x-1 px-2 py-0.2 rounded-full text-[10px] font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30"
            >
              <span>{ticker}</span>
              <button onClick={() => toggleTicker(ticker)} className="hover:text-white">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
