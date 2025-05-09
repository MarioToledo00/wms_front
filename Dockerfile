# Etapa 1: build del proyecto
FROM node:22.13.1 AS builder

WORKDIR /app

# Copiar archivos necesarios
COPY package*.json ./
RUN npm install -g @angular/cli@19.0.4
RUN npm install

COPY . .

# Compilar la app
RUN ng build --configuration=production

# Etapa 2: contenedor liviano para servir la app
FROM nginx:alpine

# Elimina el contenido default del Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos construidos a Nginx
COPY --from=builder /app/dist/* /usr/share/nginx/html

# Copia configuración personalizada de nginx (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
