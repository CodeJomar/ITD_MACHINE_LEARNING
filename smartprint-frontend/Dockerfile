FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos archivos de dependencias e instalamos
COPY package.json package-lock.json* ./
RUN npm install

# Copiamos todo el código fuente
COPY . .

# Inyectamos variables de entorno para que Vite las asimile en el build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

# Construimos la app para producción
RUN npm run build

# ==========================================
# Etapa 2: Servidor Web (Nginx)
# ==========================================
FROM nginx:alpine

# Eliminamos la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestra configuración especial para Single Page Applications
COPY nginx.conf /etc/nginx/conf.d/

# Copiamos los archivos compilados de la Etapa 1 al servidor Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto HTTP
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]