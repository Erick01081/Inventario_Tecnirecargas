'use client';

import { Producto } from '@/types/producto';

interface ListaProductosProps {
  productos: Producto[];
  onAumentar: (producto: Producto) => void;
  onDisminuir: (producto: Producto) => void;
  onEliminar: (id: string) => void;
}

/**
 * Componente que muestra la lista de productos en una tabla
 * 
 * Este componente renderiza todos los productos del inventario en formato de tabla,
 * mostrando nombre, marca e inventario actual. Incluye botones para aumentar, disminuir
 * y eliminar productos. El diseño es responsivo y muestra un estado visual cuando el
 * inventario está bajo.
 * 
 * Complejidad: O(n) donde n es el número de productos a renderizar
 * 
 * @param productos - Array de productos a mostrar
 * @param onAumentar - Función que se ejecuta al hacer clic en aumentar inventario
 * @param onDisminuir - Función que se ejecuta al hacer clic en disminuir inventario
 * @param onEliminar - Función que se ejecuta al hacer clic en eliminar producto
 */
export default function ListaProductos({
  productos,
  onAumentar,
  onDisminuir,
  onEliminar
}: ListaProductosProps) {
  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
        <p className="text-gray-500 text-base sm:text-lg">No hay productos en el inventario</p>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">Crea tu primer producto usando el formulario de arriba</p>
      </div>
    );
  }

  return (
    <>
      {/* Vista de tarjetas para móvil */}
      <div className="block md:hidden space-y-4">
        {productos.map((producto) => (
          <div key={producto.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{producto.nombre}</h3>
              <p className="text-sm text-gray-600">Marca: {producto.marca}</p>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Inventario Actual</p>
                <span
                  className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                    producto.inventarioActual === 0
                      ? 'bg-red-100 text-red-800'
                      : producto.inventarioActual < 10
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {producto.inventarioActual}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onAumentar(producto)}
                className="w-full text-green-700 bg-green-50 hover:bg-green-100 active:bg-green-200 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm"
              >
                + Aumentar Inventario
              </button>
              <button
                onClick={() => onDisminuir(producto)}
                disabled={producto.inventarioActual === 0}
                className="w-full text-red-700 bg-red-50 hover:bg-red-100 active:bg-red-200 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                - Disminuir Inventario
              </button>
              <button
                onClick={() => {
                  if (confirm(`¿Está seguro de eliminar ${producto.nombre}?`)) {
                    onEliminar(producto.id);
                  }
                }}
                className="w-full text-gray-700 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm"
              >
                Eliminar Producto
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vista de tabla para desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inventario Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productos.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{producto.marca}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        producto.inventarioActual === 0
                          ? 'bg-red-100 text-red-800'
                          : producto.inventarioActual < 10
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {producto.inventarioActual}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAumentar(producto)}
                        className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded transition-colors"
                        title="Aumentar inventario"
                      >
                        + Aumentar
                      </button>
                      <button
                        onClick={() => onDisminuir(producto)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors"
                        title="Disminuir inventario"
                        disabled={producto.inventarioActual === 0}
                      >
                        - Disminuir
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Está seguro de eliminar ${producto.nombre}?`)) {
                            onEliminar(producto.id);
                          }
                        }}
                        className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded transition-colors"
                        title="Eliminar producto"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

