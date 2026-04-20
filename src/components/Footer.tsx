export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-10">
      <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/Logo_Volta.svg" alt="Liceo Volta Foggia" className="h-10 w-auto" />
          <div className="text-xs text-gray-500">
            <p className="font-semibold text-gray-700">Liceo Scientifico Statale Alessandro Volta</p>
            <p>Foggia — Progetto STEAM</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="text-xl">🥗</span>
          <span>NutriTrack © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
