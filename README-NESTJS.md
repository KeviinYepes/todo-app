# Como instalar NestJS

Esta guia explica como instalar NestJS paso a paso usando `npm`.

## Requisitos previos

Antes de empezar, verifica que tengas instalado:

- `node -v`
- `npm -v`

Si alguno no funciona, instala Node.js desde su pagina oficial.

## Opcion 1: usar NestJS sin instalarlo globalmente

Esta es la forma mas simple y recomendada si solo quieres crear el proyecto.

### Paso 1

Abre una terminal en la carpeta donde quieres crear tu proyecto.

### Paso 2

Ejecuta este comando:

```bash
npx @nestjs/cli new backend
```

### Paso 3

El asistente te preguntara que gestor de paquetes quieres usar.

Selecciona:

- `npm`

### Paso 4

Cuando termine la instalacion, entra a la carpeta del proyecto:

```bash
cd backend
```

### Paso 5

Inicia el proyecto en modo desarrollo:

```bash
npm run start:dev
```

## Opcion 2: instalar la CLI de NestJS globalmente

Si quieres usar el comando `nest` en cualquier proyecto, instala la CLI global.

### Paso 1

Ejecuta este comando:

```bash
npm install -g @nestjs/cli
```

### Paso 2

Verifica que quedo instalada:

```bash
nest -v
```

### Paso 3

Crea el proyecto:

```bash
nest new backend
```

### Paso 4

Entra al proyecto:

```bash
cd backend
```

### Paso 5

Ejecuta el servidor:

```bash
npm run start:dev
```

## Si aparece un error en PowerShell

No escribas el simbolo `$` al inicio del comando.

Correcto:

```bash
npm install -g @nestjs/cli
```

Incorrecto:

```bash
$ npm install -g @nestjs/cli
```
