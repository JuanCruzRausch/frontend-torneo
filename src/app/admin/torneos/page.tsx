'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchTorneos, type Torneo } from '../../../redux/slices/torneoSlice';
import Link from 'next/link';

export default function AdminTorneosPage() {
  const dispatch = useAppDispatch();
  const { torneos, isLoading, error } = useAppSelector((state) => state.torneos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');

  useEffect(() => {
    dispatch(fetchTorneos());
  }, [dispatch]);

  // Filter tournaments based on search term and status
  const filteredTorneos = torneos.filter((torneo: Torneo) => {
    const matchesSearch = (torneo.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (torneo.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterEstado === 'todos' || torneo.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
            <li>›</li>
            <li><Link href="/admin" className="hover:text-blue-600">Admin</Link></li>
            <li>›</li>
            <li className="text-gray-900 font-medium">Torneos</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestión de Torneos
            </h1>
            <p className="text-gray-600">
              Administra todos los torneos del sistema
            </p>
          </div>
          <Link 
            href="/admin/torneos/crear"
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center"
          >
            <span className="mr-2">+</span>
            Crear Torneo
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500 text-white text-2xl mr-4">
                🏆
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Torneos</p>
                <p className="text-3xl font-bold text-gray-900">{torneos.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500 text-white text-2xl mr-4">
                ✅
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {torneos.filter((t: Torneo) => t.estado === 'activo').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500 text-white text-2xl mr-4">
                ⏳
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {torneos.filter((t: Torneo) => t.estado === 'pendiente').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-500 text-white text-2xl mr-4">
                🏁
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Finalizados</p>
                <p className="text-3xl font-bold text-gray-900">
                  {torneos.filter((t: Torneo) => t.estado === 'finalizado').length}
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
                Buscar tourneos
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o descripción..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:w-48">
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por estado
              </label>
              <select
                id="filter"
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="pendiente">Pendientes</option>
                <option value="finalizado">Finalizados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tournaments List */}
        {filteredTorneos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-6">🏆</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {searchTerm || filterEstado !== 'todos' ? 'No se encontraron torneos' : 'No hay torneos creados'}
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              {searchTerm || filterEstado !== 'todos' 
                ? 'Intenta ajustar los filtros de búsqueda.' 
                : 'Comienza creando tu primer torneo.'
              }
            </p>
            {(!searchTerm && filterEstado === 'todos') && (
              <Link 
                href="/admin/torneos/crear"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium inline-flex items-center"
              >
                <span className="mr-2">+</span>
                Crear Primer Torneo
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTorneos.map((torneo: Torneo) => (
              <div key={torneo._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {torneo.nombre || 'Sin nombre'}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {torneo.descripcion || 'Sin descripción'}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            torneo.estado === 'activo' ? 'bg-green-100 text-green-800' :
                            torneo.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            torneo.estado === 'finalizado' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {torneo.estado ? torneo.estado.charAt(0).toUpperCase() + torneo.estado.slice(1) : 'Sin estado'}
                          </span>
                                                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {torneo.formato || 'Sin formato'}
                            </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Fecha de Inicio</p>
                        <p className="font-semibold">
                          {torneo.fechaInicio ? new Date(torneo.fechaInicio).toLocaleDateString('es-ES') : 'Sin fecha'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Fecha de Fin</p>
                        <p className="font-semibold">
                          {torneo.fechaFin ? new Date(torneo.fechaFin).toLocaleDateString('es-ES') : 'Sin fecha'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Equipos</p>
                        <p className="font-semibold">{torneo.equipos?.length || 0} equipos</p>
                      </div>
                    </div>

                    {torneo.zonas && torneo.zonas.length > 0 && (
                      <div className="mt-4">
                        <p className="text-gray-600 text-sm mb-2">Zonas:</p>
                        <div className="flex flex-wrap gap-2">
                          {torneo.zonas.map((zona: any) => (
                            <span key={zona._id} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                              {zona.nombre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 text-sm text-gray-500">
                      <p>Creado por: {torneo.creadoPor?.nombreCompleto || torneo.creadoPor?.nombre || 'Usuario desconocido'}</p>
                      <p>Fecha de creación: {torneo.createdAt ? new Date(torneo.createdAt).toLocaleDateString('es-ES') : 'Sin fecha'}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 lg:mt-0 lg:ml-8 flex flex-col gap-3 lg:min-w-[200px]">
                    <Link 
                      href={`/admin/torneos/${torneo._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center font-medium"
                    >
                      Ver Torneo
                    </Link>
                    <Link 
                      href={`/admin/torneos/${torneo._id}/editar`}
                      className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors text-center font-medium"
                    >
                      Editar
                    </Link>
                    <Link 
                      href={`/torneos/${torneo._id}/equipos`}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-center font-medium"
                    >
                      Gestionar Equipos
                    </Link>
                    <Link 
                      href={`/torneos/${torneo._id}/fixture`}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-center font-medium"
                    >
                      Ver Fixture
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