package com.tenpo.api.dto;

import lombok.Builder;

@Builder
public record TenpistaResponseDTO(
                Integer id,
                String name,
                String rut) {
}
