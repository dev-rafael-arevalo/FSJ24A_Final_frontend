# Proyecto Final de Frontend en React con Vite

Este repositorio contiene el proyecto final de frontend desarrollado en React utilizando Vite como bundler para el curso de Full Stack JavaScript 24A. El objetivo principal es crear una interfaz de usuario interactiva que consuma la API RESTful proporcionada por el backend en Laravel.

## Integrantes del Grupo 5

- Gabriel Antonio Castillo Alegría
- Rafael Edgardo Arévalo Vanegas
- Iván Ernesto Calderón Polanco
- Josué Mauricio Benavides Batres
- Mateo Canales
- Mario José Pinto Amaya

## Requisitos

- Node.js 16.0 o superior
- npm o yarn

## Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/dev-rafael-arevalo/FSJ24A_Final_frontend.git
   ```

2. **Instalar dependencias**:

   ```bash
   cd FSJ24A_Final_frontend
   npm install
   ```

   O si prefieres usar yarn:

   ```bash
   yarn install
   ```

3. **Configurar variables de entorno**:

   Crea un archivo `.env` en la raíz del proyecto y agrega la URL base de la API del backend:

   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

   Asegúrate de que la URL coincida con la dirección donde está corriendo el servidor de backend.

4. **Iniciar el servidor de desarrollo**:

   ```bash
   npm run dev
   ```

   O si usas yarn:

   ```bash
   yarn dev
   ```

   La aplicación estará disponible en `http://localhost:3000`.

## Estructura del Proyecto

- `src/`: Contiene los archivos fuente del proyecto.
  - `components/`: Componentes reutilizables de React.
  - `pages/`: Páginas principales de la aplicación.
  - `services/`: Servicios para interactuar con la API del backend.
  - `App.jsx`: Componente principal de la aplicación.
  - `main.jsx`: Punto de entrada de la aplicación.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios y haz commit de ellos (`git commit -am 'Agrega nueva característica'`).
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`).
5. Abre un Pull Request describiendo tus cambios.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.

## Contacto

Para más información o consultas, por favor contacta a los integrantes del Grupo 5:

- Gabriel Antonio Castillo Alegría
- Rafael Edgardo Arévalo Vanegas
- Iván Ernesto Calderón Polanco
- Josué Mauricio Benavides Batres
- Mateo Canales
- Mario José Pinto Amaya

¡Gracias por visitar nuestro proyecto! 
