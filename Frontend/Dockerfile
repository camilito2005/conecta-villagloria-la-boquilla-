FROM node:20-alpine

# Carpeta de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json primero (mejora la cache)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto que usa Vite
EXPOSE 5173

# Arrancar Vite automáticamente
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
