'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchTorneoById } from '../../../../redux/slices/torneoSlice';

export default function TorneoTablaPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { selectedTorneo: torneo, isLoading, error } = useAppSelector((state) => state.torneos);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchTorneoById(params.id as string));
    }
  }, [dispatch, params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando tabla...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar tabla</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchTorneoById(params.id as string))}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!torneo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Torneo no encontrado</h2>
          <Link 
            href="/torneos"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Ver Todos los Torneos
          </Link>
        </div>
      </div>
    );
  }

  const equipos = torneo.equipos || [];
  // Ordenar equipos por puntos (descendente), luego por diferencia de goles (descendente)
  const equiposOrdenados = [...equipos].sort((a: any, b: any) => {
    const puntosA = a.puntos || 0;
    const puntosB = b.puntos || 0;
    const difA = a.diferenciaGoles || 0;
    const difB = b.diferenciaGoles || 0;
    
    if (puntosA !== puntosB) {
      return puntosB - puntosA; // Más puntos primero
    }
    return difB - difA; // Mejor diferencia de goles si tienen mismos puntos
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
            <li>›</li>
            <li><Link href="/torneos" className="hover:text-blue-600">Torneos</Link></li>
            <li>›</li>
            <li><Link href={`/torneos/${torneo._id}`} className="hover:text-blue-600">{torneo.nombre}</Link></li>
            <li>›</li>
            <li className="text-gray-900 font-medium">Tabla de Posiciones</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tabla de Posiciones</h1>
              <p className="text-gray-600">
                {torneo.nombre} • {equipos.length} equipo{equipos.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Link 
              href={`/torneos/${torneo._id}`}
              className="mt-4 md:mt-0 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              ← Volver al Torneo
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <Link 
                href={`/torneos/${torneo._id}/equipos`}
                className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium"
              >
                Equipos
              </Link>
              <Link 
                href={`/torneos/${torneo._id}/tabla`}
                className="border-b-2 border-blue-500 text-blue-600 py-4 px-1 text-sm font-medium"
              >
                Tabla de Posiciones
              </Link>
              <Link 
                href={`/torneos/${torneo._id}/fixture`}
                className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium"
              >
                Fixture
              </Link>
            </nav>
          </div>
        </div>

        {/* Standings Table */}
        {equipos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay datos de tabla
            </h3>
            <p className="text-gray-600">
              Este torneo aún no tiene equipos o resultados registrados.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-2 items-center font-semibold text-gray-900 text-sm">
                <div className="col-span-1 text-center">Pos</div>
                <div className="col-span-4">Equipo</div>
                <div className="col-span-1 text-center">Pts</div>
                <div className="col-span-1 text-center">PJ</div>
                <div className="col-span-1 text-center">GF</div>
                <div className="col-span-1 text-center">GC</div>
                <div className="col-span-1 text-center">DG</div>
                <div className="col-span-2 text-center">Estado</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {equiposOrdenados.map((equipo: any, index: number) => (
                <div key={equipo._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-2 items-center">
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

                    {/* Team Name */}
                    <div className="col-span-4">
                      <div className="flex items-center">
                        {/* Mostrar escudo si existe, sino mostrar iniciales */}
                        {equipo.escudoUrl ? (
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-3 border border-gray-200">
                            <img 
                              src={equipo.escudoUrl} 
                              alt={`Escudo de ${equipo.nombre}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback a iniciales si la imagen falla
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold hidden">
                              {equipo.nombre.charAt(0)}
                            </div>
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                            {equipo.nombre.charAt(0)}
                          </div>
                        )}
                        <div>
                          <Link 
                            href={`/equipos/${equipo._id}`}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {equipo.nombre}
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="col-span-1 text-center">
                      <span className="font-bold text-lg text-blue-600">{equipo.puntos || 0}</span>
                    </div>

                    {/* Matches Played */}
                    <div className="col-span-1 text-center">
                      <span className="text-gray-900">-</span>
                    </div>

                    {/* Goals For */}
                    <div className="col-span-1 text-center">
                      <span className="text-green-600 font-medium">{Math.abs(equipo.golesAFavor || 0)}</span>
                    </div>

                    {/* Goals Against */}
                    <div className="col-span-1 text-center">
                      <span className="text-red-600 font-medium">{Math.abs(equipo.golesEnContra || 0)}</span>
                    </div>

                    {/* Goal Difference */}
                    <div className="col-span-1 text-center">
                      <span className={`font-medium ${
                        (equipo.diferenciaGoles || 0) > 0 ? 'text-green-600' :
                        (equipo.diferenciaGoles || 0) < 0 ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {equipo.diferenciaGoles > 0 ? '+' : ''}{equipo.diferenciaGoles || 0}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        index === 0 ? 'bg-green-100 text-green-800' :
                        index < 4 ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {index === 0 ? 'Líder' :
                         index < 4 ? 'Clasificado' : 'Regular'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
                  <span>Líder</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
                  <span>Clasificación</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
                  <span>Regular</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                PJ: Partidos Jugados • GF: Goles a Favor • GC: Goles en Contra • DG: Diferencia de Goles
              </p>
            </div>
          </div>
        )}

        {/* Statistics */}
        {equipos.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {equiposOrdenados[0]?.nombre || 'N/A'}
              </div>
              <p className="text-gray-600">Líder Actual</p>
              <p className="text-sm text-gray-500 mt-1">
                {equiposOrdenados[0]?.puntos || 0} puntos
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {equipos.reduce((total: number, equipo: any) => total + Math.abs(equipo.golesAFavor || 0), 0)}
              </div>
              <p className="text-gray-600">Total Goles</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {Math.max(...equipos.map((equipo: any) => equipo.puntos || 0))}
              </div>
              <p className="text-gray-600">Máx. Puntos</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.max(...equipos.map((equipo: any) => Math.abs(equipo.diferenciaGoles || 0)))}
              </div>
              <p className="text-gray-600">Mejor Diferencia</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 