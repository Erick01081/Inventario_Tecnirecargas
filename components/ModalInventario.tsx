'use client';

import { useState, useEffect } from 'react';
import { Producto } from '@/types/producto';

interface ModalInventarioProps {
  producto: Producto | null;
  tipo: 'aumentar' | 'disminuir' | null;
  onCerrar: () => void;
  onConfirmar: (id: string, cantidad: number) => Promise<void>;
}

/**
 * Componente modal para aumentar o disminuir el inventario de un producto
 * 
 * Este componente muestra un modal que permite al usuario ingresar una cantidad
 * para aumentar o disminuir el inventario de un producto. Se valida que la cantidad
 * sea positiva y que al disminuir no quede en negativo.
 * 
 * Complejidad: O(1) - Operaciones constantes
 * 
 * @param producto - El producto cuyo inventario se va a modificar
 * @param tipo - Tipo de operación: 'aumentar' o 'disminuir'
 * @param onCerrar - Función que se ejecuta al cerrar el modal
 * @param onConfirmar - Función que se ejecuta al confirmar la operación
 */
export default function ModalInventario({
  producto,
  tipo,
  onCerrar,
  onConfirmar
}: ModalInventarioProps) {
  const [cantidad, setCantidad] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);

  useEffect(() => {
    setCantidad('');
    setError('');
    setCargando(false);
  }, [producto, tipo]);

  /**
   * Maneja el cierre del modal con la tecla Escape
   * Complejidad: O(1)
   */
  useEffect(() => {
    if (!producto || !tipo) {
      return;
    }

    const manejarEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onCerrar();
      }
    };

    window.addEventListener('keydown', manejarEscape);
    return () => window.removeEventListener('keydown', manejarEscape);
  }, [producto, tipo, onCerrar]);

  /**
   * Valida y procesa la cantidad ingresada
   * Complejidad: O(1)
   */
  const manejarConfirmar = async (): Promise<void> => {
    if (!producto || !tipo) {
      return;
    }

    const cantidadNum = parseFloat(cantidad);

    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      setError('Por favor ingrese una cantidad válida mayor a 0');
      return;
    }

    if (tipo === 'disminuir' && cantidadNum > producto.inventarioActual) {
      setError(`No se puede disminuir más de ${producto.inventarioActual} unidades`);
      return;
    }

    setCargando(true);
    setError('');

    try {
      const cantidadFinal = tipo === 'aumentar' ? cantidadNum : -cantidadNum;
      await onConfirmar(producto.id, cantidadFinal);
      onCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar inventario');
      setCargando(false);
    }
  };

  if (!producto || !tipo) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
          {tipo === 'aumentar' ? 'Aumentar' : 'Disminuir'} Inventario
        </h2>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-2 text-sm sm:text-base">
            <span className="font-semibold">Producto:</span> {producto.nombre}
          </p>
          <p className="text-gray-600 mb-2 text-sm sm:text-base">
            <span className="font-semibold">Marca:</span> {producto.marca}
          </p>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            <span className="font-semibold">Inventario actual:</span> {producto.inventarioActual}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
            Cantidad a {tipo === 'aumentar' ? 'aumentar' : 'disminuir'}:
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={cantidad}
            onChange={(e) => {
              setCantidad(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="Ingrese la cantidad"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onCerrar}
            disabled={cargando}
            className="w-full sm:w-auto px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-base"
          >
            Cancelar
          </button>
          <button
            onClick={manejarConfirmar}
            disabled={cargando}
            className={`w-full sm:w-auto px-4 py-3 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base ${
              tipo === 'aumentar'
                ? 'bg-green-500 hover:bg-green-600 active:bg-green-700'
                : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
            }`}
          >
            {cargando ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

