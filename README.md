# Portfolio FSX - Open Source Portfolio & Blog

Un portfolio personal y blog open source construido con Next.js 16, TypeScript y SQLite. Incluye panel de administración completo para gestionar contenido sin tocar código.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![SQLite](https://img.shields.io/badge/SQLite-3-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Características

### 🎨 Portafolio
- Página principal con información personal, experiencia y habilidades
- Proyectos dinámicos gestionados desde panel admin
- Diseño responsivo con tema oscuro/claro
- Animaciones y efectos hover premium

### 📝 Blog
- Sistema de blog completo con Markdown (GFM)
- Vista previa en tiempo real al escribir
- Barra de herramientas Markdown
- Etiquetas y categorías
- Imágenes de portada con drag & drop
- Atribución de autores

### ⚙️ Panel de Administración
- Autenticación JWT segura
- Código de invitación para registro
- Dashboard con estadísticas
- CRUD completo para blog y proyectos
- Subida de imágenes

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/portfolio-fsx-nxt.git
cd portfolio-fsx-nxt
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env.local`:

```env
# Clave secreta para JWT (genera una clave segura)
JWT_SECRET=tu-clave-secreta-muy-segura-cambiar-en-produccion

# Código de invitación para registrar administradores
INVITATION_CODE=tu-codigo-de-invitacion
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

El proyecto estará disponible en [http://localhost:3000](http://localhost:3000)

### 5. Configurar tu cuenta de admin

1. Ve a `/admin/register`
2. Ingresa el código de invitación que configuraste
3. Crea tu cuenta
4. Inicia sesión en `/admin/login`
5. ¡Listo! Accede al dashboard en `/admin/dashboard`

### 6. (Opcional) Sembrar datos de ejemplo

```bash
npx tsx scripts/seed-projects.ts
```

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **Next.js 16** | Framework React con App Router |
| **React 19** | Biblioteca UI |
| **TypeScript** | Tipado estático |
| **Tailwind CSS 4** | Estilos utility-first |
| **SQLite** | Base de datos embebida |
| **JWT** | Autenticación |
| **react-markdown** | Renderizado Markdown |

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/
│   │   ├── admin/           # Panel de administración
│   │   │   ├── dashboard/   # Dashboard principal
│   │   │   ├── login/       # Login
│   │   │   ├── register/    # Registro con código
│   │   │   ├── posts/       # Gestión de blog
│   │   │   └── projects/    # Gestión de proyectos
│   │   ├── api/             # API Routes
│   │   │   ├── auth/        # Autenticación
│   │   │   ├── blog/        # CRUD blog
│   │   │   ├── projects/    # CRUD proyectos
│   │   │   └── upload/      # Subida de imágenes
│   │   ├── blog/            # Páginas del blog
│   │   └── proyectos/       # Página de proyectos
│   ├── components/          # Componentes React
│   ├── lib/                 # Utilidades
│   │   ├── auth/            # Autenticación
│   │   └── db/              # Base de datos
│   └── types/               # Tipos TypeScript
├── data/                    # Base de datos SQLite (auto-generada)
├── public/
│   └── uploads/             # Imágenes subidas
└── scripts/                 # Scripts de utilidad
```

## 📝 Scripts Disponibles

```bash
npm run dev       # Desarrollo
npm run build     # Build producción
npm run start     # Servidor producción
npm run lint      # Linting
```

## 🔐 Seguridad

- Las contraseñas se hashean con bcrypt
- Autenticación con JWT
- Código de invitación para registro
- La base de datos y uploads no se suben a git

## 🎨 Personalización

### Cambiar información personal

Edita `src/app/page.tsx` para cambiar:
- Nombre
- Descripción
- Links de contacto
- Experiencia
- Habilidades

### Cambiar colores

Edita las variables CSS en `src/app/globals.css`:

```css
:root {
  --bg: #0a0a0a;
  --fg: #ededed;
  --accent: #3b82f6;
  /* ... */
}
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -m 'Añadir nueva característica'`)
4. Push (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - Siéntete libre de usar este proyecto para tu propio portfolio.

## 👤 Autor Original

**Felix Sánchez**
- LinkedIn: [felixrsanchez](https://www.linkedin.com/in/felixrsanchez/)
- GitHub: [felix73sanchez](https://github.com/felix73sanchez)

---

⭐ Si te gusta el proyecto, ¡dale una estrella en GitHub!
