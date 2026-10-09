# 🏢 FIIs Analytics Dashboard (2024)

> **Dashboard Web financeiro de alta fidelidade para análise, consolidação e acompanhamento de uma carteira de Fundos Imobiliários (FIIs) negociados na B3 ao longo de 2024.**

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15-22c55e.svg)](https://recharts.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)

---

## 📸 Visão Geral da Interface & Arquitetura

O dashboard foi projetado sob os mais modernos preceitos de **UI/UX para Finanças e Gestão de Patrimônio (Fintech / Asset Management)**:
- **Tema Dark Mode Premium:** Tons de grafite (`#0A0E17`, `#111827`), superfícies em vidro fosco (*glassmorphism*), tipografia com números alinhados tabulares (`tabular-nums`) e contrastes otimizados para legibilidade prolongada.
- **Paleta Semântica Financeira:** Destaques em **esmeralda/verde** para proventos e dividend yield, **ciano/azul** para valores patrimoniais e capital alocado, e **âmbar/rosa** para alertas de ágio/desconto.
- **Responsividade Total:** Adaptável para desktops ultra-wide, laptops, tablets e smartphones.

---

## 🚀 Funcionalidades Principais & Arquitetura de Interface

### 1. Grid Assimétrico (Dashboard Split 68% / 32%)
- **Coluna Principal (68% da largura):**
  - **Evolução Temporal dos Proventos (Jan a Dez/2024):** Gráfico de barras e linhas com a renda recebida mês a mês, linha de média móvel anual e alternador instantâneo entre Renda (R$) e Patrimônio (R$).
  - **Tabela da Carteira de Alta Legibilidade:**
    - **Micro-gráficos em linha (Sparklines SVG 12M):** Visualização imediata da oscilação do preço da cota ao longo do ano em cada linha.
    - **Barra de Progresso Embutida para % da Carteira:** Mini barra horizontal em degradê ao lado do valor numérico para percepção instantânea de peso e concentração.
    - **Alinhamento Numérico Rigoroso:** Textos alinhados à esquerda e todos os valores monetários/percentuais alinhados rigidamente à direita em `font-mono tabular-nums`.
- **Coluna Lateral / Sidebar Analítica (32% da largura):**
  - **Alocação por Segmento (Donut Chart):** Percentuais, valor financeiro no centro sob hover e legenda clicável para filtro imediato.
  - **Card Top 3 Melhores Pagadores:** Ranking visual com medalhas, renda gerada e fatia do fluxo passivo da carteira.
  - **Card Top Oportunidades (Menor P/VP):** Destaque para fundos com forte desconto patrimonial e Dividend Yield atrativo.
  - **Card de Projeção de Próximos Proventos:** Estimativa de renda recorrente para os próximos 30 dias baseada no DY médio ponderado.

### 2. Sheet / Slide-Over Lateral de Detalhes do Fundo (Deep Dive)
- Painel lateral deslizante à direita (*Drawer*) ativado ao clicar em qualquer ativo da tabela ou da sidebar:
  - Seletor inteligente de ativos com campo de busca integrado no topo.
  - Histórico mensal completo (12 meses) com gráficos de **Cotação vs. VP** e **Rendimento por Cota**.
  - **Links Diretos para Análise Externa:** Acesso com 1 clique ao [Status Invest](https://statusinvest.com.br/) e [Clube FII](https://www.clubefii.com.br/).

### 3. KPI Cards com Micro-Sparklines e Contexto Comparativo
- Mini linhas de tendência em degradê suave no rodapé de cada card.
- Variações comparativas claras (+X% vs mês anterior, total acumulado de 12M, etc.).

### 4. Barra de Filtros Compacta e Inteligente
- Substituição da antiga lista estática por um **seletor inteligente compacto com busca** e chips interativos de segmentos.
- Seletor de período com suporte a cada mês de 2024 e visão **Consolidada Anual**.

### 5. Exportação Funcional de Relatórios
- Download em **CSV** (otimizado para Excel com `;` e UTF-8 BOM).
- Download em **JSON** estruturado.
- **Impressão / PDF:** Disparo de layout limpo para geração de relatórios físicos ou digitais.

### 4. Tabela Dinâmica da Carteira
- Ordenação dinâmica por clique em qualquer coluna (Ticker, Segmento, Cotas, Preço, P/VP, Valor Total, % Carteira, Rendimento/Cota, DY Mensal e Renda Mensal).
- Badges coloridas indicando a faixa de valuation de cada ativo.
- Linha totalizadora no rodapé para conciliação contábil.
- Clique na linha para abrir o modal de detalhes completos do ativo.

### 5. Gaveta de Detalhe Individual do Ativo (*Deep Dive*)
- Exibe o histórico de todos os 12 meses de 2024 para o fundo selecionado.
- Gráfico comparativo de **Preço de Mercado vs. Valor Patrimonial da Cota**.
- Histórico de rendimento por cota mês a mês.
- Estatísticas de máxima, mínima e amplitude de negociação.

### 6. Exportação de Relatórios
- Exportação em **CSV** (otimizado para Microsoft Excel com separador ponto-e-vírgula e UTF-8 BOM).
- Exportação em **JSON** para integração com outras ferramentas analíticas.

---

## 🧮 Metodologia e Fórmulas de Cálculo

### 1. Dividend Yield Médio Ponderado da Carteira (\% a.m.)
$$\text{DY}_{\text{ponderado}} = \left( \frac{\sum_{i=1}^{n} \text{Renda Mensal}_i}{\sum_{i=1}^{n} \text{Valor Total}_i} \right) \times 100$$

### 2. Dividend Yield Anualizado Projetado (\% a.a.)
$$\text{DY}_{\text{anualizado}} = \left( \left( 1 + \frac{\text{DY}_{\text{ponderado}}}{100} \right)^{12} - 1 \right) \times 100$$

### 3. Preço sobre Valor Patrimonial Médio Ponderado (P/VP)
$$\text{P/VP}_{\text{carteira}} = \frac{\sum_{i=1}^{n} (\text{P/VP}_i \times \text{Valor Total}_i)}{\sum_{i=1}^{n} \text{Valor Total}_i}$$

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Framework UI** | React 18 | Performance reativa e arquitetura de componentes modulares. |
| **Bundler & Build** | Vite 6 | Compilação ultrarrápida com Hot Module Replacement (HMR). |
| **Linguagem** | TypeScript 5 | Tipagem estática rigorosa para dados financeiros. |
| **Estilização** | Tailwind CSS 3 | Design System responsivo, utilitários dark mode e micro-animações. |
| **Visualização** | Recharts 2 | Gráficos SVG interativos com tooltips e animações fluidas. |
| **Ícones** | Lucide React | Biblioteca moderna de ícones vetoriais concisos. |
| **Processamento** | Python 3 + OpenPyXL | Pipeline de extração e saneamento dos dados do Excel original. |

---

## 📂 Estrutura do Projeto

```
Projeto FIIS 2024/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline CI/CD GitHub Pages
├── public/
│   └── data/
│       └── fiis-data.json      # Cópia pública dos dados da carteira
├── scripts/
│   └── export_data.py          # Script de saneamento e extração do Excel
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── AllocationChart.tsx         # Gráfico Donut de segmentos
│   │   │   ├── DividendEvolutionChart.tsx  # Barras mensais de proventos
│   │   │   ├── RiskReturnScatterChart.tsx  # Matriz P/VP vs. DY Mensal
│   │   │   └── TopDividendAssetsChart.tsx  # Ranking de maiores pagadores
│   │   ├── AssetDetailModal.tsx            # Modal de histórico detalhado
│   │   ├── ExportModal.tsx                 # Modal de exportação CSV/JSON
│   │   ├── FilterBar.tsx                   # Filtros, busca e período
│   │   ├── FiiTable.tsx                    # Tabela dinâmica ordenada
│   │   ├── KpiCards.tsx                    # 5 Cards de indicadores
│   │   ├── StockTicker.tsx                 # Letreiro contínuo de bolsa (Marquee)
│   │   ├── MethodologyModal.tsx            # Modal de fórmulas financeiras
│   │   └── Navbar.tsx                      # Topbar e alternador de visão
│   ├── data/
│   │   └── fiis-data.json      # Base estruturada de 2024
│   ├── types/
│   │   └── fii.ts              # Tipagens TypeScript
│   ├── utils/
│   │   ├── calculations.ts     # Fórmulas e agrupamentos matemáticos
│   │   └── formatters.ts       # Formatadores BRL, % e datas
│   ├── App.tsx                 # Orquestrador principal da aplicação
│   ├── index.css               # Estilos globais e Tailwind CSS
│   └── main.tsx                # Entrada React
├── FIIS 2024.xlsx              # Planilha original
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                 # Configuração para deploy na Vercel
└── vite.config.ts
```

---

## 💻 Como Executar Localmente

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **npm** ou **yarn** ou **pnpm**

### Passo a Passo

1. **Clone ou navegue até o diretório do projeto:**
   ```bash
   cd "c:\Users\acacio.faria\Documents\Projeto FIIS 2024"
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em: `http://localhost:3000` (ou na porta indicada no terminal).

4. **Gerar versão de produção (Build):**
   ```bash
   npm run build
   ```
   Os arquivos finais otimizados serão gerados no diretório `dist/`.

---

## 🌐 Deploy em Produção

### Deploy na Vercel (Recomendado)
O projeto já conta com o arquivo `vercel.json` configurado. Basta conectar o repositório na plataforma [Vercel](https://vercel.com/) e clicar em **Deploy**.

### Deploy no GitHub Pages
O repositório já inclui a GitHub Action em `.github/workflows/deploy.yml`. Basta ativar o **GitHub Pages** nas configurações do repositório em `Settings -> Pages -> Source: GitHub Actions`.

---

## 📄 Licença
Desenvolvido para análise de portfólio de Fundos Imobiliários na B3.

