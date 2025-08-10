'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchTorneoById } from '../../../../redux/slices/torneoSlice';

interface Equipo {
  _id: string;
  nombre: string;
  jugadores: Array<{
    _id: string;
    nombre: string;
    apellido: string;
    nombreCompleto: string;
  }>;
  puntos: number;
  golesAFavor: number;
  golesEnContra: number;
  diferenciaGoles: number;
}

interface Zona {
  _id: string;
  nombre: string;
  torneoId: {
    _id: string;
    nombre: string;
  };
  equipos: Equipo[];
  partidos: any[];
}

interface TablaPosicion {
  equipoId: string;
  equipoNombre: string;
  puntos: number;
  partidosJugados: number;
  partidosGanados: number;
  partidosEmpatados: number;
  partidosPerdidos: number;
  golesAFavor: number;
  golesEnContra: number;
  diferenciaGoles: number;
  posicion: number;
}

interface ZonasResponse {
  success: boolean;
  torneoId: string;
  torneoNombre: string;
  count: number;
  data: Zona[];
}

interface TablaResponse {
  success: boolean;
  zonaId: string;
  zonaNombre: string;
  count: number;
  data: TablaPosicion[];
}

export default function ZonasPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { selectedTorneo: torneo, isLoading, error } = useAppSelector((state) => state.torneos);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [tablas, setTablas] = useState<Record<string, TablaPosicion[]>>({});
  const [loadingZonas, setLoadingZonas] = useState(true);
  const [loadingTablas, setLoadingTablas] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (params.id) {
      dispatch(fetchTorneoById(params.id as string));
      fetchZonas();
    }
  }, [dispatch, params.id]);

  const fetchZonas = async () => {
    try {
      setLoadingZonas(true);
      const response = await fetch(`http://localhost:8080/api/zonas/torneo/${params.id}`);
      if (response.ok) {
        const data: ZonasResponse = await response.json();
        setZonas(data.data);
        
        // Cargar las tablas de posiciones para cada zona
        data.data.forEach(zona => {
          fetchTablaZona(zona._id);
        });
      }
    } catch (error) {
      console.error('Error fetching zonas:', error);
    } finally {
      setLoadingZonas(false);
    }
  };

  const fetchTablaZona = async (zonaId: string) => {
    try {
      setLoadingTablas(prev => ({ ...prev, [zonaId]: true }));
      const response = await fetch(`http://localhost:8080/api/zonas/${zonaId}/tabla`);
      if (response.ok) {
        const data: TablaResponse = await response.json();
        setTablas(prev => ({ ...prev, [zonaId]: data.data }));
      }
    } catch (error) {
      console.error('Error fetching tabla zona:', error);
    } finally {
      setLoadingTablas(prev => ({ ...prev, [zonaId]: false }));
    }
  };

  if (isLoading || loadingZonas) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando zonas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar zonas</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchZonas}
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
            <li><Link href={`/torneos/${torneo._id}`} className="hover:text-blue-600">{torneo.nombre}</Link></li>
            <li>›</li>
            <li className="text-gray-900 font-medium">Zonas</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Zonas del Torneo</h1>
              <p className="text-gray-600 text-lg">{torneo.nombre}</p>
            </div>
            <Link 
              href={`/torneos/${torneo._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Volver al Torneo
            </Link>
          </div>
        </div>

        {/* Zonas */}
        {zonas.length > 0 ? (
          <div className="space-y-8">
            {zonas.map((zona) => (
              <div key={zona._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header de la Zona */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">{zona.nombre}</h2>
                  <p className="text-blue-100">{zona.equipos.length} equipos</p>
                </div>

                {/* Tabla de Posiciones */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tabla de Posiciones</h3>
                  
                  {loadingTablas[zona._id] ? (
                    <div className="flex justify-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : tablas[zona._id] ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PJ</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PG</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PE</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PP</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GF</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GC</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">DG</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {tablas[zona._id].map((equipo, index) => (
                            <tr key={equipo.equipoId} className={index < 3 ? 'bg-green-50' : ''}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {equipo.posicion}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Link 
                                  href={`/equipos/${equipo.equipoId}`}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  {equipo.equipoNombre}
                                </Link>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                {equipo.partidosJugados}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                {equipo.partidosGanados}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                {equipo.partidosEmpatados}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                {equipo.partidosPerdidos}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                {equipo.golesAFavor}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                {equipo.golesEnContra}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                {equipo.diferenciaGoles > 0 ? `+${equipo.diferenciaGoles}` : equipo.diferenciaGoles}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                                {equipo.puntos}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No hay datos de tabla de posiciones disponibles
                    </div>
                  )}

                  {/* Lista de Equipos */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipos de la Zona</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {zona.equipos.map((equipo) => (
                        <div key={equipo._id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Link 
                              href={`/equipos/${equipo._id}`}
                              className="font-medium text-blue-600 hover:text-blue-800"
                            >
                              {equipo.nombre}
                            </Link>
                            <span className="text-sm text-gray-500">{equipo.jugadores.length} jugadores</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Puntos: {equipo.puntos}</span>
                              <span>GF: {equipo.golesAFavor}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>GC: {equipo.golesEnContra}</span>
                              <span>DG: {equipo.diferenciaGoles > 0 ? `+${equipo.diferenciaGoles}` : equipo.diferenciaGoles}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay zonas configuradas</h2>
            <p className="text-gray-600 mb-4">Este torneo aún no tiene zonas configuradas.</p>
          </div>
        )}
      </div>
    </div>
  );
} 