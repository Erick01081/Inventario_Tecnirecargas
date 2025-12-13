# Sistema de Inventario Tecnirecargas

Aplicación web de gestión de inventario construida con Next.js, TypeScript y Tailwind CSS.

## Características

- ✅ Crear productos con nombre, marca e inventario inicial
- ✅ Ver lista de todos los productos
- ✅ Aumentar cantidad del inventario
- ✅ Disminuir cantidad del inventario
- ✅ Eliminar productos
- ✅ Base de datos simple usando archivo JSON
- ✅ Interfaz moderna y responsiva

## Requisitos

- Node.js 18+ 
- npm o yarn

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

- `app/` - Páginas y rutas de Next.js
- `components/` - Componentes React reutilizables
- `lib/` - Funciones de utilidad y acceso a base de datos
- `types/` - Definiciones de tipos TypeScript
- `data/` - Archivo JSON que actúa como base de datos

## Base de Datos

La aplicación utiliza un archivo JSON (`data/products.json`) como base de datos simple. Este archivo se crea automáticamente cuando se crea el primer producto.

## Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente Next.js
3. El despliegue se realizará automáticamente

**Nota:** Para producción, considera usar una base de datos real como Vercel Postgres, MongoDB, o similar.

