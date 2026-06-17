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

## 🚀 Guía de Instalación (para no técnicos)

> ¿Querés tu propio portafolio + blog funcionando sin depender de Wix, WordPress o Medium? Esta guía te lleva paso a paso.

### Qué necesitás

- **Un VPS** (servidor virtual): podés alquilar uno desde ~$5/mes en [Hetzner](https://www.hetzner.com/), [DigitalOcean](https://www.digitalocean.com/), [Linode](https://www.linode.com/) o [Vultr](https://www.vultr.com/). Con 1GB de RAM y 25GB de disco alcanza.
- **Un dominio** (opcional pero recomendado): ej. `tunombre.com`. Podés comprarlo en [Namecheap](https://www.namecheap.com/), [Cloudflare](https://www.cloudflare.com/) o [Porkbun](https://porkbun.com/).
- **Acceso SSH** al servidor — tu proveedor de VPS te da las credenciales al crearlo.

---

### Paso 1: Conectarte al servidor

Cuando crees tu VPS, el proveedor te va a dar una **IP** (como `203.0.113.10`), un **usuario** (generalmente `root`) y una **contraseña**.

En tu computadora, abrí la Terminal (Mac/Linux) o PowerShell (Windows) y ejecutá:

```bash
ssh root@203.0.113.10
```

Reemplazá `203.0.113.10` con la IP de tu servidor. Te va a pedir la contraseña — la escribís y das Enter (no se ve mientras escribís, es normal).

> **¿No tenés terminal?** Si estás en Windows, instalá [Windows Terminal](https://apps.microsoft.com/detail/9n0dx20hk701) desde la Microsoft Store. En Mac, ya viene incluida (buscá "Terminal" en Spotlight).

---

### Paso 2: Instalar Docker (una sola vez)

Docker es el programa que va a correr el portafolio. Pegá estos comandos uno por uno en la terminal del servidor:

```bash
# Actualizar paquetes del sistema
apt update && apt upgrade -y

# Instalar Docker (la herramienta principal)
curl -fsSL https://get.docker.com | sh

# Verificar que Docker quedó bien instalado
docker --version
```

Si ves un número de versión, está listo.

---

### Paso 3: Descargar el proyecto

```bash
git clone https://github.com/felix73sanchez/portfolio-fsx-nxt.git
cd portfolio-fsx-nxt
```

---

### Paso 4: Configurar

Creá un archivo de configuración con tus datos:

```bash
nano .env
```

Dentro del editor (nano), escribí estas dos líneas reemplazando los valores por los tuyos:

```env
JWT_SECRET=poné-acá-una-frase-larga-y-azarosa-que-solo-vos-sepas
INVITATION_CODE=poné-acá-un-código-secreto-para-registrarte
```

**Explicación:**
- `JWT_SECRET`: es la clave que protege las sesiones de los usuarios. Poné cualquier frase larga y difícil de adivinar.
- `INVITATION_CODE`: es el código que vas a necesitar para crear tu primer usuario. Después del registro inicial podés cambiarlo.

Guardá con `Ctrl + O`, Enter, y salí con `Ctrl + X`.

---

### Paso 5: Levantar el portafolio

```bash
docker compose up -d --build
```

Este comando puede tardar unos minutos la primera vez (está descargando dependencias y compilando). Al finalizar vas a ver algo como:

```
✔ Container portfolio-fsx  Started
```

**Tu portafolio ya está corriendo** en `http://tu-ip-del-servidor:7373`.

---

### Paso 6: Crear tu cuenta de administrador

1. En tu navegador, andá a `http://tu-ip-del-servidor:7373/admin/register`.
2. Ingresá el `INVITATION_CODE` que pusiste en el `.env`.
3. Completá tu email, nombre y contraseña.
4. **Ya sos administrador.** Entrás a `/admin` y ves el panel.

---

### Paso 7: Ponerle tu dominio (opcional)

Si tenés un dominio, estos son los pasos generales:

1. En tu proveedor de dominio, creá un registro **A** que apunte a la IP de tu servidor.
2. Instalá un proxy reverso como **Nginx Proxy Manager** o **Caddy** usando Docker para manejar SSL (certificado HTTPS gratis con Let's Encrypt).
3. Configurá el proxy para que redirija las peticiones a `http://localhost:7373`.

> Si esto te suena chino, el portafolio funciona perfecto solo con la IP. El HTTPS se puede agregar después cuando tengas más confianza.

---

> **Ya está todo listo.** La primera vez que arranca la aplicación, se cargan automáticamente datos de perfil, experiencia laboral, educación, habilidades técnicas y proyectos. No necesitás hacer nada extra.

---

### Comandos útiles para el día a día

```bash
# Ver si el portafolio está corriendo
docker ps

# Ver los registros (logs)
docker compose logs -f

# Frenar el portafolio
docker compose down

# Actualizar a la última versión
git pull
docker compose up -d --build
```

---

### ¿Algo no funciona?

- **Puerto ocupado**: si el puerto 7373 ya está en uso, cambiá el puerto en `docker-compose.yml` (línea `"7373:3000"` → `"8080:3000"`).
- **No veo el sitio**: asegurate de que el firewall del servidor permita conexiones en el puerto. Probá con `ufw allow 7373` si usás UFW.
- **Se me olvidó la contraseña**: eliminá el archivo `data/database.sqlite` y registrate de nuevo (perdés datos, pero podés volver a cargarlos).
- **Otro problema**: abrí un [issue en GitHub](https://github.com/felix73sanchez/portfolio-fsx-nxt/issues), intentamos ayudarte.

---
> **Para desarrolladores**: si sabés manejar la terminal y preferís los comandos directos, la sección de abajo es para vos.

---

## 🚀 Inicio Rápido para Devs

```bash
# Clonar e instalar
git clone https://github.com/felix73sanchez/portfolio-fsx-nxt.git
cd portfolio-fsx-nxt
npm install

# Configurar (crear .env.local)
# JWT_SECRET=clave-secreta
# INVITATION_CODE=codigo-invitacion

# Desarrollo
npm run dev        # http://localhost:3000

# Docker producción
docker compose up -d --build   # http://localhost:7373
```

### Setup Inicial
1. Andá a `/admin/register` e ingresá el `INVITATION_CODE`.
2. Creá tu usuario — el primero es **owner** automáticamente.
3. Accedé al dashboard en `/admin`.



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
