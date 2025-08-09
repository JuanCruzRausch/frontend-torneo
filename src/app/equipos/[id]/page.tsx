'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchEquipoById, updateEquipo, type Equipo } from '../../../redux/slices/equipoSlice';
import { createJugador, updateJugador, deleteJugador, type Jugador } from '../../../redux/slices/jugadorSlice';

export default function EquipoDetailPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { selectedEquipo: equipo, isLoading, error } = useAppSelector((state) => state.equipos);
  const { user } = useAppSelector((state) => state.auth);
  
  // Admin interface state
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Jugador | null>(null);
  
  // Form data state
  const [teamForm, setTeamForm] = useState({ nombre: '', color: '' });
  const [playerForm, setPlayerForm] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    numero: '',
    posicion: '',
  });

  const isAdmin = user?.rol === 'admin'; // Check if user is admin

  useEffect(() => {
    if (params.id) {
      dispatch(fetchEquipoById(params.id as string));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (equipo && !isEditingTeam) {
      setTeamForm({
        nombre: equipo.nombre || '',
        color: equipo.color || '',
      });
    }
  }, [equipo, isEditingTeam]);

  // Admin handler functions
  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipo) return;
    
    try {
      await dispatch(updateEquipo({ 
        id: equipo._id || equipo.id, 
        ...teamForm 
      })).unwrap();
      setIsEditingTeam(false);
      // Refresh team data
      dispatch(fetchEquipoById(params.id as string));
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipo) return;
    
    try {
      await dispatch(createJugador({
        ...playerForm,
        numero: playerForm.numero ? parseInt(playerForm.numero) : undefined,
        equipoId: equipo._id || equipo.id,
      } as any)).unwrap();
      setIsAddingPlayer(false);
      setPlayerForm({
        nombre: '',
        apellido: '',
        dni: '',
        fechaNacimiento: '',
        numero: '',
        posicion: '',
      });
      // Refresh team data to show new player
      dispatch(fetchEquipoById(params.id as string));
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  const handleUpdatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer) return;
    
    try {
      await dispatch(updateJugador({ 
        id: editingPlayer._id || editingPlayer.id, 
        ...playerForm,
        numero: playerForm.numero ? parseInt(playerForm.numero) : undefined,
      })).unwrap();
      setEditingPlayer(null);
      setPlayerForm({
        nombre: '',
        apellido: '',
        dni: '',
        fechaNacimiento: '',
        numero: '',
        posicion: '',
      });
      // Refresh team data
      dispatch(fetchEquipoById(params.id as string));
    } catch (error) {
      console.error('Error updating player:', error);
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este jugador?')) {
      try {
        await dispatch(deleteJugador(playerId)).unwrap();
        // Refresh team data
        dispatch(fetchEquipoById(params.id as string));
      } catch (error) {
        console.error('Error deleting player:', error);
      }
    }
  };

  const startEditingPlayer = (player: Jugador) => {
    setEditingPlayer(player);
    setPlayerForm({
      nombre: player.nombre || '',
      apellido: player.apellido || '',
      dni: player.dni || '',
      fechaNacimiento: player.fechaNacimiento ? player.fechaNacimiento.split('T')[0] : '',
      numero: player.numero?.toString() || '',
      posicion: player.posicion || '',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando equipo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar equipo</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchEquipoById(params.id as string))}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Equipo no encontrado</h2>
          <Link 
            href="/torneos"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Ver Torneos
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
            <li><Link href={`/torneos/${equipo.torneoId?._id || ''}`} className="hover:text-blue-600">{equipo.torneoId?.nombre || 'Torneo'}</Link></li>
            <li>›</li>
            <li className="text-gray-900 font-medium">{equipo.nombre}</li>
          </ol>
        </nav>

        {/* Team Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                {equipo.nombre?.substring(0, 2)?.toUpperCase() || 'EQ'}
              </div>
              <div>
                {isEditingTeam && isAdmin ? (
                  <form onSubmit={handleUpdateTeam} className="space-y-2">
                    <input
                      type="text"
                      value={teamForm.nombre}
                      onChange={(e) => setTeamForm({ ...teamForm, nombre: e.target.value })}
                      className="text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded px-2 py-1"
                      required
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={teamForm.color}
                        onChange={(e) => setTeamForm({ ...teamForm, color: e.target.value })}
                        placeholder="Color del equipo"
                        className="text-gray-600 bg-gray-50 border border-gray-300 rounded px-2 py-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingTeam(false)}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{equipo.nombre}</h1>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEditingTeam(true)}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            ✏️ Editar
                          </button>
                          <Link
                            href="/admin/equipos/crear"
                            className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                          >
                            ➕ Crear Equipo
                          </Link>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600">
                      {equipo.torneoId?.nombre || 'Sin torneo'} • {equipo.jugadores?.length || 0} jugadores
                      {equipo.color && ` • ${equipo.color}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Link 
                href={`/torneos/${equipo.torneoId?._id || ''}/equipos`}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                ← Volver a Equipos
              </Link>
              {isAdmin && (
                <Link 
                  href="/admin/equipos"
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                >
                  🏠 Admin Equipos
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500 text-white text-2xl mr-4">
                🏆
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Puntos</p>
                <p className="text-3xl font-bold text-gray-900">{equipo.puntos || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500 text-white text-2xl mr-4">
                ⚽
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Goles a Favor</p>
                <p className="text-3xl font-bold text-gray-900">{equipo.golesAFavor || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-500 text-white text-2xl mr-4">
                🥅
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Goles en Contra</p>
                <p className="text-3xl font-bold text-gray-900">{equipo.golesEnContra || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500 text-white text-2xl mr-4">
                📊
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Diferencia de Goles</p>
                <p className={`text-3xl font-bold ${
                  (equipo.diferenciaGoles || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {equipo.diferenciaGoles > 0 ? '+' : ''}{equipo.diferenciaGoles || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Players Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Plantilla de Jugadores</h2>
            <div className="flex items-center gap-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {equipo.jugadores?.length || 0} jugadores
              </span>
              {isAdmin && (
                <button
                  onClick={() => setIsAddingPlayer(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <span>+</span>
                  Agregar Jugador
                </button>
              )}
            </div>
          </div>

          {equipo.jugadores && equipo.jugadores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jugador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DNI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Nacimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Goles
                    </th>
                    {isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {equipo.jugadores.map((jugador: Jugador) => (
                    <tr key={jugador._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-medium mr-4">
                            {jugador.nombre?.charAt(0) || ''}{jugador.apellido?.charAt(0) || ''}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {jugador.nombreCompleto}
                            </div>
                            <div className="text-sm text-gray-500">
                              {jugador.nombre || ''} {jugador.apellido || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {jugador.dni || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {jugador.fechaNacimiento ? new Date(jugador.fechaNacimiento).toLocaleDateString('es-ES') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {jugador.goles} {jugador.goles === 1 ? 'gol' : 'goles'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditingPlayer(jugador)}
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleDeletePlayer(jugador._id || jugador.id)}
                              className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay jugadores registrados</h3>
              <p className="text-gray-600">Este equipo aún no tiene jugadores en su plantilla.</p>
            </div>
          )}
        </div>

        {/* Add/Edit Player Modal */}
        {(isAddingPlayer || editingPlayer) && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {isAddingPlayer ? 'Agregar Jugador' : 'Editar Jugador'}
              </h3>
              <form onSubmit={isAddingPlayer ? handleAddPlayer : handleUpdatePlayer} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={playerForm.nombre}
                      onChange={(e) => setPlayerForm({ ...playerForm, nombre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={playerForm.apellido}
                      onChange={(e) => setPlayerForm({ ...playerForm, apellido: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DNI *
                  </label>
                  <input
                    type="text"
                    value={playerForm.dni}
                    onChange={(e) => setPlayerForm({ ...playerForm, dni: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    value={playerForm.fechaNacimiento}
                    onChange={(e) => setPlayerForm({ ...playerForm, fechaNacimiento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="number"
                      value={playerForm.numero}
                      onChange={(e) => setPlayerForm({ ...playerForm, numero: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                      max="99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posición
                    </label>
                    <select
                      value={playerForm.posicion}
                      onChange={(e) => setPlayerForm({ ...playerForm, posicion: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar posición</option>
                      <option value="Portero">Portero</option>
                      <option value="Defensor">Defensor</option>
                      <option value="Mediocampista">Mediocampista</option>
                      <option value="Delantero">Delantero</option>
                      <option value="Extremo Izquierdo">Extremo Izquierdo</option>
                      <option value="Extremo Derecho">Extremo Derecho</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingPlayer(false);
                      setEditingPlayer(null);
                      setPlayerForm({
                        nombre: '',
                        apellido: '',
                        dni: '',
                        fechaNacimiento: '',
                        numero: '',
                        posicion: '',
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {isAddingPlayer ? 'Agregar' : 'Actualizar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Team Information */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Equipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Torneo</p>
              <p className="font-semibold text-gray-900">{equipo.torneoId?.nombre || 'Sin torneo'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de Registro</p>
              <p className="font-semibold text-gray-900">
                {new Date(equipo.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
            {equipo.ciudad && (
              <div>
                <p className="text-sm text-gray-600">Ciudad</p>
                <p className="font-semibold text-gray-900">{equipo.ciudad}</p>
              </div>
            )}
            {equipo.estadio && (
              <div>
                <p className="text-sm text-gray-600">Estadio</p>
                <p className="font-semibold text-gray-900">{equipo.estadio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 