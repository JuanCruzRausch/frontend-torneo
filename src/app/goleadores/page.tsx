'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchGoleadores, type Goleador } from '../../redux/slices/jugadorSlice';

export default function GoleadoresPage() {
  const dispatch = useAppDispatch();
  const { goleadores, isLoading, error } = useAppSelector((state) => state.jugadores);

  useEffect(() => {
    dispatch(fetchGoleadores());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando goleadores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar goleadores</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchGoleadores())}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Top Goleadores
          </h1>
          <p className="text-xl text-gray-600">
            Los mejores goleadores de todos los torneos
          </p>
        </div>

        {/* Leaderboard */}
        {goleadores.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚽</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay goleadores registrados
            </h3>
            <p className="text-gray-600">
              Los goleadores aparecerán aquí cuando se registren partidos con goles.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 items-center font-semibold text-gray-900">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-2 text-center">Foto</div>
                <div className="col-span-4">Jugador</div>
                <div className="col-span-3">Equipo</div>
                <div className="col-span-2 text-center">Goles</div>
              </div>
            </div>

            {/* Players List */}
            <div className="divide-y divide-gray-200">
              {goleadores.map((goleador: Goleador, index: number) => (
                <div key={goleador.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Position */}
                    <div className="col-span-1 text-center">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                    </div>

                    {/* Photo */}
                    <div className="col-span-2 flex justify-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                        {goleador.foto ? (
                          <img 
                            src={goleador.foto} 
                            alt={`${goleador.nombre} ${goleador.apellido}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-xl">
                            👤
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Player Name */}
                    <div className="col-span-4">
                      <h3 className="font-semibold text-gray-900">
                        {goleador.nombre} {goleador.apellido}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {goleador.posicion}
                        {goleador.dorsal && (
                          <span className="ml-2 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                            #{goleador.dorsal}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Team */}
                    <div className="col-span-3">
                      <div className="flex items-center">
                        {goleador.equipo?.escudo && (
                          <img 
                            src={goleador.equipo.escudo} 
                            alt={goleador.equipo.nombre}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        )}
                        <span className="font-medium text-gray-900">
                          {goleador.equipo?.nombre || 'Sin equipo'}
                        </span>
                      </div>
                    </div>

                    {/* Goals */}
                    <div className="col-span-2 text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900 mr-1">
                          {goleador.totalGoles || goleador.goles || 0}
                        </span>
                        <span className="text-gray-600">⚽</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Actualizado en tiempo real • Total de goleadores: {goleadores.length}
              </p>
            </div>
          </div>
        )}

        {/* Additional Stats */}
        {goleadores.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="bg-white rounded-lg shadow-md p-6 text-center">
               <div className="text-3xl font-bold text-yellow-600 mb-2">
                 {Math.max(...goleadores.map((g: Goleador) => g.totalGoles || g.goles || 0))}
               </div>
               <p className="text-gray-600">Máximo de goles</p>
             </div>
             <div className="bg-white rounded-lg shadow-md p-6 text-center">
               <div className="text-3xl font-bold text-blue-600 mb-2">
                 {goleadores.reduce((total: number, g: Goleador) => total + (g.totalGoles || g.goles || 0), 0)}
               </div>
               <p className="text-gray-600">Total de goles</p>
             </div>
             <div className="bg-white rounded-lg shadow-md p-6 text-center">
               <div className="text-3xl font-bold text-green-600 mb-2">
                 {(goleadores.reduce((total: number, g: Goleador) => total + (g.totalGoles || g.goles || 0), 0) / goleadores.length).toFixed(1)}
               </div>
               <p className="text-gray-600">Promedio por jugador</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
} 