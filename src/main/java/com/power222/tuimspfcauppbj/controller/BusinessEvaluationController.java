package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.BusinessEvaluation;
import com.power222.tuimspfcauppbj.service.BusinessEvaluationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businessEvaluation")
public class BusinessEvaluationController {

    private final BusinessEvaluationService svc;

    public BusinessEvaluationController(BusinessEvaluationService svc) {
        this.svc = svc;
    }

    @GetMapping
    public List<BusinessEvaluation> getAllBusinessEvaluation() {
        return svc.getAllBusinessEvaluation();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessEvaluation> getBusinessEvaluationById(@PathVariable long id) {
        return svc.getBusinessEvaluationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public BusinessEvaluation createBusinessEvaluation(@RequestBody BusinessEvaluation newBusinessEvaluation) {
        return svc.createAndSaveNewBusinessEvaluation(newBusinessEvaluation);
    }

    @DeleteMapping("/{id}")
    public void deleteBusinessEvaluationByid(@PathVariable long id) {
        svc.deleteBusinessEvaluationById(id);
    }
}
