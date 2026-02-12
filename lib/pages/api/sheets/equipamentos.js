import { getSheetsClient, CONFIG } from '../../../lib/googleSheets';
import { padronizarLoja, formatarData } from '../../../lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ sucesso: false, erro: 'Método não permitido' });
  }

  try {
    const sheets = await getSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: CONFIG.planilhaId,
      range: `${CONFIG.nomeAba}!A:L`,
    });

    const dados = response.data.values || [];
    
    if (dados.length === 0) {
      return res.json({ 
        sucesso: true, 
        equipamentos: [],
        lojas: CONFIG.lojasPermitidas,
        setores: CONFIG.setoresPermitidos,
        tiposServico: CONFIG.tiposServico
      });
    }

    dados.shift(); // Remove cabeçalho
    
    const equipamentos = [];
    let i = 0;
    
    while (i < dados.length) {
      const linhaReal = i + 2;
      const linhaDados = dados[i];
      
      if (linhaDados[CONFIG.colunas.item]) {
        const itemNome = linhaDados[CONFIG.colunas.item] || '';
        const intervalo = extrairIntervalo(itemNome);
        const itemSemIntervalo = itemNome.replace(/\s*\[\d+d\]\s*$/g, '');
        
        let loja = linhaDados[CONFIG.colunas.loja] || '';
        loja = padronizarLoja(loja);
        
        const manutencoes = [];
        for (let j = 1; j < CONFIG.linhasPorBloco; j++) {
          const idx = i + j;
          if (idx >= dados.length) break;
          
          const manutDados = dados[idx];
          if (!manutDados[CONFIG.colunas.item] && manutDados[CONFIG.colunas.servico]) {
            manutencoes.push({
              id: `${linhaReal}-${j}`,
              linha: idx + 2,
              data: formatarData(manutDados[CONFIG.colunas.ultimaTroca]),
              proximaTroca: formatarData(manutDados[CONFIG.colunas.proximaTroca]),
              servico: manutDados[CONFIG.colunas.servico] || '',
              descricao: manutDados[CONFIG.colunas.descricao] || '',
              responsavel: manutDados[CONFIG.colunas.responsavel] || '',
              intervalo: manutDados[CONFIG.colunas.intervalo] || intervalo
            });
          }
        }
        
        equipamentos.push({
          id: linhaReal,
          item: itemSemIntervalo,
          itemCompleto: itemNome,
          estado: linhaDados[CONFIG.colunas.estado] || 'Ativo',
          ultimaTroca: formatarData(linhaDados[CONFIG.colunas.ultimaTroca]),
          proximaTroca: formatarData(linhaDados[CONFIG.colunas.proximaTroca]),
          loja: loja,
          setor: linhaDados[CONFIG.colunas.setor] || '',
          manutencoes: manutencoes,
          dataCriacao: linhaDados[CONFIG.colunas.dataCriacao] || ''
        });
      }
      
      i += CONFIG.linhasPorBloco;
    }
    
    return res.json({
      sucesso: true,
      equipamentos: equipamentos.reverse(),
      lojas: CONFIG.lojasPermitidas,
      setores: CONFIG.setoresPermitidos,
      tiposServico: CONFIG.tiposServico
    });
    
  } catch (error) {
    console.error('Erro ao obter dados:', error);
    return res.status(500).json({ sucesso: false, erro: error.message });
  }
}
