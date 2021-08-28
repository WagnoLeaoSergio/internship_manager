package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.Interview;
import com.power222.tuimspfcauppbj.service.InterviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {
    private final InterviewService svc;

    public InterviewController(InterviewService svc) {
        this.svc = svc;
    }

    @GetMapping
    public List<Interview> getAllInterviews() {
        return svc.getAllInterviews();
    }

    @GetMapping("/employer/{id}")
    public List<Interview> getInterviewsByEmployerId(@PathVariable long id) {
        return svc.getAllInterviewsByEmployerId(id);
    }

    @GetMapping("/student/{id}")
    public List<Interview> getInterviewsByStudentId(@PathVariable long id) {
        return svc.getAllInterviewsByStudentId(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Interview> getInterview(@PathVariable long id) {
        return svc.getInterviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Interview> createInterview(@RequestBody Interview newInterview) {
        return svc.persistNewInterview(newInterview)
                .map(resume -> ResponseEntity.status(HttpStatus.CREATED).body(resume))
                .orElse(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Interview> updateInterview(@PathVariable long id, @RequestBody Interview requestBody) {
        return svc.updateInterview(id, requestBody)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public void deleteInterview(@PathVariable long id) {
        svc.deleteInterviewById(id);
    }
}
