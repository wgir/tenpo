package com.tenpo.service;

import com.tenpo.api.dto.TenpistaRequestDTO;
import com.tenpo.api.dto.TenpistaResponseDTO;
import com.tenpo.model.Tenpista;
import com.tenpo.repository.TenpistaRepository;
import com.tenpo.repository.TransactionRepository;
import com.tenpo.exception.TenpistaHasTransactionsException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TenpistaService Unit Tests")
class TenpistaServiceTest {

    @Mock
    private TenpistaRepository tenpistaRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TenpistaService tenpistaService;

    @Test
    @DisplayName("Should create tenpista when request is valid")
    void shouldCreateTenpistaWhenRequestIsValid() {
        // Arrange
        TenpistaRequestDTO request = new TenpistaRequestDTO("John Doe", "12.345.678-9");
        Tenpista tenpista = Tenpista.builder()
                .id(101)
                .name("John Doe")
                .rut("12.345.678-9")
                .build();

        when(tenpistaRepository.save(any(Tenpista.class))).thenReturn(tenpista);

        // Act
        TenpistaResponseDTO response = tenpistaService.createTenpista(request);

        // Assert
        assertNotNull(response);
        assertEquals(101, response.id());
        assertEquals("John Doe", response.name());
        verify(tenpistaRepository, times(1)).save(any(Tenpista.class));
    }

    @Test
    @DisplayName("Should return all tenpistas")
    void shouldReturnAllTenpistas() {
        // Arrange
        List<Tenpista> tenpistas = List.of(
                Tenpista.builder().id(1).name("Tenpista 1").build(),
                Tenpista.builder().id(2).name("Tenpista 2").build());

        when(tenpistaRepository.findAll()).thenReturn(tenpistas);

        // Act
        List<TenpistaResponseDTO> response = tenpistaService.getAllTenpistas();

        // Assert
        assertEquals(2, response.size());
        verify(tenpistaRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return tenpista when id exists")
    void shouldReturnTenpistaWhenIdExists() {
        // Arrange
        Integer id = 101;
        Tenpista tenpista = Tenpista.builder().id(id).name("John Doe").build();

        when(tenpistaRepository.findById(id)).thenReturn(Optional.of(tenpista));

        // Act
        TenpistaResponseDTO response = tenpistaService.getTenpistaById(id);

        // Assert
        assertNotNull(response);
        assertEquals(id, response.id());
        verify(tenpistaRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Should throw exception when tenpista id does not exist")
    void shouldThrowExceptionWhenTenpistaIdDoesNotExist() {
        // Arrange
        Integer id = 999;
        when(tenpistaRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> tenpistaService.getTenpistaById(id));
    }

    @Test
    @DisplayName("Should update tenpista details when valid")
    void shouldUpdateTenpistaWhenValid() {
        // Arrange
        Integer tenpistaId = 101;
        TenpistaRequestDTO request = new TenpistaRequestDTO("Jane Doe", "98.765.432-1");
        Tenpista existingTenpista = Tenpista.builder().id(tenpistaId).name("Old Name").build();
        Tenpista updatedTenpista = Tenpista.builder().id(tenpistaId).name("Jane Doe").rut("98.765.432-1").build();

        when(tenpistaRepository.findById(tenpistaId)).thenReturn(Optional.of(existingTenpista));
        when(tenpistaRepository.save(any(Tenpista.class))).thenReturn(updatedTenpista);

        // Act
        TenpistaResponseDTO response = tenpistaService.updateTenpista(tenpistaId, request);

        // Assert
        assertNotNull(response);
        assertEquals("Jane Doe", response.name());
        verify(tenpistaRepository, times(1)).findById(tenpistaId);
        verify(tenpistaRepository, times(1)).save(any(Tenpista.class));
    }

    @Test
    @DisplayName("Should delete tenpista when no transactions exist")
    void shouldDeleteTenpistaWhenNoTransactionsExist() {
        // Arrange
        Integer id = 101;
        Tenpista tenpista = Tenpista.builder().id(id).name("John Doe").build();

        when(tenpistaRepository.findById(id)).thenReturn(Optional.of(tenpista));
        when(transactionRepository.countByTenpistaId(id)).thenReturn(0L);
        doNothing().when(tenpistaRepository).delete(tenpista);

        // Act
        tenpistaService.deleteTenpista(id);

        // Assert
        verify(tenpistaRepository, times(1)).findById(id);
        verify(transactionRepository, times(1)).countByTenpistaId(id);
        verify(tenpistaRepository, times(1)).delete(tenpista);
    }

    @Test
    @DisplayName("Should throw TenpistaHasTransactionsException when tenpista has transactions")
    void shouldThrowExceptionWhenTenpistaHasTransactions() {
        // Arrange
        Integer id = 101;
        Tenpista tenpista = Tenpista.builder().id(id).name("John Doe").build();

        when(tenpistaRepository.findById(id)).thenReturn(Optional.of(tenpista));
        when(transactionRepository.countByTenpistaId(id)).thenReturn(5L);

        // Act & Assert
        TenpistaHasTransactionsException exception = assertThrows(
                TenpistaHasTransactionsException.class,
                () -> tenpistaService.deleteTenpista(id));

        assertTrue(exception.getMessage().contains("5 transaction(s)"));
        verify(tenpistaRepository, times(1)).findById(id);
        verify(transactionRepository, times(1)).countByTenpistaId(id);
        verify(tenpistaRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Should throw exception when tenpista not found for deletion")
    void shouldThrowExceptionWhenTenpistaNotFoundForDeletion() {
        // Arrange
        Integer id = 999;
        when(tenpistaRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> tenpistaService.deleteTenpista(id));
        verify(tenpistaRepository, times(1)).findById(id);
        verify(transactionRepository, never()).countByTenpistaId(any());
    }

    @Test
    @DisplayName("Should handle race condition with DataIntegrityViolationException")
    void shouldHandleRaceConditionDuringDeletion() {
        // Arrange
        Integer id = 101;
        Tenpista tenpista = Tenpista.builder().id(id).name("John Doe").build();

        when(tenpistaRepository.findById(id)).thenReturn(Optional.of(tenpista));
        when(transactionRepository.countByTenpistaId(id)).thenReturn(0L);
        doThrow(new DataIntegrityViolationException("FK constraint"))
                .when(tenpistaRepository).delete(tenpista);

        // Act & Assert
        TenpistaHasTransactionsException exception = assertThrows(
                TenpistaHasTransactionsException.class,
                () -> tenpistaService.deleteTenpista(id));

        assertTrue(exception.getMessage().contains("Cannot delete tenpista with existing transactions"));
        verify(tenpistaRepository, times(1)).delete(tenpista);
    }
}
