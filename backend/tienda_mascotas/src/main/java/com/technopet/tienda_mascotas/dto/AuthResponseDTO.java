package com.technopet.tienda_mascotas.dto;

/**
 * Respuesta del login: el token y los datos que el front necesita
 * para saber quién inició sesión (rol para el panel admin, id para crear pedidos).
 */
public class AuthResponseDTO {
  private String token;
  private Integer id;
  private String nombre;
  private String email;
  private String rol;

    public AuthResponseDTO() {
    }

    public AuthResponseDTO(String token, Integer id, String nombre, String email, String rol) {
        this.token = token;
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
