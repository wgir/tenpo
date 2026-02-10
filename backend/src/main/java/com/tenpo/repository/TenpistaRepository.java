package com.tenpo.repository;

import com.tenpo.model.Tenpista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenpistaRepository extends JpaRepository<Tenpista, Integer> {

    Optional<Tenpista> findByRut(String rut);
}
