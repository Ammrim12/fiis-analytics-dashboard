import React from 'react';
import { X, HelpCircle, Calculator, Scale, Percent, Landmark } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111827] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Metodologia e Fórmulas</h3>
              <p className="text-xs text-slate-400">Como as métricas da carteira foram calculadas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Fórmulas e Explicações */}
        <div className="space-y-4 text-xs text-slate-300">
          
          <div className="bg-[#162032] p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
              <Percent className="h-4 w-4" />
              <h4>Dividend Yield Médio Ponderado (% a.m.)</h4>
            </div>
            <p>
              Em vez de uma média simples aritmética, o Dividend Yield ponderado reflete o rendimento real obtido sobre o total de capital alocado:
            </p>
            <div className="font-mono bg-slate-900 p-2.5 rounded-lg text-emerald-300 border border-slate-700">
              DY Ponderado = (Σ Renda Mensal / Σ Patrimônio Total Investido) × 100
            </div>
          </div>

          <div className="bg-[#162032] p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-teal-400 font-semibold text-sm">
              <Calculator className="h-4 w-4" />
              <h4>DY Anualizado Projetado (% a.a.)</h4>
            </div>
            <p>
              Projeção composta de 12 meses mantendo-se constante a taxa mensal observada:
            </p>
            <div className="font-mono bg-slate-900 p-2.5 rounded-lg text-teal-300 border border-slate-700">
              DY Anualizado = [(1 + DY Mensal / 100)¹² - 1] × 100
            </div>
          </div>

          <div className="bg-[#162032] p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm">
              <Scale className="h-4 w-4" />
              <h4>P/VP Médio Ponderado da Carteira</h4>
            </div>
            <p>
              Preço sobre Valor Patrimonial médio considerando o peso financeiro que cada fundo representa na carteira total:
            </p>
            <div className="font-mono bg-slate-900 p-2.5 rounded-lg text-sky-300 border border-slate-700">
              P/VP Carteira = Σ (P/VPᵢ × Valor Totalᵢ) / Σ Valor Total
            </div>
            <p className="text-[11px] text-slate-400">
              Valores abaixo de 1,00 indicam negociação com desconto frente ao valor patrimonial dos imóveis ou títulos.
            </p>
          </div>

          <div className="bg-[#162032] p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-purple-400 font-semibold text-sm">
              <Landmark className="h-4 w-4" />
              <h4>Base de Dados e Amostra</h4>
            </div>
            <p>
              Amostra contendo 18 fundos imobiliários negociados na B3 ao longo dos 12 meses do ano fiscal de 2024, englobando setores como Logística, Papel / CRI, Papel / CDI, Shoppings, Renda Urbana, Lajes Corporativas e Agro.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

