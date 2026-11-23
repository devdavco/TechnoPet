package com.technopet.tienda_mascotas.config;

import com.technopet.tienda_mascotas.model.RolUsuario;
import com.technopet.tienda_mascotas.model.Usuario;
import com.technopet.tienda_mascotas.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public void run(String... args) throws Exception {
        if(usuarioRepository.findByEmail("admin@admin.com").isEmpty()){
            Usuario admin = new Usuario();
            admin.setEmail("admin@admin.com");
            admin.setNombre("Admin");
            admin.setNumTelefono("3213213211");
            admin.setContrasena(passwordEncoder.encode("123admin"));
            admin.setRol(RolUsuario.ADMIN);
            usuarioRepository.save(admin);
            System.out.println("Usuario Admin creado: admin@admin.com / 123admin");
        }
    }
}