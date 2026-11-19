package com.technopet.tienda_mascotas.service;

import com.technopet.tienda_mascotas.model.Categoria;

public interface CategoriaService {

    Categoria findById(Long id);
    Categoria save(Categoria categoria);
    Categoria update(Long id, Categoria categoria);
    Categoria deleteById(Long id);

}
