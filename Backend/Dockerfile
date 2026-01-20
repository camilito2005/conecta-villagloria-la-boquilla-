

# Imagen base de Node
FROM node:20

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar solo package.json y package-lock.json primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código del backend
COPY . .

# Exponer el puerto de la app
EXPOSE 3000

# Comando por defecto (modo desarrollo con nodemon)
# CMD ["npm", "run", "dev"]
CMD ["npm", "start"]
