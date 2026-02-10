package com.tenpo.service;

import com.tenpo.api.dto.TransactionRequestDTO;
import com.tenpo.api.dto.TransactionResponseDTO;
import com.tenpo.model.Tenpista;
import com.tenpo.model.Transaction;
import com.tenpo.repository.TenpistaRepository;
import com.tenpo.repository.TransactionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TransactionService Unit Tests")
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private TenpistaRepository tenpistaRepository;

    @InjectMocks
    private TransactionService transactionService;

    @Test
    @DisplayName("Should create transaction when request is valid")
    void shouldCreateTransactionWhenRequestIsValid() {
        // Arrange
        Integer tenpistaId = 1;
        LocalDateTime now = LocalDateTime.now();
        TransactionRequestDTO request = new TransactionRequestDTO(500, "Starbucks", now, tenpistaId);

        Tenpista tenpista = Tenpista.builder().id(tenpistaId).name("Tenpista 1").rut("12345678-9").build();
        Transaction transaction = Transaction.builder()
                .id(1001)
                .amount(500)
                .merchantOrBusiness("Starbucks")
                .date(now)
                .tenpista(tenpista)
                .build();

        when(tenpistaRepository.findById(tenpistaId)).thenReturn(Optional.of(tenpista));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        // Act
        TransactionResponseDTO response = transactionService.createTransaction(request);

        // Assert
        assertNotNull(response);
        assertEquals(1001, response.id());
        assertEquals(500, response.amount());
        assertEquals("Starbucks", response.merchantOrBusiness());
        verify(tenpistaRepository, times(1)).findById(tenpistaId);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    @DisplayName("Should throw exception when tenpista not found")
    void shouldThrowExceptionWhenTenpistaNotFound() {
        // Arrange
        Integer tenpistaId = 999;
        TransactionRequestDTO request = new TransactionRequestDTO(500, "Biz", LocalDateTime.now(), tenpistaId);

        when(tenpistaRepository.findById(tenpistaId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> transactionService.createTransaction(request));
        assertEquals("Tenpista not found", exception.getMessage());
        verify(tenpistaRepository, times(1)).findById(tenpistaId);
        verifyNoInteractions(transactionRepository);
    }

    @Test
    @DisplayName("Should return all transactions")
    void shouldReturnAllTransactions() {
        // Arrange
        Tenpista tenpista = Tenpista.builder().id(1).name("Tenpista 1").rut("12345678-9").build();
        List<Transaction> transactions = List.of(
                Transaction.builder().id(1).amount(100).merchantOrBusiness("Store 1").date(LocalDateTime.now())
                        .tenpista(tenpista).build(),
                Transaction.builder().id(2).amount(200).merchantOrBusiness("Store 2").date(LocalDateTime.now())
                        .tenpista(tenpista).build());

        when(transactionRepository.findAll()).thenReturn(transactions);

        // Act
        List<TransactionResponseDTO> response = transactionService.getAllTransactions();

        // Assert
        assertEquals(2, response.size());
        verify(transactionRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return transaction when id exists")
    void shouldReturnTransactionWhenIdExists() {
        // Arrange
        Integer id = 1001;
        Tenpista tenpista = Tenpista.builder().id(1).name("Tenpista 1").rut("12345678-9").build();
        Transaction transaction = Transaction.builder()
                .id(id)
                .amount(500)
                .merchantOrBusiness("Store")
                .date(LocalDateTime.now())
                .tenpista(tenpista)
                .build();

        when(transactionRepository.findById(id)).thenReturn(Optional.of(transaction));

        // Act
        TransactionResponseDTO response = transactionService.getTransactionById(id);

        // Assert
        assertNotNull(response);
        assertEquals(id, response.id());
        verify(transactionRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Should throw exception when transaction id does not exist")
    void shouldThrowExceptionWhenTransactionIdDoesNotExist() {
        // Arrange
        Integer id = 9999;
        when(transactionRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> transactionService.getTransactionById(id));
        assertEquals("Transaction not found", exception.getMessage());
    }

    @Test
    @DisplayName("Should update transaction when valid")
    void shouldUpdateTransactionWhenValid() {
        // Arrange
        Integer transId = 1001;
        Integer tenpistaId = 1;
        LocalDateTime now = LocalDateTime.now();
        TransactionRequestDTO request = new TransactionRequestDTO(600, "Updated Store", now, tenpistaId);

        Tenpista tenpista = Tenpista.builder().id(tenpistaId).name("Tenpista 1").rut("12345678-9").build();
        Transaction existingTransaction = Transaction.builder()
                .id(transId)
                .amount(500)
                .merchantOrBusiness("Old Store")
                .date(LocalDateTime.now())
                .tenpista(tenpista)
                .build();
        Transaction updatedTransaction = Transaction.builder()
                .id(transId)
                .amount(600)
                .merchantOrBusiness("Updated Store")
                .date(now)
                .tenpista(tenpista)
                .build();

        when(transactionRepository.findById(transId)).thenReturn(Optional.of(existingTransaction));
        when(tenpistaRepository.findById(tenpistaId)).thenReturn(Optional.of(tenpista));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(updatedTransaction);

        // Act
        TransactionResponseDTO response = transactionService.updateTransaction(transId, request);

        // Assert
        assertNotNull(response);
        assertEquals(600, response.amount());
        assertEquals("Updated Store", response.merchantOrBusiness());
        verify(transactionRepository, times(1)).findById(transId);
        verify(tenpistaRepository, times(1)).findById(tenpistaId);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    @DisplayName("Should delete transaction by id")
    void shouldDeleteTransactionById() {
        // Arrange
        Integer id = 1001;
        doNothing().when(transactionRepository).deleteById(id);

        // Act
        transactionService.deleteTransaction(id);

        // Assert
        verify(transactionRepository, times(1)).deleteById(id);
    }
}
