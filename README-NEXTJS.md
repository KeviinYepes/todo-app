# Como instalar Next.js

Esta guia explica como instalar Next.js paso a paso usando `npm`.

## Requisitos previos

Antes de empezar, verifica que tengas instalado:

- `node -v`
- `npm -v`

Si alguno no funciona, instala Node.js primero.

## Instalacion paso a paso

### Paso 1

Abre una terminal en la carpeta donde quieres crear el frontend.

### Paso 2

Ejecuta este comando:

```bash
npx create-next-app@latest frontend
```

### Paso 3

Responde las preguntas del asistente.

Una configuracion comun es esta:

- `Would you like to use TypeScript?` -> `Yes`
- `Would you like to use ESLint?` -> `Yes`
- `Would you like to use Tailwind CSS?` -> `Yes`
- `Would you like your code inside a src/ directory?` -> `No` o `Yes`
- `Would you like to use App Router?` -> `Yes`
- `Would you like to use Turbopack?` -> `Yes`
- `Would you like to customize the import alias?` -> `No`

### Paso 4

Cuando termine, entra a la carpeta del proyecto:

```bash
cd frontend
```

### Paso 5

Ejecuta el proyecto:

```bash
npm run dev
```

### Paso 6

Abre en el navegador:

```text
http://localhost:3000
```

## Comando rapido sin preguntas

Si quieres crear el proyecto con respuestas automaticas, usa:

```bash
npx create-next-app@latest frontend --yes
```

## Si `pnpm` da error

Si ves un mensaje como "pnpm no se reconoce como comando", no uses `pnpm`.

Con `npm`, el comando correcto es:

```bash
npx create-next-app@latest frontend
```
