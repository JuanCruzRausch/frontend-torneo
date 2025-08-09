'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTorneos, type Torneo } from '../../redux/slices/torneoSlice';
import { fetchEquipos } from '../../redux/slices/equipoSlice';
import { fetchPartidos } from '../../redux/slices/partidoSlice';
import Link from 'next/link';

export default function AdminPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { torneos } = useAppSelector((state) => state.torneos);
  const { equipos } = useAppSelector((state) => state.equipos);
  const { partidos } = useAppSelector((state) => state.partidos);

  useEffect(() => {
    dispatch(fetchTorneos());
    dispatch(fetchEquipos());
    dispatch(fetchPartidos());
  }, [dispatch]);

  const stats = [
    {
      name: 'Torneos',
      value: torneos.length,
      icon: '🏆',
      href: '/admin/torneos',
      color: 'bg-blue-500',
    },
    {
      name: 'Equipos',
      value: equipos.length,
      icon: '👥',
      href: '/admin/equipos',
      color: 'bg-green-500',
    },
    {
      name: 'Partidos',
      value: partidos.length,
      icon: '⚽',
      href: '/admin/partidos',
      color: 'bg-yellow-500',
    },
    {
      name: 'Zonas',
      value: 0, // TODO: Add zones count
      icon: '📍',
      href: '/admin/zonas',
      color: 'bg-purple-500',
    },
  ];

  const quickActions = [
    {
      title: 'Crear Torneo',
      description: 'Configurar un nuevo torneo de fútbol',
      icon: '🏆',
      href: '/admin/torneos/crear',
      color: 'bg-blue-500',
    },
    {
      title: 'Registrar Equipo',
      description: 'Añadir un nuevo equipo al sistema',
      icon: '👥',
      href: '/admin/equipos/crear',
      color: 'bg-green-500',
    },
    {
      title: 'Crear Partido',
      description: 'Programar un nuevo partido',
      icon: '⚽',
      href: '/admin/partidos/crear',
      color: 'bg-yellow-500',
    },
    {
      title: 'Gestionar Zonas',
      description: 'Organizar equipos en zonas',
      icon: '📍',
      href: '/admin/zonas',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido, {user?.nombre}. Aquí puedes gestionar todos los aspectos de los torneos.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color} text-white text-2xl mr-4`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tournaments */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Torneos Recientes</h3>
              <Link href="/admin/torneos" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todos
              </Link>
            </div>
            
            {torneos.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-gray-600">No hay torneos creados</p>
                <Link href="/admin/torneos/crear" className="text-blue-600 hover:text-blue-700 text-sm">
                  Crear primer torneo
                </Link>
              </div>
            ) : (
                             <div className="space-y-4">
                                  {torneos.slice(0, 3).map((torneo: Torneo) => (
                   <div key={torneo._id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{torneo.nombre}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(torneo.fechaInicio).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                       torneo.estado === 'activo' ? 'bg-green-100 text-green-800' :
                       torneo.estado === 'inactivo' ? 'bg-yellow-100 text-yellow-800' :
                       'bg-gray-100 text-gray-800'
                     }`}>
                       {torneo.estado === 'activo' ? 'ACTIVO' :
                        torneo.estado === 'inactivo' ? 'INACTIVO' : 'FINALIZADO'}
                     </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Management Links */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Gestión</h3>
            <div className="space-y-4">
              <Link href="/admin/torneos" className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🏆</span>
                  <div>
                    <h4 className="font-medium text-gray-900">Gestionar Torneos</h4>
                    <p className="text-sm text-gray-600">Crear, editar y eliminar torneos</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link href="/admin/equipos" className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">👥</span>
                  <div>
                    <h4 className="font-medium text-gray-900">Gestionar Equipos</h4>
                    <p className="text-sm text-gray-600">Registrar equipos y jugadores</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link href="/admin/partidos" className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚽</span>
                  <div>
                    <h4 className="font-medium text-gray-900">Gestionar Partidos</h4>
                    <p className="text-sm text-gray-600">Programar y actualizar resultados</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link href="/admin/zonas" className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📍</span>
                  <div>
                    <h4 className="font-medium text-gray-900">Gestionar Zonas</h4>
                    <p className="text-sm text-gray-600">Organizar equipos por zonas</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 