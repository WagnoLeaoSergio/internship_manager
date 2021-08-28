package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.InternEvaluation;
import com.power222.tuimspfcauppbj.service.InternEvaluationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internEvaluation")
public class InternEvaluationController {

    private final InternEvaluationService svc;

    public InternEvaluationController(InternEvaluationService svc) {
        this.svc = svc;
    }

    @GetMapping
    public List<InternEvaluation> getAllInternEvaluation() {
        return svc.getAllInternEvaluation();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InternEvaluation> getInternEvaluationById(@PathVariable long id) {
        return svc.getInternEvaluationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public InternEvaluation createInternEvaluation(@RequestBody InternEvaluation newInternEvaluation) {
        return svc.createAndSaveNewInternEvaluation(newInternEvaluation);
    }

    @DeleteMapping("/{id}")
    public void deleteInternEvaluationByid(@PathVariable long id) {
        svc.deleteInternEvaluationById(id);
    }
}
