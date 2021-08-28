package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.ContractRepository;
import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

    private final StudentRepository studentRepo;
    private final InternshipOfferRepository offerRepo;
    private final ContractRepository contractRepo;

    public ReportService(StudentRepository studentRepo, InternshipOfferRepository offerRepo, ContractRepository contractRepo) {
        this.studentRepo = studentRepo;
        this.offerRepo = offerRepo;
        this.contractRepo = contractRepo;
    }

    public Page<Student> registeredStudents(int page, int itemPerPage) {
        return studentRepo.findAllBySemesters(SemesterContext.getCurrent(), PageRequest.of(page, itemPerPage));
    }

    public Page<Student> studentsWithoutResume(int page, int itemPerPage) {
        return studentRepo.findAllBySemestersAndResumesIsEmpty(SemesterContext.getCurrent(), PageRequest.of(page, itemPerPage));
    }

    public Page<Student> studentsPendingResumes(int page, int itemPerPage) {
        return studentRepo.findAllBySemestersAndResumesReviewStatePending(SemesterContext.getCurrent(), PageRequest.of(page, itemPerPage));
    }

    public Page<Student> studentsNotHired(int page, int itemPerPage) {
        return studentRepo.findAllByApplications_ContractIsNull(PageRequest.of(page, itemPerPage));
    }

    public Page<Student> studentsScheduledInterview(int page, int itemPerPage) {
        return studentRepo.findAllByApplications_InterviewIsNotNull(PageRequest.of(page, itemPerPage));
    }

    public Page<InternshipOffer> allOffers(int page, int itemPerPage) {
        return offerRepo.findAll(PageRequest.of(page, itemPerPage));
    }

    public Page<InternshipOffer> offersPendingApprobation(int page, int itemPerPage) {
        return offerRepo.findAllByReviewStatePending(PageRequest.of(page, itemPerPage));
    }

    public Page<InternshipOffer> offersWithoutHired(int page, int itemPerPage) {
        return offerRepo.findAllByApplicationsStateNotAccepted(PageRequest.of(page, itemPerPage));
    }

    public Page<Contract> contractsWaitingStudent(int page, int itemPerPage) {
        return contractRepo.findAllBySignatureState(ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE, PageRequest.of(page, itemPerPage));
    }

    public Page<Contract> contractsWaitingEmployer(int page, int itemPerPage) {
        return contractRepo.findAllBySignatureState(ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE, PageRequest.of(page, itemPerPage));
    }

    public Page<Contract> contractsWaitingAdmin(int page, int itemPerPage) {
        return contractRepo.findAllBySignatureState(ContractSignatureState.WAITING_FOR_ADMIN_SIGNATURE, PageRequest.of(page, itemPerPage));
    }
}
