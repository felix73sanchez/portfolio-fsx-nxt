# 🏗️ Arquitectura

Visión técnica de la arquitectura de Portfolio FSX.

## Visión General del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                      Navegador del Cliente                       │
├─────────────────────────────────────────────────────────────────┤
│                    Aplicación Next.js                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Sitio Público│  │ Panel Admin  │  │   Rutas de API       │  │
│  │  (SSR/SSG)   │  │  (CSR)       │  │   (/api/*)          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                      Capa de Middleware                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware de Autenticación (verificación JWT)          │  │
│  └──────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                      Lógica de Negocio                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Auth Lib   │  │  Capa de BD  │  │  Subida de Archivos  │  │
│  │  (JWT/Hash)  │  │  (SQLite)    │  │  (Almacen. Local)    │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                      Almacenamiento de Datos                     │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │  Base de Datos SQLite    │  │  Sistema de Archivos       │  │
│  │  (data/portfolio.db)     │  │  (public/uploads/)         │  │
│  └──────────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Estructura de Directorios

```
portfolio-fsx-nxt/
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # Pipeline de GitHub Actions
├── __tests__/               # Suites de pruebas
│   ├── api/                 # Tests de validación de API
│   ├── components/          # Smoke tests de componentes
│   ├── lib/                 # Tests unitarios de librerías
│   └── utils/              # Tests de funciones utilitarias
├── data/                    # Base de datos SQLite (ignorada por git)
│   └── portfolio.db
├── docs/                    # Documentación
├── public/
│   └── uploads/            # Imágenes subidas por usuarios
├── scripts/
│   ├── deploy.sh           # Script de despliegue para AWS
│   └── docker-entrypoint.sh # Punto de entrada de Docker
├── src/
│   ├── app/
│   │   ├── admin/          # Páginas del panel admin (protegidas)
│   │   │   ├── dashboard/
│   │   │   ├── posts/
│   │   │   ├── projects/
│   │   │   ├── content/
│   │   │   └── profile/
│   │   ├── api/            # Rutas de API REST
│   │   │   ├── auth/       # Endpoints de autenticación
│   │   │   ├── blog/       # CRUD del blog
│   │   │   ├── projects/   # CRUD de proyectos
│   │   │   ├── site/       # Config del sitio, experiencias, habilidades
│   │   │   └── upload/     # Subida de archivos
│   │   ├── blog/           # Páginas públicas del blog
│   │   └── proyectos/      # Página pública de proyectos
│   ├── components/         # Componentes de UI reutilizables
│   │   ├── AdminLayout.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeProvider.tsx
│   ├── lib/
│   │   ├── auth/           # JWT, hashing de contraseñas, funciones de usuario
│   │   └── db/             # Inicialización y consultas SQLite
│   └── types/              # Definiciones de tipos TypeScript
├── docker-compose.yml
├── Dockerfile
└── next.config.ts
```

## Detalles del Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 16 | Meta-framework React con App Router |
| React | 19 | Librería de UI con nuevo compilador |
| TypeScript | 5 | Seguridad de tipos |
| Tailwind CSS | 4 | Estilos utility-first |

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js API Routes | 16 | Endpoints de API REST |
| better-sqlite3 | 12 | SQLite de alto rendimiento |
| jsonwebtoken | 9 | Generación de tokens JWT |
| jose | 6 | Verificación de JWT (compatible con Edge) |
| bcryptjs | 3 | Hashing de contraseñas |

### Infraestructura

| Tecnología | Propósito |
|------------|-----------|
| Docker | Containerización |
| GitHub Actions | Pipeline de CI/CD |
| SQLite | Base de datos embebida |
| Node.js 20 | Runtime |

## Flujo de Autenticación

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Cliente │          │  Servidor │          │    BD    │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │  POST /api/auth/login                     │
     │  {email, password}  │                     │
     │────────────────────►│                     │
     │                     │  Obtener usuario    │
     │                     │────────────────────►│
     │                     │◄────────────────────│
     │                     │  Comparar contraseña│
     │                     │  (bcrypt.compare)   │
     │                     │                     │
     │                     │  Generar JWT        │
     │                     │  Establecer cookie  │
     │                     │  HTTP-only          │
     │  {token, user}      │                     │
     │◄────────────────────│                     │
     │                     │                     │
     │  Petición a /admin/*│                     │
     │  (con cookie)       │                     │
     │────────────────────►│                     │
     │                     │                     │
     │    Middleware:      │                     │
     │    Verificar JWT    │                     │
     │    (librería jose)  │                     │
     │                     │                     │
     │  Página renderizada │                     │
     │◄────────────────────│                     │
```

## Esquema de Base de Datos

### users (usuarios)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    createdAt TEXT NOT NULL
);
```

### blog_posts (posts del blog)
```sql
CREATE TABLE blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    coverImage TEXT,
    tags TEXT,          -- Array JSON
    published INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    publishedAt TEXT,
    authorId INTEGER REFERENCES users(id)
);
```

### projects (proyectos)
```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT NOT NULL,  -- Array JSON
    links TEXT,                  -- Array JSON
    displayOrder INTEGER DEFAULT 0,
    visible INTEGER DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);
```

### site_config (configuración del sitio)
```sql
CREATE TABLE site_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);
```

### experiences (experiencias laborales)
```sql
CREATE TABLE experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    startDate TEXT NOT NULL,
    endDate TEXT,
    current INTEGER DEFAULT 0,
    responsibilities TEXT NOT NULL,  -- Array JSON
    displayOrder INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);
```

### skills (habilidades)
```sql
CREATE TABLE skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    displayOrder INTEGER DEFAULT 0
);
```

### education (educación)
```sql
CREATE TABLE education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    location TEXT,
    startYear INTEGER NOT NULL,
    endYear INTEGER,
    current INTEGER DEFAULT 0,
    description TEXT,
    displayOrder INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);
```

## Consideraciones de Seguridad

### Autenticación
- Contraseñas hasheadas con bcrypt (10 rondas)
- Tokens JWT expiran en 7 días
- Cookies HTTP-only previenen ataques XSS
- Middleware protege todas las rutas `/admin/*`

### Variables de Entorno
| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `JWT_SECRET` | **Sí (producción)** | Secreto para firmar JWTs. La app no arranca en producción sin esto. |
| `INVITATION_CODE` | Sí | Código requerido para registrar nuevos usuarios |
| `DATABASE_PATH` | No | Ruta personalizada al archivo de base de datos SQLite |

### Seguridad de Docker
- Usuario no-root (`nextjs:nodejs`, UID 1001)
- npm/yarn eliminados de la imagen de producción
- Imagen base Alpine mínima
- 0 vulnerabilidades HIGH/CRITICAL conocidas
