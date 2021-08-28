package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.service.ReportService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private final ReportService svc;

    public ReportsController(ReportService svc) {
        this.svc = svc;
    }

    @GetMapping("/students")
    public Page<Student> registeredStudents(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int itemsPerPage) {
        return svc.registeredStudents(page, itemsPerPage);
    }

    @GetMapping("/studentsWithoutResume")
    public Page<Student> studentsWithoutResume(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int itemsPerPage) {
        return svc.studentsWithoutResume(page, itemsPerPage);
    }

    @GetMapping("/studentsPendingResumes")
    public Page<Student> studentsPendingResumes(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int itemsPerPage) {
        return svc.studentsPendingResumes(page, itemsPerPage);
    }

    @GetMapping("/studentsNotHired")
    public Page<Student> studentsNotHired(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int itemsPerPage) {
        return svc.studentsNotHired(page, itemsPerPage);
    }

    @GetMapping("/studentsScheduledInterview")
    public Page<Student> studentsScheduledInterview(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int itemsPerPage) {
        return svc.studentsScheduledInterview(page, itemsPerPage);
    }

    @GetMapping("/offers")
    public Page<InternshipOffer> allOffers(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int itemsPerPage) {
        return svc.allOffers(page, itemsPerPage);
    }

    @GetMapping("/offersPendingApprobation")
    public Page<InternshipOffer> offersPendingApprobation(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int itemsPerPage) {
        return svc.offersPendingApprobation(page, itemsPerPage);
    }

    @GetMapping("/offersWithoutHired")
    public Page<InternshipOffer> offersWithoutHired(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int itemsPerPage) {
        return svc.offersWithoutHired(page, itemsPerPage);
    }

    @GetMapping("/contractsWaitingStudent")
    public Page<Contract> contractsWaitingStudent(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int itemsPerPage) {
        return svc.contractsWaitingStudent(page, itemsPerPage);
    }

    @GetMapping("/contractsWaitingEmployer")
    public Page<Contract> contractsWaitingEmployer(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int itemsPerPage) {
        return svc.contractsWaitingEmployer(page, itemsPerPage);
    }

    @GetMapping("/contractsWaitingAdmin")
    public Page<Contract> contractsWaitingAdmin(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int itemsPerPage) {
        return svc.contractsWaitingAdmin(page, itemsPerPage);
    }
}
