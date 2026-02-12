import { getSheetsClient, CONFIG } from '../../../lib/googleSheets';
import { calcularProximaData } from '../../../lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ sucesso: false, erro: 'Método não permitido' });
  }

  try {
    const { equipamentoId, servico, descricao, data, intervalo, responsavel } = req.body;
    
    if (!equipamentoId || !servico || !data || !intervalo) {
      throw new Error('Campos obrigatórios não preenchidos');
    }
    
    const sheets = await getSheetsClient();
    const linhaEquipamento = parseInt(equipamentoId);
    
    // Encontra primeira linha livre no bloco
    let linhaManutencao = linhaEquipamento + 1;
    
    for (let i = 1; i < CONFIG.linhasPorBloco; i++) {
      const checkRow = await sheets.spreadsheets.values.get({
        spreadsheetId: CONFIG.planilhaId,
        range: `${CONFIG.nomeAba}!A${linhaEquipamento + i}`,
      });
      
      const valor = checkRow.data.values?.[0]?.[0];
      if (!valor) {
        linhaManutencao = linhaEquipamento + i;
        break;
      }
    }
    
    if (linhaManutencao >= linhaEquipamento + CONFIG.linhasPorBloco) {
      throw new Error('Bloco cheio! Não é possível adicionar mais manutenções.');
    }
    
    const proximaTroca = calcularProximaData(data, intervalo);
    const hoje = new Date().toISOString().split('T')[0];
    
    // Prepara os dados da manutenção
    const valores = new Array(CONFIG.colunas.dataCriacao + 1).fill('');
    
    valores[CONFIG.colunas.ultimaTroca] = data;
    valores[CONFIG.colunas.proximaTroca] = proximaTroca;
    valores[CONFIG.colunas.servico] = servico;
    valores[CONFIG.colunas.descricao] = descricao || '';
    valores[CONFIG.colunas.responsavel] = responsavel || '';
    valores[CONFIG.colunas.intervalo] = intervalo;
    valores[CONFIG.colunas.tipoRegistro] = 'manutencao';
    valores[CONFIG.colunas.dataCriacao] = hoje;
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: CONFIG.planilhaId,
      range: `${CONFIG.nomeAba}!A${linhaManutencao}:L${linhaManutencao}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [valores]
      }
    });
    
    return res.json({
      sucesso: true,
      mensagem: '✓ Manutenção registrada com sucesso!'
    });
    
  } catch (error) {
    console.error('Erro ao registrar manutenção:', error);
    return res.status(500).json({ sucesso: false, erro: error.message });
  }
}
