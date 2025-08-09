'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createEquipo, updateEquipo } from '../redux/slices/equipoSlice';
import type { Equipo } from '../redux/slices/equipoSlice';
import type { Torneo } from '../redux/slices/torneoSlice';

const equipoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres'),
  torneoId: z.string().min(1, 'Debe seleccionar un torneo'),
  color: z.string().min(1, 'El color es requerido'),
  fundacion: z.string().optional(),
  ciudad: z.string().optional(),
  estadio: z.string().optional(),
});

type EquipoFormData = z.infer<typeof equipoSchema>;

interface EquipoFormProps {
  equipo?: Equipo;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EquipoForm({ equipo, onSuccess, onCancel }: EquipoFormProps) {
  const dispatch = useAppDispatch();
  const { torneos } = useAppSelector((state) => state.torneos);
  const [escudoUrl, setEscudoUrl] = useState(equipo?.escudo || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EquipoFormData>({
    resolver: zodResolver(equipoSchema),
    defaultValues: equipo ? {
      nombre: equipo.nombre,
      torneoId: equipo.torneoId,
      color: equipo.color,
      fundacion: equipo.fundacion || '',
      ciudad: equipo.ciudad || '',
      estadio: equipo.estadio || '',
    } : {
      color: '#000000',
    }
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Crear FormData para subir a Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // Debes configurar este preset en Cloudinary
      formData.append('folder', 'torneos/escudos');

      // Subir a Cloudinary
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', // Reemplaza con tu cloud name
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      setEscudoUrl(data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Por favor intenta nuevamente.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFormSubmit = async (data: EquipoFormData) => {
    try {
      const equipoData = {
        ...data,
        escudo: escudoUrl || '/default-team-logo.png', // URL por defecto si no hay escudo
      };

      if (equipo) {
        await dispatch(updateEquipo({ id: equipo.id, ...equipoData })).unwrap();
      } else {
        await dispatch(createEquipo(equipoData)).unwrap();
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error al guardar equipo:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {equipo ? 'Editar Equipo' : 'Crear Nuevo Equipo'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
        {/* Escudo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Escudo del Equipo
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 border-2 border-gray-300 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
              {escudoUrl ? (
                <img 
                  src={escudoUrl} 
                  alt="Escudo" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-2xl">🛡️</span>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG hasta 5MB. Recomendado: 200x200px
              </p>
              {isUploadingImage && (
                <p className="text-xs text-blue-600 mt-1">Subiendo imagen...</p>
              )}
            </div>
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Equipo *
          </label>
          <input
            {...register('nombre')}
            type="text"
            id="nombre"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Club Atlético Ejemplo"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        {/* Torneo */}
        <div>
          <label htmlFor="torneoId" className="block text-sm font-medium text-gray-700 mb-2">
            Torneo *
          </label>
          <select
            {...register('torneoId')}
            id="torneoId"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar torneo...</option>
            {torneos.map((torneo: Torneo) => (
              <option key={torneo.id} value={torneo.id}>
                {torneo.nombre}
              </option>
            ))}
          </select>
          {errors.torneoId && (
            <p className="mt-1 text-sm text-red-600">{errors.torneoId.message}</p>
          )}
        </div>

        {/* Color */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
            Color Principal *
          </label>
          <div className="flex items-center space-x-3">
            <input
              {...register('color')}
              type="color"
              id="color"
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              {...register('color')}
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="#000000"
            />
          </div>
          {errors.color && (
            <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
          )}
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fundacion" className="block text-sm font-medium text-gray-700 mb-2">
              Año de Fundación
            </label>
            <input
              {...register('fundacion')}
              type="text"
              id="fundacion"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 1990"
            />
          </div>

          <div>
            <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <input
              {...register('ciudad')}
              type="text"
              id="ciudad"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Buenos Aires"
            />
          </div>
        </div>

        <div>
          <label htmlFor="estadio" className="block text-sm font-medium text-gray-700 mb-2">
            Estadio
          </label>
          <input
            {...register('estadio')}
            type="text"
            id="estadio"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Estadio Municipal"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </div>
            ) : (
              equipo ? 'Actualizar Equipo' : 'Crear Equipo'
            )}
          </button>
        </div>
      </form>

      {/* Cloudinary Configuration Note */}
      <div className="px-6 pb-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Configuración de Cloudinary
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Para que funcione la subida de imágenes, debes:
                </p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Crear una cuenta en Cloudinary</li>
                  <li>Configurar un upload preset público</li>
                                     <li>Reemplazar &apos;your-cloud-name&apos; con tu Cloud Name</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 