'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchTorneoById } from '../../../../redux/slices/torneoSlice';
import { fetchPartidosByTorneo, Partido } from '../../../../redux/slices/partidoSlice';

export default function TorneoFixturePage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { selectedTorneo: torneo, isLoading: torneoLoading, error: torneoError } = useAppSelector((state) => state.torneos);
  const { partidosByTorneo: partidos, isLoading: partidosLoading, error: partidosError } = useAppSelector((state) => state.partidos);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchTorneoById(params.id as string));
      dispatch(fetchPartidosByTorneo(params.id as string));
    }
  }, [dispatch, params.id]);

  const isLoading = torneoLoading || partidosLoading;
  const error = torneoError || partidosError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando fixture...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar fixture</h2>
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
            <li className="text-gray-900 font-medium">Fixture</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Fixture del Torneo</h1>
              <p className="text-gray-600">
                {torneo.nombre} • Calendario de partidos
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
                className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium"
              >
                Tabla de Posiciones
              </Link>
              <Link 
                href={`/torneos/${torneo._id}/fixture`}
                className="border-b-2 border-blue-500 text-blue-600 py-4 px-1 text-sm font-medium"
              >
                Fixture
              </Link>
            </nav>
          </div>
        </div>

        {/* Fixture Content */}
        {partidos && partidos.length > 0 ? (
          <div className="space-y-6">
            {/* Tournament Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{partidos.length}</p>
                  <p className="text-gray-600">Total de Partidos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {partidos.filter((p: Partido) => p.estado === 'jugado').length}
                  </p>
                  <p className="text-gray-600">Partidos Jugados</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {partidos.filter((p: Partido) => p.estado === 'programado').length}
                  </p>
                  <p className="text-gray-600">Partidos Pendientes</p>
                </div>
              </div>
            </div>

            {/* Matches Grid */}
            <div className="grid gap-4">
              {(() => {
                // Ordenar partidos por fecha, horario y cancha
                const partidosOrdenados = [...partidos].sort((a, b) => {
                  // Primero por fecha
                  const fechaA = new Date(a.fecha);
                  const fechaB = new Date(b.fecha);
                  if (fechaA.getTime() !== fechaB.getTime()) {
                    return fechaA.getTime() - fechaB.getTime();
                  }
                  
                  // Luego por horario
                  if (a.horario !== b.horario) {
                    return a.horario.localeCompare(b.horario);
                  }
                  
                  // Finalmente por cancha
                  return a.cancha.localeCompare(b.cancha);
                });

                return partidosOrdenados.map((partido: Partido) => (
                  <div key={partido._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Match Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              partido.estado === 'jugado' 
                                ? 'bg-green-100 text-green-800' 
                                : partido.estado === 'programado'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {partido.estado === 'jugado' ? 'Finalizado' : 
                               partido.estado === 'programado' ? 'Programado' : partido.estado}
                            </span>
                            {partido.zonaId && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {partido.zonaId.nombre}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Teams and Score */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          {/* Local Team */}
                          <div className="text-center md:text-right">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {partido.equipoLocal.nombre}
                            </h3>
                          </div>

                          {/* Score */}
                          <div className="text-center">
                            {partido.estado === 'jugado' ? (
                              <div className="text-3xl font-bold text-gray-900">
                                {partido.golesLocal} - {partido.golesVisitante}
                              </div>
                            ) : (
                              <div className="text-lg text-gray-500">VS</div>
                            )}
                          </div>

                          {/* Visiting Team */}
                          <div className="text-center md:text-left">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {partido.equipoVisitante.nombre}
                            </h3>
                          </div>
                        </div>

                        {/* Goal Details */}
                        {partido.estado === 'jugado' && (partido.golesLocalDetalle.length > 0 || partido.golesVisitanteDetalle.length > 0) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Local Goals */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Goles {partido.equipoLocal.nombre}:
                                </h4>
                                <div className="space-y-1">
                                  {partido.golesLocalDetalle.map((gol, index) => (
                                    <p key={index} className="text-sm text-gray-600">
                                      {gol.jugadorId.nombreCompleto} ({gol.minuto}')
                                    </p>
                                  ))}
                                </div>
                              </div>

                              {/* Visiting Goals */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Goles {partido.equipoVisitante.nombre}:
                                </h4>
                                <div className="space-y-1">
                                  {partido.golesVisitanteDetalle.map((gol, index) => (
                                    <p key={index} className="text-sm text-gray-600">
                                      {gol.jugadorId.nombreCompleto} ({gol.minuto}')
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Match Details */}
                      <div className="lg:ml-8 lg:min-w-[200px]">
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Fecha</p>
                            <p className="font-medium">
                              {new Date(partido.fecha).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Horario</p>
                            <p className="font-medium">{partido.horario}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Cancha</p>
                            <p className="font-medium">{partido.cancha}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Fase</p>
                            <p className="font-medium capitalize">{partido.fase}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-6">📅</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No hay partidos programados
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Aún no se han programado partidos para este torneo.
            </p>
            
            {/* Quick Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={`/torneos/${torneo._id}/equipos`}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Ver Equipos
              </Link>
              <Link 
                href={`/torneos/${torneo._id}/tabla`}
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors font-medium"
              >
                Ver Tabla
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 