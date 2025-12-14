# Configuración de Supabase para Persistencia de Datos

## Pasos para Configurar Supabase

### 1. Crear cuenta y proyecto en Supabase

1. Ve a [Supabase](https://supabase.com) y crea una cuenta (es gratis)
2. Haz clic en **New Project**
3. Completa la información del proyecto:
   - **Name**: inventario-tecnirecargas (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (guárdala)
   - **Region**: Elige la región más cercana
4. Espera a que se cree el proyecto (tarda unos minutos)

### 2. Crear la tabla de productos

1. En tu proyecto de Supabase, ve a **SQL Editor** (en el menú lateral)
2. Haz clic en **New Query**
3. Copia y pega el siguiente SQL:

```sql
-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  marca TEXT NOT NULL,
  "inventarioActual" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Agregar columna inventarioActual si no existe (para tablas ya creadas)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'productos' AND column_name = 'inventarioActual'
  ) THEN
    ALTER TABLE productos ADD COLUMN "inventarioActual" INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Habilitar Row Level Security (RLS)
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir todas las operaciones (solo si no existe)
DROP POLICY IF EXISTS "Permitir todas las operaciones en productos" ON productos;

CREATE POLICY "Permitir todas las operaciones en productos"
ON productos
FOR ALL
USING (true)
WITH CHECK (true);
```

4. Haz clic en **Run** para ejecutar el SQL
5. Verifica que la tabla se creó correctamente yendo a **Table Editor** en el menú lateral

### 3. Obtener las credenciales de API

1. En tu proyecto de Supabase, ve a **Settings** (⚙️) > **API**
2. Copia los siguientes valores:
   - **Project URL** (será `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (será `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 4. Configurar variables de entorno en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a **Settings** > **Environment Variables**
3. Agrega las siguientes variables:

   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: La URL de tu proyecto (ej: `https://xxxxx.supabase.co`)
   - **Environment**: Production, Preview, Development

   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: La clave anon public de tu proyecto
   - **Environment**: Production, Preview, Development

4. Haz clic en **Save**

### 5. Configurar variables de entorno localmente (opcional)

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_aqui
```

**Nota**: No subas este archivo a Git (ya está en .gitignore)

### 6. Redesplegar la aplicación

1. Haz commit y push de los cambios
2. Vercel desplegará automáticamente
3. Los datos ahora persistirán en Supabase

## Verificar que funciona

1. Crea algunos productos en la aplicación
2. Ve a Supabase > **Table Editor** > **productos**
3. Deberías ver los productos que creaste
4. Recarga la aplicación - los productos deberían seguir ahí

## Ventajas de Supabase

- ✅ Base de datos PostgreSQL real (más robusta que KV)
- ✅ Plan gratuito generoso (500MB de base de datos)
- ✅ Interfaz web para ver y editar datos
- ✅ API REST automática
- ✅ Row Level Security para seguridad
- ✅ Escalable y confiable

## Notas de Seguridad

La política actual permite todas las operaciones. Para producción, considera restringir las políticas según tus necesidades de seguridad.

