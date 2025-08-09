'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchEquipoById, updateEquipo } from '@/redux/slices/equipoSlice';
import { fetchTorneos } from '@/redux/slices/torneoSlice';
import { Equipo } from '@/redux/slices/equipoSlice';
import { Torneo } from '@/redux/slices/torneoSlice';

export default function EditarEquipoPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { selectedEquipo, isLoading, error } = useAppSelector((state) => state.equipos);
  const { torneos } = useAppSelector((state) => state.torneos);
  
  const [formData, setFormData] = useState({
    nombre: '',
    color: '',
    torneoId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchEquipoById(params.id as string));
      dispatch(fetchTorneos());
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (selectedEquipo) {
      setFormData({
        nombre: selectedEquipo.nombre || '',
        color: selectedEquipo.color || '',
        torneoId: typeof selectedEquipo.torneoId === 'string' 
          ? selectedEquipo.torneoId 
          : selectedEquipo.torneoId?._id || ''
      });
    }
  }, [selectedEquipo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.id) return;

    console.log('Submitting form data:', formData);
    console.log('Team ID:', params.id);
    
    setIsSubmitting(true);
    try {
      const result = await dispatch(updateEquipo({
        id: params.id as string,
        nombre: formData.nombre,
        color: formData.color,
        torneoId: formData.torneoId
      })).unwrap();
      
      console.log('Update result:', result);
      router.push('/admin/equipos');
    } catch (error) {
      console.error('Error al actualizar equipo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/equipos');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando equipo...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedEquipo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Equipo no encontrado</h1>
          <p className="text-gray-600 mb-6">El equipo que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => router.push('/admin/equipos')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Equipos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a
                href="/admin"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Admin
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <a
                  href="/admin/equipos"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                >
                  Equipos
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  Editar {selectedEquipo.nombre}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Editar Equipo</h1>
          <p className="mt-2 text-gray-600">
            Modifica la información del equipo {selectedEquipo.nombre}
          </p>
        </div>

        {/* Team Info Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre actual</p>
              <p className="text-lg text-gray-900">{selectedEquipo.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Color actual</p>
              <p className="text-lg text-gray-900">{selectedEquipo.color || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Torneo</p>
              <p className="text-lg text-gray-900">
                {typeof selectedEquipo.torneoId === 'string' 
                  ? 'ID del torneo' 
                  : selectedEquipo.torneoId?.nombre || 'Sin torneo'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Jugadores</p>
              <p className="text-lg text-gray-900">{selectedEquipo.jugadores?.length || 0} jugadores</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Modificar Equipo</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Equipo
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa el nombre del equipo"
                required
              />
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                Color del Equipo
              </label>
              <input
                type="text"
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Azul y Blanco"
              />
            </div>

            <div>
              <label htmlFor="torneoId" className="block text-sm font-medium text-gray-700 mb-2">
                Torneo
              </label>
              <select
                id="torneoId"
                value={formData.torneoId}
                onChange={(e) => setFormData({ ...formData, torneoId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona un torneo</option>
                {torneos.map((torneo: Torneo) => (
                  <option key={torneo._id} value={torneo._id}>
                    {torneo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 