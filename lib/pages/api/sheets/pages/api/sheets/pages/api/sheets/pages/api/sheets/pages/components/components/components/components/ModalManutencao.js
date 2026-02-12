import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ModalManutencao({ isOpen, onClose, equipamento, tiposServico, onSuccess }) {
  const [formData, setFormData] = useState({
    servico: '',
    novoServico: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
    intervalo: 30,
    responsavel: ''
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [showNovoServico, setShowNovoServico] = useState(false);

  useEffect(() => {
    if (equipamento) {
      setFormData({
        ...formData,
        intervalo: equipamento.intervalo || 30,
        data: new Date().toISOString().split('T')[0]
      });
    }
  }, [equipamento]);

  if (!isOpen || !equipamento) return null;

  const handleServicoChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, servico: value });
    setShowNovoServico(value === 'Outro');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    
    let servicoFinal = formData.servico;
    if (formData.servico === 'Outro' && formData.novoServico) {
      servicoFinal = formData.novoServico;
    }

    if (!servicoFinal || !formData.data || !formData.intervalo) {
      setErro('Preencha os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/sheets/manutencao', {
        equipamentoId: equipamento.id,
        servico: servicoFinal,
        descricao: formData.descricao,
        data: formData.data,
        intervalo: formData.intervalo,
        responsavel: formData.responsavel
      });
      
      if (response.data.sucesso) {
        onSuccess();
        setFormData({
          servico: '',
          novoServico: '',
          descricao: '',
          data: new Date().toISOString().split('T')[0],
          intervalo: 30,
          responsavel: ''
        });
        setShowNovoServico(false);
      }
    } catch (error) {
      setErro(error.response?.data?.erro || error.message);
    } finally {
      setLoading(false);
    }
  };

  const calcularProximaData = () => {
    if (formData.data && formData.intervalo) {
      const data = new Date(formData.data);
      data.setDate(data.getDate() + parseInt(formData.intervalo));
      return data.toLocaleDateString('pt-BR');
    }
    return '--/--/----';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#f5f9fc] to-[#e9f0f5] z-[4500] overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl md:rounded-[48px] p-6 md:p-12 max-w-2xl w-full shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 md:gap-6 pb-6 md:pb-8 mb-6 md:mb-10 border-b border-[#0f4e5f]/10">
            <div className="bg-[#0f4e5f]/10 p-3 md:p-4 rounded-2xl md:rounded-3xl">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-[#0f4e5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0b3b4c] mb-2">Nova Manutenção</h2>
              <div className="flex items-center gap-2 text-[#0f4e5f] bg-[#0f4e5f]/5 px-4 py-2 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="font-semibold">{equipamento.item}</span>
                {equipamento.setor && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span>{equipamento.setor}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {erro && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Campo Serviço */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-gray-100">
              <label className="md:w-40 text-sm uppercase tracking-wider font-bold text-[#1e5a6d]">
                SERVIÇO <span className="text-red-500">*</span>
              </label>
              <div className="flex-1">
                <select
                  value={formData.servico}
                  onChange={handleServicoChange}
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-lg bg-gray-50 focus:bg-white focus:border-[#0f4e5f] focus:outline-none focus:ring-4 focus:ring-[#0f4e5f]/10 transition-all"
                  required
                >
                  <option value="">Selecione...</option>
                  {tiposServico.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>

                {/* Campo para novo serviço */}
                {showNovoServico && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-[#1e5a6d] mb-2">
                      NOVO SERVIÇO <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.novoServico}
                      onChange={(e) => setFormData({ ...formData, novoServico: e.target.value })}
                      placeholder="Digite o nome do novo serviço"
                      className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-lg bg-gray-50 focus:bg-white focus:border-[#0f4e5f] focus:outline-none focus:ring-4 focus:ring-[#0f4e5f]/10 transition-all"
                      required={showNovoServico}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Campo Descrição */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-gray-100">
              <label className="md:w-40 text-sm uppercase tracking-wider font-bold text-[#1e5a6d]">
                DESCRIÇÃO
              </label>
              <div className="flex-1">
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva o serviço realizado..."
                  rows="3"
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-lg bg-gray-50 focus:bg-white focus:border-[#0f4e5f] focus:outline-none focus:ring-4 focus:ring-[#0f4e5f]/10 transition-all resize-none"
                />
              </div>
            </div>

            {/* Campo Data */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-gray-100">
              <label className="md:w-40 text-sm uppercase tracking-wider font-bold text-[#1e5a6d]">
                DATA <span className="text-red-500">*</span>
              </label>
              <div className="flex-1">
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-lg bg-gray-50 focus:bg-white focus:border-[#0f4e5f] focus:outline-none focus:ring-4 focus:ring-[#0f4e5f]/10 transition-all"
                  required
                />
              </div>
            </div>

            {/* Campo Intervalo */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-gray-100">
              <label className="md:w-40 text-sm uppercase tracking-wider font-bold text-[#1e5a6d]">
                INTERVALO <span className="text-red-500">*</span>
              </label>
              <div className="flex-1">
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={formData.intervalo}
                    onChange={(e) => setFormData({ ...formData, intervalo: e.target.value })}
                    min="1"
                    max="999"
                    className="flex-1 px-5 py-4 border-2 border-gray-100 rounded-2xl text-lg bg-gray-50 focus:bg-white focus:border-[#0f4e5f] focus:outline-none focus:ring-4 focus:ring-[#0f4e5f]/10 transition-all"
                    required
                  />
                  <span className="flex items-center px-4 bg-gray-100 rounded-2xl text-gray-600 font-semibold">
                    dias
                  </span>
                </div>
              </div>
            </div>

            {/* Campo Responsável */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <label className="md:w-40 text-sm uppercase tracking-wider font-bold text-[#1e5a6d]">
                RESPONSÁVEL
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  placeholder="Nome de quem realizou"
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-lg bg-gray-50 focus:bg-white focus:border-[#0f4e5f] focus:outline-none focus:ring-4 focus:ring-[#0f4e5f]/10 transition-all"
                />
              </div>
            </div>

            {/* Preview da próxima troca */}
            <div className="bg-gradient-to-r from-[#e6f3f8] to-[#d6e9ef] p-6 rounded-2xl md:rounded-3xl mb-8 border-l-8 border-[#0f4e5f]">
              <div className="flex items-center gap-4">
                <div className="bg-[#0f4e5f] p-3 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#0f4e5f] font-semibold uppercase tracking-wider">Próxima troca</p>
                  <p className="text-2xl font-bold text-[#0b3b4c]">{calcularProximaData()}</p>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 rounded-full border-2 border-[#0f4e5f] text-[#0f4e5f] font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-full bg-[#0f4e5f] text-white font-bold hover:bg-[#0a3a48] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Registrando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Registrar Manutenção
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
