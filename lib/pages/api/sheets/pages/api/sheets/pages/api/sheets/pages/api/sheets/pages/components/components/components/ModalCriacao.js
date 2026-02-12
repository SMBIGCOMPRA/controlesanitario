import { useState } from 'react';
import axios from 'axios';

export default function ModalCriacao({ isOpen, onClose, lojas, setores, onSuccess }) {
  const [formData, setFormData] = useState({
    item: '',
    loja: '',
    setor: ''
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    
    if (!formData.item || !formData.loja) {
      setErro('Preencha os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/sheets/criar', formData);
      
      if (response.data.sucesso) {
        onSuccess();
        setFormData({ item: '', loja: '', setor: '' });
      }
    } catch (error) {
      setErro(error.response?.data?.erro || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#f5f9fc] to-[#e9f0f5] z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl md:rounded-[48px] p-6 md:p-12 max-w-2xl w-full shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 md:gap-6 pb-6 md:pb-8 mb-6 md:mb-10 border-b border-[#0f4e5f]/10">
            <div className="bg-[#0f4e5f]/10 p-3 md:p-4 rounded-2xl md:rounded-3xl">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-[#0f4e5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0b3b4c]">Novo Equipamento</h2>
          </div>

          {erro && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Campo Item */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-gray-100">
              <label className="md:w-40 text-sm uppercase tracking-wider font-bold text-[#1e5a6d]">
                ITEM <span className="text-red-500">*</span>
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value.toUpperCase() })}
                  placeholder="Ex: ESTERILIZADOR"
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-lg bg-gray-50 focus:bg-white focus:border-[#0f4e5f] focus:outline-none focus:ring-4 focus:ring-[#0f4e5f]/10 transition-all"
                  required
                />
              </div>
            </div>

            {/* Campo Loja */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-gray-100">
              <label className="md:w-40 text-sm uppercase tracking-wider font-bold text-[#1e5a6d]">
                LOJA <span className="text-red-500">*</span>
              </label>
              <div className="flex-1">
                <select
                  value={formData.loja}
                  onChange={(e) => setFormData({ ...formData, loja: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-lg bg-gray-50 focus:bg-white focus:border-[#0f4e5f] focus:outline-none focus:ring-4 focus:ring-[#0f4e5f]/10 transition-all"
                  required
                >
                  <option value="">Selecione...</option>
                  {lojas.map(loja => (
                    <option key={loja} value={loja}>
                      {loja === 'CD' ? 'CD' : `Loja ${loja}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Campo Setor */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <label className="md:w-40 text-sm uppercase tracking-wider font-bold text-[#1e5a6d]">
                SETOR
              </label>
              <div className="flex-1">
                <select
                  value={formData.setor}
                  onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-lg bg-gray-50 focus:bg-white focus:border-[#0f4e5f] focus:outline-none focus:ring-4 focus:ring-[#0f4e5f]/10 transition-all"
                >
                  <option value="">Selecione...</option>
                  {setores.map(setor => (
                    <option key={setor} value={setor}>{setor}</option>
                  ))}
                </select>
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
                    Criando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Criar Equipamento
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
