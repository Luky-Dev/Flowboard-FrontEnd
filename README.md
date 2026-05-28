# Flowboard

Flowboard es una aplicación fullstack tipo kanban para gestionar workspaces, boards y tareas. La idea es similar a herramientas como Trello, pero construida desde cero como proyecto personal para aprender y practicar backend, frontend y deploy en producción.

No es un proyecto guiado paso a paso, lo fui armando mientras resolvía problemas reales de arquitectura, autenticación, bases de datos y despliegue.

---

## Stack

Frontend
- Next.js
- TypeScript
- Axios
- Tailwind

Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt

Deploy
- Frontend en Vercel
- Backend en Render
- Base de datos en PostgreSQL en la nube

---

## Funcionalidades

- Registro e inicio de sesión con JWT
- Hash de contraseñas con bcrypt
- Middleware de autenticación
- Workspaces por usuario
- Boards dentro de workspaces
- Tareas con estructura tipo kanban
- Asignación de usuarios a tareas
- Relación entre entidades usando Prisma

---

## Arquitectura

Frontend → API REST (Express) → Base de datos (PostgreSQL)

Estructura del backend basada en:
- routes
- controllers
- services
- middlewares

---

## Aprendizajes

- Cómo funciona el deploy en Vercel y Render en producción
- Problemas reales con env variables en build time
- Errores comunes con Prisma y su schema estricto
- Manejo de CORS en producción
- Debug de rutas y errores 404 en APIs
- Diferencia entre error de código y error de despliegue

---

## Deploy

Frontend: Vercel  
Backend: Render  

---

## Notas

El proyecto no está enfocado en diseño visual, sino en funcionamiento, arquitectura y flujo completo de una aplicación real.

Es un proyecto en evolución.

Version deployed ------------------------------------------------------------------------------------------------------------

https://flowboard-front-end.vercel.app/register
