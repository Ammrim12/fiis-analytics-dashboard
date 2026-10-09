import React from 'react';
import { 
  Building2, 
  Download, 
  RotateCcw, 
  HelpCircle, 
  Layers,
  BarChart3,
  SlidersHorizontal
} from 'lucide-react';
import { ViewMode } from '../types/fii';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onResetFilters: () => void;
  onOpenExport: () => void;
  onOpenHelp: () => void;
  totalAtivosFiltrados: number;
  totalAtivosGeral: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  onResetFilters,
  onOpenExport,
  onOpenHelp,
  totalAtivosFiltrados,
  totalAtivosGeral,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B0F17]/95 backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo e Título */}
          <div className="flex items-center space-x-3 min-w-max">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-400 p-[1px] shadow-glow-emerald">
              <div className="h-full w-full bg-[#0A0E17] rounded-[11px] flex items-center justify-center">
                <Building2 className="h-4.5 w-4.5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  FIIs Analytics
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    2024
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Carteira de Fundos Imobiliários B3
              </p>
            </div>
          </div>

          {/* Alternador de Visões Principais */}
          <div className="flex items-center bg-[#111827] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('overview')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'overview'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Dashboard Executivo</span>
            </button>

            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'analytics'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Matriz Valuation</span>
            </button>
          </div>

          {/* Ações Rápidas */}
          <div className="flex items-center space-x-2">
            
            {/* Contador de Ativos */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <SlidersHorizontal className="h-3 w-3 text-emerald-400" />
              <span>
                <strong className="text-white font-mono">{totalAtivosFiltrados}</strong> de {totalAtivosGeral} ativos
              </span>
            </div>

            {/* Reset Filtros */}
            <button
              onClick={onResetFilters}
              title="Redefinir Filtros"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Exportar */}
            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors border border-slate-700 shadow-sm"
            >
              <Download className="h-3.5 w-3.5 text-sky-400" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            {/* Metodologia */}
            <button
              onClick={onOpenHelp}
              title="Metodologia & Fórmulas"
              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
