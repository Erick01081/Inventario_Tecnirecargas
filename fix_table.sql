-- Script para corregir la tabla productos en Supabase
-- Ejecuta esto en SQL Editor de Supabase

-- Agregar la columna inventarioActual si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'productos' AND column_name = 'inventarioActual'
  ) THEN
    ALTER TABLE productos ADD COLUMN "inventarioActual" INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Verificar que todas las columnas necesarias existen
-- Si falta alguna, agregarla:

-- Verificar columna 'nombre'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'productos' AND column_name = 'nombre'
  ) THEN
    ALTER TABLE productos ADD COLUMN nombre TEXT NOT NULL;
  END IF;
END $$;

-- Verificar columna 'marca'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'productos' AND column_name = 'marca'
  ) THEN
    ALTER TABLE productos ADD COLUMN marca TEXT NOT NULL;
  END IF;
END $$;

-- Verificar columna 'id'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'productos' AND column_name = 'id'
  ) THEN
    ALTER TABLE productos ADD COLUMN id TEXT PRIMARY KEY;
  END IF;
END $$;

