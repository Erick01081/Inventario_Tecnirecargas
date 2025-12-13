'use client';

import { useState, useEffect } from 'react';
import { Producto } from '@/types/producto';
import FormularioProducto from '@/components/FormularioProducto';
import ListaProductos from '@/components/ListaProductos';
import ModalInventario from '@/components/ModalInventario';

/**
 * Componente principal de la aplicación de inventario
 * 
 * Este componente gestiona el estado global de la aplicación, incluyendo la lista
 * de productos y el modal para modificar inventario. Se encarga de cargar los productos
 * desde la API, crear nuevos productos, actualizar inventarios y eliminar productos.
 * 
 * Complejidad: O(n) donde n es el número de productos (al cargar y renderizar)
 */
export default function HomePage(): JSX.Element {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [tipoOperacion, setTipoOperacion] = useState<'aumentar' | 'disminuir' | null>(null);
  const [modalCrearAbierto, setModalCrearAbierto] = useState<boolean>(false);

  /**
   * Carga todos los productos desde la API
   * Complejidad: O(1) - Solo realiza una llamada HTTP
   */
  const cargarProductos = async (): Promise<void> => {
    try {
      const respuesta = await fetch('/api/productos');
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setProductos(datos);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  /**
   * Maneja la apertura del modal para aumentar inventario
   * Complejidad: O(1)
   * @param producto - Producto cuyo inventario se va a aumentar
   */
  const manejarAumentar = (producto: Producto): void => {
    setProductoSeleccionado(producto);
    setTipoOperacion('aumentar');
  };

  /**
   * Maneja la apertura del modal para disminuir inventario
   * Complejidad: O(1)
   * @param producto - Producto cuyo inventario se va a disminuir
   */
  const manejarDisminuir = (producto: Producto): void => {
    setProductoSeleccionado(producto);
    setTipoOperacion('disminuir');
  };

  /**
   * Cierra el modal de inventario
   * Complejidad: O(1)
   */
  const cerrarModal = (): void => {
    setProductoSeleccionado(null);
    setTipoOperacion(null);
  };

  /**
   * Confirma la operación de aumentar o disminuir inventario
   * Complejidad: O(1) - Solo realiza una llamada HTTP
   * @param id - ID del producto a modificar
   * @param cantidad - Cantidad a agregar (positiva) o restar (negativa)
   */
  const confirmarOperacion = async (id: string, cantidad: number): Promise<void> => {
    const respuesta = await fetch(`/api/productos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cantidad }),
    });

    if (!respuesta.ok) {
      const datos = await respuesta.json();
      throw new Error(datos.error || 'Error al actualizar inventario');
    }

    await cargarProductos();
  };

  /**
   * Elimina un producto del inventario
   * Complejidad: O(1) - Solo realiza una llamada HTTP
   * @param id - ID del producto a eliminar
   */
  const manejarEliminar = async (id: string): Promise<void> => {
    try {
      const respuesta = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
      });

      if (respuesta.ok) {
        await cargarProductos();
      } else {
        const datos = await respuesta.json();
        alert(datos.error || 'Error al eliminar producto');
      }
    } catch (error) {
      alert('Error al eliminar producto');
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <img 
              src="/logo.png" 
              alt="Logo Tecnirecargas" 
              className="h-10 sm:h-16 w-auto flex-shrink-0"
            />
            <h1 className="text-lg sm:text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
              Sistema de Inventario Tecnirecargas
            </h1>
          </div>
          <button
            onClick={() => setModalCrearAbierto(true)}
            className="w-full sm:w-auto bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-semibold shadow-md text-base sm:text-lg whitespace-nowrap"
          >
            + Crear Producto
          </button>
        </div>

        <ListaProductos
          productos={productos}
          onAumentar={manejarAumentar}
          onDisminuir={manejarDisminuir}
          onEliminar={manejarEliminar}
        />

        <FormularioProducto
          abierto={modalCrearAbierto}
          onCerrar={() => setModalCrearAbierto(false)}
          onProductoCreado={cargarProductos}
        />

        <ModalInventario
          producto={productoSeleccionado}
          tipo={tipoOperacion}
          onCerrar={cerrarModal}
          onConfirmar={confirmarOperacion}
        />
      </div>
    </div>
  );
}

