package com.technopet.tienda_mascotas.dto;

public class AuthRequestDTO {

    private String email;
    private String contrasena;

    public AuthRequestDTO() {
    }

    public AuthRequestDTO(String username, String password) {
        this.email = username;
        this.contrasena = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}
