# 🏆 Sistema de Gestión de Torneos de Fútbol

Una aplicación web completa para la gestión de torneos de fútbol construida con Next.js 14, Redux Toolkit, Tailwind CSS y Cloudinary.

## ✨ Características

### 🌐 Páginas Públicas
- **Home**: Landing page con torneos destacados y características del sistema
- **Torneos**: Lista completa de todos los torneos disponibles
- **Goleadores**: Ranking de los mejores goleadores de todos los torneos
- **Reglamento**: Información detallada sobre las reglas y normativas

### 🔒 Panel de Administración
- **Dashboard**: Vista general con estadísticas y accesos rápidos
- **Gestión de Torneos**: Crear, editar y eliminar torneos
- **Gestión de Equipos**: Registrar equipos con subida de escudos a Cloudinary
- **Gestión de Partidos**: Programar partidos y actualizar resultados
- **Gestión de Zonas**: Organizar equipos por zonas

### 🎯 Características Técnicas
- **Autenticación JWT**: Sistema de login con tokens seguros
- **Estado Global**: Redux Toolkit con Redux Persist
- **Subida de Imágenes**: Integración con Cloudinary para escudos de equipos
- **Formularios Validados**: React Hook Form con Zod para validación
- **Diseño Responsivo**: Tailwind CSS con diseño mobile-first
- **Rutas Protegidas**: Middleware para proteger rutas administrativas

## 🛠 Tecnologías

- **Frontend**: Next.js 14 (App Router)
- **Estado**: Redux Toolkit + Redux Persist
- **Estilos**: Tailwind CSS
- **Formularios**: React Hook Form + Zod
- **Imágenes**: Cloudinary
- **HTTP**: Axios con interceptores
- **TypeScript**: Tipado completo

## 🚀 Instalación y Configuración

### 1. Clonar y configurar el proyecto

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

### 2. Configuración del Backend

El frontend está configurado para conectarse a un backend en `http://localhost:4000/api`. Asegúrate de que tu backend esté corriendo en esa URL con los siguientes endpoints:

#### Endpoints de Autenticación
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener datos del usuario

#### Endpoints de Torneos
- `GET /torneos` - Listar torneos
- `GET /torneos/:id` - Obtener torneo por ID
- `GET /torneos/:id/equipos` - Obtener equipos de un torneo
- `POST /torneos` - Crear torneo
- `PUT /torneos/:id` - Actualizar torneo
- `DELETE /torneos/:id` - Eliminar torneo

#### Endpoints de Equipos
- `GET /equipos` - Listar equipos
- `GET /equipos/:id` - Obtener equipo por ID
- `POST /equipos` - Crear equipo
- `PUT /equipos/:id` - Actualizar equipo
- `DELETE /equipos/:id` - Eliminar equipo

#### Endpoints de Partidos
- `GET /partidos` - Listar partidos
- `GET /partidos/ordenados` - Partidos ordenados por fecha
- `POST /partidos` - Crear partido
- `PUT /partidos/:id` - Actualizar partido

#### Endpoints de Jugadores
- `GET /jugadores/goleadores` - Top goleadores

### 3. Configuración de Cloudinary

Para que funcione la subida de imágenes de escudos:

1. Crea una cuenta en [Cloudinary](https://cloudinary.com/)
2. Configura un "Upload Preset" público en tu dashboard
3. Reemplaza en `src/components/EquipoForm.tsx`:
   - `your-cloud-name` con tu Cloud Name
   - `ml_default` con tu Upload Preset (opcional)

```typescript
// En EquipoForm.tsx, línea ~77
const response = await fetch(
  'https://api.cloudinary.com/v1_1/TU-CLOUD-NAME/image/upload',
  // ...
);
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js 14 (App Router)
│   ├── admin/             # Panel de administración
│   ├── goleadores/        # Página de goleadores
│   ├── login/             # Página de login
│   ├── reglamento/        # Página de reglamento
│   ├── torneos/           # Páginas de torneos
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   ├── EquipoForm.tsx     # Formulario de equipos (con Cloudinary)
│   ├── Footer.tsx         # Footer del sitio
│   ├── LoginForm.tsx      # Formulario de login
│   ├── Navbar.tsx         # Barra de navegación
│   ├── Providers.tsx      # Proveedores de Redux
│   └── TorneoForm.tsx     # Formulario de torneos
├── redux/                 # Estado global
│   ├── slices/            # Slices de Redux Toolkit
│   ├── hooks.ts           # Hooks tipados de Redux
│   └── store.ts           # Configuración del store
└── utils/                 # Utilidades
    ├── auth.ts            # Funciones de autenticación
    └── axios.ts           # Configuración de axios
```

## 🔐 Autenticación

El sistema utiliza JWT para autenticación:

1. **Login**: Envía credenciales a `/auth/login`
2. **Token**: Se guarda en localStorage y se persiste con Redux Persist
3. **Interceptor**: Axios agrega automáticamente el token a las requests
4. **Middleware**: Next.js protege rutas administrativas
5. **Logout**: Limpia el token y redirige al home

## 🎨 Diseño y UX

- **Diseño Responsivo**: Optimizado para móviles, tablets y desktop
- **Tema Moderno**: Paleta de colores azul y gris con acentos
- **Componentes Interactivos**: Hovers, transiciones y estados de carga
- **Iconos**: Uso de emojis para consistencia cross-platform
- **Feedback Visual**: Mensajes de error, loading states y confirmaciones

## 📱 Páginas Implementadas

### Públicas
- ✅ `/` - Home con torneos destacados
- ✅ `/torneos` - Lista de todos los torneos
- ✅ `/goleadores` - Ranking de goleadores
- ✅ `/reglamento` - Reglas y normativas
- ✅ `/login` - Página de autenticación

### Administrativas (Protegidas)
- ✅ `/admin` - Dashboard principal
- ✅ `/admin/torneos` - Gestión de torneos
- ✅ `/admin/equipos` - Gestión de equipos
- ✅ `/admin/partidos` - Gestión de partidos
- ✅ `/admin/zonas` - Gestión de zonas

### Por Implementar
- 🔄 `/torneos/[id]` - Detalle de torneo
- 🔄 `/torneos/[id]/equipos` - Equipos del torneo
- 🔄 `/torneos/[id]/tabla` - Tabla de posiciones
- 🔄 `/torneos/[id]/fixture` - Fixture del torneo
- 🔄 `/equipos/[id]` - Detalle de equipo

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Iniciar en producción
npm run start

# Linting
npm run lint
```

## 📝 Notas de Desarrollo

1. **Estado Global**: Usa Redux Toolkit para un state management predecible
2. **Persistencia**: Auth state se persiste automáticamente
3. **Validación**: Todos los formularios están validados con Zod
4. **TypeScript**: Proyecto completamente tipado para mejor DX
5. **Error Handling**: Manejo consistente de errores en toda la app

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para la gestión de torneos de fútbol**
