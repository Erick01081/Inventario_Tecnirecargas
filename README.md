# Sistema de Inventario Tecnirecargas

Aplicación web de gestión de inventario construida con Next.js, TypeScript y Tailwind CSS.

## Características

- ✅ Crear productos con nombre, marca e inventario inicial
- ✅ Ver lista de todos los productos
- ✅ Aumentar cantidad del inventario
- ✅ Disminuir cantidad del inventario
- ✅ Eliminar productos
- ✅ Buscador de productos por nombre o marca
- ✅ Persistencia de datos con Vercel KV (Redis)
- ✅ Interfaz moderna y responsiva (móvil y desktop)

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

La aplicación utiliza **Vercel KV** (Redis) para persistir los datos en producción. En desarrollo local, usa archivos JSON.

### Configuración de Vercel KV (Requerido para Producción)

**IMPORTANTE:** Sin Vercel KV configurado, los datos se perderán en cada "cold start" de Vercel.

Para configurar Vercel KV:

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a la pestaña **Storage** > **Create Database** > Selecciona **KV**
3. Conecta la base de datos a tu proyecto
4. Vercel configurará automáticamente las variables de entorno necesarias
5. Redespliega tu aplicación

Ver `VERCEL_KV_SETUP.md` para instrucciones detalladas.

## Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente Next.js
3. Configura Vercel KV (ver arriba)
4. El despliegue se realizará automáticamente

