'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTorneos, type Torneo } from '../../redux/slices/torneoSlice';
import Link from 'next/link';

export default function TorneosPage() {
  const dispatch = useAppDispatch();
  const { torneos, isLoading, error } = useAppSelector((state) => state.torneos);

  useEffect(() => {
    dispatch(fetchTorneos());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando torneos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar torneos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchTorneos())}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Torneos de Fútbol
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre todos los torneos disponibles, equipos participantes y resultados en tiempo real.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Filtrar por estado:</span>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todos</option>
                  <option value="planificado">Planificado</option>
                  <option value="en_curso">En Curso</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {torneos.length} torneo{torneos.length !== 1 ? 's' : ''} encontrado{torneos.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Tournaments Grid */}
        {torneos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚽</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay torneos disponibles</h3>
            <p className="text-gray-600">Pronto tendremos torneos emocionantes para ti.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {torneos.map((torneo: Torneo) => (
              <div key={torneo.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                {/* Tournament Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 truncate">{torneo.nombre}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      torneo.estado === 'en_curso' ? 'bg-green-100 text-green-800' :
                      torneo.estado === 'planificado' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {torneo.estado === 'en_curso' ? 'EN CURSO' :
                       torneo.estado === 'planificado' ? 'PRÓXIMO' : 'FINALIZADO'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{torneo.descripcion}</p>
                </div>

                {/* Tournament Info */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📅</span>
                    <span>Inicio: {new Date(torneo.fechaInicio).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">🏁</span>
                    <span>Fin: {new Date(torneo.fechaFin).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">👥</span>
                    <span>Máximo {torneo.maxEquipos} equipos</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 space-y-2">
                  <Link 
                    href={`/torneos/${torneo.id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Ver Detalles
                  </Link>
                  <div className="grid grid-cols-3 gap-2">
                    <Link 
                      href={`/torneos/${torneo.id}/equipos`}
                      className="text-center text-sm bg-gray-100 text-gray-700 py-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      Equipos
                    </Link>
                    <Link 
                      href={`/torneos/${torneo.id}/tabla`}
                      className="text-center text-sm bg-gray-100 text-gray-700 py-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      Tabla
                    </Link>
                    <Link 
                      href={`/torneos/${torneo.id}/fixture`}
                      className="text-center text-sm bg-gray-100 text-gray-700 py-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      Fixture
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 