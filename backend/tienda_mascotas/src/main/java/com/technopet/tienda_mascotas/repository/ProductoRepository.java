package com.technopet.tienda_mascotas.repository;

import com.technopet.tienda_mascotas.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    List<Producto> findByCategoriaId(Integer categoriaId);

    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    List<Producto> findByStockGreaterThan(Integer stock);
}