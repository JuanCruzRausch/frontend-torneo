# Configuración de Cloudinary para Subida de Imágenes

## 📋 Requisitos Previos

1. Tener una cuenta en [Cloudinary](https://cloudinary.com/)
2. Tener configurado un proyecto en Cloudinary

## 🔧 Pasos de Configuración

### 1. Obtener Credenciales de Cloudinary

1. Inicia sesión en tu cuenta de Cloudinary
2. Ve al Dashboard principal
3. Anota tu **Cloud Name** (aparece en la parte superior)
4. Ve a **Settings** → **Upload** → **Upload presets**
5. Crea un nuevo preset o usa uno existente
6. Anota el nombre del **Upload Preset**

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz de tu proyecto con el siguiente contenido:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name-aqui
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tu-upload-preset-aqui
```

**Ejemplo:**
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=myapp123
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default
```

### 3. Configurar Upload Preset (Opcional)

Si quieres más control sobre las subidas, puedes configurar tu preset:

1. Ve a **Settings** → **Upload** → **Upload presets**
2. Haz clic en tu preset
3. Configura las opciones deseadas:
   - **Signing Mode**: `Unsigned` (para subidas desde el frontend)
   - **Folder**: `equipos/escudos` (para organizar las imágenes)
   - **Allowed formats**: `jpg, png, gif, webp`
   - **Max file size**: `10MB` (o el tamaño que prefieras)

### 4. Reiniciar el Servidor

Después de crear el archivo `.env.local`, reinicia tu servidor de desarrollo:

```bash
npm run dev
```

## 🚀 Uso

Una vez configurado, podrás:

1. Ir a `/admin/equipos/crear`
2. Seleccionar una imagen para el escudo del equipo
3. La imagen se subirá automáticamente a Cloudinary
4. La URL de la imagen se guardará en el campo `escudoUrl`

## 🔒 Seguridad

- **NUNCA** subas tu API Key o Secret a variables públicas
- Usa solo `NEXT_PUBLIC_` para variables que deben estar disponibles en el frontend
- El preset de subida debe estar configurado como `Unsigned` para mayor seguridad

## 🐛 Solución de Problemas

### Error: "Error uploading image to Cloudinary"

1. Verifica que las variables de entorno estén correctamente configuradas
2. Asegúrate de que el Cloud Name sea correcto
3. Verifica que el Upload Preset exista y esté configurado como `Unsigned`
4. Revisa la consola del navegador para más detalles del error

### Error: "Upload preset not found"

1. Verifica que el nombre del preset sea exactamente igual al configurado en Cloudinary
2. Asegúrate de que el preset esté activo
3. Verifica que tengas permisos para usar ese preset

### Error: "File too large"

1. Configura un tamaño máximo de archivo mayor en tu preset de Cloudinary
2. O comprime la imagen antes de subirla

## 📱 Formatos Soportados

- **Imágenes**: JPG, PNG, GIF, WebP
- **Tamaño máximo**: Configurable en tu preset (recomendado: 10MB)
- **Resolución**: Sin límite (Cloudinary optimiza automáticamente)

## 🔗 Recursos Adicionales

- [Documentación oficial de Cloudinary](https://cloudinary.com/documentation)
- [Guía de Upload Presets](https://cloudinary.com/documentation/upload_presets)
- [API de Subida de Imágenes](https://cloudinary.com/documentation/upload_images) 