'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { fetchTorneoById, clearSelectedTorneo } from '../../../../../redux/slices/torneoSlice';
import TorneoForm from '../../../../../components/TorneoForm';

export default function EditTorneoPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedTorneo: torneo, isLoading, error } = useAppSelector((state) => state.torneos);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchTorneoById(params.id as string));
    }

    return () => {
      dispatch(clearSelectedTorneo());
    };
  }, [dispatch, params.id]);

  const handleSuccess = () => {
    router.push('/admin/torneos');
  };

  const handleCancel = () => {
    router.push('/admin/torneos');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando torneo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar torneo</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={() => dispatch(fetchTorneoById(params.id as string))}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
            <Link 
              href="/admin/torneos"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Volver a Torneos
            </Link>
          </div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
            <li>›</li>
            <li><Link href="/admin" className="hover:text-blue-600">Admin</Link></li>
            <li>›</li>
            <li><Link href="/admin/torneos" className="hover:text-blue-600">Torneos</Link></li>
            <li>›</li>
            <li className="text-gray-900 font-medium">Editar {torneo.nombre}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Editar Torneo
              </h1>
              <p className="text-gray-600">
                Modifica la información del torneo "{torneo.nombre}"
              </p>
            </div>
            <Link 
              href="/admin/torneos"
              className="mt-4 md:mt-0 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              ← Volver a Torneos
            </Link>
          </div>
        </div>

        {/* Tournament Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">ℹ️</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Información del Torneo
              </h3>
              <div className="text-sm text-blue-700 mt-1">
                <p>Creado el {new Date(torneo.createdAt).toLocaleDateString('es-ES')} por {torneo.creadoPor?.nombreCompleto || torneo.creadoPor?.nombre || 'Usuario desconocido'}</p>
                <p>Estado actual: <span className="font-medium">{torneo.estado}</span> • Equipos: {torneo.equipos?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <TorneoForm 
          torneo={torneo} 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </div>
    </div>
  );
} 