package com.technopet.tienda_mascotas.controller;

import com.technopet.tienda_mascotas.dto.CategoriaDTO;
import com.technopet.tienda_mascotas.model.Categoria;
import com.technopet.tienda_mascotas.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    public List<CategoriaDTO> listarCategorias() {
        return categoriaService.findAll().stream()
                .map(CategoriaDTO::fromEntity)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerCategoria(@PathVariable Integer id) {
        try {
            Categoria categoria = categoriaService.findById(id);
            return ResponseEntity.ok(CategoriaDTO.fromEntity(categoria));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<CategoriaDTO> crearCategoria(@Valid @RequestBody CategoriaDTO dto) {
        dto.setId(null); // evita que el cliente sobrescriba una categoría existente
        Categoria creada = categoriaService.save(dto.toEntity());
        return ResponseEntity.status(HttpStatus.CREATED).body(CategoriaDTO.fromEntity(creada));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCategoria(@PathVariable Integer id,
                                                 @Valid @RequestBody CategoriaDTO dto) {
        try {
            Categoria actualizada = categoriaService.update(id, dto.toEntity());
            return ResponseEntity.ok(CategoriaDTO.fromEntity(actualizada));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable Integer id) {
        try {
            categoriaService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        }
    }
}
