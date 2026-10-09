import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileJson, Printer, Check } from 'lucide-react';
import { FiiRecord } from '../types/fii';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: FiiRecord[];
  periodo: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  records,
  periodo,
}) => {
  const [downloadedType, setDownloadedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const exportCSV = () => {
    const headers = [
      'Ticker',
      'Nome',
      'Segmento',
      'Período',
      'Cotas',
      'Preço Atual (R$)',
      'VP por Cota (R$)',
      'P/VP',
      'Valor Total (R$)',
      'Rendimento por Cota (R$)',
      'DY Mensal (%)',
      'Renda Mensal (R$)',
    ];

    const rows = records.map(r => [
      r.ticker,
      `"${r.nome}"`,
      `"${r.segmento}"`,
      r.periodo,
      r.cotas,
      r.precoAtual.toFixed(2),
      r.vpPorCota.toFixed(2),
      r.pvp.toFixed(4),
      r.valorTotal.toFixed(2),
      r.rendimentoPorCota.toFixed(4),
      r.dyMensal.toFixed(4),
      r.rendaMensal.toFixed(2),
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `carteira_fiis_2024_${periodo}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadedType('csv');
    setTimeout(() => setDownloadedType(null), 3000);
  };

  const exportJSON = () => {
    const jsonString = JSON.stringify(records, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `carteira_fiis_2024_${periodo}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadedType('json');
    setTimeout(() => setDownloadedType(null), 3000);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111827] border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Exportação de Relatório</h3>
              <p className="text-xs text-slate-400">{records.length} registros prontos para exportação</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Selecione o formato para exportar a posição atual consolidada ou filtrada da carteira:
        </p>

        <div className="grid grid-cols-3 gap-3">
          {/* CSV */}
          <button
            onClick={exportCSV}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-700 bg-[#162032] hover:border-emerald-500/60 hover:bg-slate-800 transition-all text-center group"
          >
            <FileSpreadsheet className="h-6 w-6 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-white">CSV</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Excel / Planilhas</span>
            {downloadedType === 'csv' && (
              <span className="mt-1.5 text-[10px] text-emerald-400 flex items-center gap-1">
                <Check className="h-3 w-3" /> Salvo
              </span>
            )}
          </button>

          {/* JSON */}
          <button
            onClick={exportJSON}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-700 bg-[#162032] hover:border-sky-500/60 hover:bg-slate-800 transition-all text-center group"
          >
            <FileJson className="h-6 w-6 text-sky-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-white">JSON</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Dados Puros</span>
            {downloadedType === 'json' && (
              <span className="mt-1.5 text-[10px] text-sky-400 flex items-center gap-1">
                <Check className="h-3 w-3" /> Salvo
              </span>
            )}
          </button>

          {/* PDF / Imprimir */}
          <button
            onClick={printReport}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-700 bg-[#162032] hover:border-purple-500/60 hover:bg-slate-800 transition-all text-center group"
          >
            <Printer className="h-6 w-6 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-white">Imprimir / PDF</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Relatório Pronto</span>
          </button>
        </div>

        <div className="pt-2 text-[11px] text-slate-500 text-center">
          Os dados exportados refletem fielmente todos os filtros aplicados na tela.
        </div>

      </div>
    </div>
  );
};
