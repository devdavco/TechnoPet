package com.technopet.tienda_mascotas.service;

import com.technopet.tienda_mascotas.model.Categoria;

import com.technopet.tienda_mascotas.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriasServiceJpa implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Override
    public Categoria findById(Integer id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada: " + id));
    }

    @Override
    public Categoria save(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Override
    public Categoria update(Integer id, Categoria categoria) {
        Categoria existente = findById(id);
        if(categoria.getNombre() != null && !categoria.getNombre().isBlank() ){
            existente.setNombre(categoria.getNombre());

        }
        if( categoria.getDescripcion() != null && !categoria.getDescripcion().isBlank()){
            existente.setDescripcion(categoria.getDescripcion());
        }
        if(categoria.getImagen() != null && !categoria.getImagen().isBlank()){
            existente.setImagen(categoria.getImagen());
        }

        return categoriaRepository.save(existente);
    }

    @Override
    public Categoria deleteById(Integer id) {
        Categoria existente = findById(id);
        categoriaRepository.delete(existente);
        return existente;
    }

    @Override
    public List<Categoria> findAll() {
        return categoriaRepository.findAll();
    }
}
