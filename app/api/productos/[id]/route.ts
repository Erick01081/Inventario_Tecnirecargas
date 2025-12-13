import { NextRequest, NextResponse } from 'next/server';
import { actualizarInventario, eliminarProducto, obtenerProductoPorId } from '@/lib/database';

/**
 * Obtiene un producto por su ID
 * Complejidad: O(n) donde n es el número de productos
 * @param request - Request de Next.js
 * @param params - Parámetros de la ruta con el ID del producto
 * @returns Response con el producto encontrado
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const producto = obtenerProductoPorId(params.id);
    
    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(producto);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

/**
 * Actualiza el inventario de un producto (aumentar o disminuir)
 * Complejidad: O(n) donde n es el número de productos
 * @param request - Request de Next.js con la cantidad a modificar
 * @param params - Parámetros de la ruta con el ID del producto
 * @returns Response con el producto actualizado
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { cantidad } = body;

    if (cantidad === undefined || typeof cantidad !== 'number') {
      return NextResponse.json(
        { error: 'La cantidad es requerida y debe ser un número' },
        { status: 400 }
      );
    }

    const productoActualizado = actualizarInventario(params.id, cantidad);
    
    if (!productoActualizado) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(productoActualizado);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar inventario' },
      { status: 500 }
    );
  }
}

/**
 * Elimina un producto del inventario
 * Complejidad: O(n) donde n es el número de productos
 * @param request - Request de Next.js
 * @param params - Parámetros de la ruta con el ID del producto
 * @returns Response indicando si se eliminó correctamente
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const eliminado = eliminarProducto(params.id);
    
    if (!eliminado) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}

