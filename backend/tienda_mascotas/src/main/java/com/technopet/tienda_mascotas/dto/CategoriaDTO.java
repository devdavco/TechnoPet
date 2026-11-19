package com.technopet.tienda_mascotas.dto;


import com.technopet.tienda_mascotas.model.Categoria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaDTO {
    private Integer id;

    @NotBlank(message="El nombre es obligatorio")
    @Size(max=100, message ="Máximo 100 caracteres")
    private String nombre;

    @Size(max=500, message ="Máximo 500 caracteres")
    private String descripcion;
    private String imagen;


    public static CategoriaDTO fromEntity(Categoria categoria){
        return new CategoriaDTO(
                categoria.getId(),
                categoria.getNombre(),
                categoria.getDescripcion(),
                categoria.getImagen()
        );
    }
    public Categoria toEntity(){
        return new Categoria(id,nombre,descripcion,imagen);
    }
}
