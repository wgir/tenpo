package com.tenpo.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenpo.api.dto.TenpistaRequestDTO;
import com.tenpo.api.dto.TenpistaResponseDTO;
import com.tenpo.service.TenpistaService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TenpistaController.class)
class TenpistaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TenpistaService tenpistaService;

    @Test
    @DisplayName("Should create tenpista when request is valid")
    void shouldCreateTenpistaWhenRequestIsValid() throws Exception {
        // Arrange
        TenpistaRequestDTO request = new TenpistaRequestDTO("John Doe", "12345678-k");
        TenpistaResponseDTO response = new TenpistaResponseDTO(1, "John Doe", "12345678-k");

        when(tenpistaService.createTenpista(any(TenpistaRequestDTO.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/tenpistas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("John Doe")))
                .andExpect(jsonPath("$.rut", is("12345678-k")));

        verify(tenpistaService, times(1)).createTenpista(any(TenpistaRequestDTO.class));
    }

    @Test
    @DisplayName("Should return 400 when create tenpista request is invalid")
    void shouldReturn400WhenCreateTenpistaRequestIsInvalid() throws Exception {
        // Arrange
        TenpistaRequestDTO invalidRequest = new TenpistaRequestDTO("", "");

        // Act & Assert
        mockMvc.perform(post("/tenpistas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title", is("Validation Error")));

        verify(tenpistaService, never()).createTenpista(any());
    }

    @Test
    @DisplayName("Should return all tenpistas")
    void shouldReturnAllTenpistas() throws Exception {
        // Arrange
        List<TenpistaResponseDTO> tenpistas = List.of(
                new TenpistaResponseDTO(1, "John Doe", "12345678-k"),
                new TenpistaResponseDTO(2, "Jane Doe", "87654321-0"));

        when(tenpistaService.getAllTenpistas()).thenReturn(tenpistas);

        // Act & Assert
        mockMvc.perform(get("/tenpistas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("John Doe")))
                .andExpect(jsonPath("$[1].name", is("Jane Doe")));

        verify(tenpistaService, times(1)).getAllTenpistas();
    }

    @Test
    @DisplayName("Should return tenpista when id exists")
    void shouldReturnTenpistaWhenIdExists() throws Exception {
        // Arrange
        Integer tenpistaId = 1;
        TenpistaResponseDTO response = new TenpistaResponseDTO(tenpistaId, "John Doe", "12345678-k");

        when(tenpistaService.getTenpistaById(tenpistaId)).thenReturn(response);

        // Act & Assert
        mockMvc.perform(get("/tenpistas/{id}", tenpistaId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(tenpistaId)))
                .andExpect(jsonPath("$.name", is("John Doe")));

        verify(tenpistaService, times(1)).getTenpistaById(tenpistaId);
    }

    @Test
    @DisplayName("Should return 400 when tenpista is not found")
    void shouldReturn400WhenTenpistaIsNotFound() throws Exception {
        // Arrange
        Integer tenpistaId = 99;
        when(tenpistaService.getTenpistaById(tenpistaId)).thenThrow(new RuntimeException("Tenpista not found"));

        // Act & Assert
        mockMvc.perform(get("/tenpistas/{id}", tenpistaId))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail", is("Tenpista not found")))
                .andExpect(jsonPath("$.title", is("Business Logic Error")));

        verify(tenpistaService, times(1)).getTenpistaById(tenpistaId);
    }

    @Test
    @DisplayName("Should update tenpista when data is valid")
    void shouldUpdateTenpistaWhenDataIsValid() throws Exception {
        // Arrange
        Integer tenpistaId = 1;
        TenpistaRequestDTO request = new TenpistaRequestDTO("Updated Name", "12345678-k");
        TenpistaResponseDTO response = new TenpistaResponseDTO(tenpistaId, "Updated Name", "12345678-k");

        when(tenpistaService.updateTenpista(eq(tenpistaId), any(TenpistaRequestDTO.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(put("/tenpistas/{id}", tenpistaId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Name")));

        verify(tenpistaService, times(1)).updateTenpista(eq(tenpistaId), any(TenpistaRequestDTO.class));
    }

    @Test
    @DisplayName("Should delete tenpista")
    void shouldDeleteTenpista() throws Exception {
        // Arrange
        Integer tenpistaId = 1;
        doNothing().when(tenpistaService).deleteTenpista(tenpistaId);

        // Act & Assert
        mockMvc.perform(delete("/tenpistas/{id}", tenpistaId))
                .andExpect(status().isNoContent());

        verify(tenpistaService, times(1)).deleteTenpista(tenpistaId);
    }
}
