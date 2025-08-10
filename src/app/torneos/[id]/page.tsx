'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchTorneoById, type Torneo } from '../../../redux/slices/torneoSlice';

export default function TorneoDetailPage() {
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
          <p className="mt-4 text-gray-600">Cargando torneo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar torneo</h2>
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
          <p className="text-gray-600 mb-4">El torneo que buscas no existe o ha sido eliminado.</p>
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
            <li className="text-gray-900 font-medium">{torneo.nombre}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{torneo.nombre}</h1>
              <p className="text-gray-600 text-lg">{torneo.descripcion}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              torneo.estado === 'activo' ? 'bg-green-100 text-green-800' :
              torneo.estado === 'inactivo' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {torneo.estado === 'activo' ? 'ACTIVO' :
               torneo.estado === 'inactivo' ? 'INACTIVO' : 'FINALIZADO'}
            </span>
          </div>

          {/* Tournament Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📅</span>
              <div>
                <p className="text-sm text-gray-600">Fecha de Inicio</p>
                <p className="font-semibold">{new Date(torneo.fechaInicio).toLocaleDateString('es-ES')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-3">🏁</span>
              <div>
                <p className="text-sm text-gray-600">Fecha de Fin</p>
                <p className="font-semibold">{new Date(torneo.fechaFin).toLocaleDateString('es-ES')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-3">👥</span>
              <div>
                <p className="text-sm text-gray-600">Equipos Participantes</p>
                <p className="font-semibold">{torneo.equipos?.length || 0} equipos</p>
              </div>
            </div>
          </div>

          {torneo.formato && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚽</span>
                <div>
                  <p className="text-sm text-gray-600">Formato</p>
                  <p className="font-semibold">{torneo.formato}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href={`/torneos/${torneo._id}/equipos`}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Equipos</h3>
                <p className="text-gray-600 text-sm">Ver todos los equipos participantes</p>
                <div className="mt-3 text-blue-600 font-medium">
                  {torneo.equipos?.length || 0} equipos
                </div>
              </div>
            </div>
          </Link>

          <Link href={`/torneos/${torneo._id}/tabla`}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tabla de Posiciones</h3>
                <p className="text-gray-600 text-sm">Posiciones y estadísticas</p>
                <div className="mt-3 text-green-600 font-medium">
                  {torneo.zonas?.length || 0} zona{(torneo.zonas?.length || 0) !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </Link>

          <Link href={`/torneos/${torneo._id}/fixture`}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fixture</h3>
                <p className="text-gray-600 text-sm">Calendario de partidos</p>
                <div className="mt-3 text-yellow-600 font-medium">
                  Ver fechas
                </div>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Estadísticas</h3>
              <p className="text-gray-600 text-sm">Datos del torneo</p>
              <div className="mt-3 text-purple-600 font-medium text-sm">
                Creado: {new Date(torneo.createdAt).toLocaleDateString('es-ES')}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Equipos Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Equipos Participantes</h2>
              <Link href={`/torneos/${torneo._id}/equipos`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todos
              </Link>
            </div>

            {torneo.equipos && torneo.equipos.length > 0 ? (
              <div className="space-y-3">
                {torneo.equipos.slice(0, 5).map((equipo: any) => (
                  <div key={equipo._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                      <span className="font-medium text-gray-900">{equipo.nombre}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {equipo.puntos || 0} pts
                    </div>
                  </div>
                ))}
                {torneo.equipos.length > 5 && (
                  <div className="text-center text-gray-500 text-sm">
                    +{torneo.equipos.length - 5} equipos más
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">👥</div>
                <p className="text-gray-600">No hay equipos registrados aún</p>
              </div>
            )}
          </div>

          {/* Tournament Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información del Torneo</h2>
            
            <div className="space-y-4">
              {torneo.creadoPor && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Organizado por</p>
                  <p className="text-gray-900">{torneo.creadoPor.nombreCompleto || torneo.creadoPor.nombre}</p>
                </div>
              )}

              {torneo.formato && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Formato</p>
                  <p className="text-gray-900">{torneo.formato}</p>
                </div>
              )}

              {torneo.zonas && torneo.zonas.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Zonas</p>
                  <div className="space-y-1">
                    {torneo.zonas.map((zona: any) => (
                      <div key={zona._id} className="bg-gray-50 px-3 py-2 rounded text-sm">
                        {zona.nombre}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-600">Última actualización</p>
                <p className="text-gray-900">{new Date(torneo.updatedAt).toLocaleDateString('es-ES')}</p>
              </div>
            </div>

            {torneo.reglamento && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-2">Reglamento</p>
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 max-h-32 overflow-y-auto">
                  {torneo.reglamento}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 