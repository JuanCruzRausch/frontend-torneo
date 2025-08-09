'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchEquipos, type Equipo } from '../../../redux/slices/equipoSlice';
import { fetchTorneos } from '../../../redux/slices/torneoSlice';
import Link from 'next/link';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function AdminEquiposPage() {
  const dispatch = useAppDispatch();
  const { equipos, isLoading, error } = useAppSelector((state) => state.equipos);
  const { torneos } = useAppSelector((state) => state.torneos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTorneo, setFilterTorneo] = useState('todos');

  useEffect(() => {
    dispatch(fetchEquipos());
    dispatch(fetchTorneos());
  }, [dispatch]);

  // Filter teams based on search term and tournament
  const filteredEquipos = equipos.filter((equipo: Equipo) => {
    const matchesSearch = (equipo.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterTorneo === 'todos' || 
      (typeof equipo.torneoId === 'object' ? equipo.torneoId._id === filterTorneo : equipo.torneoId === filterTorneo);
    return matchesSearch && matchesFilter;
  });

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
            onClick={() => dispatch(fetchEquipos())}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
            <li>›</li>
            <li><Link href="/admin" className="hover:text-blue-600">Admin</Link></li>
            <li>›</li>
            <li className="text-gray-900 font-medium">Equipos</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestión de Equipos
            </h1>
            <p className="text-gray-600">
              Administra todos los equipos del sistema
            </p>
          </div>
          <Link 
            href="/admin/equipos/crear"
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center"
          >
            <span className="mr-2">+</span>
            Crear Equipo
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500 text-white text-2xl mr-4">
                👥
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Equipos</p>
                <p className="text-3xl font-bold text-gray-900">{equipos.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500 text-white text-2xl mr-4">
                🏆
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Torneos Activos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {torneos.filter((t: any) => t.estado === 'activo').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500 text-white text-2xl mr-4">
                👤
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jugadores</p>
                <p className="text-3xl font-bold text-gray-900">
                  {equipos.reduce((total: number, equipo: Equipo) => 
                    total + (equipo.jugadores?.length || 0), 0
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500 text-white text-2xl mr-4">
                ⚽
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Goles</p>
                <p className="text-3xl font-bold text-gray-900">
                  {equipos.reduce((total: number, equipo: Equipo) => 
                    total + (equipo.golesAFavor || 0), 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar equipos
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre del equipo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:w-64">
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por torneo
              </label>
              <select
                id="filter"
                value={filterTorneo}
                onChange={(e) => setFilterTorneo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos los torneos</option>
                {torneos.map((torneo: any) => (
                  <option key={torneo._id} value={torneo._id}>
                    {torneo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Teams List */}
        {filteredEquipos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-6">👥</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {searchTerm || filterTorneo !== 'todos' ? 'No se encontraron equipos' : 'No hay equipos registrados'}
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              {searchTerm || filterTorneo !== 'todos' 
                ? 'Intenta ajustar los filtros de búsqueda.' 
                : 'Comienza creando tu primer equipo.'
              }
            </p>
            {(!searchTerm && filterTorneo === 'todos') && (
              <Link 
                href="/admin/equipos/crear"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium inline-flex items-center"
              >
                <span className="mr-2">+</span>
                Crear Primer Equipo
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEquipos.map((equipo: Equipo) => (
              <div key={equipo._id || equipo.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                        {(equipo.nombre || 'E').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {equipo.nombre || 'Sin nombre'}
                        </h3>
                        <p className="text-gray-600">
                          {typeof equipo.torneoId === 'object' 
                            ? equipo.torneoId.nombre 
                            : 'Torneo no especificado'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-600">Jugadores</p>
                        <p className="font-semibold">{equipo.jugadores?.length || 0} jugadores</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Puntos</p>
                        <p className="font-semibold">{equipo.puntos || 0} pts</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Goles a Favor</p>
                        <p className="font-semibold text-green-600">{equipo.golesAFavor || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Goles en Contra</p>
                        <p className="font-semibold text-red-600">{equipo.golesEnContra || 0}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Diferencia: {equipo.diferenciaGoles > 0 ? '+' : ''}{equipo.diferenciaGoles || 0}
                      </span>
                      {equipo.color && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {equipo.color}
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>Registrado: {equipo.createdAt ? new Date(equipo.createdAt).toLocaleDateString('es-ES') : 'Sin fecha'}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 lg:mt-0 lg:ml-8 flex flex-col gap-3 lg:min-w-[200px]">
                    <Link 
                      href={`/equipos/${equipo._id || equipo.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center font-medium"
                    >
                      Ver Equipo
                    </Link>
                    <Link 
                      href={`/admin/equipos/${equipo._id || equipo.id}/editar`}
                      className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors text-center font-medium"
                    >
                      Editar
                    </Link>
                    <Link 
                      href={`/equipos/${equipo._id || equipo.id}`}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-center font-medium"
                    >
                      Gestionar Jugadores
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
} 