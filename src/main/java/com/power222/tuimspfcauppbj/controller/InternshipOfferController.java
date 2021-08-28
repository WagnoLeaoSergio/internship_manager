package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.service.InternshipOfferService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
public class InternshipOfferController {
    private final InternshipOfferService offerService;

    public InternshipOfferController(InternshipOfferService offerService) {
        this.offerService = offerService;
    }

    @GetMapping
    public List<InternshipOffer> getAllOffers() {
        return offerService.getAllInternshipOffers();
    }

    @GetMapping("/student/{id}")
    public List<InternshipOffer> getOfferByAllowedStudentId(@PathVariable long id) {
        return offerService.getOfferByAllowedStudentId(id);
    }

    @GetMapping("/pending")
    public List<InternshipOffer> getOffersWithPendingApproval() {
        return offerService.getInternshipOffersWithPendingApproval();
    }

    @GetMapping("/approved")
    public List<InternshipOffer> getApprovedOffers() {
        return offerService.getApprovedInternshipOffers();
    }

    @GetMapping("/employer/{username}")
    public List<InternshipOffer> getOffersByEmployerUsername(@PathVariable String username) {
        return offerService.getInternshipOffersOfEmployer(username);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InternshipOffer> getOffer(@PathVariable long id) {
        return offerService.getInternshipOfferById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<InternshipOffer> createOffer(@RequestBody InternshipOffer newOffer) {
        return offerService.createInternshipOffer(newOffer)
                .map(offer -> ResponseEntity.status(HttpStatus.CREATED).body(offer))
                .orElse(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<InternshipOffer> updateOffer(@RequestBody InternshipOffer offer, @PathVariable long id) {
        return offerService.updateInternshipOffer(id, offer)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.CONFLICT).build());
    }

    @PutMapping("/{offerId}/addRemoveStudent/{studentId}")
    public ResponseEntity<InternshipOffer> switchOfferVisibilityForStudent(@PathVariable long offerId, @PathVariable long studentId) {
        return offerService.switchOfferVisibilityForStudent(offerId, studentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }

    @DeleteMapping("/{id}")
    public void deleteOffer(@PathVariable long id) {
        offerService.deleteOfferById(id);
    }

}
