import { Producto } from '@/types/producto';

const CLAVE_PRODUCTOS = 'productos:inventario';

/**
 * Obtiene el cliente de Vercel KV si está disponible
 * Complejidad: O(1)
 * @returns Cliente KV o null si no está configurado
 */
function obtenerClienteKV() {
  try {
    // Intentar usar Vercel KV si las variables de entorno están configuradas
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = require('@vercel/kv');
      return kv;
    }
  } catch (error) {
    console.warn('Vercel KV no está disponible, usando almacenamiento local:', error);
  }
  return null;
}

/**
 * Intenta leer productos desde Vercel KV o archivo local
 * Complejidad: O(n) donde n es el número de productos
 * @returns Array de productos
 */
async function leerProductosDesdeKV(): Promise<Producto[]> {
  const kv = obtenerClienteKV();
  
  if (kv) {
    try {
      const productos = await kv.get<Producto[]>(CLAVE_PRODUCTOS);
      return productos || [];
    } catch (error) {
      console.error('Error al leer desde Vercel KV:', error);
      return [];
    }
  }
  
  // Fallback: intentar leer desde archivo (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    try {
      const fs = require('fs');
      const path = require('path');
      const ARCHIVO_DB = path.join(process.cwd(), 'data', 'products.json');
      
      if (fs.existsSync(ARCHIVO_DB)) {
        const contenido = fs.readFileSync(ARCHIVO_DB, 'utf-8');
        return JSON.parse(contenido);
      }
    } catch (error) {
      console.warn('No se pudo leer desde archivo:', error);
    }
  }
  
  return [];
}

/**
 * Intenta guardar productos en Vercel KV o archivo local
 * Complejidad: O(n) donde n es el número de productos
 * @param productos - Array de productos a guardar
 */
async function guardarProductosEnKV(productos: Producto[]): Promise<void> {
  const kv = obtenerClienteKV();
  
  if (kv) {
    try {
      await kv.set(CLAVE_PRODUCTOS, productos);
      return;
    } catch (error) {
      console.error('Error al guardar en Vercel KV:', error);
      throw new Error('No se pudo guardar los productos en Vercel KV');
    }
  }
  
  // Fallback: intentar guardar en archivo (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    try {
      const fs = require('fs');
      const path = require('path');
      const ARCHIVO_DB = path.join(process.cwd(), 'data', 'products.json');
      const directorio = path.dirname(ARCHIVO_DB);
      
      if (!fs.existsSync(directorio)) {
        fs.mkdirSync(directorio, { recursive: true });
      }
      
      fs.writeFileSync(ARCHIVO_DB, JSON.stringify(productos, null, 2), 'utf-8');
    } catch (error) {
      console.warn('No se pudo guardar en archivo:', error);
    }
  }
}

/**
 * Lee todos los productos desde Vercel KV o archivo local
 * Complejidad: O(n) donde n es el número de productos
 * @returns Array de productos
 */
export async function leerProductos(): Promise<Producto[]> {
  return await leerProductosDesdeKV();
}

/**
 * Guarda todos los productos en Vercel KV o archivo local
 * Complejidad: O(n) donde n es el número de productos
 * @param productos - Array de productos a guardar
 */
export async function guardarProductos(productos: Producto[]): Promise<void> {
  await guardarProductosEnKV(productos);
}

/**
 * Obtiene un producto por su ID
 * Complejidad: O(n) donde n es el número de productos
 * @param id - ID del producto a buscar
 * @returns El producto encontrado o null si no existe
 */
export async function obtenerProductoPorId(id: string): Promise<Producto | null> {
  const productos = await leerProductos();
  const producto = productos.find(p => p.id === id);
  return producto || null;
}

/**
 * Crea un nuevo producto y lo guarda
 * Complejidad: O(n) donde n es el número de productos
 * @param nombre - Nombre del producto
 * @param marca - Marca del producto
 * @param inventarioInicial - Cantidad inicial en inventario
 * @returns El producto creado
 */
export async function crearProducto(nombre: string, marca: string, inventarioInicial: number): Promise<Producto> {
  const productos = await leerProductos();
  
  const nuevoProducto: Producto = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    nombre,
    marca,
    inventarioActual: inventarioInicial
  };
  
  productos.push(nuevoProducto);
  await guardarProductos(productos);
  
  return nuevoProducto;
}

/**
 * Actualiza la cantidad de inventario de un producto
 * Complejidad: O(n) donde n es el número de productos
 * @param id - ID del producto a actualizar
 * @param cantidad - Cantidad a agregar (positiva) o restar (negativa)
 * @returns El producto actualizado o null si no existe
 */
export async function actualizarInventario(id: string, cantidad: number): Promise<Producto | null> {
  const productos = await leerProductos();
  const indice = productos.findIndex(p => p.id === id);
  
  if (indice === -1) {
    return null;
  }
  
  productos[indice].inventarioActual += cantidad;
  
  if (productos[indice].inventarioActual < 0) {
    productos[indice].inventarioActual = 0;
  }
  
  await guardarProductos(productos);
  
  return productos[indice];
}

/**
 * Elimina un producto del inventario
 * Complejidad: O(n) donde n es el número de productos
 * @param id - ID del producto a eliminar
 * @returns true si se eliminó correctamente, false si no existe
 */
export async function eliminarProducto(id: string): Promise<boolean> {
  const productos = await leerProductos();
  const indice = productos.findIndex(p => p.id === id);
  
  if (indice === -1) {
    return false;
  }
  
  productos.splice(indice, 1);
  await guardarProductos(productos);
  
  return true;
}

