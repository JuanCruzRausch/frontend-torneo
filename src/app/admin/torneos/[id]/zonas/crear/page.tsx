'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../../../../redux/hooks';
import { fetchTorneoById } from '../../../../../../redux/slices/torneoSlice';
import { fetchEquipos } from '../../../../../../redux/slices/equipoSlice';

interface Equipo {
  _id: string;
  nombre: string;
  escudoUrl?: string;
}

interface ZonaFormData {
  nombre: string;
  descripcion: string;
  equipos: string[];
}

export default function CrearZonaPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedTorneo: torneo, isLoading: loadingTorneo } = useAppSelector((state) => state.torneos);
  const { equipos, isLoading: loadingEquipos } = useAppSelector((state) => state.equipos);
  
  const [formData, setFormData] = useState<ZonaFormData>({
    nombre: '',
    descripcion: '',
    equipos: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchTorneoById(params.id as string));
      dispatch(fetchEquipos());
    }
  }, [dispatch, params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEquipoToggle = (equipoId: string) => {
    setFormData(prev => ({
      ...prev,
      equipos: prev.equipos.includes(equipoId)
        ? prev.equipos.filter(id => id !== equipoId)
        : [...prev.equipos, equipoId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setError('El nombre de la zona es obligatorio');
      return;
    }

    if (formData.equipos.length === 0) {
      setError('Debes seleccionar al menos un equipo');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('No tienes autorización para crear zonas');
        return;
      }

      const response = await fetch('http://localhost:8080/api/zonas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          torneoId: params.id,
          equipos: formData.equipos
        })
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/torneos/${params.id}/zonas`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al crear la zona');
      }
    } catch (error) {
      console.error('Error creating zona:', error);
      setError('Error de conexión al crear la zona');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingTorneo || loadingEquipos) {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/admin" className="hover:text-blue-600">Admin</Link></li>
            <li>›</li>
            <li><Link href="/admin/torneos" className="hover:text-blue-600">Torneos</Link></li>
            <li>›</li>
            <li><Link href={`/admin/torneos/${torneo._id}`} className="hover:text-blue-600">{torneo.nombre}</Link></li>
            <li>›</li>
            <li className="text-gray-900 font-medium">Crear Zona</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Nueva Zona</h1>
              <p className="text-gray-600 text-lg">Torneo: {torneo.nombre}</p>
            </div>
            <Link 
              href={`/admin/torneos/${torneo._id}/zonas`}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Volver a Zonas
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
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

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Zona *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Zona A, Zona Norte, etc."
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descripción opcional de la zona"
              />
            </div>

            {/* Selección de Equipos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Seleccionar Equipos * ({formData.equipos.length} seleccionados)
              </label>
              
              {equipos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4">
                                     {equipos.map((equipo: Equipo) => (
                    <div
                      key={equipo._id}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.equipos.includes(equipo._id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleEquipoToggle(equipo._id)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.equipos.includes(equipo._id)}
                        onChange={() => handleEquipoToggle(equipo._id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                      />
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
                        <span className="font-medium text-gray-900">{equipo.nombre}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">👥</div>
                  <p>No hay equipos disponibles para seleccionar</p>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href={`/admin/torneos/${torneo._id}/zonas`}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || formData.equipos.length === 0}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creando...' : 'Crear Zona'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 