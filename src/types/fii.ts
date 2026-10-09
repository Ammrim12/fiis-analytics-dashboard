export interface FiiRecord {
  ticker: string;
  nome: string;
  segmento: string;
  tipo: 'Tijolo' | 'Papel' | 'Agro' | 'Outros';
  periodo: string; // 'YYYY-MM-DD'
  cotas: number;
  precoAtual: number;
  vpPorCota: number;
  pvp: number;
  valorTotal: number;
  rendimentoPorCota: number;
  dyMensal: number; // em porcentagem, ex: 0.86 para 0.86%
  rendaMensal: number;
}

export type ViewMode = 'overview' | 'analytics';

export interface FilterState {
  periodo: string; // 'all' ou '2024-01-01' a '2024-12-01'
  segmentos: string[];
  tickers: string[];
  searchQuery: string;
}

export interface PortfolioKpis {
  patrimonioTotal: number;
  rendaMensalTotal: number;
  dyMedioPonderado: number;
  dyAnualizadoProjetado: number;
  pvpMedioPonderado: number;
  totalCotas: number;
  totalAtivos: number;
  totalSegmentos: number;
  rendaAcumuladaAno: number;

  // Séries temporais para Sparklines nos cards
  patrimonioSeries: number[];
  rendaSeries: number[];
  dySeries: number[];
  pvpSeries: number[];
  cotasSeries: number[];

  // Contexto comparativo (MoM ou acumulado)
  patrimonioChangePct: number;
  rendaChangePct: number;
  isConsolidated: boolean;
}

export interface SegmentAllocation {
  segmento: string;
  valorTotal: number;
  rendaMensal: number;
  percentual: number;
  ativosCount: number;
  color: string;
}

export interface MonthlyDividendData {
  periodo: string;
  mesFormatado: string;
  rendaTotal: number;
  patrimonioTotal: number;
  dyMedio: number;
  cotasTotal: number;
}

export interface ValuationOpportunity {
  ticker: string;
  nome: string;
  segmento: string;
  pvp: number;
  descontoPct: number;
  dyMensal: number;
  precoAtual: number;
  vpPorCota: number;
  valorTotal: number;
  cotas: number;
}

export interface DividendProjection {
  rendaMensalEstimada: number;
  rendaAnualEstimada: number;
  dyMedioPonderado: number;
  valorPorCotaMedio: number;
  proximaDataEstimada: string;
}
