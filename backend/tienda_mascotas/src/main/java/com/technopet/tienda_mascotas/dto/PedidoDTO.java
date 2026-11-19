package com.technopet.tienda_mascotas.dto;

import com.technopet.tienda_mascotas.model.EstadoPedido;
import com.technopet.tienda_mascotas.model.Pedido;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDTO {
    private Integer id;
    private Integer usuarioId;
    private String nombreUsuario;
    private LocalDateTime fecha;
    private EstadoPedido estado;

    // Convierte la entidad Pedido en este DTO (igual que tu CategoriaDTO.fromEntity)
    public static PedidoDTO fromEntity(Pedido pedido) {
        return new PedidoDTO(
                pedido.getId(),
                pedido.getUsuario().getId(),
                pedido.getUsuario().getNombre(),
                pedido.getFecha(),
                pedido.getEstado());
    }
}