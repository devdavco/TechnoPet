package com.technopet.tienda_mascotas.controller;

import com.technopet.tienda_mascotas.dto.CambioEstadoDTO;
import com.technopet.tienda_mascotas.dto.PedidoDTO;
import com.technopet.tienda_mascotas.dto.PedidoRequestDTO;
import com.technopet.tienda_mascotas.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController                    // responde JSON
@RequestMapping("/api/pedidos")    // todas las URL empiezan así
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    // GET /api/pedidos
    @GetMapping
    public List<PedidoDTO> listarPedidos() {
        return pedidoService.findAll().stream().map(PedidoDTO::fromEntity).toList();
    }

    // GET /api/pedidos/5
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPedido(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(PedidoDTO.fromEntity(pedidoService.findById(id)));
        } catch (NoSuchElementException ex) {
            return error(HttpStatus.NOT_FOUND, ex);
        }
    }

    // GET /api/pedidos/usuario/1
    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> listarPorUsuario(@PathVariable Integer usuarioId) {
        try {
            return ResponseEntity.ok(pedidoService.findByUsuario(usuarioId).stream()
                    .map(PedidoDTO::fromEntity).toList());
        } catch (NoSuchElementException ex) {
            return error(HttpStatus.NOT_FOUND, ex);
        }
    }

    // POST /api/pedidos   body: { "usuarioId": 1 }
    @PostMapping
    public ResponseEntity<?> crearPedido(@Valid @RequestBody PedidoRequestDTO request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(PedidoDTO.fromEntity(pedidoService.crear(request.getUsuarioId())));
        } catch (NoSuchElementException ex) {
            return error(HttpStatus.NOT_FOUND, ex);
        }
    }

    // PUT /api/pedidos/5/estado   body: { "estado": "PAGADO" }
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Integer id,
                                           @Valid @RequestBody CambioEstadoDTO dto) {
        try {
            return ResponseEntity.ok(PedidoDTO.fromEntity(
                    pedidoService.cambiarEstado(id, dto.getEstado())));
        } catch (NoSuchElementException ex) {
            return error(HttpStatus.NOT_FOUND, ex);
        } catch (IllegalStateException ex) {
            return error(HttpStatus.BAD_REQUEST, ex);
        }
    }

    // DELETE /api/pedidos/5
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarPedido(@PathVariable Integer id) {
        try {
            pedidoService.deleteById(id);
            return ResponseEntity.noContent().build();   // 204
        } catch (NoSuchElementException ex) {
            return error(HttpStatus.NOT_FOUND, ex);
        }
    }

    // Arma la respuesta de error { "error": "..." } en un solo lugar
    private ResponseEntity<Map<String, String>> error(HttpStatus status, RuntimeException ex) {
        return ResponseEntity.status(status).body(Map.of("error", ex.getMessage()));
    }
}