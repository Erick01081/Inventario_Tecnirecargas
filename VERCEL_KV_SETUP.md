# Configuración de Vercel KV para Persistencia de Datos

## Problema
En Vercel serverless, los datos en memoria se pierden en cada "cold start". Para solucionar esto, necesitas configurar Vercel KV (Redis) para persistir los datos.

## Pasos para Configurar Vercel KV

### 1. Instalar Vercel KV en tu proyecto de Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a la pestaña **Storage**
3. Haz clic en **Create Database**
4. Selecciona **KV** (Redis)
5. Sigue las instrucciones para crear la base de datos KV

### 2. Conectar el proyecto a Vercel KV

1. En la página de tu proyecto en Vercel, ve a **Settings** > **Environment Variables**
2. Vercel debería haber agregado automáticamente estas variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN` (opcional)

Si no están automáticamente, puedes encontrarlas en la página de tu base de datos KV en Vercel.

### 3. Verificar la configuración

Una vez configuradas las variables de entorno, Vercel las usará automáticamente en el próximo despliegue.

### 4. Desplegar

1. Haz commit y push de los cambios
2. Vercel desplegará automáticamente
3. Los datos ahora persistirán entre reinicios

## Notas

- **Desarrollo local**: En desarrollo, la aplicación seguirá usando archivos locales si Vercel KV no está configurado
- **Producción**: En producción, si Vercel KV está configurado, usará KV. Si no, usará memoria (que se pierde en cada cold start)
- **Plan gratuito**: Vercel KV tiene un tier gratuito generoso para proyectos pequeños

## Verificar que funciona

Después de configurar y desplegar:
1. Crea algunos productos
2. Espera unos minutos (para que ocurra un cold start)
3. Recarga la página
4. Los productos deberían seguir ahí

