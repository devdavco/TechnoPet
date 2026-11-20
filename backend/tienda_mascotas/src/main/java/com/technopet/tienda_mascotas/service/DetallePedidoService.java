package com.technopet.tienda_mascotas.service;

import com.technopet.tienda_mascotas.model.DetallePedido;

import java.util.List;

public interface DetallePedidoService {
    List<DetallePedido> findAll();
    List<DetallePedido> findByPedidoId(Integer pedidoId);
    DetallePedido findById(Integer id);
    DetallePedido save(Integer pedidoId, Integer productoId, Integer cantidad);
    DetallePedido update(Integer id, Integer cantidad);
    DetallePedido deleteById(Integer id);
}
