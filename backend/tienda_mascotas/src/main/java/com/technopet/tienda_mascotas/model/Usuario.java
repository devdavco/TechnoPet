package com.technopet.tienda_mascotas.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 100)
    private String contrasena;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RolUsuario rol = RolUsuario.COMPRADOR;

    @Column(name = "num_telefono", length = 20)
    private String numTelefono;
}