package com.technopet.tienda_mascotas.service;

import com.technopet.tienda_mascotas.model.Producto;
import com.technopet.tienda_mascotas.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    public Optional<Producto> buscarPorId(Integer id) {
        return productoRepository.findById(id);
    }

    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    public Optional<Producto> actualizar(Integer id, Producto datos) {
        return productoRepository.findById(id).map(existente -> {
            existente.setNombre(datos.getNombre());
            existente.setDescripcion(datos.getDescripcion());
            existente.setPrecio(datos.getPrecio());
            existente.setStock(datos.getStock());
            existente.setImagen(datos.getImagen());
            if (datos.getCategoria() != null) {
                existente.setCategoria(datos.getCategoria());
            }
            return productoRepository.save(existente);
        });
    }

    public boolean eliminar(Integer id) {
        if (!productoRepository.existsById(id)) {
            return false;
        }
        productoRepository.deleteById(id);
        return true;
    }
}