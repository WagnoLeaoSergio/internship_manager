package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Resume;
import com.power222.tuimspfcauppbj.util.ReviewState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    @SuppressWarnings("MethodParameterNamingConvention")
    List<Resume> findAllByOwner_Id(long owner_id);

    List<Resume> findAllByReviewState(ReviewState reviewState);

    default List<Resume> findAllByReviewStatePending() {
        return findAllByReviewState(ReviewState.PENDING);
    }
}
