import { Producto } from '@/types/producto';
import { createClient } from '@supabase/supabase-js';

const TABLA_PRODUCTOS = 'productos';

/**
 * Obtiene el cliente de Supabase si está configurado
 * Complejidad: O(1)
 * @returns Cliente de Supabase o null si no está configurado
 */
function obtenerClienteSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    return createClient(supabaseUrl, supabaseKey);
  }

  return null;
}

/**
 * Lee todos los productos desde Supabase o archivo local
 * Complejidad: O(n) donde n es el número de productos
 * @returns Array de productos
 */
async function leerProductosDesdeSupabase(): Promise<Producto[]> {
  const supabase = obtenerClienteSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLA_PRODUCTOS)
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error al leer desde Supabase:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error al leer desde Supabase:', error);
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
 * Guarda todos los productos en Supabase o archivo local
 * Complejidad: O(n) donde n es el número de productos
 * @param productos - Array de productos a guardar
 */
async function guardarProductosEnSupabase(productos: Producto[]): Promise<void> {
  const supabase = obtenerClienteSupabase();

  if (supabase) {
    try {
      // Eliminar todos los productos existentes
      const { error: deleteError } = await supabase
        .from(TABLA_PRODUCTOS)
        .delete()
        .neq('id', ''); // Eliminar todos

      if (deleteError) {
        console.error('Error al eliminar productos existentes:', deleteError);
      }

      // Insertar todos los productos
      if (productos.length > 0) {
        const { error: insertError } = await supabase
          .from(TABLA_PRODUCTOS)
          .insert(productos);

        if (insertError) {
          console.error('Error al insertar productos:', insertError);
          throw new Error('No se pudo guardar los productos en Supabase');
        }
      }

      return;
    } catch (error) {
      console.error('Error al guardar en Supabase:', error);
      throw error;
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
 * Lee todos los productos desde Supabase o archivo local
 * Complejidad: O(n) donde n es el número de productos
 * @returns Array de productos
 */
export async function leerProductos(): Promise<Producto[]> {
  return await leerProductosDesdeSupabase();
}

/**
 * Guarda todos los productos en Supabase o archivo local
 * Complejidad: O(n) donde n es el número de productos
 * @param productos - Array de productos a guardar
 */
export async function guardarProductos(productos: Producto[]): Promise<void> {
  await guardarProductosEnSupabase(productos);
}

/**
 * Obtiene un producto por su ID
 * Complejidad: O(n) donde n es el número de productos
 * @param id - ID del producto a buscar
 * @returns El producto encontrado o null si no existe
 */
export async function obtenerProductoPorId(id: string): Promise<Producto | null> {
  const supabase = obtenerClienteSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLA_PRODUCTOS)
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return data as Producto;
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      return null;
    }
  }

  // Fallback: buscar en array
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
  const nuevoProducto: Producto = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    nombre,
    marca,
    inventarioActual: inventarioInicial
  };

  const supabase = obtenerClienteSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLA_PRODUCTOS)
        .insert([nuevoProducto])
        .select()
        .single();

      if (error) {
        console.error('Error al crear producto en Supabase:', error);
        const mensajeError = error.message || 'No se pudo crear el producto en Supabase';
        throw new Error(`Error de Supabase: ${mensajeError}. ¿Está creada la tabla 'productos'?`);
      }

      return data as Producto;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  // Fallback: agregar a array y guardar
  const productos = await leerProductos();
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
  const supabase = obtenerClienteSupabase();

  if (supabase) {
    try {
      // Obtener producto actual
      const { data: producto, error: getError } = await supabase
        .from(TABLA_PRODUCTOS)
        .select('*')
        .eq('id', id)
        .single();

      if (getError || !producto) {
        return null;
      }

      const nuevoInventario = Math.max(0, producto.inventarioActual + cantidad);

      // Actualizar producto
      const { data: productoActualizado, error: updateError } = await supabase
        .from(TABLA_PRODUCTOS)
        .update({ inventarioActual: nuevoInventario })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error al actualizar inventario en Supabase:', updateError);
        return null;
      }

      return productoActualizado as Producto;
    } catch (error) {
      console.error('Error al actualizar inventario:', error);
      return null;
    }
  }

  // Fallback: actualizar en array
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
  const supabase = obtenerClienteSupabase();

  if (supabase) {
    try {
      const { error } = await supabase
        .from(TABLA_PRODUCTOS)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error al eliminar producto en Supabase:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return false;
    }
  }

  // Fallback: eliminar de array
  const productos = await leerProductos();
  const indice = productos.findIndex(p => p.id === id);

  if (indice === -1) {
    return false;
  }

  productos.splice(indice, 1);
  await guardarProductos(productos);

  return true;
}
