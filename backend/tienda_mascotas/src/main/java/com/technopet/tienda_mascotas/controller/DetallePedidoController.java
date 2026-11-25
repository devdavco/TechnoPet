package com.technopet.tienda_mascotas.controller;

import com.technopet.tienda_mascotas.dto.CambioCantidadDTO;
import com.technopet.tienda_mascotas.dto.DetallePedidoDTO;
import com.technopet.tienda_mascotas.model.DetallePedido;
import com.technopet.tienda_mascotas.service.DetallePedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/detalle-pedidos")
@RequiredArgsConstructor
public class DetallePedidoController {

    private final DetallePedidoService detallePedidoService;

    // GET /api/detalle-pedidos            → todos
    // GET /api/detalle-pedidos?pedidoId=1 → los de un pedido
    @GetMapping
    public List<DetallePedidoDTO> listar(@RequestParam(required = false) Integer pedidoId) {
        List<DetallePedido> detalles = (pedidoId != null)
                ? detallePedidoService.findByPedidoId(pedidoId)
                : detallePedidoService.findAll();
        return detalles.stream().map(DetallePedidoDTO::fromEntity).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(DetallePedidoDTO.fromEntity(detallePedidoService.findById(id)));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }

    // Cualquier usuario con sesión puede agregar productos a un pedido (lo usa el carrito al finalizar la compra)
    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody DetallePedidoDTO dto) {
        try {
            DetallePedido creado = detallePedidoService.save(
                    dto.getPedidoId(), dto.getProductoId(), dto.getCantidad());
            return ResponseEntity.status(HttpStatus.CREATED).body(DetallePedidoDTO.fromEntity(creado));
        } catch (IllegalArgumentException ex) {   // stock insuficiente
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (RuntimeException ex) {           // pedido o producto no existe
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizarCantidad(@PathVariable Integer id,
                                                @Valid @RequestBody CambioCantidadDTO dto) {
        try {
            DetallePedido actualizado = detallePedidoService.update(id, dto.getCantidad());
            return ResponseEntity.ok(DetallePedidoDTO.fromEntity(actualizado));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            detallePedidoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }
}
