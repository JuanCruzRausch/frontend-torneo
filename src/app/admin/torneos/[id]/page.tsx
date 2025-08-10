'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchTorneoById } from '../../../../redux/slices/torneoSlice';

export default function TorneoAdminPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { selectedTorneo: torneo, isLoading } = useAppSelector((state) => state.torneos);

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
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!torneo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Torneo no encontrado</h2>
          <Link 
            href="/admin/torneos"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver a Torneos
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
            <li><Link href="/admin" className="hover:text-blue-600">Admin</Link></li>
            <li>›</li>
            <li><Link href="/admin/torneos" className="hover:text-blue-600">Torneos</Link></li>
            <li>›</li>
            <li className="text-gray-900 font-medium">{torneo.nombre}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{torneo.nombre}</h1>
              <p className="text-gray-600 text-lg">Panel de Administración del Torneo</p>
              {torneo.descripcion && (
                <p className="text-gray-500 mt-2">{torneo.descripcion}</p>
              )}
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/admin/torneos"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Volver a Torneos
              </Link>
              <Link 
                href={`/admin/torneos/${torneo._id}/editar`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Editar Torneo
              </Link>
            </div>
          </div>
        </div>

        {/* Funcionalidades del Torneo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gestión de Zonas */}
          <Link href={`/admin/torneos/${torneo._id}/zonas`}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Zonas</h3>
                <p className="text-gray-600 text-sm">Crear, editar y administrar zonas del torneo</p>
                <div className="mt-3 text-blue-600 font-medium">
                  {torneo.zonas?.length || 0} zona{(torneo.zonas?.length || 0) !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </Link>

          {/* Gestión de Equipos */}
          <Link href="/admin/equipos">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Equipos</h3>
                <p className="text-gray-600 text-sm">Administrar equipos y jugadores</p>
                <div className="mt-3 text-green-600 font-medium">
                  {torneo.equipos?.length || 0} equipo{(torneo.equipos?.length || 0) !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </Link>

          {/* Fixture */}
          <Link href={`/torneos/${torneo._id}/fixture`}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fixture</h3>
                <p className="text-gray-600 text-sm">Ver calendario de partidos</p>
                <div className="mt-3 text-purple-600 font-medium">
                  Ver Fixture
                </div>
              </div>
            </div>
          </Link>

          {/* Estadísticas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Estadísticas</h3>
              <p className="text-gray-600 text-sm">Análisis y reportes del torneo</p>
              <div className="mt-3 text-yellow-600 font-medium">
                Próximamente
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuración</h3>
              <p className="text-gray-600 text-sm">Ajustes avanzados del torneo</p>
              <div className="mt-3 text-gray-600 font-medium">
                Próximamente
              </div>
            </div>
          </div>

          {/* Vista Pública */}
          <Link href={`/torneos/${torneo._id}`}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                  <span className="text-2xl">👁️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Vista Pública</h3>
                <p className="text-gray-600 text-sm">Ver como lo ven los usuarios</p>
                <div className="mt-3 text-indigo-600 font-medium">
                  Ver Torneo
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Información del Torneo */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Torneo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">ID del Torneo</span>
              <p className="text-sm text-gray-900 font-mono">{torneo._id}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Estado</span>
              <p className="text-sm text-gray-900">{torneo.estado || 'Activo'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Fecha de Creación</span>
              <p className="text-sm text-gray-900">
                {torneo.createdAt ? new Date(torneo.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Última Actualización</span>
              <p className="text-sm text-gray-900">
                {torneo.updatedAt ? new Date(torneo.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 