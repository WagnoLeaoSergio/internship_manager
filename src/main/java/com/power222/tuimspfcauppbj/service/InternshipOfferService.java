package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.util.ReviewState;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class InternshipOfferService {

    private final InternshipOfferRepository offerRepo;
    private final AuthenticationService authSvc;
    private final StudentRepository studentRepo;
    private final NotificationService notifSvc;

    public InternshipOfferService(InternshipOfferRepository offerRepo, AuthenticationService authSvc, StudentRepository studentRepo, NotificationService notifSvc) {
        this.offerRepo = offerRepo;
        this.authSvc = authSvc;
        this.studentRepo = studentRepo;
        this.notifSvc = notifSvc;
    }

    public List<InternshipOffer> getAllInternshipOffers() {
        return offerRepo.findAll();
    }

    public List<InternshipOffer> getOfferByAllowedStudentId(long studentId) {
        return offerRepo.findAllByAllowedStudentsId(studentId);
    }

    public List<InternshipOffer> getInternshipOffersOfEmployer(String email) {
        return offerRepo.findByEmployerEmail(email);
    }

    public List<InternshipOffer> getInternshipOffersWithPendingApproval() {
        return offerRepo.findAllByReviewStatePending();
    }

    public List<InternshipOffer> getApprovedInternshipOffers() {
        return offerRepo.findAllByReviewStateApproved();
    }

    public Optional<InternshipOffer> getInternshipOfferById(long id) {
        return offerRepo.findById(id);
    }

    public Optional<InternshipOffer> createInternshipOffer(InternshipOffer offer) {
        return Optional.ofNullable(authSvc.getCurrentUser())
                .filter(u -> u instanceof Employer)
                .map(e -> setOfferInitialState(offer, (Employer) e))
                .map(offerRepo::saveAndFlush)
                .map(o -> {
                    notifSvc.notifyOfferCreation(o);
                    return o;
                });
    }

    public Optional<InternshipOffer> updateInternshipOffer(long id, InternshipOffer offer) {
        return offerRepo.findById(id)
                .map(oldOffer -> {
                    offer.setId(oldOffer.getId());
                    offer.setSemester(oldOffer.getSemester());
                    return offer;
                })
                .filter(this::isOfferStateValid)
                .map(offerRepo::saveAndFlush)
                .map(o -> {
                    notifSvc.notifyOfferUpdate(o);
                    return o;
                });
    }

    public Optional<InternshipOffer> switchOfferVisibilityForStudent(long offerId, long studentId) {
        return offerRepo.findById(offerId)
                .flatMap(offer -> studentRepo.findById(studentId)
                        .map(student -> getStudentInternshipOfferFunction(student, offer)));
    }

    public void deleteOfferById(long id) {
        offerRepo.deleteById(id);
    }

    private InternshipOffer getStudentInternshipOfferFunction(Student student, InternshipOffer offer) {
        if (offer.getAllowedStudents().contains(student))
            offer.getAllowedStudents().remove(student);
        else {
            offer.getAllowedStudents().add(student);
            notifSvc.notifyOfferAssigned(offer, student.getId());
        }

        return offerRepo.saveAndFlush(offer);
    }

    private boolean isOfferStateValid(InternshipOffer offer) {
        if (offer.getReviewState() == ReviewState.DENIED)
            return (offer.getReasonForRejection() != null) && !offer.getReasonForRejection().isBlank();

        return true;
    }

    private InternshipOffer setOfferInitialState(InternshipOffer offer, Employer employer) {
        employer.getOffers().add(offer);
        offer.setEmployer(employer);
        offer.setReviewState(ReviewState.PENDING);
        offer.setAllowedStudents(Collections.emptyList());
        return offer;
    }
}
