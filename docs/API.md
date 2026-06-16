# 🔌 Referencia de API

Documentación completa de la API REST de Portfolio FSX.

## URL Base

```
Desarrollo: http://localhost:3000
Producción: https://tudominio.com
```

## Autenticación

La autenticación es mediante cookie `httpOnly`. Al iniciar sesión o registrarse,
el servidor establece automáticamente la cookie `auth-token` con un JWT firmado.
El navegador la envía en cada petición a rutas protegidas (`/api/*`, `/admin/*`).

No es necesario enviar un header `Authorization` manualmente — la cookie se maneja
de forma transparente en peticiones same-origin.

---

## 🔐 Endpoints de Autenticación

### POST `/api/auth/register`

Registra un nuevo usuario administrador. Requiere código de invitación.

**Cuerpo de la Petición:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "contraseñasegura123",
  "invitationCode": "tu-codigo-de-invitacion"
}
```

**Respuesta (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "juan@ejemplo.com",
    "name": "Juan Pérez"
  }
}
```
> El token JWT se establece automáticamente como cookie `httpOnly` (`auth-token`).

**Errores:**
- `400`: Campos faltantes o contraseña muy corta (mínimo 6 caracteres)
- `403`: Código de invitación inválido
- `409`: Email ya registrado

---

### POST `/api/auth/login`

Autentica un usuario existente.

**Cuerpo de la Petición:**
```json
{
  "email": "juan@ejemplo.com",
  "password": "contraseñasegura123"
}
```

**Respuesta (200):**
```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": 1,
    "email": "juan@ejemplo.com",
    "name": "Juan Pérez"
  }
}
```
> El token JWT se establece automáticamente como cookie `httpOnly` (`auth-token`).

**Errores:**
- `400`: Email o contraseña faltantes
- `401`: Credenciales inválidas

---

### POST `/api/auth/logout`

Cierra la sesión del usuario actual (limpia la cookie de autenticación).

**Respuesta (200):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

### POST `/api/auth/change-password`

Cambia la contraseña del usuario autenticado.

> La autenticación se valida mediante la cookie `auth-token`.

**Cuerpo de la Petición:**
```json
{
  "currentPassword": "contraseñaanterior123",
  "newPassword": "nuevacontraseña456",
  "confirmPassword": "nuevacontraseña456"
}
```

**Respuesta (200):**
```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

**Errores:**
- `400`: Campos faltantes o contraseñas no coinciden
- `401`: No autenticado
- `403`: Contraseña actual incorrecta

---

## 📝 Endpoints del Blog

### GET `/api/blog`

Obtiene todos los posts del blog.

**Comportamiento:**
- Usuario autenticado (admin): devuelve **todos** los posts (públicos y borradores).
- Público anónimo: devuelve **solo los publicados**.

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "slug": "mi-primer-post",
    "title": "Mi Primer Post",
    "description": "Una breve descripción",
    "content": "# Contenido en Markdown...",
    "coverImage": "/uploads/cover.jpg",
    "tags": ["javascript", "react"],
    "published": true,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z",
    "publishedAt": "2025-01-15T10:30:00Z",
    "authorId": 1,
    "authorName": "Juan Pérez"
  }
]
```

---

### GET `/api/blog/slug/[slug]`

Obtiene un post del blog por su slug.

**Respuesta (200):**
```json
{
  "id": 1,
  "slug": "mi-primer-post",
  "title": "Mi Primer Post",
  ...
}
```

**Errores:**
- `404`: Post no encontrado

---

### POST `/api/blog`

Crea un nuevo post del blog.

> La autenticación se valida mediante la cookie `auth-token`.

**Cuerpo de la Petición:**
```json
{
  "title": "Mi Nuevo Post",
  "description": "Descripción del post",
  "content": "# Contenido en Markdown aquí",
  "coverImage": "/uploads/cover.jpg",
  "tags": ["etiqueta1", "etiqueta2"],
  "published": false
}
```

**Respuesta (201):**
```json
{
  "id": 2,
  "slug": "mi-nuevo-post",
  "title": "Mi Nuevo Post",
  ...
}
```

---

### PUT `/api/blog/[id]`

Actualiza un post existente del blog.

> La autenticación se valida mediante la cookie `auth-token`.

**Cuerpo de la Petición:** Igual que POST (todos los campos opcionales)

**Respuesta (200):** Objeto del post actualizado

---

### DELETE `/api/blog/[id]`

Elimina un post del blog.

> La autenticación se valida mediante la cookie `auth-token`.

**Respuesta (200):**
```json
{
  "message": "Post eliminado exitosamente"
}
```

---

## 🎨 Endpoints de Proyectos

### GET `/api/projects`

Obtiene todos los proyectos.

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "title": "Nombre del Proyecto",
    "description": "Descripción del proyecto",
    "technologies": ["React", "Node.js"],
    "coverImage": "/uploads/cover.jpg",
    "links": [
      {"label": "GitHub", "url": "https://github.com/..."},
      {"label": "Demo", "url": "https://demo.com"}
    ],
    "displayOrder": 0,
    "visible": true,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
]
```

---

### POST `/api/projects`

Crea un nuevo proyecto.

> La autenticación se valida mediante la cookie `auth-token`.

**Cuerpo de la Petición:**
```json
{
  "title": "Nuevo Proyecto",
  "description": "Descripción aquí",
  "technologies": ["React", "TypeScript"],
  "coverImage": "/uploads/cover.jpg",
  "links": [
    {"label": "GitHub", "url": "https://github.com/..."}
  ],
  "displayOrder": 0,
  "visible": true
}
```

> `coverImage` es opcional. Si se omite, las tarjetas de proyecto muestran un
> fondo degradado con el monograma del título como respaldo.

---

### PUT `/api/projects/[id]`

Actualiza un proyecto.

> La autenticación se valida mediante la cookie `auth-token`.

---

### DELETE `/api/projects/[id]`

Elimina un proyecto.

> La autenticación se valida mediante la cookie `auth-token`.

---

## 👤 Endpoints de Configuración del Sitio

### GET `/api/site/config`

Obtiene la configuración del sitio/perfil (público).

**Respuesta (200):**
```json
{
  "name": "Juan Pérez",
  "title": "Desarrollador Full Stack",
  "subtitle": "Construyendo cosas geniales",
  "location": "Ciudad de México, México",
  "about": "Texto sobre mí...",
  "email": "juan@ejemplo.com",
  "phone": "+5212345678",
  "linkedin": "https://linkedin.com/in/juanperez",
  "github": "https://github.com/juanperez",
  "twitter": "https://x.com/juanperez"
}
```

---

### PUT `/api/site/config`

Actualiza la configuración del sitio.

> La autenticación se valida mediante la cookie `auth-token`.

**Cuerpo de la Petición:** Cualquier subconjunto de campos de configuración

---

## 💼 Endpoints de Experiencia Laboral

### GET `/api/site/experiences`

Obtiene todas las experiencias laborales.

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "title": "Desarrollador Senior",
    "company": "Tech Corp",
    "location": "Remoto",
    "startDate": "2022-01-01",
    "endDate": null,
    "current": true,
    "responsibilities": [
      "Liderar equipo de desarrollo",
      "Revisión de código"
    ],
    "displayOrder": 0
  }
]
```

---

### POST `/api/site/experiences`

Crea una nueva experiencia.

> La autenticación se valida mediante la cookie `auth-token`.

---

### PUT `/api/site/experiences/[id]`

Actualiza una experiencia.

---

### DELETE `/api/site/experiences/[id]`

Elimina una experiencia.

---

## 🎓 Endpoints de Educación

### GET `/api/site/education`

Obtiene todas las entradas de educación.

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "degree": "Ingeniería en Sistemas",
    "institution": "Universidad Nacional",
    "location": "Ciudad, País",
    "startYear": 2018,
    "endYear": 2022,
    "current": false,
    "description": "Licenciatura",
    "displayOrder": 0
  }
]
```

---

### POST `/api/site/education`

Crea una entrada de educación.

> La autenticación se valida mediante la cookie `auth-token`.

---

### PUT `/api/site/education/[id]`

Actualiza una entrada de educación.

---

### DELETE `/api/site/education/[id]`

Elimina una entrada de educación.

---

## 🛠️ Endpoints de Habilidades

### GET `/api/site/skills`

Obtiene todas las habilidades agrupadas por categoría.

**Respuesta (200):**
```json
{
  "Frontend": ["React", "Vue.js", "TypeScript"],
  "Backend": ["Node.js", "Python", "Go"],
  "DevOps": ["Docker", "AWS", "CI/CD"]
}
```

---

### PUT `/api/site/skills`

Actualiza las habilidades de una categoría.

> La autenticación se valida mediante la cookie `auth-token`.

**Cuerpo de la Petición:**
```json
{
  "category": "Frontend",
  "skills": ["React", "Vue.js", "Angular"]
}
```

---

## 📤 Endpoint de Subida de Archivos

### POST `/api/upload`

Sube un archivo de imagen.

> La autenticación se valida mediante la cookie `auth-token`.

**Petición:** `multipart/form-data` con campo `file`

**Respuesta (200):**
```json
{
  "url": "/uploads/1705312345678-imagen.jpg"
}
```

**Errores:**
- `400`: No se proporcionó archivo o tipo de archivo inválido
- `401`: No autenticado

**Tipos de archivo aceptados:** `image/jpeg`, `image/png`, `image/gif`, `image/webp`

---

## Formato de Respuesta de Error

Todos los errores siguen este formato:

```json
{
  "error": "Mensaje de error"
}
```

Códigos de estado HTTP comunes:
- `400`: Petición Incorrecta (error de validación)
- `401`: No Autorizado (token faltante o inválido)
- `403`: Prohibido (permisos insuficientes)
- `404`: No Encontrado
- `500`: Error Interno del Servidor
