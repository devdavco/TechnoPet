package com.technopet.tienda_mascotas.dto;

import com.technopet.tienda_mascotas.model.DetallePedido;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetallePedidoDTO {

    private Integer id;

    @NotNull(message = "El pedido es obligatorio")
    private Integer pedidoId;

    @NotNull(message = "El producto es obligatorio")
    private Integer productoId;

    private String productoNombre;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad mínima es 1")
    private Integer cantidad;

    private Integer precioUnitario;
    private Integer subtotal;

    public static DetallePedidoDTO fromEntity(DetallePedido d) {
        return new DetallePedidoDTO(
                d.getId(),
                d.getPedido().getId(),
                d.getProducto().getId(),
                d.getProducto().getNombre(),
                d.getCantidad(),
                d.getPrecioUnitario(),
                d.getCantidad() * d.getPrecioUnitario()
        );
    }
}
