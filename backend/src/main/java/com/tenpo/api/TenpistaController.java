package com.tenpo.api;

import com.tenpo.api.dto.TenpistaRequestDTO;
import com.tenpo.api.dto.TenpistaResponseDTO;
import com.tenpo.service.TenpistaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tenpistas")
@RequiredArgsConstructor
public class TenpistaController {

    private final TenpistaService tenpistaService;

    @PostMapping
    public ResponseEntity<TenpistaResponseDTO> createTenpista(@Valid @RequestBody TenpistaRequestDTO request) {
        return new ResponseEntity<>(tenpistaService.createTenpista(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TenpistaResponseDTO>> getAllTenpistas() {
        return ResponseEntity.ok(tenpistaService.getAllTenpistas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TenpistaResponseDTO> getTenpistaById(@PathVariable Integer id) {
        return ResponseEntity.ok(tenpistaService.getTenpistaById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TenpistaResponseDTO> updateTenpista(@PathVariable Integer id,
            @Valid @RequestBody TenpistaRequestDTO request) {
        return ResponseEntity.ok(tenpistaService.updateTenpista(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTenpista(@PathVariable Integer id) {
        tenpistaService.deleteTenpista(id);
        return ResponseEntity.noContent().build();
    }
}
