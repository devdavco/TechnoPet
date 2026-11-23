package com.technopet.tienda_mascotas.repository;

import com.technopet.tienda_mascotas.model.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Integer> {

    // Busqueda por pedido_id = ?
    List<DetallePedido> findByPedidoId(Integer pedidoId);

    Optional<DetallePedido> findByPedidoIdAndProductoId(Integer pedidoId, Integer productoId);
}
