'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { fetchTorneoById } from '../../../../../redux/slices/torneoSlice';

interface Equipo {
  _id: string;
  nombre: string;
  escudoUrl?: string;
  puntos: number;
  golesAFavor: number;
  golesEnContra: number;
  diferenciaGoles: number;
}

interface Zona {
  _id: string;
  nombre: string;
  descripcion?: string;
  torneoId: {
    _id: string;
    nombre: string;
  };
  equipos: Equipo[];
  partidos: Array<{
    _id: string;
    fecha: string;
    equipoLocal: string;
    equipoVisitante: string;
    golesLocal?: number;
    golesVisitante?: number;
  }>;
}

export default function ZonasAdminPage() {
  const params = useParams();

  const dispatch = useAppDispatch();
  const { selectedTorneo: torneo, isLoading: loadingTorneo } = useAppSelector((state) => state.torneos);
  
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchZonas = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/api/zonas/torneo/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setZonas(data.data);
      } else {
        setError('Error al cargar las zonas');
      }
    } catch (error) {
      console.error('Error fetching zonas:', error);
      setError('Error de conexión al cargar las zonas');
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchTorneoById(params.id as string));
      fetchZonas();
    }
  }, [dispatch, params.id, fetchZonas]);

  const handleDeleteZona = async (zonaId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta zona? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No tienes autorización para eliminar zonas');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/zonas/${zonaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Recargar las zonas
        fetchZonas();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al eliminar la zona');
      }
    } catch (error) {
      console.error('Error deleting zona:', error);
      setError('Error de conexión al eliminar la zona');
    }
  };

  if (loadingTorneo || isLoading) {
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
            <li><Link href={`/admin/torneos/${torneo._id}`} className="hover:text-blue-600">{torneo.nombre}</Link></li>
            <li>›</li>
            <li className="text-gray-900 font-medium">Zonas</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Administrar Zonas</h1>
              <p className="text-gray-600 text-lg">Torneo: {torneo.nombre}</p>
              <p className="text-gray-500 text-sm">Gestiona las zonas y equipos del torneo</p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href={`/admin/torneos/${torneo._id}`}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Volver al Torneo
              </Link>
              <Link 
                href={`/admin/torneos/${torneo._id}/zonas/crear`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Crear Nueva Zona
              </Link>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Zonas */}
        {zonas.length > 0 ? (
          <div className="space-y-6">
            {zonas.map((zona) => (
              <div key={zona._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header de la Zona */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">{zona.nombre}</h2>
                      {zona.descripcion && (
                        <p className="text-blue-100 text-sm mt-1">{zona.descripcion}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/torneos/${torneo._id}/zonas/${zona._id}/editar`}
                        className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-md hover:bg-opacity-30 transition-colors text-sm"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteZona(zona._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabla de Posiciones */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tabla de Posiciones</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pos
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Equipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            PJ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pts
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            GF
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            GC
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DG
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {zona.equipos
                          .sort((a, b) => b.puntos - a.puntos || b.diferenciaGoles - a.diferenciaGoles)
                          .map((equipo, index) => (
                            <tr key={equipo._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {equipo.escudoUrl ? (
                                    <img
                                      src={equipo.escudoUrl}
                                      alt={`Escudo de ${equipo.nombre}`}
                                      className="w-8 h-8 rounded-full mr-3"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                                      {equipo.nombre.charAt(0)}
                                    </div>
                                  )}
                                  <span className="text-sm font-medium text-gray-900">{equipo.nombre}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {/* Aquí podrías mostrar partidos jugados si tienes esa información */}
                                -
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                {equipo.puntos}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {equipo.golesAFavor}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {equipo.golesEnContra}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {equipo.diferenciaGoles}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay zonas creadas</h3>
            <p className="text-gray-600 mb-6">Comienza creando la primera zona para organizar los equipos del torneo.</p>
            <Link
              href={`/admin/torneos/${torneo._id}/zonas/crear`}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Crear Primera Zona
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 