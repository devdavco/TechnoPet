package com.technopet.tienda_mascotas.controller;

import com.technopet.tienda_mascotas.dto.ProductoDTO;
import com.technopet.tienda_mascotas.model.Categoria;
import com.technopet.tienda_mascotas.service.CategoriaService;
import com.technopet.tienda_mascotas.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;
    private final CategoriaService categoriaService;

    @GetMapping
    public List<ProductoDTO> obtenerProductos() {
        return productoService.listarTodos().stream()
                .map(ProductoDTO::fromEntity)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Integer id) {
        return productoService.buscarPorId(id)
                .map(ProductoDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crearProducto(@Valid @RequestBody ProductoDTO dto) {
        try {
            Categoria categoria = categoriaService.findById(dto.getCategoriaId());
            dto.setId(null); // evita sobrescribir un producto existente
            var creado = productoService.guardar(dto.toEntity(categoria));
            return ResponseEntity.status(HttpStatus.CREATED).body(ProductoDTO.fromEntity(creado));
        } catch (RuntimeException ex) { // categoría no encontrada
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizarProducto(@PathVariable Integer id,
                                                @Valid @RequestBody ProductoDTO dto) {
        try {
            Categoria categoria = categoriaService.findById(dto.getCategoriaId());
            return productoService.actualizar(id, dto.toEntity(categoria))
                    .map(ProductoDTO::fromEntity)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException ex) { // categoría no encontrada
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Integer id) {
        return productoService.eliminar(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}