package com.technopet.tienda_mascotas.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "detalle_pedidos", uniqueConstraints = @UniqueConstraint(
        name = "uq_detalle_pedido_producto",
        columnNames = {"pedido_id", "producto_id"}
))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetallePedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne(optional = false)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false)
    private Integer precioUnitario;
}
