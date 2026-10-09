import { 
  FiiRecord, 
  PortfolioKpis, 
  SegmentAllocation, 
  MonthlyDividendData, 
  ValuationOpportunity, 
  DividendProjection 
} from '../types/fii';
import { MONTH_NAMES_SHORT, getSegmentColor } from './formatters';

/**
 * Filtra a base de registros de acordo com o estado de filtros
 */
export const filterFiiRecords = (
  records: FiiRecord[],
  periodo: string,
  selectedSegmentos: string[],
  selectedTickers: string[],
  searchQuery: string
): FiiRecord[] => {
  return records.filter((item) => {
    // Filtro de período
    if (periodo !== 'all' && item.periodo !== periodo) {
      return false;
    }

    // Filtro de segmento
    if (selectedSegmentos.length > 0 && !selectedSegmentos.includes(item.segmento)) {
      return false;
    }

    // Filtro de ticker
    if (selectedTickers.length > 0 && !selectedTickers.includes(item.ticker)) {
      return false;
    }

    // Filtro de busca textual
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTicker = item.ticker.toLowerCase().includes(q);
      const matchNome = item.nome.toLowerCase().includes(q);
      const matchSegmento = item.segmento.toLowerCase().includes(q);
      if (!matchTicker && !matchNome && !matchSegmento) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Calcula a evolução mês a mês dos proventos e patrimônio em 2024
 */
export const calculateMonthlyEvolution = (
  allRecords: FiiRecord[],
  selectedSegmentos: string[] = [],
  selectedTickers: string[] = []
): MonthlyDividendData[] => {
  const filtered = allRecords.filter(r => {
    if (selectedSegmentos.length > 0 && !selectedSegmentos.includes(r.segmento)) return false;
    if (selectedTickers.length > 0 && !selectedTickers.includes(r.ticker)) return false;
    return true;
  });

  const monthMap = new Map<string, { rendaTotal: number; patrimonioTotal: number; cotasTotal: number; pvpWeighted: number }>();

  filtered.forEach(r => {
    const existing = monthMap.get(r.periodo) || { rendaTotal: 0, patrimonioTotal: 0, cotasTotal: 0, pvpWeighted: 0 };
    existing.rendaTotal += r.rendaMensal;
    existing.patrimonioTotal += r.valorTotal;
    existing.cotasTotal += r.cotas;
    existing.pvpWeighted += (r.pvp * r.valorTotal);
    monthMap.set(r.periodo, existing);
  });

  const sortedMonths = Array.from(monthMap.keys()).sort();

  return sortedMonths.map(periodo => {
    const data = monthMap.get(periodo)!;
    const parts = periodo.split('-');
    const mesCode = parts[1] || '01';
    const mesNome = MONTH_NAMES_SHORT[mesCode] || mesCode;
    const dyMedio = data.patrimonioTotal > 0 ? (data.rendaTotal / data.patrimonioTotal) * 100 : 0;

    return {
      periodo,
      mesFormatado: `${mesNome}/24`,
      rendaTotal: Math.round(data.rendaTotal * 100) / 100,
      patrimonioTotal: Math.round(data.patrimonioTotal * 100) / 100,
      dyMedio: Math.round(dyMedio * 100) / 100,
      cotasTotal: data.cotasTotal,
    };
  });
};

/**
 * Calcula os KPIs da carteira e séries temporais para sparklines
 */
export const calculatePortfolioKpis = (
  filteredRecords: FiiRecord[],
  allRecords: FiiRecord[],
  isConsolidated: boolean,
  currentPeriod: string,
  selectedSegmentos: string[] = [],
  selectedTickers: string[] = []
): PortfolioKpis => {
  // Evolução mensal para extrair as séries dos sparklines
  const monthlyData = calculateMonthlyEvolution(allRecords, selectedSegmentos, selectedTickers);
  
  const patrimonioSeries = monthlyData.map(m => m.patrimonioTotal);
  const rendaSeries = monthlyData.map(m => m.rendaTotal);
  const dySeries = monthlyData.map(m => m.dyMedio);
  const cotasSeries = monthlyData.map(m => m.cotasTotal);
  
  // P/VP series
  const pvpSeries = monthlyData.map(m => {
    const periodRecords = allRecords.filter(r => r.periodo === m.periodo);
    const totalVal = periodRecords.reduce((acc, c) => acc + c.valorTotal, 0);
    return totalVal > 0 ? periodRecords.reduce((acc, c) => acc + (c.pvp * c.valorTotal), 0) / totalVal : 1;
  });

  if (filteredRecords.length === 0) {
    return {
      patrimonioTotal: 0,
      rendaMensalTotal: 0,
      dyMedioPonderado: 0,
      dyAnualizadoProjetado: 0,
      pvpMedioPonderado: 0,
      totalCotas: 0,
      totalAtivos: 0,
      totalSegmentos: 0,
      rendaAcumuladaAno: 0,
      patrimonioSeries: [],
      rendaSeries: [],
      dySeries: [],
      pvpSeries: [],
      cotasSeries: [],
      patrimonioChangePct: 0,
      rendaChangePct: 0,
      isConsolidated,
    };
  }

  // Se for consolidado (ano completo):
  if (isConsolidated) {
    const latestByTicker = new Map<string, FiiRecord>();
    const sortedRecords = [...filteredRecords].sort((a, b) => a.periodo.localeCompare(b.periodo));
    
    sortedRecords.forEach(r => {
      latestByTicker.set(r.ticker, r);
    });

    const latestList = Array.from(latestByTicker.values());
    const patrimonioTotal = latestList.reduce((acc, curr) => acc + curr.valorTotal, 0);
    const totalCotas = latestList.reduce((acc, curr) => acc + curr.cotas, 0);
    const rendaAcumuladaAno = filteredRecords.reduce((acc, curr) => acc + curr.rendaMensal, 0);
    
    const uniqueMonths = new Set(filteredRecords.map(r => r.periodo)).size || 1;
    const rendaMensalMedia = rendaAcumuladaAno / uniqueMonths;

    const dyMedioPonderado = patrimonioTotal > 0 ? (rendaMensalMedia / patrimonioTotal) * 100 : 0;
    const dyAnualizadoProjetado = ((Math.pow(1 + (dyMedioPonderado / 100), 12) - 1) * 100);

    const sumPvpWeight = latestList.reduce((acc, curr) => acc + (curr.pvp * curr.valorTotal), 0);
    const pvpMedioPonderado = patrimonioTotal > 0 ? (sumPvpWeight / patrimonioTotal) : 0;

    const uniqueSegments = new Set(latestList.map(r => r.segmento)).size;

    // Variação do início ao fim de 2024 (Jan vs Dez)
    const firstPatrimonio = patrimonioSeries[0] || patrimonioTotal;
    const lastPatrimonio = patrimonioSeries[patrimonioSeries.length - 1] || patrimonioTotal;
    const patrimonioChangePct = firstPatrimonio > 0 ? ((lastPatrimonio - firstPatrimonio) / firstPatrimonio) * 100 : 0;

    const firstRenda = rendaSeries[0] || rendaMensalMedia;
    const lastRenda = rendaSeries[rendaSeries.length - 1] || rendaMensalMedia;
    const rendaChangePct = firstRenda > 0 ? ((lastRenda - firstRenda) / firstRenda) * 100 : 0;

    return {
      patrimonioTotal,
      rendaMensalTotal: rendaMensalMedia,
      dyMedioPonderado,
      dyAnualizadoProjetado,
      pvpMedioPonderado,
      totalCotas,
      totalAtivos: latestList.length,
      totalSegmentos: uniqueSegments,
      rendaAcumuladaAno,
      patrimonioSeries,
      rendaSeries,
      dySeries,
      pvpSeries,
      cotasSeries,
      patrimonioChangePct,
      rendaChangePct,
      isConsolidated: true,
    };
  }

  // Mês específico selecionado
  const patrimonioTotal = filteredRecords.reduce((acc, curr) => acc + curr.valorTotal, 0);
  const rendaMensalTotal = filteredRecords.reduce((acc, curr) => acc + curr.rendaMensal, 0);
  const totalCotas = filteredRecords.reduce((acc, curr) => acc + curr.cotas, 0);

  const dyMedioPonderado = patrimonioTotal > 0 ? (rendaMensalTotal / patrimonioTotal) * 100 : 0;
  const dyAnualizadoProjetado = ((Math.pow(1 + (dyMedioPonderado / 100), 12) - 1) * 100);

  const sumPvpWeight = filteredRecords.reduce((acc, curr) => acc + (curr.pvp * curr.valorTotal), 0);
  const pvpMedioPonderado = patrimonioTotal > 0 ? (sumPvpWeight / patrimonioTotal) : 0;

  const totalAtivos = new Set(filteredRecords.map(r => r.ticker)).size;
  const totalSegmentos = new Set(filteredRecords.map(r => r.segmento)).size;

  const activeTickers = new Set(filteredRecords.map(r => r.ticker));
  const rendaAcumuladaAno = allRecords
    .filter(r => activeTickers.has(r.ticker))
    .reduce((acc, curr) => acc + curr.rendaMensal, 0);

  // Variação MoM (vs mês anterior)
  let patrimonioChangePct = 0;
  let rendaChangePct = 0;

  const currentIdx = monthlyData.findIndex(m => m.periodo === currentPeriod);
  if (currentIdx > 0) {
    const prev = monthlyData[currentIdx - 1];
    patrimonioChangePct = prev.patrimonioTotal > 0 ? ((patrimonioTotal - prev.patrimonioTotal) / prev.patrimonioTotal) * 100 : 0;
    rendaChangePct = prev.rendaTotal > 0 ? ((rendaMensalTotal - prev.rendaTotal) / prev.rendaTotal) * 100 : 0;
  }

  return {
    patrimonioTotal,
    rendaMensalTotal,
    dyMedioPonderado,
    dyAnualizadoProjetado,
    pvpMedioPonderado,
    totalCotas,
    totalAtivos,
    totalSegmentos,
    rendaAcumuladaAno,
    patrimonioSeries,
    rendaSeries,
    dySeries,
    pvpSeries,
    cotasSeries,
    patrimonioChangePct,
    rendaChangePct,
    isConsolidated: false,
  };
};

/**
 * Calcula mapa de sparkline de preços por ticker
 */
export const calculateTickerPriceSeries = (allRecords: FiiRecord[]): Record<string, number[]> => {
  const result: Record<string, number[]> = {};
  
  // Ordena por período
  const sorted = [...allRecords].sort((a, b) => a.periodo.localeCompare(b.periodo));
  
  sorted.forEach(r => {
    if (!result[r.ticker]) {
      result[r.ticker] = [];
    }
    result[r.ticker].push(r.precoAtual);
  });

  return result;
};

/**
 * Calcula a alocação por segmento da carteira
 */
export const calculateSegmentAllocation = (records: FiiRecord[]): SegmentAllocation[] => {
  if (records.length === 0) return [];

  const byTicker = new Map<string, FiiRecord>();
  [...records].sort((a, b) => a.periodo.localeCompare(b.periodo)).forEach(r => {
    byTicker.set(r.ticker, r);
  });
  const uniqueRecords = Array.from(byTicker.values());

  const totalValue = uniqueRecords.reduce((acc, r) => acc + r.valorTotal, 0);
  const segmentMap = new Map<string, { valorTotal: number; rendaMensal: number; count: number }>();

  uniqueRecords.forEach(r => {
    const existing = segmentMap.get(r.segmento) || { valorTotal: 0, rendaMensal: 0, count: 0 };
    existing.valorTotal += r.valorTotal;
    existing.rendaMensal += r.rendaMensal;
    existing.count += 1;
    segmentMap.set(r.segmento, existing);
  });

  const allocations: SegmentAllocation[] = [];
  segmentMap.forEach((data, segmento) => {
    const percentual = totalValue > 0 ? (data.valorTotal / totalValue) * 100 : 0;
    allocations.push({
      segmento,
      valorTotal: data.valorTotal,
      rendaMensal: data.rendaMensal,
      percentual,
      ativosCount: data.count,
      color: getSegmentColor(segmento),
    });
  });

  return allocations.sort((a, b) => b.valorTotal - a.valorTotal);
};

/**
 * Calcula os Top FIIs por renda gerada
 */
export const calculateTopAssetsByIncome = (
  records: FiiRecord[],
  limit = 3
) => {
  const tickerMap = new Map<string, {
    ticker: string;
    nome: string;
    segmento: string;
    rendaTotal: number;
    valorTotal: number;
    cotas: number;
  }>();

  records.forEach(r => {
    const existing = tickerMap.get(r.ticker) || {
      ticker: r.ticker,
      nome: r.nome,
      segmento: r.segmento,
      rendaTotal: 0,
      valorTotal: r.valorTotal,
      cotas: r.cotas,
    };
    existing.rendaTotal += r.rendaMensal;
    existing.valorTotal = r.valorTotal;
    existing.cotas = r.cotas;
    tickerMap.set(r.ticker, existing);
  });

  const list = Array.from(tickerMap.values());
  const totalRendaGeral = list.reduce((acc, curr) => acc + curr.rendaTotal, 0);

  return list
    .sort((a, b) => b.rendaTotal - a.rendaTotal)
    .slice(0, limit)
    .map(item => ({
      ...item,
      rendaTotal: Math.round(item.rendaTotal * 100) / 100,
      participacaoRenda: totalRendaGeral > 0 ? (item.rendaTotal / totalRendaGeral) * 100 : 0,
    }));
};

/**
 * Calcula Top Oportunidades de Valuation (Menor P/VP com Desconto)
 */
export const calculateValuationOpportunities = (
  records: FiiRecord[],
  limit = 3
): ValuationOpportunity[] => {
  const byTicker = new Map<string, FiiRecord>();
  [...records].sort((a, b) => a.periodo.localeCompare(b.periodo)).forEach(r => {
    byTicker.set(r.ticker, r);
  });
  const list = Array.from(byTicker.values());

  return list
    .sort((a, b) => a.pvp - b.pvp)
    .slice(0, limit)
    .map(r => ({
      ticker: r.ticker,
      nome: r.nome,
      segmento: r.segmento,
      pvp: r.pvp,
      descontoPct: r.pvp < 1.0 ? (1 - r.pvp) * 100 : 0,
      dyMensal: r.dyMensal,
      precoAtual: r.precoAtual,
      vpPorCota: r.vpPorCota,
      valorTotal: r.valorTotal,
      cotas: r.cotas,
    }));
};

/**
 * Calcula Projeção de Próximos Proventos
 */
export const calculateDividendProjection = (
  kpis: PortfolioKpis
): DividendProjection => {
  const rendaMensalEstimada = kpis.rendaMensalTotal;
  const rendaAnualEstimada = rendaMensalEstimada * 12;
  const valorPorCotaMedio = kpis.totalCotas > 0 ? rendaMensalEstimada / kpis.totalCotas : 0;

  return {
    rendaMensalEstimada,
    rendaAnualEstimada,
    dyMedioPonderado: kpis.dyMedioPonderado,
    valorPorCotaMedio,
    proximaDataEstimada: '15 do próximo mês',
  };
};
