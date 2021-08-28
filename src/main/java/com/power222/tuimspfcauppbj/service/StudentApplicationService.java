package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.ResumeRepository;
import com.power222.tuimspfcauppbj.dao.StudentApplicationRepository;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import com.power222.tuimspfcauppbj.util.StudentApplicationState;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class StudentApplicationService {

    private final StudentApplicationRepository appliRepo;
    private final InternshipOfferRepository offerRepo;
    private final ResumeRepository resumeRepo;
    private final AuthenticationService authSvc;

    public StudentApplicationService(StudentApplicationRepository appliRepo, InternshipOfferRepository offerRepo, ResumeRepository resumeRepo, AuthenticationService authSvc) {
        this.appliRepo = appliRepo;
        this.offerRepo = offerRepo;
        this.resumeRepo = resumeRepo;
        this.authSvc = authSvc;
    }

    public List<StudentApplication> getAllApplication() {
        return appliRepo.findAll();
    }

    public List<StudentApplication> getAllContractsWaitingForAdmin() {
        var set = new HashSet<StudentApplication>();
        set.addAll(appliRepo.findAllByStateAndContractIsNull(StudentApplicationState.JOB_OFFER_ACCEPTED_BY_STUDENT));
        set.addAll(appliRepo.findAllByContractSignatureState(ContractSignatureState.WAITING_FOR_ADMIN_SIGNATURE));
        return new ArrayList<>(set);
    }

    public Optional<StudentApplication> getApplicationById(long id) {
        return appliRepo.findById(id);
    }

    public Optional<StudentApplication> createAndSaveNewApplication(long offerId, long resumeId) {
        var currentUser = authSvc.getCurrentUser();
        var offer = offerRepo.findById(offerId);
        var resume = resumeRepo.findById(resumeId);
        if ((currentUser instanceof Student) && offer.isPresent() && resume.isPresent()) {
            return Optional.of(appliRepo.saveAndFlush(StudentApplication.builder()
                    .student((Student) currentUser)
                    .offer(offer.get())
                    .state(StudentApplicationState.APPLICATION_PENDING_FOR_EMPLOYER_INITIAL_REVIEW)
                    .reasonForRejection("")
                    .resume(resume.get())
                    .build()));
        } else
            return Optional.empty();
    }

    public Optional<StudentApplication> updateStudentApplicationState(long id, StudentApplication tempApplication) {
        return appliRepo.findById(id)
                .map(application -> {
                    application.setState(tempApplication.getState());
                    application.setReasonForRejection(tempApplication.getReasonForRejection());
                    return appliRepo.saveAndFlush(application);
                });
    }

    public StudentApplication updateStudentApplication(long id, StudentApplication newApplication) {
        return appliRepo.findById(id)
                .map(oldApplication -> {
                    newApplication.setId(oldApplication.getId());
                    newApplication.setSemester(oldApplication.getSemester());
                    return appliRepo.saveAndFlush(newApplication);
                })
                .orElse(newApplication);
    }
}
