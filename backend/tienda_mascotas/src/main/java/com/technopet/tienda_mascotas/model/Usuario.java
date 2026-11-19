package com.technopet.tienda_mascotas.model;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    /*
     * CONTRASEÑA: solo de escritura en el JSON.
     *
     * Problema que resuelve:
     *   Los endpoints GET /api/usuarios, GET /api/usuarios/{id}, PUT y /registro
     *   devuelven la entidad Usuario directamente. Sin esta anotación, Jackson
     *   (la librería que convierte objetos Java <-> JSON) incluiría el campo
     *   "contrasena" en la respuesta, y cualquiera podría ver las claves de todos.
     *
     * Cómo funciona @JsonProperty(access = WRITE_ONLY):
     *   - JSON -> Java (deserializar, cuando el cliente ENVÍA datos):
     *       SÍ se lee. Por eso /registro y /login siguen recibiendo la contraseña.
     *   - Java -> JSON (serializar, cuando el servidor RESPONDE):
     *       NO se escribe. El campo simplemente no aparece en la respuesta.
     *
     * Importante: esto solo afecta al JSON. En Java el campo sigue existiendo,
     * se guarda en la base de datos y el login puede compararlo normalmente.
     */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false, length = 100)
    private String contrasena;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RolUsuario rol = RolUsuario.COMPRADOR;

    @Column(name = "num_telefono", length = 20)
    private String numTelefono;
}