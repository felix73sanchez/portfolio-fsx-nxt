# Portfolio FSX - Felix Sánchez

Portfolio personal y blog construido con Next.js 16, TypeScript y SQLite.

## 🚀 Características

### Portafolio
- **Página principal** con información personal, experiencia y habilidades técnicas
- **Página de proyectos** dinámica con administración desde panel admin
- **Diseño responsivo** con tema oscuro por defecto y opción de tema claro
- **Animaciones y efectos hover** para una experiencia premium

### Blog
- **Sistema de blog completo** con soporte para Markdown (GFM)
- **Vista previa en tiempo real** al escribir artículos
- **Barra de herramientas Markdown** para formateo rápido
- **Etiquetas** para organizar contenido
- **Imágenes de portada** con drag & drop
- **Autores** con atribución automática

### Panel de Administración
- **Autenticación JWT** con código de invitación para registro
- **Dashboard** con estadísticas de artículos
- **CRUD completo** para artículos del blog
- **CRUD completo** para proyectos del portafolio
- **Subida de imágenes** a `/public/uploads/`

## 🛠️ Tecnologías

- **Frontend**: Next.js 16, React 19, TypeScript
- **Estilos**: Tailwind CSS 4, CSS Variables
- **Base de datos**: SQLite (better-sqlite3)
- **Autenticación**: JWT (jsonwebtoken), bcryptjs
- **Markdown**: react-markdown, remark-gfm

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/felixsanchez/portfolio-fsx-nxt.git

# Instalar dependencias
npm install

# Sembrar proyectos iniciales (opcional)
npx tsx scripts/seed-projects.ts

# Ejecutar en desarrollo
npm run dev
```

## 🔧 Variables de Entorno

Crear archivo `.env.local`:

```env
JWT_SECRET=tu-clave-secreta-muy-segura
INVITATION_CODE=tu-codigo-de-invitacion
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── admin/           # Panel de administración
│   │   ├── dashboard/   # Dashboard principal
│   │   ├── login/       # Login de admin
│   │   ├── register/    # Registro con código de invitación
│   │   ├── posts/       # CRUD de artículos
│   │   └── projects/    # CRUD de proyectos
│   ├── api/             # API Routes
│   │   ├── auth/        # Login y registro
│   │   ├── blog/        # CRUD de blog
│   │   ├── projects/    # CRUD de proyectos
│   │   └── upload/      # Subida de imágenes
│   ├── blog/            # Páginas públicas del blog
│   └── proyectos/       # Página pública de proyectos
├── components/          # Componentes reutilizables
│   ├── Header.tsx       # Header con navegación
│   ├── Footer.tsx       # Footer
│   ├── MarkdownRenderer.tsx  # Renderizador de Markdown
│   └── ThemeContext.tsx # Contexto para tema claro/oscuro
├── lib/
│   ├── auth/            # Funciones de autenticación
│   └── db/              # Funciones de base de datos
└── types/               # Tipos TypeScript
```

## 🔐 Acceso al Panel de Admin

1. Ve a `/admin/register` y registra una cuenta con el código de invitación
2. Inicia sesión en `/admin/login`
3. Accede al dashboard en `/admin/dashboard`

## 📝 Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run start     # Servidor de producción
npm run lint      # Linting con ESLint
```

## 🗄️ Base de Datos

La base de datos SQLite se crea automáticamente en `data/portfolio.db` con las siguientes tablas:

- **users**: Usuarios administradores
- **blog_posts**: Artículos del blog
- **projects**: Proyectos del portafolio

## 📄 Licencia

ISC

## 👤 Autor

**Felix Sánchez**
- Email: felixsanchez73@outlook.com
- LinkedIn: [felixrsanchez](https://www.linkedin.com/in/felixrsanchez/)
- GitHub: [felix73sanchez](https://github.com/felix73sanchez)
