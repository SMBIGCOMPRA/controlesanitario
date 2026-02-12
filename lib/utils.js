export function padronizarLoja(loja) {
  if (!loja) return '';
  if (loja.toString().toUpperCase() === 'CD') return 'CD';
  
  let lojaLimpa = loja.toString().replace(/loja\s*/i, '').trim();
  
  if (!isNaN(lojaLimpa) && lojaLimpa !== '') {
    const numero = parseInt(lojaLimpa, 10);
    if (numero >= 1 && numero <= 9) {
      return `0${numero}`;
    }
    if (numero >= 10) {
      return numero.toString();
    }
  }
  
  return lojaLimpa;
}

export function formatarData(data) {
  if (!data) return '';
  try {
    if (typeof data === 'string') {
      if (data.includes('/')) return data;
      const partes = data.split('-');
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
    }
    if (data instanceof Date) {
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }
    return '';
  } catch {
    return '';
  }
}

export function formatarDataISO(data) {
  if (!data) return '';
  try {
    if (data.includes('/')) {
      const partes = data.split('/');
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return data;
  } catch {
    return '';
  }
}

export function extrairIntervalo(itemNome) {
  if (!itemNome) return null;
  try {
    const match = itemNome.toString().match(/\[(\d+)d\]/);
    return match ? parseInt(match[1]) : null;
  } catch {
    return null;
  }
}

export function calcularProximaData(dataBase, dias) {
  const data = new Date(dataBase);
  data.setDate(data.getDate() + parseInt(dias));
  return formatarData(data);
}

export function escapeHTML(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
