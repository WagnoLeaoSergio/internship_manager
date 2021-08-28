package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.InterviewRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.Interview;
import com.power222.tuimspfcauppbj.model.User;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class InterviewService {
    private final InterviewRepository interviewRepo;
    private final AuthenticationService authSvc;

    public InterviewService(InterviewRepository interviewRepo, AuthenticationService authSvc) {
        this.interviewRepo = interviewRepo;
        this.authSvc = authSvc;
    }

    public List<Interview> getAllInterviews() {
        return interviewRepo.findAll();
    }

    public List<Interview> getAllInterviewsByEmployerId(long id) {
        return interviewRepo.findAllByStudentApplication_Offer_Employer_Id(id);
    }

    public List<Interview> getAllInterviewsByStudentId(long id) {
        return interviewRepo.findAllByStudentApplication_Student_Id(id);
    }

    public Optional<Interview> getInterviewById(long id) {
        return interviewRepo.findById(id);
    }

    public Optional<Interview> persistNewInterview(Interview interview) {
        User currentUser = authSvc.getCurrentUser();
        if (currentUser instanceof Employer) {
            return Optional.of(interviewRepo.saveAndFlush(interview));
        } else
            return Optional.empty();
    }

    public Optional<Interview> updateInterview(long id, Interview interview) {
        return interviewRepo.findById(id)
                .map(oldInterview -> interview.toBuilder()
                        .id(oldInterview.getId())
                        .semester(oldInterview.getSemester())
                        .build())
                .map(newInterview -> interviewRepo.saveAndFlush(interview));
    }

    @Transactional
    public void deleteInterviewById(long id) {
        interviewRepo.deleteById(id);
    }
}
