# Sistema de Inventario Tecnirecargas

Aplicación web de gestión de inventario construida con Next.js, TypeScript y Tailwind CSS.

## Características

- ✅ Crear productos con nombre, marca e inventario inicial
- ✅ Ver lista de todos los productos
- ✅ Aumentar cantidad del inventario
- ✅ Disminuir cantidad del inventario
- ✅ Eliminar productos
- ✅ Buscador de productos por nombre o marca
- ✅ Persistencia de datos con Supabase (PostgreSQL)
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

La aplicación utiliza **Supabase** (PostgreSQL) para persistir los datos en producción. En desarrollo local, usa archivos JSON.

### Configuración de Supabase (Requerido para Producción)

**IMPORTANTE:** Sin Supabase configurado, los datos se perderán en cada "cold start" de Vercel.

Para configurar Supabase:

1. Crea una cuenta y proyecto en [Supabase](https://supabase.com) (gratis)
2. Crea la tabla de productos usando el SQL en `SUPABASE_SETUP.md`
3. Obtén las credenciales de API desde Settings > API
4. Configura las variables de entorno en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Redespliega tu aplicación

Ver `SUPABASE_SETUP.md` para instrucciones detalladas paso a paso.

## Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente Next.js
3. Configura Vercel KV (ver arriba)
4. El despliegue se realizará automáticamente

