# Servidor de prueba (ELIMINADO)

Instrucciones rápidas para ejecutar el servidor local que acepta subidas multipart/form-data.

1. Abrir terminal en `server/`

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar el servidor:

```bash
npm start
```

El servidor queda escuchando por defecto en `http://localhost:4000`.

Endpoint de subida: `POST /api/videos/upload`.

Campos esperados (multipart/form-data):
- `title` (string)
- `description` (string)
- `category` (string)
- `videoFile` (file)
- `audioTracks[]` (file) — múltiples aceptados
- `subtitles[]` (file) — múltiples aceptados

Respuesta JSON contiene `videoUrl`, `audioUrls`, `subtitleUrls`, `size`, `uploadDate`, etc.

Este servidor fue eliminado o neutralizado por petición del usuario. Si necesitas restaurarlo, puedo recrearlo.
