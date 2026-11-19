package com.technopet.tienda_mascotas.service;

import com.technopet.tienda_mascotas.model.Categoria;

import java.util.List;

public interface CategoriaService {

    Categoria findById(Integer id);
    Categoria save(Categoria categoria);
    Categoria update(Integer id, Categoria categoria);
    Categoria deleteById(Integer id);
    List<Categoria> findAll();

}
