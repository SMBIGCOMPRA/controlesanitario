import { useState, useRef, useEffect } from 'react';

export default function Filtros({
  equipamentos,
  lojas,
  setores,
  filtroItem,
  filtroLoja,
  filtroSetor,
  onFiltroItemChange,
  onFiltroLojaChange,
  onFiltroSetorChange,
  totalResultados
}) {
  const [itemMenuAberto, setItemMenuAberto] = useState(false);
  const [lojaMenuAberto, setLojaMenuAberto] = useState(false);
  const [setorMenuAberto, setSetorMenuAberto] = useState(false);
  
  const itemRef = useRef(null);
  const lojaRef = useRef(null);
  const setorRef = useRef(null);

  const itensUnicos = [...new Set(equipamentos.map(eq => eq.item))].sort();

  useEffect(() => {
    function handleClickOutside(event) {
      if (itemRef.current && !itemRef.current.contains(event.target)) {
        setItemMenuAberto(false);
      }
      if (lojaRef.current && !lojaRef.current.contains(event.target)) {
        setLojaMenuAberto(false);
      }
      if (setorRef.current && !setorRef.current.contains(event.target)) {
        setSetorMenuAberto(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleItem = (item) => {
    if (filtroItem.includes(item)) {
      onFiltroItemChange(filtroItem.filter(i => i !== item));
    } else {
      onFiltroItemChange([...filtroItem, item]);
    }
  };

  const toggleLoja = (loja) => {
    if (filtroLoja.includes(loja)) {
      onFiltroLojaChange(filtroLoja.filter(l => l !== loja));
    } else {
      onFiltroLojaChange([...filtroLoja, loja]);
    }
  };

  const toggleSetor = (setor) => {
    if (filtroSetor.includes(setor)) {
      onFiltroSetorChange(filtroSetor.filter(s => s !== setor));
    } else {
      onFiltroSetorChange([...filtroSetor, setor]);
    }
  };

  const limparTodos = () => {
    onFiltroItemChange([]);
    onFiltroLojaChange([]);
    onFiltroSetorChange([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8 bg-white/50 backdrop-blur-md p-4 md:p-6 rounded-[40px] relative z-50">
      {/* Filtro Item */}
      <div className="relative" ref={itemRef}>
        <button
          onClick={() => setItemMenuAberto(!itemMenuAberto)}
          className={`flex items-center gap-3 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200
            ${filtroItem.length > 0 
              ? 'bg-[#0f4e5f] text-white' 
              : 'bg-white text-[#0b3b4c] border border-[#0f4e5f]/20 hover:border-[#0f4e5f]'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span>Item {filtroItem.length > 0 && `(${filtroItem.length})`}</span>
          <svg className={`w-4 h-4 transition-transform ${itemMenuAberto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {itemMenuAberto && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-white/60 p-5 z-[9999]">
            <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-100">
              <span className="font-bold text-[#0b3b4c]">Filtrar por Item</span>
              <button onClick={() => setItemMenuAberto(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto mb-4">
              {itensUnicos.map(item => (
                <label key={item} className="flex items-center p-3 hover:bg-gray-50 rounded-xl cursor-pointer border-b border-gray-50">
                  <input
                    type="checkbox"
                    checked={filtroItem.includes(item)}
                    onChange={() => toggleItem(item)}
                    className="w-5 h-5 accent-[#0f4e5f] rounded cursor-pointer"
                  />
                  <span className="ml-3 text-[#2c3e50]">{item}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  onFiltroItemChange([]);
                  setItemMenuAberto(false);
                }}
                className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium text-sm"
              >
                Limpar
              </button>
              <button
                onClick={() => setItemMenuAberto(false)}
                className="px-5 py-2 rounded-full bg-[#0f4e5f] text-white hover:bg-[#0a3a48] font-medium text-sm"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filtro Loja */}
      <div className="relative" ref={lojaRef}>
        <button
          onClick={() => setLojaMenuAberto(!lojaMenuAberto)}
          className={`flex items-center gap-3 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200
            ${filtroLoja.length > 0 
              ? 'bg-[#0f4e5f] text-white' 
              : 'bg-white text-[#0b3b4c] border border-[#0f4e5f]/20 hover:border-[#0f4e5f]'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Loja {filtroLoja.length > 0 && `(${filtroLoja.length})`}</span>
          <svg className={`w-4 h-4 transition-transform ${lojaMenuAberto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {lojaMenuAberto && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-white/60 p-5 z-[9999]">
            <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-100">
              <span className="font-bold text-[#0b3b4c]">Filtrar por Loja</span>
              <button onClick={() => setLojaMenuAberto(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto mb-4">
              {lojas.map(loja => (
                <label key={loja} className="flex items-center p-3 hover:bg-gray-50 rounded-xl cursor-pointer border-b border-gray-50">
                  <input
                    type="checkbox"
                    checked={filtroLoja.includes(loja)}
                    onChange={() => toggleLoja(loja)}
                    className="w-5 h-5 accent-[#0f4e5f] rounded cursor-pointer"
                  />
                  <span className="ml-3 text-[#2c3e50]">{loja === 'CD' ? 'CD' : `Loja ${loja}`}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  onFiltroLojaChange([]);
                  setLojaMenuAberto(false);
                }}
                className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium text-sm"
              >
                Limpar
              </button>
              <button
                onClick={() => setLojaMenuAberto(false)}
                className="px-5 py-2 rounded-full bg-[#0f4e5f] text-white hover:bg-[#0a3a48] font-medium text-sm"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filtro Setor */}
      <div className="relative" ref={setorRef}>
        <button
          onClick={() => setSetorMenuAberto(!setorMenuAberto)}
          className={`flex items-center gap-3 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200
            ${filtroSetor.length > 0 
              ? 'bg-[#0f4e5f] text-white' 
              : 'bg-white text-[#0b3b4c] border border-[#0f4e5f]/20 hover:border-[#0f4e5f]'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>Setor {filtroSetor.length > 0 && `(${filtroSetor.length})`}</span>
          <svg className={`w-4 h-4 transition-transform ${setorMenuAberto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {setorMenuAberto && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-white/60 p-5 z-[9999]">
            <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-100">
              <span className="font-bold text-[#0b3b4c]">Filtrar por Setor</span>
              <button onClick={() => setSetorMenuAberto(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto mb-4">
              {setores.map(setor => (
                <label key={setor} className="flex items-center p-3 hover:bg-gray-50 rounded-xl cursor-pointer border-b border-gray-50">
                  <input
                    type="checkbox"
                    checked={filtroSetor.includes(setor)}
                    onChange={() => toggleSetor(setor)}
                    className="w-5 h-5 accent-[#0f4e5f] rounded cursor-pointer"
                  />
                  <span className="ml-3 text-[#2c3e50]">{setor}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  onFiltroSetorChange([]);
                  setSetorMenuAberto(false);
                }}
                className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium text-sm"
              >
                Limpar
              </button>
              <button
                onClick={() => setSetorMenuAberto(false)}
                className="px-5 py-2 rounded-full bg-[#0f4e5f] text-white hover:bg-[#0a3a48] font-medium text-sm"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>

      {(filtroItem.length > 0 || filtroLoja.length > 0 || filtroSetor.length > 0) && (
        <button
          onClick={limparTodos}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpar filtros
        </button>
      )}

      <div className="ml-auto flex items-center gap-2 px-5 py-2 rounded-full bg-[#0f4e5f]/10 text-[#0f4e5f] font-semibold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>{totalResultados} equipamentos</span>
      </div>
    </div>
  );
}
