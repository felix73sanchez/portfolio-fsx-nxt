# 🤝 Contribuir

¡Gracias por considerar contribuir a Portfolio FSX! Este documento proporciona guías para contribuir.

## Código de Conducta

Sé respetuoso e inclusivo. Damos la bienvenida a colaboradores de todos los orígenes y niveles de experiencia.

## ¿Cómo Puedo Contribuir?

### 🐛 Reportar Bugs

1. Verifica si el bug ya existe en [Issues](https://github.com/felix73sanchez/portfolio-fsx-nxt/issues)
2. Crea un nuevo issue con:
   - Título claro y descriptivo
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Capturas de pantalla si aplica
   - Detalles del entorno (SO, versión de Node, navegador)

### 💡 Sugerir Características

1. Abre un issue con la etiqueta `enhancement`
2. Describe la característica y su caso de uso
3. Proporciona mockups/ejemplos si es posible

### 📝 Pull Requests

1. Haz un Fork del repositorio
2. Crea una rama de feature: `git checkout -b feature/caracteristica-increible`
3. Realiza tus cambios
4. Ejecuta tests: `npm test`
5. Ejecuta linting: `npm run lint`
6. Commit con mensaje descriptivo
7. Push a tu fork
8. Abre un Pull Request

---

## Configuración de Desarrollo

### Prerrequisitos
- Node.js 20+
- npm 10+

### Configuración

```bash
# Clona tu fork
git clone https://github.com/TU-USUARIO/portfolio-fsx-nxt.git
cd portfolio-fsx-nxt

# Instala dependencias
npm install

# Crea archivo de entorno
cp .env.example .env.local

# Inicia servidor de desarrollo
npm run dev
```

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Con coverage
npm run test:coverage

# Modo watch
npm run test:watch

# Verificación de tipos
npm run typecheck
```

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── admin/       # Páginas del panel admin
│   ├── api/         # Rutas de API
│   └── ...          # Páginas públicas
├── components/      # Componentes reutilizables
├── lib/
│   ├── auth/        # Lógica de autenticación
│   └── db/          # Funciones de base de datos
└── types/           # Tipos TypeScript
```

---

## Guías de Código

### TypeScript
- Usa tipos estrictos (evita `any`)
- Define interfaces para todas las estructuras de datos
- Usa tipos de retorno apropiados para funciones

### React
- Usa componentes funcionales con hooks
- Mantén los componentes pequeños y enfocados
- Usa tipos de props apropiados

### Rutas de API
- Retorna códigos de estado HTTP apropiados
- Incluye mensajes de error en español (idioma del proyecto)
- Valida los datos de entrada

### Estilos
- Usa utilidades de Tailwind CSS
- Sigue las convenciones existentes de colores/espaciado
- Soporta modo oscuro

---

## Mensajes de Commit

Usa commits convencionales:

```
feat: agregar funcionalidad de cambio de contraseña
fix: resolver problema de redirección en login
docs: actualizar documentación de API
style: formatear código con prettier
refactor: simplificar middleware de auth
test: agregar tests unitarios para auth
chore: actualizar dependencias
```

---

## Proceso de Pull Request

1. Actualiza la documentación si es necesario
2. Agrega tests para nuevas características
3. Asegúrate de que todos los tests pasen
4. Actualiza el CHANGELOG si aplica
5. Solicita revisión de los mantenedores

### Checklist de PR

- [ ] El código sigue el estilo del proyecto
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] Sin errores de TypeScript
- [ ] Todos los tests pasan
- [ ] Mensajes de commit siguen la convención

---

## Áreas para Contribuir

### Buenos Primeros Issues
- Mejorar mensajes de error
- Agregar más tests
- Corregir typos en documentación
- Mejorar responsividad móvil

### Ideas de Características
- Soporte multi-idioma (i18n)
- Optimización de imágenes
- Dashboard de analíticas
- Exportar datos como JSON
- Notificaciones por email
- Autenticación de dos factores

---

## ¿Preguntas?

- Abre una Discusión en GitHub
- Revisa issues y PRs existentes
- Lee la documentación en `/docs`

¡Gracias por contribuir! 🎉
