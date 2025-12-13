import { Producto } from '@/types/producto';
import fs from 'fs';
import path from 'path';

const ARCHIVO_DB = path.join(process.cwd(), 'data', 'products.json');

/**
 * Asegura que el directorio de datos existe
 * Complejidad: O(1)
 */
function asegurarDirectorio(): void {
  const directorio = path.dirname(ARCHIVO_DB);
  if (!fs.existsSync(directorio)) {
    fs.mkdirSync(directorio, { recursive: true });
  }
}

/**
 * Lee todos los productos desde el archivo JSON
 * Complejidad: O(n) donde n es el número de productos
 * @returns Array de productos
 */
export function leerProductos(): Producto[] {
  asegurarDirectorio();
  
  if (!fs.existsSync(ARCHIVO_DB)) {
    return [];
  }
  
  try {
    const contenido = fs.readFileSync(ARCHIVO_DB, 'utf-8');
    return JSON.parse(contenido);
  } catch (error) {
    console.error('Error al leer productos:', error);
    return [];
  }
}

/**
 * Guarda todos los productos en el archivo JSON
 * Complejidad: O(n) donde n es el número de productos
 * @param productos - Array de productos a guardar
 */
export function guardarProductos(productos: Producto[]): void {
  asegurarDirectorio();
  
  try {
    fs.writeFileSync(ARCHIVO_DB, JSON.stringify(productos, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error al guardar productos:', error);
    throw new Error('No se pudo guardar los productos');
  }
}

/**
 * Obtiene un producto por su ID
 * Complejidad: O(n) donde n es el número de productos
 * @param id - ID del producto a buscar
 * @returns El producto encontrado o null si no existe
 */
export function obtenerProductoPorId(id: string): Producto | null {
  const productos = leerProductos();
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
export function crearProducto(nombre: string, marca: string, inventarioInicial: number): Producto {
  const productos = leerProductos();
  
  const nuevoProducto: Producto = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    nombre,
    marca,
    inventarioActual: inventarioInicial
  };
  
  productos.push(nuevoProducto);
  guardarProductos(productos);
  
  return nuevoProducto;
}

/**
 * Actualiza la cantidad de inventario de un producto
 * Complejidad: O(n) donde n es el número de productos
 * @param id - ID del producto a actualizar
 * @param cantidad - Cantidad a agregar (positiva) o restar (negativa)
 * @returns El producto actualizado o null si no existe
 */
export function actualizarInventario(id: string, cantidad: number): Producto | null {
  const productos = leerProductos();
  const indice = productos.findIndex(p => p.id === id);
  
  if (indice === -1) {
    return null;
  }
  
  productos[indice].inventarioActual += cantidad;
  
  if (productos[indice].inventarioActual < 0) {
    productos[indice].inventarioActual = 0;
  }
  
  guardarProductos(productos);
  
  return productos[indice];
}

/**
 * Elimina un producto del inventario
 * Complejidad: O(n) donde n es el número de productos
 * @param id - ID del producto a eliminar
 * @returns true si se eliminó correctamente, false si no existe
 */
export function eliminarProducto(id: string): boolean {
  const productos = leerProductos();
  const indice = productos.findIndex(p => p.id === id);
  
  if (indice === -1) {
    return false;
  }
  
  productos.splice(indice, 1);
  guardarProductos(productos);
  
  return true;
}

