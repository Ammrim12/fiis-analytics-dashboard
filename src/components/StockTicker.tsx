import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface MarketTickerItem {
  symbol: string;
  price: string;
  changePct: number;
  isIndex?: boolean;
}

interface StockTickerProps {
  items?: MarketTickerItem[];
  onSelectTicker?: (ticker: string) => void;
}

const DEFAULT_TICKER_ITEMS: MarketTickerItem[] = [
  { symbol: 'IFIX', price: '3.395,00', changePct: 0.12, isIndex: true },
  { symbol: 'KNCR11', price: 'R$ 106,50', changePct: 0.45 },
  { symbol: 'KNIP11', price: 'R$ 98,20', changePct: -0.15 },
  { symbol: 'HGLG11', price: 'R$ 165,30', changePct: 0.22 },
  { symbol: 'XPML11', price: 'R$ 112,10', changePct: 0.05 },
  { symbol: 'BTLG11', price: 'R$ 104,80', changePct: 0.18 },
  { symbol: 'VISC11', price: 'R$ 121,90', changePct: -0.08 },
  { symbol: 'MXRF11', price: 'R$ 10,42', changePct: 0.30 },
  { symbol: 'HGRU11', price: 'R$ 128,40', changePct: 0.15 },
  { symbol: 'TRXF11', price: 'R$ 108,60', changePct: 0.28 },
  { symbol: 'CPTS11', price: 'R$ 8,45', changePct: -0.24 },
  { symbol: 'ALZR11', price: 'R$ 117,50', changePct: 0.10 },
  { symbol: 'BRCO11', price: 'R$ 124,20', changePct: 0.16 },
  { symbol: 'CDI 2024', price: '11,15% a.a.', changePct: 0.0, isIndex: true },
  { symbol: 'SELIC', price: '10,75% a.a.', changePct: 0.0, isIndex: true },
];

export const StockTicker: React.FC<StockTickerProps> = ({
  items = DEFAULT_TICKER_ITEMS,
  onSelectTicker,
}) => {
  // Duplicamos a lista para criar o loop contínuo e perfeito
  const tickerLoop = [...items, ...items];

  return (
    <div className="w-full bg-[#121824] border-y border-[#1E293B] overflow-hidden py-1.5 select-none relative group">
      
      {/* Sombras suaves nas extremidades para transição natural de entrada/saída */}
      <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-[#121824] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-[#121824] to-transparent z-10 pointer-events-none" />

      {/* Faixa Marquee Contínua */}
      <div className="animate-marquee flex items-center whitespace-nowrap">
        {tickerLoop.map((item, index) => {
          const isPositive = item.changePct > 0;
          const isNeutral = item.changePct === 0;

          return (
            <div
              key={`${item.symbol}-${index}`}
              onClick={() => !item.isIndex && onSelectTicker && onSelectTicker(item.symbol)}
              className={`inline-flex items-center space-x-2 px-4 border-r border-slate-800/80 transition-colors ${
                !item.isIndex ? 'cursor-pointer hover:bg-slate-800/50 py-0.5 rounded' : ''
              }`}
            >
              {/* Bullets / Ponto de Status */}
              <span className={`w-1.5 h-1.5 rounded-full ${
                item.isIndex 
                  ? 'bg-sky-400' 
                  : isPositive 
                  ? 'bg-[#4ade80]' 
                  : isNeutral 
                  ? 'bg-slate-400' 
                  : 'bg-rose-400'
              }`} />

              {/* Ticker / Nome */}
              <span className={`font-mono text-xs font-bold tracking-tight ${
                item.isIndex ? 'text-sky-300' : 'text-white'
              }`}>
                {item.symbol}
              </span>

              {/* Preço */}
              <span className="font-mono text-xs text-slate-300 font-medium">
                {item.price}
              </span>

              {/* Variação Percentual */}
              {!item.isIndex && (
                <span className={`inline-flex items-center font-mono text-[11px] font-semibold ${
                  isPositive 
                    ? 'text-[#4ade80]' 
                    : isNeutral 
                    ? 'text-slate-400' 
                    : 'text-rose-400'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 mr-0.5 inline" />
                  ) : isNeutral ? (
                    <Minus className="h-2.5 w-2.5 mr-0.5 inline" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-0.5 inline" />
                  )}
                  {isPositive ? '+' : ''}{item.changePct.toFixed(2)}%
                </span>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

