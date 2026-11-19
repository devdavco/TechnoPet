package com.technopet.tienda_mascotas.service;
import com.technopet.tienda_mascotas.model.RolUsuario;
import com.technopet.tienda_mascotas.model.Usuario;
import com.technopet.tienda_mascotas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Integer id) {
        return usuarioRepository.findById(id);
    }

    public Usuario registrar(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("El correo electrónico ya está registrado.");
        }
        if (usuario.getRol() == null) {
            usuario.setRol(RolUsuario.COMPRADOR);
        }
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> login(String email, String contrasena) {
        return usuarioRepository.findByEmail(email)
                .filter(u -> u.getContrasena().equals(contrasena));
    }

    public Optional<Usuario> actualizar(Integer id, Usuario datosActualizados) {
        return usuarioRepository.findById(id).map(existente -> {
            existente.setNombre(datosActualizados.getNombre());
            existente.setEmail(datosActualizados.getEmail());
            if (datosActualizados.getContrasena() != null && !datosActualizados.getContrasena().isBlank()) {
                existente.setContrasena(datosActualizados.getContrasena());
            }
            if (datosActualizados.getRol() != null) {
                existente.setRol(datosActualizados.getRol());
            }
            existente.setNumTelefono(datosActualizados.getNumTelefono());
            return usuarioRepository.save(existente);
        });
    }

    public boolean eliminar(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            return false;
        }
        usuarioRepository.deleteById(id);
        return true;
    }
}