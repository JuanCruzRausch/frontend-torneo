'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../../../../../redux/hooks';
import { fetchTorneoById } from '../../../../../../../redux/slices/torneoSlice';
import { fetchEquipos } from '../../../../../../../redux/slices/equipoSlice';

interface Equipo {
  _id: string;
  nombre: string;
}

interface Zona {
  _id: string;
  nombre: string;
  descripcion?: string;
  torneoId: {
    _id: string;
    nombre: string;
  };
  equipos: Array<{
    _id: string;
    nombre: string;
  }>;
}

interface ZonaFormData {
  nombre: string;
  descripcion: string;
}

export default function EditarZonaPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedTorneo: torneo, isLoading: loadingTorneo } = useAppSelector((state) => state.torneos);
  const { equipos: equiposTorneo, isLoading: loadingEquipos } = useAppSelector((state) => state.equipos);
  
  const [zona, setZona] = useState<Zona | null>(null);
  const [formData, setFormData] = useState<ZonaFormData>({
    nombre: '',
    descripcion: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEquipoId, setSelectedEquipoId] = useState<string>('');

  const fetchZona = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/api/zonas/${params.zonaId}`);
      if (response.ok) {
        const data = await response.json();
        setZona(data.data);
        setFormData({
          nombre: data.data.nombre,
          descripcion: data.data.descripcion || ''
        });
      } else {
        setError('Error al cargar la zona');
      }
    } catch (error) {
      console.error('Error fetching zona:', error);
      setError('Error de conexión al cargar la zona');
    } finally {
      setIsLoading(false);
    }
  }, [params.zonaId]);

  useEffect(() => {
    if (params.id && params.zonaId) {
      dispatch(fetchTorneoById(params.id as string));
      dispatch(fetchEquipos(params.id as string));
      fetchZona();
    }
  }, [dispatch, params.id, params.zonaId, fetchZona]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setError('El nombre de la zona es obligatorio');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('No tienes autorización para editar zonas');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/zonas/${params.zonaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion
        })
      });

      if (response.ok) {
        router.push(`/admin/torneos/${params.id}/zonas`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar la zona');
      }
    } catch (error) {
      console.error('Error updating zona:', error);
      setError('Error de conexión al actualizar la zona');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEquipo = async () => {
    if (!selectedEquipoId) {
      setError('Selecciona un equipo para agregar');
      return;
    }

    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No tienes autorización para modificar zonas');
        return;
      }

      // Obtener el equipo seleccionado
      const equipoToAdd = equiposTorneo.find(e => e._id === selectedEquipoId);
      if (!equipoToAdd) {
        setError('Equipo no encontrado');
        return;
      }

      // Verificar si el equipo ya está en la zona
      if (zona?.equipos.some(e => e._id === selectedEquipoId)) {
        setError('Este equipo ya está en la zona');
        return;
      }

      // Agregar el equipo a la zona
      const updatedEquipos = [...(zona?.equipos || []), equipoToAdd];
      
      const response = await fetch(`http://localhost:8080/api/zonas/${params.zonaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          equipos: updatedEquipos.map(e => e._id)
        })
      });

      if (response.ok) {
        // Actualizar el estado local
        setZona(prev => prev ? {
          ...prev,
          equipos: updatedEquipos
        } : null);
        setSelectedEquipoId('');
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al agregar el equipo');
      }
    } catch (error) {
      console.error('Error adding equipo:', error);
      setError('Error de conexión al agregar el equipo');
    }
  };

  const handleRemoveEquipo = async (equipoId: string) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No tienes autorización para modificar zonas');
        return;
      }

      // Remover el equipo de la zona
      const updatedEquipos = zona?.equipos.filter(e => e._id !== equipoId) || [];
      
      const response = await fetch(`http://localhost:8080/api/zonas/${params.zonaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          equipos: updatedEquipos.map(e => e._id)
        })
      });

      if (response.ok) {
        // Actualizar el estado local
        setZona(prev => prev ? {
          ...prev,
          equipos: updatedEquipos
        } : null);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al remover el equipo');
      }
    } catch (error) {
      console.error('Error removing equipo:', error);
      setError('Error de conexión al remover el equipo');
    }
  };

  // Obtener equipos que no están en la zona
  const equiposDisponibles = equiposTorneo.filter((equipo: Equipo) => 
    !zona?.equipos.some((e: { _id: string }) => e._id === equipo._id)
  );

  if (loadingTorneo || loadingEquipos || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!torneo || !zona) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Zona no encontrada</h2>
          <Link 
            href={`/admin/torneos/${params.id}/zonas`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver a Zonas
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
            <li><Link href={`/admin/torneos/${torneo._id}/zonas`} className="hover:text-blue-600">Zonas</Link></li>
            <li>›</li>
            <li className="text-gray-900 font-medium">Editar {zona.nombre}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Zona</h1>
              <p className="text-gray-600 text-lg">Torneo: {torneo.nombre}</p>
              <p className="text-gray-600">Zona: {zona.nombre}</p>
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
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
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

            {/* Botones del formulario */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href={`/admin/torneos/${torneo._id}/zonas`}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Actualizando...' : 'Actualizar Zona'}
              </button>
            </div>
          </form>
        </div>

        {/* Gestión de Equipos */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Gestión de Equipos</h3>
          
          {/* Agregar Equipo */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-lg font-medium text-blue-900 mb-4">Agregar Equipo a la Zona</h4>
            <div className="flex flex-col sm:flex-row gap-4">
                              <select
                  value={selectedEquipoId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedEquipoId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                <option value="">Selecciona un equipo</option>
                                 {equiposDisponibles.map((equipo: Equipo) => (
                   <option key={equipo._id} value={equipo._id}>
                     {equipo.nombre}
                   </option>
                 ))}
              </select>
              <button
                onClick={handleAddEquipo}
                disabled={!selectedEquipoId}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar Equipo
              </button>
            </div>
            {equiposDisponibles.length === 0 && (
              <p className="text-sm text-blue-700 mt-2">
                Todos los equipos del torneo ya están en esta zona
              </p>
            )}
          </div>

          {/* Lista de Equipos Actuales */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Equipos en la Zona ({zona.equipos.length})
            </h4>
            {zona.equipos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🏟️</div>
                <p>No hay equipos en esta zona</p>
                <p className="text-sm">Agrega equipos usando el selector de arriba</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                 {zona.equipos.map((equipo: { _id: string; nombre: string }) => (
                   <div
                     key={equipo._id}
                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                   >
                     <span className="font-medium text-gray-900">{equipo.nombre}</span>
                     <button
                       onClick={() => handleRemoveEquipo(equipo._id)}
                       className="text-red-600 hover:text-red-800 transition-colors p-1"
                       title="Eliminar equipo de la zona"
                     >
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                       </svg>
                     </button>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>

        {/* Información de la Zona */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Información de la Zona</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">ID de la Zona:</span>
              <p className="text-gray-600 font-mono">{zona._id}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Total de Equipos:</span>
              <p className="text-gray-600">{zona.equipos.length} equipos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 