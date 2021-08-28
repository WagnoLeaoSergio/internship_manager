package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.util.ReviewState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    @SuppressWarnings("SpringDataMethodInconsistencyInspection")
    Page<Student> findAllBySemestersAndResumesIsEmpty(String semester, Pageable pageable);

    Page<Student> findAllBySemestersAndResumes_ReviewState(String semster, ReviewState reviewState, Pageable pageable);

    Page<Student> findAllByApplications_ContractIsNull(Pageable pageable);

    Page<Student> findAllByApplications_InterviewIsNotNull(Pageable pageable);

    Page<Student> findAllBySemesters(String semester, Pageable pageable);

    List<Student> findAllBySemesters(String semester);

    default Page<Student> findAllBySemestersAndResumesReviewStatePending(String semester, Pageable pageable) {
        return findAllBySemestersAndResumes_ReviewState(semester, ReviewState.PENDING, pageable);
    }
}
