import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function getAuthClient() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: SCOPES,
    });
    
    return auth;
  } catch (error) {
    console.error('Erro ao autenticar:', error);
    throw error;
  }
}

export async function getSheetsClient() {
  const auth = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

export const CONFIG = {
  planilhaId: process.env.SPREADSHEET_ID,
  nomeAba: 'Controle',
  colunas: {
    item: 0,          // A
    estado: 1,        // B
    ultimaTroca: 2,   // C
    proximaTroca: 3,  // D
    loja: 4,          // E
    setor: 5,         // F - NOVO
    servico: 6,       // G
    descricao: 7,     // H
    responsavel: 8,   // I
    intervalo: 9,     // J
    tipoRegistro: 10, // K
    dataCriacao: 11   // L
  },
  lojasPermitidas: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'CD'],
  setoresPermitidos: [
    'Cozinha',
    'Lavanderia',
    'Quarto',
    'Banheiro',
    'Área Externa',
    'Recepção',
    'Refeitório',
    'Depósito',
    'Laboratório',
    'Outro'
  ],
  linhasPorBloco: 20,
  tiposServico: [
    'Reparo',
    'Substituição',
    'Limpeza profunda',
    'Calibração',
    'Inspeção',
    'Manutenção preventiva',
    'Troca de peça',
    'Recarga',
    'Desinfecção',
    'Outro'
  ]
};
