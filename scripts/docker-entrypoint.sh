#!/bin/sh
set -e

# Arreglar permisos de las carpetas críticas
# Si están montadas como volúmenes del host, esto asegurará que el usuario 1001 pueda escribir
echo "Fixing permissions for data directories..."

# Crear directorios si no existen
mkdir -p /app/data
mkdir -p /app/public/uploads

# Cambiar el dueño de las carpetas al usuario nextjs (UID 1001)
chown -R nextjs:nodejs /app/data
chown -R nextjs:nodejs /app/public/uploads

# Ejecutar el comando pasado (la app) como el usuario nextjs usando su-exec (Alpine)
echo "Starting application as user nextjs..."
exec su-exec nextjs "$@"
