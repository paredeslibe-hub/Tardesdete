-- Schema para Tardes de Té - Base de datos Supabase
-- Tabla de pedidos con todos los campos del formulario

CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Datos del cliente
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,

    -- Datos del pedido
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    direccion TEXT NOT NULL,

    -- Productos seleccionados (JSON para flexibilidad)
    productos JSONB NOT NULL,

    -- Extras seleccionados (JSON para flexibilidad)
    extras JSONB DEFAULT '[]'::jsonb,

    -- Información de precios
    subtotal DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,

    -- Estado del pedido
    status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmado', 'entregado', 'cancelado')),

    -- Notas adicionales
    notas TEXT,

    -- Metadata
    user_agent TEXT,
    ip_address INET
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_fecha ON orders(fecha);
CREATE INDEX IF NOT EXISTS idx_orders_telefono ON orders(telefono);

-- Políticas RLS (Row Level Security) - por defecto, solo el owner puede ver/escribir
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política para insertar pedidos (todos pueden crear)
CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Política para leer pedidos (solo el owner/admin)
CREATE POLICY "Only authenticated users can view orders" ON orders
    FOR SELECT USING (auth.role() = 'authenticated');

-- Comentarios en la tabla
COMMENT ON TABLE orders IS 'Tabla principal de pedidos para Tardes de Té';
COMMENT ON COLUMN orders.productos IS 'Array de productos seleccionados con cantidades';
COMMENT ON COLUMN orders.extras IS 'Array de extras seleccionados con cantidades';
COMMENT ON COLUMN orders.status IS 'Estado del pedido: pendiente, confirmado, entregado, cancelado';