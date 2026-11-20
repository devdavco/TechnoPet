package com.technopet.tienda_mascotas.dto;

import com.technopet.tienda_mascotas.model.Categoria;
import com.technopet.tienda_mascotas.model.Producto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {

    private Integer id;

    @NotNull(message = "La categoría es obligatoria")
    private Integer categoriaId;

    private String categoriaNombre; // solo respuesta, útil para el front

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150, message = "Máximo 150 caracteres")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @Min(value = 0, message = "El precio no puede ser negativo")
    private Integer precio;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    @Size(max = 500, message = "Máximo 500 caracteres")
    private String imagen;

    public static ProductoDTO fromEntity(Producto p) {
        return new ProductoDTO(
                p.getId(),
                p.getCategoria().getId(),
                p.getCategoria().getNombre(),
                p.getNombre(),
                p.getDescripcion(),
                p.getPrecio(),
                p.getStock(),
                p.getImagen()
        );
    }

    public Producto toEntity(Categoria categoria) {
        Producto p = new Producto();
        p.setId(id);
        p.setCategoria(categoria);
        p.setNombre(nombre);
        p.setDescripcion(descripcion);
        p.setPrecio(precio);
        p.setStock(stock);
        p.setImagen(imagen);
        return p;
    }
}
