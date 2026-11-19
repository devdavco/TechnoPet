package com.technopet.tienda_mascotas.service;

import com.technopet.tienda_mascotas.model.Categoria;

import com.technopet.tienda_mascotas.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoriasServiceJpa implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Override
    public Categoria findById(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada: " + id));
    }

    @Override
    public Categoria save(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Override
    public Categoria update(Long id, Categoria categoria) {
        Categoria existente = findById(id);
        existente.setNombre(categoria.getNombre());
        return categoriaRepository.save(existente);
    }

    @Override
    public Categoria deleteById(Long id) {
        Categoria existente = findById(id);
        categoriaRepository.delete(existente);
        return existente;
    }
}
