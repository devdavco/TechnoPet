package com.technopet.tienda_mascotas.service;
import com.technopet.tienda_mascotas.model.RolUsuario;
import com.technopet.tienda_mascotas.model.Usuario;
import com.technopet.tienda_mascotas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Integer id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Usuario registrar(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("El correo electrónico ya está registrado.");
        }
        /*
         * 1) FORZAR id = null: el registro SIEMPRE crea un usuario nuevo.
         *
         * Problema que resuelve:
         *   save() de JPA hace dos cosas distintas según el id:
         *     - id == null  -> INSERT (crea un registro nuevo; MySQL asigna el id).
         *     - id con valor -> busca ese id y, si existe, hace UPDATE (lo sobrescribe).
         *   Si un cliente enviara {"id": 1, ...} en /registro, en lugar de crear
         *   una cuenta nueva REEMPLAZARÍA los datos del usuario 1 (Laura, la admin),
         *   incluida su contraseña. Con esto, el id que mande el cliente se ignora.
         */
        usuario.setId(null);

        /*
         * 2) FORZAR rol = COMPRADOR: nadie puede auto-asignarse ADMIN.
         *
         * Problema que resuelve:
         *   Antes solo se ponía COMPRADOR si el rol venía vacío (null). Si alguien
         *   enviaba {"rol": "ADMIN"}, se registraba como administrador sin permiso.
         *   Regla de negocio: el registro público siempre crea compradores.
         *   Un ADMIN se crea por otra vía controlada (por ejemplo, directamente en
         *   la base de datos, como Laura en inserts.sql).
         *
         * Nota: el "if (rol == null)" que había antes ya no hace falta, porque
         * ahora el rol se asigna siempre, venga lo que venga.
         */
        usuario.setRol(RolUsuario.COMPRADOR);

        return usuarioRepository.save(usuario);
    }

//    public Optional<Usuario> login(String email, String contrasena) {
//        return usuarioRepository.findByEmail(email)
//                .filter(u -> u.getContrasena().equals(contrasena));
//    }

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

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado " +username));

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getContrasena())
                .roles(usuario.getRol().name())
                .build();
    }
}