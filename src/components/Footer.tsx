export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Torneo Misionero" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold">Torneo Misionero</span>
            </div>
            <p className="text-gray-300 text-sm">
              Sistema completo de gestión de torneos de fútbol. 
              Gestiona equipos, partidos, resultados y mucho más.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <a href="/torneos" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Torneos
                </a>
              </li>
              <li>
                <a href="/goleadores" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Goleadores
                </a>
              </li>
              <li>
                <a href="/reglamento" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Reglamento
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📧 info@torneos.com</p>
              <p>📱 +54 11 1234-5678</p>
              <p>📍 Buenos Aires, Argentina</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Gestión de Torneos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
} 