# 🚀 Guía de Self-Hosting

Guía completa para desplegar Portfolio FSX en tu propio servidor.

## Opciones de Despliegue

| Método | Ideal Para | Dificultad |
|--------|------------|------------|
| **Docker Compose** | VPS, servidores dedicados | Fácil ⭐ |
| **Docker Run** | Pruebas rápidas | Fácil ⭐ |
| **Node.js Directo** | Hosting tradicional | Media ⭐⭐ |
| **Railway/Render** | Plataformas PaaS | Fácil ⭐ |

---

## Opción 1: Docker Compose (Recomendado)

### Prerrequisitos
- Docker y Docker Compose instalados
- Un VPS con al menos 512MB de RAM

### Pasos

1. **Clona el repositorio**
```bash
git clone https://github.com/felix73sanchez/portfolio-fsx-nxt.git
cd portfolio-fsx-nxt
```

2. **Configura las variables de entorno**

Crea o edita `docker-compose.yml`:
```yaml
version: '3.8'
services:
  portfolio:
    build: .
    ports:
      - "80:3000"
    volumes:
      - ./data:/app/data
      - ./public/uploads:/app/public/uploads
    environment:
      - NODE_ENV=production
      - JWT_SECRET=tu-clave-super-secreta-min-32-chars
      - INVITATION_CODE=tu-codigo-secreto-para-registro
    restart: unless-stopped
```

3. **Inicia la aplicación**
```bash
docker-compose up -d
```

4. **Accede a tu sitio**
```
http://ip-de-tu-servidor
```

5. **Registra el primer usuario admin**
```
http://ip-de-tu-servidor/admin/register
```
Usa tu `INVITATION_CODE` para registrarte.

---

## Opción 2: Docker Run (Sin Compose)

```bash
# Construir imagen
docker build -t portfolio-fsx .

# Crear directorios de datos
mkdir -p data public/uploads

# Ejecutar contenedor
docker run -d \
  --name portfolio \
  -p 80:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/public/uploads:/app/public/uploads \
  -e JWT_SECRET=tu-clave-super-secreta-min-32-chars \
  -e INVITATION_CODE=tu-codigo-secreto \
  --restart unless-stopped \
  portfolio-fsx
```

---

## Opción 3: Node.js Directo

### Prerrequisitos
- Node.js 20+
- npm 10+

### Pasos

1. **Clona e instala**
```bash
git clone https://github.com/felix73sanchez/portfolio-fsx-nxt.git
cd portfolio-fsx-nxt
npm install
```

2. **Configura el entorno**

Crea `.env.local`:
```env
JWT_SECRET=tu-clave-super-secreta-min-32-chars
INVITATION_CODE=tu-codigo-secreto
```

3. **Compila para producción**
```bash
npm run build
```

4. **Inicia el servidor**
```bash
NODE_ENV=production npm start
```

5. **Usa PM2 para gestión de procesos**
```bash
npm install -g pm2
pm2 start npm --name portfolio -- start
pm2 save
pm2 startup
```

---

## Opción 4: Railway / Render

### Railway
1. Conecta tu repositorio de GitHub
2. Añade variables de entorno:
   - `JWT_SECRET`
   - `INVITATION_CODE`
3. ¡Despliega!

### Render
1. Crea nuevo Web Service
2. Conecta el repositorio
3. Usa Dockerfile para el despliegue
4. Añade variables de entorno
5. ¡Despliega!

⚠️ **Nota:** Plataformas sin almacenamiento persistente (Vercel, Netlify) no funcionarán porque SQLite requiere un sistema de archivos escribible.

---

## Configuración de Proxy Inverso

### Configuración de Nginx

```nginx
server {
    listen 80;
    server_name tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Incrementar tamaño máximo de subida para imágenes
    client_max_body_size 10M;
}
```

### Con SSL (Certbot)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tudominio.com

# Auto-renovación
sudo certbot renew --dry-run
```

---

## Respaldo y Restauración

### Respaldo

```bash
# Respaldar base de datos
cp data/portfolio.db backups/portfolio-$(date +%Y%m%d).db

# Respaldar uploads
tar -czf backups/uploads-$(date +%Y%m%d).tar.gz public/uploads/
```

### Restauración

```bash
# Restaurar base de datos
cp backups/portfolio-20250115.db data/portfolio.db

# Restaurar uploads
tar -xzf backups/uploads-20250115.tar.gz -C public/
```

### Script de Respaldo Automatizado

Crea `scripts/backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/ruta/a/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Base de datos
cp data/portfolio.db $BACKUP_DIR/db_$DATE.db

# Uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz public/uploads/

# Mantener solo últimos 7 días
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Respaldo completado: $DATE"
```

Añadir a crontab:
```bash
crontab -e
# Añadir: 0 3 * * * /ruta/a/scripts/backup.sh
```

---

## Actualización

### Docker
```bash
cd portfolio-fsx-nxt
git pull origin main
docker-compose build --no-cache
docker-compose up -d
```

### Node.js Directo
```bash
cd portfolio-fsx-nxt
git pull origin main
npm install
npm run build
pm2 restart portfolio
```

---

## Solución de Problemas

### Error de Permisos de Base de Datos
```
Error: SQLITE_CANTOPEN
```

**Solución:**
```bash
# Arreglar permisos del directorio data
sudo chown -R 1001:1001 data/
chmod 755 data/
```

### Puerto Ya en Uso
```bash
# Encontrar proceso usando el puerto
lsof -i :3000

# Terminarlo
kill -9 <PID>
```

### El Contenedor No Arranca
```bash
# Revisar logs
docker-compose logs -f

# Revisar estado del contenedor
docker ps -a
```

### Error de JWT_SECRET
```
Error: JWT_SECRET is not defined
```

**Solución:** Asegúrate de que `JWT_SECRET` esté definido en tu entorno. En producción, la app se niega a arrancar sin él.

---

## Referencia de Variables de Entorno

| Variable | Requerida | Por Defecto | Descripción |
|----------|-----------|-------------|-------------|
| `JWT_SECRET` | **Sí** | - | Clave secreta para firmar JWT (mín 32 chars recomendado) |
| `INVITATION_CODE` | **Sí** | - | Código requerido para registrar nuevos usuarios |
| `NODE_ENV` | No | development | Establecer a `production` para builds de producción |
| `PORT` | No | 3000 | Puerto en el que corre el servidor |
| `HOSTNAME` | No | 0.0.0.0 | Hostname al que bindear |
| `DATABASE_PATH` | No | data/portfolio.db | Ruta al archivo de base de datos SQLite |

---

## Lista de Verificación de Seguridad

- [ ] Establecer `JWT_SECRET` fuerte (32+ caracteres aleatorios)
- [ ] Usar `INVITATION_CODE` único
- [ ] Habilitar HTTPS con certificado SSL válido
- [ ] Configurar firewall (solo permitir puertos 80/443)
- [ ] Respaldos regulares configurados
- [ ] Mantener Docker/Node.js actualizados
- [ ] Monitorear recursos del servidor
