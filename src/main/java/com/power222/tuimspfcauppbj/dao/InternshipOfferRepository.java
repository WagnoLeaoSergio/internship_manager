package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.util.ReviewState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipOfferRepository extends JpaRepository<InternshipOffer, Long> {

    List<InternshipOffer> findByEmployerEmail(String email);

    List<InternshipOffer> findAllByAllowedStudentsId(long id);

    List<InternshipOffer> findAllByReviewState(ReviewState reviewState);

    Page<InternshipOffer> findAllByReviewState(ReviewState reviewState, Pageable pageable);

    @Query("select o from InternshipOffer o where not exists (select a from o.applications a where a.state = com.power222.tuimspfcauppbj.util.StudentApplicationState.JOB_OFFER_ACCEPTED_BY_STUDENT)")
    Page<InternshipOffer> findAllByApplicationsStateNotAccepted(Pageable pageable);

    default List<InternshipOffer> findAllByReviewStatePending() {
        return findAllByReviewState(ReviewState.PENDING);
    }

    default List<InternshipOffer> findAllByReviewStateApproved() {
        return findAllByReviewState(ReviewState.APPROVED);
    }

    default Page<InternshipOffer> findAllByReviewStatePending(Pageable pageable) {
        return findAllByReviewState(ReviewState.PENDING, pageable);
    }
}
