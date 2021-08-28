package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.InternEvaluationRepository;
import com.power222.tuimspfcauppbj.model.InternEvaluation;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class InternEvaluationService {

    private final InternEvaluationRepository interEvaluationRepo;

    public InternEvaluationService(InternEvaluationRepository interEvaliationRepo) {
        this.interEvaluationRepo = interEvaliationRepo;
    }

    public InternEvaluation createAndSaveNewInternEvaluation(InternEvaluation internEvaluation) {
        return interEvaluationRepo.saveAndFlush(internEvaluation);
    }

    public List<InternEvaluation> getAllInternEvaluation() {
        return interEvaluationRepo.findAll();
    }


    public Optional<InternEvaluation> getInternEvaluationById(long id) {
        return interEvaluationRepo.findById(id);
    }

    @Transactional
    public void deleteInternEvaluationById(long id) {
        interEvaluationRepo.deleteById(id);
    }
}
