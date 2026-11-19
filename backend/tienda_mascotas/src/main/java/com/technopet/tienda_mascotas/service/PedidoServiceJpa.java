package com.technopet.tienda_mascotas.service;

import com.technopet.tienda_mascotas.model.EstadoPedido;
import com.technopet.tienda_mascotas.model.Pedido;
import com.technopet.tienda_mascotas.model.Usuario;
import com.technopet.tienda_mascotas.repository.PedidoRepository;
import com.technopet.tienda_mascotas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service                    // Spring crea una instancia y la inyecta donde se necesite
@RequiredArgsConstructor    // Lombok crea el constructor con los campos final
public class PedidoServiceJpa implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;   // el de Stefania

    @Override
    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    @Override
    public Pedido findById(Integer id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido no encontrado: " + id));
    }

    @Override
    public List<Pedido> findByUsuario(Integer usuarioId) {
        // Sin esta validación, un usuario inexistente devolvería [] y no sabrías por qué
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new NoSuchElementException("Usuario no encontrado: " + usuarioId);
        }
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public Pedido crear(Integer usuarioId) {
        // 1. El usuario tiene que existir
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado: " + usuarioId));

        // 2. Armar el pedido (fecha y estado los pone @PrePersist)
        Pedido pedido = Pedido.builder().usuario(usuario).build();

        // 3. Guardar: hace el INSERT y devuelve el pedido ya con su id
        return pedidoRepository.save(pedido);
    }

    @Override
    public Pedido cambiarEstado(Integer id, EstadoPedido nuevoEstado) {
        Pedido pedido = findById(id);
        EstadoPedido estadoActual = pedido.getEstado();

        // TODO(human): reglas de cambio de estado

        pedido.setEstado(nuevoEstado);
        return pedidoRepository.save(pedido);   // si el id ya existe, save hace UPDATE
    }

    @Override
    public void deleteById(Integer id) {
        pedidoRepository.delete(findById(id));   // findById lanza 404 si no existe
    }
}