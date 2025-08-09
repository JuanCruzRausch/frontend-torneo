'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchTorneos, type Torneo } from '../redux/slices/torneoSlice';

export default function Home() {
  const dispatch = useAppDispatch();
  const { torneos, isLoading } = useAppSelector((state) => state.torneos);

  useEffect(() => {
    dispatch(fetchTorneos());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Gestión de Torneos
            <span className="block text-blue-600">de Fútbol</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma completa para la gestión y seguimiento de torneos de fútbol. 
            Equipos, partidos, resultados y estadísticas en tiempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/torneos"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver Torneos
            </Link>
            <Link 
              href="/goleadores"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Top Goleadores
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Torneos Destacados
          </h2>
          
          {isLoading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Cargando torneos...</p>
            </div>
          ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {torneos.slice(0, 6).map((torneo: Torneo) => (
                <div key={torneo.id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{torneo.nombre}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      torneo.estado === 'en_curso' ? 'bg-green-100 text-green-800' :
                      torneo.estado === 'planificado' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {torneo.estado.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{torneo.descripcion}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>📅 {new Date(torneo.fechaInicio).toLocaleDateString()}</span>
                    <span>👥 Max: {torneo.maxEquipos} equipos</span>
                  </div>
                  <Link 
                    href={`/torneos/${torneo.id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Ver Detalles
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && torneos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚽</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay torneos disponibles</h3>
              <p className="text-gray-600">Pronto tendremos torneos emocionantes para ti.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Torneos</h3>
              <p className="text-gray-600">Crea y administra torneos completos con todas sus configuraciones.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Equipos y Jugadores</h3>
              <p className="text-gray-600">Registra equipos, jugadores y toda su información detallada.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Estadísticas</h3>
              <p className="text-gray-600">Consulta goleadores, tablas de posiciones y estadísticas completas.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚽</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Resultados en Vivo</h3>
              <p className="text-gray-600">Actualiza resultados y sigue los partidos en tiempo real.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
