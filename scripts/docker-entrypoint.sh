#!/bin/sh
set -e

# Arreglar permisos de las carpetas críticas
# Si están montadas como volúmenes del host, esto asegurará que el usuario 1001 pueda escribir
echo "Fixing permissions for data directories..."

# Crear directorios si no existen
mkdir -p /app/data
mkdir -p /app/public/uploads

# Cambiar el dueño de las carpetas al usuario nextjs (UID 1001)
# Usamos chown directamente porque estamos corriendo como root
chown -R nextjs:nodejs /app/data
chown -R nextjs:nodejs /app/public/uploads

# Ejecutar el comando pasado (la app) como el usuario nextjs usando gosu
echo "Starting application as user nextjs..."
# Si gosu está instalado, úsalo. Si no, intenta su-exec o fallback
if command -v gosu > /dev/null; then
    exec gosu nextjs "$@"
else
    # Fallback básico si no hay tools (aunque instalaremos gosu)
    echo "Warning: gosu not found, running as root (not recommended)"
    exec "$@"
fi
