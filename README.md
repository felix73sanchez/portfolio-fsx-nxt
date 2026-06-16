# Portfolio FSX - CMS Personal & Blog Open Source

> Un portafolio profesional y sistema de gestión de contenidos (CMS) personal construido con tecnologías web. Diseñado para desarrolladores que quieren un sitio personal elegante, rápido y totalmente autogestionable.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![SQLite](https://img.shields.io/badge/SQLite-3-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Tests](https://img.shields.io/badge/Tests-35%20passing-success)

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [API Reference](./docs/API.md) | Todos los endpoints REST con ejemplos |
| [Arquitectura](./docs/ARCHITECTURE.md) | Diseño técnico y esquema de BD |
| [Self-Hosting](./docs/SELF-HOSTING.md) | Guía completa de despliegue |
| [Contribuir](./docs/CONTRIBUTING.md) | Cómo contribuir al proyecto |


## ✨ Características Principales

### 🎨 Frontend "Premium"
- **Diseño Moderno**: Estética minimalista con soporte nativo para modo oscuro/claro y efectos glassmorphism.
- **Totalmente Responsivo**: Se adapta perfectamente a móviles, tablets y escritorio.
- **Rendimiento Máximo**: Renderizado estático (SSG/ISR) optimizado con Next.js App Router; el contenido se prerenderiza en HTML para SEO real.
- **Paleta de Comandos (⌘K / Ctrl+K)**: Navegación rápida entre páginas, cambio de tema y búsqueda de artículos del blog desde cualquier punto del sitio.
- **Micro-interacciones**: Entrada del hero escalonada, revelado al hacer scroll (CSS puro con `view-timeline`) y anillos de foco accesibles, todo respetando `prefers-reduced-motion`.
- **SEO Integral**: `metadata` por página, OpenGraph, JSON-LD, `sitemap.xml` y `robots.txt` generados automáticamente.

### ✍️ Blog Avanzado
- **Tabla de Contenidos** automática con anclas en los encabezados.
- **Resaltado de Sintaxis** en bloques de código.
- **Imagen OG Dinámica** generada por artículo.
- **Artículos Relacionados** al final de cada post.

### ⚙️ Panel de Administración (CMS)
¡Olvídate de editar código para actualizar tu información!
- **Dashboard ejecutivo**: Stats en tiempo real, acciones rápidas y artículos recientes.
- **Gestión de Perfil**: Edita tu nombre, título, bio, y redes sociales.
- **Gestión de Contenido (CV)**: Añade, edita y reordena Experiencia Laboral, Educación y Habilidades.
- **Gestión de Proyectos**: Portafolio completo con imágenes, tecnologías y enlaces.
- **Sistema de Blog**: Editor Markdown con toolbar, previsualización, subida drag & drop, y estados borrador/publicado.
- **Layout unificado**: Navegación lateral con todas las secciones, soporte nativo para tema oscuro/claro.

### 🛡️ Seguridad y Arquitectura
- **Autenticación JWT**: Sesión sin estado via cookie `httpOnly`, `secure`, `sameSite`.
- **Content Security Policy**: Middleware genera nonce dinámico por request para scripts inline.
- **Rate Limiting**: Protección contra fuerza bruta en login/register/cambio de contraseña y uploads.
- **Validación de Uploads**: Detección real por magic bytes (no confía en Content-Type declarado), sanitización de filename.
- **Security Headers**: `X-Content-Type-Options`, `X-Frame-Options`, `HSTS` (producción), `Referrer-Policy`, eliminación de `X-Powered-By`.
- **Input Validation**: Tipado estricto en request bodies de API.
- **SQLite seguro**: Todas las queries usan parameterized statements (sin riesgo de inyección).
- **Privacidad**: Registro protegido mediante código de invitación (sin fallback hardcodeado).
- **Clean Architecture**: Código modular y tipado estrictamente con TypeScript.

## 🚀 Inicio Rápido

Sigue estos pasos para tener tu portafolio funcionando en minutos.

### 1. Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/portfolio-fsx-nxt.git
cd portfolio-fsx-nxt

# Instalar dependencias
npm install
```

### 2. Configuración

Crea un archivo `.env.local` en la raíz:

```env
# Clave secreta para JWT (genera una cadena larga aleatoria)
JWT_SECRET=tu-clave-secreta-cambiar-en-produccion

# Código requerido para registrar el primer administrador
INVITATION_CODE=admin-secret-code
```

### 3. Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000).

### 4. Setup Inicial

1.  Navega a `/admin/register`.
2.  Ingresa el `INVITATION_CODE` que definiste y crea tu usuario.
3.  Accede al dashboard en `/admin`.
4.  **(Opcional)** Puedes poblar datos de ejemplo ejecutando:
    ```bash
    npx tsx scripts/seed-my-data.ts   # Carga datos de perfil de ejemplo
    ```

### 5. Despliegue con Docker 🐳

El proyecto está completamente preparado para Docker.

**Usando Docker Compose (Recomendado):**

```bash
# 1. Crea un archivo .env si no lo tienes (o edita docker-compose.yml directamente)
# JWT_SECRET=...
# INVITATION_CODE=...

# 2. Levanta el contenedor
docker-compose up -d --build
```

La aplicación estará disponible en `http://localhost:7373`. Los datos (base de datos SQLite e imágenes subidas) persistirán en las carpetas locales `./data` y `./public/uploads`.

**Construcción Manual Segura:**

```bash
docker build -t portfolio-fsx .
docker run -p 7373:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/public/uploads:/app/public/uploads \
  --user 1001:1001 \
  -e JWT_SECRET=tu_secreto \
  -e INVITATION_CODE=tu_codigo \
  portfolio-fsx
```

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/
│   │   ├── admin/           # Panel de Administración (9 páginas, layout unificado)
│   │   ├── api/             # API REST (Blog, Auth, Content, Projects, Upload)
│   │   ├── not-found.tsx    # Página 404 personalizada
│   │   └── ...              # Páginas públicas (Home, Sobre mí, Blog, Proyectos)
│   ├── components/          # Componentes Reutilizables (UI Kit)
│   ├── lib/
│   │   ├── auth/            # Lógica de JWT y autenticación
│   │   ├── db/              # Inicialización y consultas SQLite
│   │   ├── rate-limit.ts    # Rate limiter in-memory con sliding window
│   │   └── validate.ts      # Helper de validación de tipos para API
│   ├── proxy.ts             # CSP + Security Headers + Auth proxy
│   └── types/               # Definiciones completas de TypeScript
├── data/                    # Archivo de base de datos SQLite (versionado como seed inicial)
├── public/
│   └── uploads/             # Almacenamiento local de imágenes
└── scripts/                 # Scripts de utilidad (seeding, mantenimiento)
```

## 🛠️ Stack Tecnológico

| Tecnología | Propósito |
|------------|-----------|
| **Next.js 16 (App Router)** | Framework Fullstack React |
| **React 19** | Biblioteca de UI |
| **Tailwind CSS v4** | Estilizado Utility-First |
| **SQLite (`better-sqlite3`)** | Base de datos SQL embebida de alto rendimiento |
| **JWT** | Manejo de sesiones sin estado + verificación en proxy |
| **React Markdown** | Renderizado de contenido rico para el blog |
| **Playwright** | Tests end-to-end para componentes interactivos |

## 🎨 Personalización

Todo el contenido es editable desde el **Panel de Administración**. No necesitas tocar el código para:
- Cambiar tu nombre o título profesional.
- Actualizar tus redes sociales.
- Agregar nuevos trabajos o estudios.
- Publicar artículos.

Para cambios de **diseño visual** (colores, fuentes), edita `src/app/globals.css`:

```css
:root { 
  /* Paleta Dark Mode (Default) */
  --bg: #0a0a0a;
  --fg: #fafafa;
  --accent: #3b82f6; /* Cambia este color para actualizar la marca */
}
/* Paleta Light Mode (automático con el toggle) */
[data-theme="light"] {
  --bg: #ffffff;
  --fg: #0a0a0a;
}
```

> **Tip:** El administrador hereda automáticamente el tema claro/oscuro del sitio. No hay configuración separada.

## 🧪 Testing

El proyecto incluye una suite de tests completa para garantizar calidad de código:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch

# Verificar tipos TypeScript
npm run typecheck
```

### Suites de Tests
- **Auth Tests**: Hashing de contraseñas, generación/verificación de JWT
- **API Validation Tests**: Validación de email, password, códigos de invitación
- **Component Tests**: Smoke tests de componentes React
- **Utility Tests**: Formateo de fechas, generación de slugs, validaciones
- **E2E Tests (Playwright)**: Theme toggle en 3 escenarios (fresh load, localStorage light, localStorage dark)

## 🔄 CI/CD

El proyecto incluye un workflow de GitHub Actions para CI/CD automático:

### Pipeline Stages
1. **Lint & Type Check**: Valida código con ESLint y TypeScript
2. **Tests**: Ejecuta suite completa de tests
3. **Build**: Compila aplicación Next.js
4. **Docker Build**: Construye imagen Docker optimizada
5. **Deploy**: Despliega a AWS EC2 via SSH

### Secrets Requeridos (GitHub)
```
DOCKER_USERNAME       # Usuario de Docker Hub
DOCKER_PASSWORD       # Token de Docker Hub
AWS_HOST              # IP/hostname de tu EC2
AWS_USERNAME          # Usuario SSH (ej: ubuntu)
AWS_SSH_KEY           # Llave SSH privada
PRODUCTION_URL        # URL de tu sitio (ej: https://portfolio.fsxsys.org)
```

### Deploy Manual a AWS
```bash
ssh usuario@tu-servidor
cd /app/portfolio
./scripts/deploy.sh
```

## 📝 Scripts

- `npm run dev`: Servidor de desarrollo.
- `npm run build`: Compila para producción.
- `npm run start`: Inicia servidor de producción.
- `npm test`: Ejecuta tests.
- `npm run test:coverage`: Tests con reporte de coverage.
- `npm run typecheck`: Verificación de tipos TypeScript.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Si tienes ideas para mejorar el dashboard o añadir nuevas funcionalidades:

1.  Haz un Fork.
2.  Crea una rama (`git checkout -b feature/amazing-feature`).
3.  Commit tus cambios.
4.  Push a la rama.
5.  Abre un Pull Request.

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Eres libre de usarlo, modificarlo y distribuirlo para tu propio uso personal o comercial.

---
**Creado por [FSX](https://github.com/felix73sanchez)**
