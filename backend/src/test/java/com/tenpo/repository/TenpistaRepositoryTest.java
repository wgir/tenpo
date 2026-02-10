package com.tenpo.repository;

import com.tenpo.model.Tenpista;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@DisplayName("TenpistaRepository Integration Tests")
class TenpistaRepositoryTest {

    @Autowired
    private TenpistaRepository tenpistaRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("Should save tenpista when valid")
    void shouldSaveTenpistaWhenValid() {
        // Arrange
        Tenpista tenpista = Tenpista.builder()
                .name("John Smith")
                .rut("12.345.678-9")
                .build();

        // Act
        Tenpista savedTenpista = tenpistaRepository.save(tenpista);

        // Assert
        assertThat(savedTenpista).isNotNull();
        assertThat(savedTenpista.getId()).isNotNull();
        assertThat(savedTenpista.getName()).isEqualTo("John Smith");
        assertThat(savedTenpista.getRut()).isEqualTo("12.345.678-9");
    }

    @Test
    @DisplayName("Should find tenpista by rut when exists")
    void shouldFindTenpistaByRutWhenExists() {
        // Arrange
        Tenpista tenpista = Tenpista.builder()
                .name("Alice")
                .rut("99.999.999-9")
                .build();
        entityManager.persistAndFlush(tenpista);

        // Act
        Optional<Tenpista> found = tenpistaRepository.findByRut("99.999.999-9");

        // Assert
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Alice");
        assertThat(found.get().getRut()).isEqualTo("99.999.999-9");
    }

    @Test
    @DisplayName("Should return empty when findByRut non-existent rut")
    void shouldReturnEmptyWhenRutDoesNotExist() {
        // Act
        Optional<Tenpista> found = tenpistaRepository.findByRut("00.000.000-0");

        // Assert
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("Should delete tenpista by id")
    void shouldDeleteTenpistaById() {
        // Arrange
        Tenpista tenpista = Tenpista.builder()
                .name("ToDelete")
                .rut("11.111.111-1")
                .build();
        tenpista = entityManager.persistFlushFind(tenpista);

        // Act
        tenpistaRepository.deleteById(tenpista.getId());
        entityManager.flush();
        entityManager.clear();

        // Assert
        assertThat(tenpistaRepository.findById(tenpista.getId())).isEmpty();
    }
}
