import { getSheetsClient, CONFIG } from '../../../lib/googleSheets';
import { padronizarLoja } from '../../../lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ sucesso: false, erro: 'Método não permitido' });
  }

  try {
    const { item, loja, setor } = req.body;
    
    if (!item || !loja) {
      throw new Error('Campos obrigatórios não preenchidos');
    }
    
    const sheets = await getSheetsClient();
    
    // Busca última linha para calcular próximo bloco
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: CONFIG.planilhaId,
      range: `${CONFIG.nomeAba}!A:A`,
    });
    
    const dados = response.data.values || [];
    const ultimaLinha = dados.length;
    
    let novaLinha;
    if (ultimaLinha <= 1) {
      novaLinha = 2;
    } else {
      novaLinha = Math.floor((ultimaLinha - 1) / CONFIG.linhasPorBloco) * CONFIG.linhasPorBloco + 2;
    }
    
    const lojaPadronizada = padronizarLoja(loja);
    const hoje = new Date().toISOString().split('T')[0];
    
    // Prepara os dados para inserir
    const valores = new Array(CONFIG.colunas.dataCriacao + 1).fill('');
    
    valores[CONFIG.colunas.item] = item.toUpperCase();
    valores[CONFIG.colunas.estado] = 'Ativo';
    valores[CONFIG.colunas.loja] = lojaPadronizada;
    valores[CONFIG.colunas.setor] = setor || '';
    valores[CONFIG.colunas.tipoRegistro] = 'equipamento';
    valores[CONFIG.colunas.dataCriacao] = hoje;
    
    // Insere o equipamento
    await sheets.spreadsheets.values.update({
      spreadsheetId: CONFIG.planilhaId,
      range: `${CONFIG.nomeAba}!A${novaLinha}:L${novaLinha}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [valores]
      }
    });
    
    // Aplica negrito
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: CONFIG.planilhaId,
      requestBody: {
        requests: [{
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: novaLinha - 1,
              endRowIndex: novaLinha,
              startColumnIndex: 0,
              endColumnIndex: 1
            },
            cell: {
              userEnteredFormat: {
                textFormat: {
                  bold: true
                }
              }
            },
            fields: 'userEnteredFormat.textFormat.bold'
          }
        }]
      }
    });
    
    return res.json({
      sucesso: true,
      mensagem: 'Equipamento criado com sucesso!',
      linha: novaLinha
    });
    
  } catch (error) {
    console.error('Erro ao criar equipamento:', error);
    return res.status(500).json({ sucesso: false, erro: error.message });
  }
}
