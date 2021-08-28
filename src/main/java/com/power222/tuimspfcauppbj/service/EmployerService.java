package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.EmployerRepository;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class EmployerService {

    private final EmployerRepository employerRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public EmployerService(EmployerRepository employerRepo, UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.employerRepo = employerRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Employer> getAllEmployers() {
        return employerRepo.findAllBySemesters(SemesterContext.getCurrent());
    }

    public Optional<Employer> getEmployerById(long id) {
        return employerRepo.findById(id);
    }

    public Optional<Employer> persistNewEmployer(Employer employer) {
        if (userRepo.existsByEmail(employer.getEmail()))
            return Optional.empty();

        employer.setPassword(passwordEncoder.encode(employer.getPassword()));
        employer.setOffers(Collections.emptyList());
        return Optional.of(employerRepo.saveAndFlush(employer));
    }

    public Employer updateEmployer(long id, Employer employer) {
        return employerRepo.findById(id)
                .map(oldEmployer -> {
                    employer.setId(oldEmployer.getId());
                    return employerRepo.saveAndFlush(employer);
                })
                .orElse(employer);
    }

    @Transactional
    public void deleteEmployerById(long id) {
        employerRepo.deleteById(id);
    }
}
