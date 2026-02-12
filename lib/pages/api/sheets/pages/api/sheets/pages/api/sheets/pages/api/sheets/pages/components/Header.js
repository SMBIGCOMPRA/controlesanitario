import Image from 'next/image';

export default function Header({ onNovoClick }) {
  return (
    <header className="flex items-center justify-between mb-8 bg-white/75 backdrop-blur-md p-4 md:p-6 rounded-[36px] shadow-lg border border-white/60">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative w-12 h-12 md:w-14 md:h-14">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="rounded-xl object-cover shadow-md"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MiIgaGVpZ2h0PSI1MiIgdmlld0JveD0iMCAwIDUyIDUyIj48cmVjdCB3aWR0aD0iNTIiIGhlaWdodD0iNTIiIGZpbGw9IiMwZjRlNWYiLz48dGV4dCB4PSIxMCIgeT0iMzYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMCIgZmlsbD0id2hpdGUiPkM8L3RleHQ+PC9zdmc+';
            }}
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0a3645] to-[#0f4e5f] bg-clip-text text-transparent">
          Controle Sanitário
        </h1>
      </div>
      
      <button
        onClick={onNovoClick}
        className="bg-gradient-to-r from-[#0f4e5f] to-[#0a3a48] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-sm md:text-base"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span className="hidden sm:inline">Novo Equipamento</span>
        <span className="sm:hidden">Novo</span>
      </button>
    </header>
  );
}
