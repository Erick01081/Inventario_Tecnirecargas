'use client';

import { useState, useEffect } from 'react';

interface FormularioProductoProps {
  abierto: boolean;
  onCerrar: () => void;
  onProductoCreado: () => void;
}

/**
 * Componente modal con formulario para crear un nuevo producto
 * 
 * Este componente muestra un modal que permite al usuario ingresar los datos de un nuevo producto
 * (nombre, marca e inventario inicial) y enviarlo al servidor para su creación. Valida que todos
 * los campos estén completos y que el inventario sea un número positivo. Se cierra automáticamente
 * después de crear el producto exitosamente.
 * 
 * Complejidad: O(1) - Operaciones constantes
 * 
 * @param abierto - Indica si el modal está abierto o cerrado
 * @param onCerrar - Función que se ejecuta al cerrar el modal
 * @param onProductoCreado - Función que se ejecuta después de crear el producto exitosamente
 */
export default function FormularioProducto({ 
  abierto, 
  onCerrar, 
  onProductoCreado 
}: FormularioProductoProps) {
  const [nombre, setNombre] = useState<string>('');
  const [marca, setMarca] = useState<string>('');
  const [inventarioInicial, setInventarioInicial] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);

  /**
   * Limpia el formulario cuando se cierra el modal
   * Complejidad: O(1)
   */
  useEffect(() => {
    if (!abierto) {
      setNombre('');
      setMarca('');
      setInventarioInicial('');
      setError('');
    }
  }, [abierto]);

  /**
   * Maneja el cierre del modal con la tecla Escape
   * Complejidad: O(1)
   */
  useEffect(() => {
    const manejarEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && abierto) {
        onCerrar();
      }
    };

    window.addEventListener('keydown', manejarEscape);
    return () => window.removeEventListener('keydown', manejarEscape);
  }, [abierto, onCerrar]);

  /**
   * Maneja el envío del formulario para crear un nuevo producto
   * Complejidad: O(1) - Solo realiza una llamada HTTP
   */
  const manejarSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !marca.trim() || !inventarioInicial.trim()) {
      setError('Por favor complete todos los campos');
      return;
    }

    const inventarioNum = parseFloat(inventarioInicial);
    if (isNaN(inventarioNum) || inventarioNum < 0) {
      setError('El inventario inicial debe ser un número positivo');
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          marca: marca.trim(),
          inventarioInicial: inventarioNum,
        }),
      });

      if (!respuesta.ok) {
        const datos = await respuesta.json();
        throw new Error(datos.error || 'Error al crear producto');
      }

      onProductoCreado();
      onCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear producto');
    } finally {
      setCargando(false);
    }
  };

  if (!abierto) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Crear Nuevo Producto</h2>
        
        <form onSubmit={manejarSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Nombre del Producto:
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="Ej: Laptop"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Marca:
            </label>
            <input
              type="text"
              value={marca}
              onChange={(e) => {
                setMarca(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="Ej: Dell"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Inventario Inicial:
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={inventarioInicial}
              onChange={(e) => {
                setInventarioInicial(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="0"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
            <button
              type="button"
              onClick={onCerrar}
              className="w-full sm:w-auto px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors font-medium text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="w-full sm:w-auto px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-base"
            >
              {cargando ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

