package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findAllByStudentApplication_Offer_Employer_Id(long id);

    List<Interview> findAllByStudentApplication_Student_Id(long id);

    List<Interview> findAllByDateTimeBefore(ZonedDateTime dateTime);
}
