package com.technopet.tienda_mascotas.dto;

import com.technopet.tienda_mascotas.model.EstadoPedido;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CambioEstadoDTO {

    @NotNull(message = "El estado es obligatorio")
    private EstadoPedido estado;
}