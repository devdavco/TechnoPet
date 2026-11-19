package com.technopet.tienda_mascotas.repository;

import com.technopet.tienda_mascotas.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

//                                         <la entidad, el tipo del id>
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    // Spring lee el nombre y arma: SELECT * FROM pedidos WHERE usuario_id = ?
    List<Pedido> findByUsuarioId(Integer usuarioId);
}