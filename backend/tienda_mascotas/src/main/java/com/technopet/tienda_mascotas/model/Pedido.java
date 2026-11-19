package com.technopet.tienda_mascotas.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity                      // "esta clase es una tabla"
@Table(name = "pedidos")     // ...y se llama pedidos
@Getter                      // Lombok crea los getX()
@Setter                      // Lombok crea los setX()
@NoArgsConstructor           // constructor vacío (JPA lo necesita)
@AllArgsConstructor          // constructor con todos los campos
@Builder                     // permite Pedido.builder().usuario(u).build()
public class Pedido {

    @Id                                                   // llave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY)   // AUTO_INCREMENT de MySQL
    private Integer id;

    @ManyToOne(optional = false)                          // muchos pedidos → un usuario
    @JoinColumn(name = "usuario_id", nullable = false)    // columna usuario_id
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime fecha;                          // DATETIME

    @Enumerated(EnumType.STRING)                          // se guarda "PENDIENTE", no 0
    @Column(nullable = false)
    private EstadoPedido estado;

    @PrePersist                                           // se ejecuta justo antes del INSERT
    void alCrear() {
        if (fecha == null) fecha = LocalDateTime.now();
        if (estado == null) estado = EstadoPedido.PENDIENTE;
    }
}