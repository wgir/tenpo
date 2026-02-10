package com.tenpo.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "tenpistas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tenpista {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tenpistas_seq")
    @SequenceGenerator(name = "tenpistas_seq", sequenceName = "tenpistas_tenpista_id_seq", allocationSize = 1)
    @Column(name = "tenpista_id")
    private Integer id;

    @Column(name = "tenpista_name", nullable = false)
    private String name;

    @Column(name = "tenpista_rut", nullable = false, unique = true)
    private String rut;

    @OneToMany(mappedBy = "tenpista", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions;
}
