package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.ResumeRepository;
import com.power222.tuimspfcauppbj.model.Resume;
import com.power222.tuimspfcauppbj.model.Student;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ResumeService {
    private final ResumeRepository resumeRepo;
    private final AuthenticationService authSvc;
    private final NotificationService notifSvc;

    public ResumeService(ResumeRepository resumeRepo, AuthenticationService authSvc, NotificationService notifSvc) {
        this.resumeRepo = resumeRepo;
        this.authSvc = authSvc;
        this.notifSvc = notifSvc;
    }

    public List<Resume> getAllResumes() {
        return resumeRepo.findAll();
    }

    public List<Resume> getResumeWithPendingApproval() {
        return resumeRepo.findAllByReviewStatePending();
    }

    public Optional<Resume> getResumeById(long id) {
        return resumeRepo.findById(id);
    }

    public List<Resume> getResumesByOwnerId(long id) {
        return resumeRepo.findAllByOwner_Id(id);
    }

    public Optional<Resume> persistNewResume(Resume resume) {
        return Optional.of(authSvc.getCurrentUser())
                .filter(u -> u instanceof Student)
                .map(student -> {
                    resume.setOwner((Student) student);
                    return resume;
                })
                .map(resumeRepo::saveAndFlush)
                .map(savedResume -> {
                    notifSvc.notifyResumeCreation(savedResume);
                    return savedResume;
                });
    }

    public Optional<Resume> updateResume(long id, Resume resume) {
        return resumeRepo.findById(id)
                .map(Resume::getId)
                .map(oldId -> {
                    resume.setId(oldId);
                    return resume;
                })
                .map(resumeRepo::saveAndFlush)
                .map(updatedResume -> {
                    notifSvc.notifyResumeUpdate(updatedResume);
                    return updatedResume;
                });
    }

    @Transactional
    public void deleteResumeById(long id) {
        resumeRepo.deleteById(id);
    }
}
