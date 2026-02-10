package com.tenpo.repository;

import com.tenpo.model.Tenpista;
import com.tenpo.model.Transaction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@DisplayName("TransactionRepository Integration Tests")
class TransactionRepositoryTest {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TestEntityManager entityManager;

    private Tenpista tenpista;

    @BeforeEach
    void setUp() {
        tenpista = Tenpista.builder().name("Tenpista 1").rut("12.345.678-9").build();
        tenpista = entityManager.persistFlushFind(tenpista);
    }

    @Test
    @DisplayName("Should count transactions by tenpista id")
    void shouldCountByTenpistaId() {
        // Arrange
        entityManager.persist(Transaction.builder().amount(100).merchantOrBusiness("A").date(LocalDateTime.now())
                .tenpista(tenpista).build());
        entityManager.persist(Transaction.builder().amount(200).merchantOrBusiness("B").date(LocalDateTime.now())
                .tenpista(tenpista).build());
        entityManager.flush();

        // Act
        long count = transactionRepository.countByTenpistaId(tenpista.getId());

        // Assert
        assertThat(count).isEqualTo(2);
    }

    @Test
    @DisplayName("Should find transactions by tenpista id")
    void shouldFindByTenpistaId() {
        // Arrange
        entityManager.persist(Transaction.builder().amount(100).merchantOrBusiness("A").date(LocalDateTime.now())
                .tenpista(tenpista).build());
        entityManager.flush();

        // Act
        List<Transaction> transactions = transactionRepository.findByTenpistaId(tenpista.getId());

        // Assert
        assertThat(transactions).hasSize(1);
        assertThat(transactions.get(0).getAmount()).isEqualTo(100);
        // Verify @EntityGraph fetch
        assertThat(transactions.get(0).getTenpista()).isNotNull();
        assertThat(transactions.get(0).getTenpista().getName()).isEqualTo("Tenpista 1");
    }

    @Test
    @DisplayName("Should return 0 when counting transactions for tenpista with none")
    void shouldReturnZeroWhenNoTransactionsForTenpista() {
        // Act
        long count = transactionRepository.countByTenpistaId(999);

        // Assert
        assertThat(count).isZero();
    }

    @Test
    @DisplayName("Should save and find transaction")
    void shouldSaveAndFindTransaction() {
        // Arrange
        Transaction transaction = Transaction.builder()
                .amount(1000)
                .merchantOrBusiness("Store")
                .date(LocalDateTime.now())
                .tenpista(tenpista)
                .build();

        // Act
        Transaction saved = transactionRepository.save(transaction);
        entityManager.flush();
        entityManager.clear();

        Transaction found = transactionRepository.findById(saved.getId()).orElse(null);

        // Assert
        assertThat(found).isNotNull();
        assertThat(found.getAmount()).isEqualTo(1000);
        assertThat(found.getTenpista().getId()).isEqualTo(tenpista.getId());
    }
}
