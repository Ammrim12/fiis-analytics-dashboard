import os
import json
import openpyxl

def main():
    wb = openpyxl.load_workbook('FIIS 2024.xlsx', data_only=True)
    sheet = wb.active
    rows = list(sheet.iter_rows(values_only=True))

    FII_METADATA = {
        'ALZR11': {'nome': 'Alianza Trust Renda Imobiliária', 'segmento': 'Renda Urbana', 'tipo': 'Tijolo'},
        'BRCO11': {'nome': 'Bresco Logística', 'segmento': 'Logística', 'tipo': 'Tijolo'},
        'BTLG11': {'nome': 'BTG Pactual Logística', 'segmento': 'Logística', 'tipo': 'Tijolo'},
        'CPTS11': {'nome': 'Capitânia Securities II', 'segmento': 'Papel / CRI', 'tipo': 'Papel'},
        'HGCR11': {'nome': 'CSHG Recebíveis Imobiliários', 'segmento': 'Papel / CRI', 'tipo': 'Papel'},
        'HGLG11': {'nome': 'CSHG Logística', 'segmento': 'Logística', 'tipo': 'Tijolo'},
        'HGRU11': {'nome': 'CSHG Renda Urbana', 'segmento': 'Renda Urbana', 'tipo': 'Tijolo'},
        'JSRE11': {'nome': 'JS Real Estate Multigestão', 'segmento': 'Lajes Corporativas', 'tipo': 'Tijolo'},
        'KNCR11': {'nome': 'Kinea Rendimentos CDI', 'segmento': 'Papel / CDI', 'tipo': 'Papel'},
        'KNIP11': {'nome': 'Kinea Rendimentos Imobiliários', 'segmento': 'Papel / CRI', 'tipo': 'Papel'},
        'KNSC11': {'nome': 'Kinea Séries Imobiliárias', 'segmento': 'Papel / CRI', 'tipo': 'Papel'},
        'MXRF11': {'nome': 'Maxi Renda FII', 'segmento': 'Papel / Híbrido', 'tipo': 'Papel'},
        'PVBI11': {'nome': 'VBI Prime Properties', 'segmento': 'Lajes Corporativas', 'tipo': 'Tijolo'},
        'RZTR11': {'nome': 'Riza Terrax FII', 'segmento': 'Agro / Terras', 'tipo': 'Agro'},
        'TRXF11': {'nome': 'TRX Real Estate', 'segmento': 'Renda Urbana', 'tipo': 'Tijolo'},
        'VGIR11': {'nome': 'Valora RE III', 'segmento': 'Papel / CDI', 'tipo': 'Papel'},
        'VISC11': {'nome': 'Vinci Shopping Centers', 'segmento': 'Shoppings', 'tipo': 'Tijolo'},
        'XPML11': {'nome': 'XP Malls FII', 'segmento': 'Shoppings', 'tipo': 'Tijolo'},
    }

    data = []
    for r in rows[1:]:
        if not r[0]:
            continue
        ticker = str(r[0]).strip().upper()
        meta = FII_METADATA.get(ticker, {
            'nome': str(r[1]).strip() if r[1] else ticker,
            'segmento': str(r[2]).strip() if r[2] else 'Outros',
            'tipo': 'Outros'
        })
        periodo = r[3].strftime('%Y-%m-%d') if hasattr(r[3], 'strftime') else str(r[3])
        cotas = int(r[4]) if r[4] is not None else 0
        precoAtual = round(float(r[5]), 2) if r[5] is not None else 0.0
        vpPorCota = round(float(r[6]), 2) if r[6] is not None else 0.0
        pvp = round(float(r[7]), 4) if r[7] is not None else 0.0
        valorTotal = round(float(r[8]), 2) if r[8] is not None else 0.0
        rendimentoPorCota = round(float(r[9]), 4) if r[9] is not None else 0.0
        dyMensal = round(float(r[10]) * 100, 4) if r[10] is not None else 0.0
        rendaMensal = round(float(r[11]), 2) if r[11] is not None else 0.0

        data.append({
            'ticker': ticker,
            'nome': meta['nome'],
            'segmento': meta['segmento'],
            'tipo': meta['tipo'],
            'periodo': periodo,
            'cotas': cotas,
            'precoAtual': precoAtual,
            'vpPorCota': vpPorCota,
            'pvp': pvp,
            'valorTotal': valorTotal,
            'rendimentoPorCota': rendimentoPorCota,
            'dyMensal': dyMensal,
            'rendaMensal': rendaMensal
        })

    os.makedirs('src/data', exist_ok=True)
    os.makedirs('public/data', exist_ok=True)

    with open('src/data/fiis-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    with open('public/data/fiis-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Sucesso: {len(data)} registros exportados.")

if __name__ == '__main__':
    main()

