package com.tenpo.service;

import com.tenpo.api.dto.TransactionRequestDTO;
import com.tenpo.api.dto.TransactionResponseDTO;
import com.tenpo.model.Tenpista;
import com.tenpo.model.Transaction;
import com.tenpo.repository.TenpistaRepository;
import com.tenpo.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TenpistaRepository tenpistaRepository;

    @Transactional
    public TransactionResponseDTO createTransaction(TransactionRequestDTO request) {
        Tenpista tenpista = tenpistaRepository.findById(request.tenpistaId())
                .orElseThrow(() -> new RuntimeException("Tenpista not found"));

        Transaction transaction = Transaction.builder()
                .amount(request.amount())
                .merchantOrBusiness(request.merchantOrBusiness())
                .date(request.date())
                .tenpista(tenpista)
                .build();

        transaction = transactionRepository.save(transaction);
        return mapToResponse(transaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponseDTO> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TransactionResponseDTO getTransactionById(Integer id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return mapToResponse(transaction);
    }

    @Transactional
    public TransactionResponseDTO updateTransaction(Integer id, TransactionRequestDTO request) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        Tenpista tenpista = tenpistaRepository.findById(request.tenpistaId())
                .orElseThrow(() -> new RuntimeException("Tenpista not found"));

        transaction.setAmount(request.amount());
        transaction.setMerchantOrBusiness(request.merchantOrBusiness());
        transaction.setDate(request.date());
        transaction.setTenpista(tenpista);

        transaction = transactionRepository.save(transaction);
        return mapToResponse(transaction);
    }

    @Transactional
    public void deleteTransaction(Integer id) {
        transactionRepository.deleteById(id);
    }

    private TransactionResponseDTO mapToResponse(@org.springframework.lang.NonNull Transaction transaction) {
        return TransactionResponseDTO.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .merchantOrBusiness(transaction.getMerchantOrBusiness())
                .date(transaction.getDate())
                .tenpistaId(transaction.getTenpista().getId())
                .tenpistaName(transaction.getTenpista().getName())
                .build();
    }
}
