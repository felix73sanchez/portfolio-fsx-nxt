# Portfolio FSX - CMS Personal & Blog Open Source

> Un portafolio profesional y sistema de gestión de contenidos (CMS) personal construido con tecnologías web modernas. Diseñado para desarrolladores que quieren un sitio personal elegante, rápido y totalmente autogestionable.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![SQLite](https://img.shields.io/badge/SQLite-3-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Características Principales

### 🎨 Frontend "Premium"
- **Diseño Moderno**: Estética minimalista con soporte nativo para modo oscuro/claro y efectos glassmorphism.
- **Totalmente Responsivo**: Se adapta perfectamente a móviles, tablets y escritorio.
- **Rendimiento Máximo**: Renderizado estático y dinámico optimizado con Next.js App Router.

### ⚙️ Panel de Administración (CMS)
¡Olvídate de editar código para actualizar tu información!
- **Dashboard estilo "Bento Grid"**: Vista general de tu actividad con widgets interactivos y diseño moderno.
- **Gestión de Perfil**: Edita tu nombre, título, bio, y redes sociales directamente desde el admin.
- **Gestión de Contenido (CV)**: Añade, edita y reordena Experiencia Laboral, Educación y Habilidades.
- **Gestión de Proyectos**: Portafolio completo con imágenes, tecnologías y enlaces.
- **Sistema de Blog**: Editor Markdown con previsualización en vivo, subida de imágenes drag & drop y estados (borrador/publicado).

### 🛡️ Seguridad y Arquitectura
- **Autenticación**: Sistema JWT propio seguro sin dependencias externas pesadas.
- **Base de Datos**: SQLite (vía `better-sqlite3`) para una portabilidad total sin necesidad de configurar servidores SQL externos.
- **Privacidad**: Registro protegido mediante código de invitación.
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
    npm run script:seed      # Carga datos base
    npm run script:profile   # Carga perfil de ejemplo
    ```

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/
│   │   ├── admin/           # Rutas del Panel de Administración (Protected)
│   │   ├── api/             # API REST (Blog, Content, Profile, etc.)
│   │   └── ...              # Páginas públicas (Home, Blog, Proyectos)
│   ├── components/          # Componentes Reutilizables (UI Kit)
│   ├── lib/
│   │   ├── auth/            # Lógica de JWT y protección
│   │   └── db/              # Inicialización y consultas SQLite
│   └── types/               # Definiciones completas de TypeScript
├── data/                    # Archivo de base de datos (ignorado por git)
├── public/
│   └── uploads/             # Almacenamiento local de imágenes
└── scripts/                 # Scripts de utilidad (seeding, mantenimiento)
```

## 🛠️ Stack Tecnológico

| Tecnología | Propósito |
|------------|-----------|
| **Next.js 15 (App Router)** | Framework Fullstack React |
| **React 19** | Biblioteca de UI |
| **Tailwind CSS** | Estilizado Utility-First |
| **SQLite (`better-sqlite3`)** | Base de datos SQL embebida de alto rendimiento |
| **Jose / JWT** | Manejo de sesiones sin estado |
| **React Markdown** | Renderizado de contenido rico para el blog |

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
```

## 📝 Scripts

- `npm run dev`: Servidor de desarrollo.
- `npm run build`: Compila para producción.
- `npm run start`: Inicia servidor de producción.
- `npm run script:seed`: Crea tablas e inserta datos iniciales.

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
**Creado con ❤️ por [Felix Sánchez](https://github.com/felix73sanchez)**
