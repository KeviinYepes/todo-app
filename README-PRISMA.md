# Como instalar Prisma

Esta guia explica como instalar Prisma paso a paso usando `npm`.

## Requisitos previos

Antes de instalar Prisma, debes estar dentro de tu proyecto backend.

Ejemplo:

```bash
cd backend
```

## Paso 1: instalar Prisma como dependencia de desarrollo

Ejecuta este comando:

```bash
npm install prisma --save-dev
```

Nota:

El comando correcto lleva un espacio entre `prisma` y `--save-dev`.

Correcto:

```bash
npm install prisma --save-dev
```

Incorrecto:

```bash
npm install prisma--save-dev
```

## Paso 2: instalar el cliente de Prisma

Ejecuta este comando:

```bash
npm install @prisma/client
```

## Paso 3: inicializar Prisma

Ejecuta:

```bash
npx prisma init
```

Este comando normalmente crea:

- una carpeta `prisma/`
- un archivo `prisma/schema.prisma`
- variables de entorno en `.env`

## Paso 4: configurar la conexion a la base de datos

Abre tu archivo `.env` y busca algo parecido a esto:

```env
DATABASE_URL="..."
```

Luego coloca tu cadena de conexion de MongoDB, PostgreSQL, MySQL o la base de datos que uses.

## Paso 5: generar Prisma Client

Despues de configurar tu esquema, ejecuta:

```bash
npx prisma generate
```

## Paso 6: revisar que Prisma funciona

Puedes verificar la version con:

```bash
npx prisma -v
```

## Comandos utiles

- `npx prisma studio`
- `npx prisma generate`
- `npx prisma db push`
- `npx prisma migrate dev`

## Nota para MongoDB

Si vas a usar MongoDB con Prisma, el proveedor en `schema.prisma` debe ser `mongodb`.
