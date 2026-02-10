package com.tenpo.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record TenpistaRequestDTO(
                @NotBlank(message = "Name is required") String name,
                @NotBlank(message = "RUT is required") String rut) {
}
