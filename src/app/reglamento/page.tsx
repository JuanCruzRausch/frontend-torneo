export default function ReglamentoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-8 py-6">
            <h1 className="text-3xl font-bold">Reglamento General</h1>
            <p className="text-blue-100 mt-2">Normas y reglas para los torneos de fútbol</p>
          </div>

          {/* Content */}
          <div className="px-8 py-6 prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Disposiciones Generales</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Los torneos organizados por esta plataforma se rigen por las reglas oficiales de la FIFA, 
                  con las adaptaciones específicas que se detallan en este reglamento.
                </p>
                <p>
                  Todos los equipos participantes deben cumplir con los requisitos de inscripción y 
                  mantener el fair play durante toda la competición.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Inscripción de Equipos</h2>
              <div className="space-y-4 text-gray-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cada equipo debe tener mínimo 11 jugadores y máximo 20 jugadores</li>
                  <li>La edad mínima para participar es de 16 años</li>
                  <li>Todos los jugadores deben presentar documentación válida</li>
                  <li>El equipo debe designar un capitán y un delegado</li>
                  <li>Se debe presentar el equipamiento completo antes del primer partido</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Formato de Competición</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">Fase de Grupos</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Los equipos se distribuyen en zonas según el número de participantes</li>
                  <li>Cada equipo juega una vez contra todos los equipos de su zona</li>
                  <li>Victoria: 3 puntos, Empate: 1 punto, Derrota: 0 puntos</li>
                  <li>Los primeros de cada zona avanzan a la siguiente fase</li>
                </ul>

                <h3 className="text-lg font-semibold mt-6">Fase Eliminatoria</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sistema de eliminación directa</li>
                  <li>En caso de empate: tiempo extra y penales si es necesario</li>
                  <li>El ganador avanza, el perdedor queda eliminado</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Reglas de Juego</h2>
              <div className="space-y-4 text-gray-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Partidos de 90 minutos (45 minutos cada tiempo)</li>
                  <li>Máximo 3 cambios por equipo durante el partido</li>
                  <li>Tarjeta amarilla: advertencia. Dos amarillas = expulsión</li>
                  <li>Tarjeta roja: expulsión directa</li>
                  <li>El árbitro tiene la decisión final en todas las jugadas</li>
                  <li>Cada equipo debe tener al menos 7 jugadores para iniciar el partido</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Disciplina y Fair Play</h2>
              <div className="space-y-4 text-gray-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Se promueve el respeto hacia rivales, árbitros y organización</li>
                  <li>Conducta antideportiva será sancionada según la gravedad</li>
                  <li>Agresiones físicas o verbales resultan en expulsión del torneo</li>
                  <li>Los equipos son responsables de la conducta de sus hinchas</li>
                  <li>Se premiará al equipo con mejor fair play del torneo</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Protestas y Apelaciones</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Las protestas deben presentarse por escrito dentro de las 24 horas posteriores 
                  al partido en cuestión. La comisión organizadora evaluará cada caso y tomará 
                  una decisión final e inapelable.
                </p>
                <p>
                  Solo se aceptarán protestas relacionadas con:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Inclusión de jugadores no habilitados</li>
                  <li>Errores administrativos en el resultado</li>
                  <li>Incumplimiento del reglamento por parte del equipo rival</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Premiación</h2>
              <div className="space-y-4 text-gray-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Campeón:</strong> Trofeo, medallas y premio económico</li>
                  <li><strong>Subcampeón:</strong> Trofeo y medallas</li>
                  <li><strong>Tercer puesto:</strong> Trofeo y medallas</li>
                  <li><strong>Goleador:</strong> Trofeo individual</li>
                  <li><strong>Mejor arquero:</strong> Trofeo individual</li>
                  <li><strong>Fair Play:</strong> Reconocimiento especial</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Este reglamento puede ser modificado por la organización. 
              Los cambios serán comunicados oportunamente a todos los participantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 