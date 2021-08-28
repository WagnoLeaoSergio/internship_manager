package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.service.EmployerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;

@RestController
@RequestMapping("/api/employers")
public class EmployerController {

    private final EmployerService svc;

    public EmployerController(EmployerService svc) {
        this.svc = svc;
    }

    @GetMapping
    public List<Employer> getAllEmployers() {
        return svc.getAllEmployers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employer> getEmployerById(@PathVariable long id) {
        return svc.getEmployerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Employer> createEmployer(@RequestBody Employer newEmployer) {
        return svc.persistNewEmployer(newEmployer)
                .map(employer -> ResponseEntity.status(HttpStatus.CREATED).body(employer))
                .orElse(ResponseEntity.status(HttpStatus.CONFLICT).build());
    }

    @PutMapping("/{id}")
    public Employer updateEmployer(@RequestBody Employer employer, @PathVariable long id) {
        return svc.updateEmployer(id, employer);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deleteEmployer(@PathVariable long id) {
        svc.deleteEmployerById(id);
    }
}
