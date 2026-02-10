package com.tenpo.repository;

import com.tenpo.model.Transaction;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    @EntityGraph(attributePaths = { "tenpista" })
    @Query("SELECT t FROM Transaction t WHERE t.tenpista.id = :tenpistaId")
    List<Transaction> findByTenpistaId(@Param("tenpistaId") Integer tenpistaId);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.tenpista.id = :tenpistaId")
    long countByTenpistaId(@Param("tenpistaId") Integer tenpistaId);
}
