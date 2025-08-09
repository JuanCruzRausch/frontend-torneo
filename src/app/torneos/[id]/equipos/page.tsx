'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchTorneoById } from '../../../../redux/slices/torneoSlice';

export default function TorneoEquiposPage() {
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
          <p className="mt-4 text-gray-600">Cargando equipos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar equipos</h2>
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
            <li className="text-gray-900 font-medium">Equipos</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Equipos Participantes</h1>
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
                className="border-b-2 border-blue-500 text-blue-600 py-4 px-1 text-sm font-medium"
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
                className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 text-sm font-medium"
              >
                Fixture
              </Link>
            </nav>
          </div>
        </div>

        {/* Teams Grid */}
        {equipos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay equipos registrados
            </h3>
            <p className="text-gray-600">
              Este torneo aún no tiene equipos participantes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {equipos.map((equipo: any, index: number) => (
              <div key={equipo._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                {/* Team Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold">
                      {equipo.nombre.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold truncate">{equipo.nombre}</h3>
                  <p className="text-blue-100 text-sm mt-1">Equipo #{index + 1}</p>
                </div>

                {/* Team Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{equipo.puntos || 0}</p>
                      <p className="text-xs text-gray-600">Puntos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{equipo.diferenciaGoles || 0}</p>
                      <p className="text-xs text-gray-600">Diferencia</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center bg-gray-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">{equipo.golesAFavor || 0}</p>
                      <p className="text-gray-600 text-xs">GF</p>
                    </div>
                    <div className="text-center bg-gray-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">{equipo.golesEnContra || 0}</p>
                      <p className="text-gray-600 text-xs">GC</p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-4">
                    <Link 
                      href={`/equipos/${equipo._id}`}
                      className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Ver Detalle
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tournament Summary */}
        {equipos.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del Torneo</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{equipos.length}</div>
                <p className="text-gray-600">Equipos</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {equipos.reduce((total: number, equipo: any) => total + (equipo.golesAFavor || 0), 0)}
                </div>
                <p className="text-gray-600">Total Goles</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {Math.max(...equipos.map((equipo: any) => equipo.puntos || 0))}
                </div>
                <p className="text-gray-600">Máx. Puntos</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {torneo.zonas?.length || 0}
                </div>
                <p className="text-gray-600">Zonas</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 