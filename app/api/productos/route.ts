import { NextRequest, NextResponse } from 'next/server';
import { leerProductos, crearProducto } from '@/lib/database';
import { Producto } from '@/types/producto';

/**
 * Obtiene todos los productos del inventario
 * Complejidad: O(n) donde n es el número de productos
 * @param request - Request de Next.js
 * @returns Response con la lista de productos
 */
export async function GET(): Promise<NextResponse> {
  try {
    const productos = await leerProductos();
    return NextResponse.json(productos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

/**
 * Crea un nuevo producto en el inventario
 * Complejidad: O(n) donde n es el número de productos
 * @param request - Request de Next.js con los datos del producto
 * @returns Response con el producto creado
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { nombre, marca, inventarioInicial } = body;

    if (!nombre || !marca || inventarioInicial === undefined) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos: nombre, marca, inventarioInicial' },
        { status: 400 }
      );
    }

    if (typeof inventarioInicial !== 'number' || inventarioInicial < 0) {
      return NextResponse.json(
        { error: 'El inventario inicial debe ser un número positivo' },
        { status: 400 }
      );
    }

    const nuevoProducto = await crearProducto(nombre, marca, inventarioInicial);
    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}

