package com.technopet.tienda_mascotas.service;

import com.technopet.tienda_mascotas.model.DetallePedido;
import com.technopet.tienda_mascotas.model.EstadoPedido;
import com.technopet.tienda_mascotas.model.Pedido;
import com.technopet.tienda_mascotas.model.Producto;
import com.technopet.tienda_mascotas.repository.DetallePedidoRepository;
import com.technopet.tienda_mascotas.repository.PedidoRepository;
import com.technopet.tienda_mascotas.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class DetallePedidoServiceJpa implements DetallePedidoService {

    private final DetallePedidoRepository detallePedidoRepository;
    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;

    @Override
    public List<DetallePedido> findAll() {
        return detallePedidoRepository.findAll();
    }

    @Override
    public List<DetallePedido> findByPedidoId(Integer pedidoId) {
        return detallePedidoRepository.findByPedidoId(pedidoId);
    }

    @Override
    public DetallePedido findById(Integer id) {
        return detallePedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle de pedido no encontrado: " + id));
    }

    @Override
    @Transactional
    public DetallePedido save(Integer pedidoId, Integer productoId, Integer cantidad) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado: " + pedidoId));
        validarPedidoEditable(pedido);

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoId));

        ajustarStock(producto, cantidad);

        // Si el producto ya está en el pedido, se suma la cantidad (respeta el UNIQUE de la tabla)
        DetallePedido detalle = detallePedidoRepository
                .findByPedidoIdAndProductoId(pedidoId, productoId)
                .map(existente -> {
                    existente.setCantidad(existente.getCantidad() + cantidad);
                    return existente;
                })
                .orElseGet(() -> DetallePedido.builder()
                        .pedido(pedido)
                        .producto(producto)
                        .cantidad(cantidad)
                        .precioUnitario(producto.getPrecio()) // el precio lo pone el servidor
                        .build());

        return detallePedidoRepository.save(detalle);
    }

    @Override
    @Transactional
    public DetallePedido update(Integer id, Integer nuevaCantidad) {
        DetallePedido existente = findById(id);
        validarPedidoEditable(existente.getPedido());

        int diferencia = nuevaCantidad - existente.getCantidad();
        ajustarStock(existente.getProducto(), diferencia); // si es negativa, devuelve stock
        existente.setCantidad(nuevaCantidad);
        return detallePedidoRepository.save(existente);
    }

    @Override
    @Transactional
    public DetallePedido deleteById(Integer id) {
        DetallePedido existente = findById(id);
        validarPedidoEditable(existente.getPedido());

        ajustarStock(existente.getProducto(), -existente.getCantidad()); // devuelve el stock
        detallePedidoRepository.delete(existente);
        return existente;
    }

    /** Descuenta 'cantidad' del stock. Con cantidad negativa, lo devuelve. */
    private void ajustarStock(Producto producto, int cantidad) {
        if (producto.getStock() < cantidad) {
            throw new IllegalArgumentException(
                    "Stock insuficiente para " + producto.getNombre()
                            + ". Disponible: " + producto.getStock());
        }
        producto.setStock(producto.getStock() - cantidad);
    }

    /** Solo se pueden agregar, editar o quitar productos de pedidos PENDIENTES. */
    private void validarPedidoEditable(Pedido pedido) {
        if (pedido.getEstado() != EstadoPedido.PENDIENTE) {
            throw new IllegalArgumentException(
                    "Solo se pueden modificar pedidos PENDIENTES. Estado actual: " + pedido.getEstado());
        }
    }
}