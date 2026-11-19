package com.technopet.tienda_mascotas.service;

import com.technopet.tienda_mascotas.model.EstadoPedido;
import com.technopet.tienda_mascotas.model.Pedido;

import java.util.List;

public interface PedidoService {
    List<Pedido> findAll();
    Pedido findById(Integer id);
    List<Pedido> findByUsuario(Integer usuarioId);
    Pedido crear(Integer usuarioId);
    Pedido cambiarEstado(Integer id, EstadoPedido nuevoEstado);
    void deleteById(Integer id);
}