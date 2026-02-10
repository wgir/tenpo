package com.tenpo.service;

import com.tenpo.api.dto.TenpistaRequestDTO;
import com.tenpo.api.dto.TenpistaResponseDTO;
import com.tenpo.model.Tenpista;
import com.tenpo.repository.TenpistaRepository;
import com.tenpo.repository.TransactionRepository;
import com.tenpo.exception.TenpistaHasTransactionsException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class TenpistaService {

        private final TenpistaRepository tenpistaRepository;
        private final TransactionRepository transactionRepository;

        @Transactional
        public TenpistaResponseDTO createTenpista(TenpistaRequestDTO request) {
                Tenpista tenpista = Tenpista.builder()
                                .name(request.name())
                                .rut(request.rut())
                                .build();

                tenpista = tenpistaRepository.save(tenpista);
                return mapToResponse(tenpista);
        }

        @Transactional(readOnly = true)
        public List<TenpistaResponseDTO> getAllTenpistas() {
                return tenpistaRepository.findAll().stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public TenpistaResponseDTO getTenpistaById(Integer id) {
                Tenpista tenpista = tenpistaRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Tenpista not found"));
                return mapToResponse(tenpista);
        }

        @Transactional
        public TenpistaResponseDTO updateTenpista(Integer id, TenpistaRequestDTO request) {
                Tenpista tenpista = tenpistaRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Tenpista not found"));

                tenpista.setName(request.name());
                tenpista.setRut(request.rut());

                tenpista = tenpistaRepository.save(tenpista);
                return mapToResponse(tenpista);
        }

        @Transactional
        public void deleteTenpista(Integer id) {
                // Check if tenpista exists
                Tenpista tenpista = tenpistaRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Tenpista not found"));

                // Check if tenpista has transactions
                long transactionCount = transactionRepository.countByTenpistaId(id);
                if (transactionCount > 0) {
                        throw new TenpistaHasTransactionsException(
                                        String.format("Cannot delete tenpista. %d transaction(s) still associated with this tenpista.",
                                                        transactionCount));
                }

                // Attempt deletion with fallback for race conditions
                try {
                        tenpistaRepository.delete(tenpista);
                } catch (DataIntegrityViolationException e) {
                        throw new TenpistaHasTransactionsException(
                                        "Cannot delete tenpista with existing transactions.");
                }
        }

        private TenpistaResponseDTO mapToResponse(@org.springframework.lang.NonNull Tenpista tenpista) {
                return TenpistaResponseDTO.builder()
                                .id(tenpista.getId())
                                .name(tenpista.getName())
                                .rut(tenpista.getRut())
                                .build();
        }
}
