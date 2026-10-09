/**
 * Utilitários de formatação financeira para BRL, porcentagens e datas
 */

export const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatCompactCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return 'R$ 0';
  if (Math.abs(value) >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(2).replace('.', ',')}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(1).replace('.', ',')}k`;
  }
  return formatCurrency(value);
};

export const formatPercent = (value: number | undefined | null, decimals = 2): string => {
  if (value === undefined || value === null || isNaN(value)) return '0,00%';
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
};

export const formatNumber = (value: number | undefined | null, decimals = 0): string => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const MONTH_NAMES_SHORT: Record<string, string> = {
  '01': 'Jan',
  '02': 'Fev',
  '03': 'Mar',
  '04': 'Abr',
  '05': 'Mai',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Ago',
  '09': 'Set',
  '10': 'Out',
  '11': 'Nov',
  '12': 'Dez',
};

export const MONTH_NAMES_FULL: Record<string, string> = {
  '01': 'Janeiro',
  '02': 'Fevereiro',
  '03': 'Março',
  '04': 'Abril',
  '05': 'Maio',
  '06': 'Junho',
  '07': 'Julho',
  '08': 'Agosto',
  '09': 'Setembro',
  '10': 'Outubro',
  '11': 'Novembro',
  '12': 'Dezembro',
};

export const formatPeriod = (periodStr: string, full = false): string => {
  if (periodStr === 'all') return 'Consolidado 2024';
  const parts = periodStr.split('-');
  if (parts.length < 2) return periodStr;
  const month = parts[1];
  const year = parts[0];
  const name = full ? (MONTH_NAMES_FULL[month] || month) : (MONTH_NAMES_SHORT[month] || month);
  return `${name}/${year}`;
};

export interface PvpBadge {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  description: string;
}

export const getPvpBadge = (pvp: number): PvpBadge => {
  if (pvp < 0.95) {
    return {
      label: 'Forte Desconto',
      bgClass: 'bg-emerald-500/10',
      textClass: 'text-emerald-400 font-semibold',
      borderClass: 'border-emerald-500/30',
      description: 'Cotação abaixo de 95% do valor patrimonial',
    };
  }
  if (pvp <= 1.02) {
    return {
      label: 'Preço Justo',
      bgClass: 'bg-sky-500/10',
      textClass: 'text-sky-400 font-medium',
      borderClass: 'border-sky-500/30',
      description: 'Negociando próximo ao VP (0.95 a 1.02)',
    };
  }
  if (pvp <= 1.08) {
    return {
      label: 'Leve Ágio',
      bgClass: 'bg-amber-500/10',
      textClass: 'text-amber-400 font-medium',
      borderClass: 'border-amber-500/30',
      description: 'Negociando com prêmio moderado (1.02 a 1.08)',
    };
  }
  return {
    label: 'Ágio Alto',
    bgClass: 'bg-rose-500/10',
    textClass: 'text-rose-400 font-semibold',
    borderClass: 'border-rose-500/30',
    description: 'Negociando com prêmio elevado (> 1.08)',
  };
};

export const SEGMENT_COLORS: Record<string, string> = {
  'Logística': '#10B981', // Emerald
  'Papel / CRI': '#38BDF8', // Sky
  'Papel / CDI': '#6366F1', // Indigo
  'Shoppings': '#F59E0B', // Amber
  'Renda Urbana': '#8B5CF6', // Purple
  'Lajes Corporativas': '#EC4899', // Pink
  'Agro / Terras': '#14B8A6', // Teal
  'Papel / Híbrido': '#06B6D4', // Cyan
  'Outros': '#94A3B8', // Slate
};

export const getSegmentColor = (segmento: string): string => {
  return SEGMENT_COLORS[segmento] || '#94A3B8';
};

