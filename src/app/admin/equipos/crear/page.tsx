'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { createEquipo } from '../../../../redux/slices/equipoSlice';
import { fetchTorneos } from '../../../../redux/slices/torneoSlice';
import { type Torneo } from '../../../../redux/slices/torneoSlice';
import ProtectedRoute from '../../../../components/ProtectedRoute';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset';

const equipoSchema = z.object({
  nombre: z.string().min(1, 'El nombre del equipo es requerido'),
  ciudad: z.string().min(1, 'La ciudad es requerida'),
  color: z.string().min(1, 'El color es requerido'),
  torneoId: z.string().min(1, 'Debe seleccionar un torneo'),
  escudoUrl: z.string().optional(),
});

type EquipoFormData = z.infer<typeof equipoSchema>;

// Interface for creating a team that matches the API expectations
interface CreateEquipoData {
  nombre: string;
  ciudad: string;
  color: string;
  torneoId: string;
  escudoUrl?: string;
}

// Type assertion to match the API expectations
type CreateEquipoPayload = {
  nombre: string;
  ciudad: string;
  color: string;
  torneoId: string;
  escudoUrl?: string;
};

export default function CrearEquipoPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.equipos);
  const { torneos } = useAppSelector((state) => state.torneos);
  const { user } = useAppSelector((state) => state.auth);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EquipoFormData>({
    resolver: zodResolver(equipoSchema),
    defaultValues: {
      nombre: '',
      ciudad: '',
      color: '',
      torneoId: '',
      escudoUrl: '',
    },
  });

  // Load tournaments on component mount
  useEffect(() => {
    dispatch(fetchTorneos());
  }, [dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error uploading image to Cloudinary');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Error al subir la imagen');
    }
  };

  const onSubmit = async (data: EquipoFormData) => {
    if (!user) {
      alert('Debe estar autenticado para crear un equipo');
      return;
    }

    try {
      setIsUploading(true);

      // Upload image to Cloudinary if selected
      if (imageFile) {
        const imageUrl = await uploadToCloudinary(imageFile);
        data.escudoUrl = imageUrl;
      }

      // Create team
      await dispatch(createEquipo(data as any)).unwrap();
      
      // Redirect to teams list
      router.push('/admin/equipos');
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error al crear el equipo');
    } finally {
      setIsUploading(false);
    }
  };

  // Temporarily comment out auth check for debugging
  // if (!user || user.rol !== 'admin') {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="text-6xl mb-4">🚫</div>
  //         <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
  //         <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página.</p>
  //         <Link 
  //           href="/"
  //           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
  //         >
  //           Volver al Inicio
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-blue-600">Inicio</Link></li>
              <li>›</li>
              <li><Link href="/admin" className="hover:text-blue-600">Admin</Link></li>
              <li>›</li>
              <li><Link href="/admin/equipos" className="hover:text-blue-600">Equipos</Link></li>
              <li>›</li>
              <li className="text-gray-900 font-medium">Crear Equipo</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Equipo</h1>
                <p className="text-gray-600 mt-2">Complete la información del equipo</p>
              </div>
              <Link 
                href="/admin/equipos"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                ← Volver a Equipos
              </Link>
            </div>
          </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Equipo *
                </label>
                <input
                  type="text"
                  {...register('nombre')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Real Madrid"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  {...register('ciudad')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Madrid"
                />
                {errors.ciudad && (
                  <p className="text-red-500 text-sm mt-1">{errors.ciudad.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color del Equipo *
                </label>
                <input
                  type="text"
                  {...register('color')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Blanco"
                />
                {errors.color && (
                  <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Torneo *
                </label>
                <select
                  {...register('torneoId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar torneo</option>
                  {torneos.map((torneo: Torneo) => (
                    <option key={torneo._id} value={torneo._id}>
                      {torneo.nombre}
                    </option>
                  ))}
                </select>
                {errors.torneoId && (
                  <p className="text-red-500 text-sm mt-1">{errors.torneoId.message}</p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escudo del Equipo
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading || isUploading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isUploading ? 'Subiendo imagen...' : 'Creando equipo...'}
                  </>
                ) : (
                  'Crear Equipo'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Instrucciones</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Todos los campos marcados con * son obligatorios</li>
            <li>• El escudo se subirá automáticamente a Cloudinary</li>
            <li>• Asegúrate de seleccionar el torneo correcto</li>
            <li>• La imagen debe ser en formato JPG, PNG o GIF</li>
          </ul>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">⚠️ Configuración de Cloudinary</h4>
            <p className="text-yellow-700 text-sm">
              Para que la subida de imágenes funcione, debes configurar las variables de entorno:
            </p>
            <ul className="text-yellow-700 text-sm mt-2 space-y-1">
              <li>• <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code>: Tu nombre de nube de Cloudinary</li>
              <li>• <code>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code>: Tu preset de subida de Cloudinary</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
} 