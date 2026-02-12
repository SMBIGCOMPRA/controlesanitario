import { getSheetsClient, CONFIG } from '../../../lib/googleSheets';
import { padronizarLoja } from '../../../lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ sucesso: false, erro: 'Método não permitido' });
  }

  try {
    const { id, item, loja, setor, estado } = req.body;
    
    if (!id || !item || !loja) {
      throw new Error('Campos obrigatórios não preenchidos');
    }
    
    const sheets = await getSheetsClient();
    const linha = parseInt(id);
    const lojaPadronizada = padronizarLoja(loja);
    
    const valores = new Array(CONFIG.colunas.dataCriacao + 1).fill('');
    
    valores[CONFIG.colunas.item] = item.toUpperCase();
    valores[CONFIG.colunas.estado] = estado || 'Ativo';
    valores[CONFIG.colunas.loja] = lojaPadronizada;
    valores[CONFIG.colunas.setor] = setor || '';
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: CONFIG.planilhaId,
      range: `${CONFIG.nomeAba}!A${linha}:L${linha}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [valores]
      }
    });
    
    // Mantém negrito
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: CONFIG.planilhaId,
      requestBody: {
        requests: [{
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: linha - 1,
              endRowIndex: linha,
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
      mensagem: '✓ Equipamento atualizado com sucesso!'
    });
    
  } catch (error) {
    console.error('Erro ao atualizar equipamento:', error);
    return res.status(500).json({ sucesso: false, erro: error.message });
  }
}
