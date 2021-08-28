package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.dao.SemesterRepository;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SemesterController {

    private final SemesterRepository repo;

    public SemesterController(SemesterRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/api/semesters")
    public List<String> getAllSemestersInDb() {
        var semesterList = repo.findAll();
        if (!semesterList.contains(SemesterContext.getPresentSemester()))
            semesterList.add(SemesterContext.getPresentSemester());

        return semesterList;
    }

    @GetMapping("/api/semesters/present")
    public String getPresentSemester() {
        return SemesterContext.getPresentSemester();
    }
}
