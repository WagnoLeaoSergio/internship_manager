package com.power222.tuimspfcauppbj.dao;

import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class SemesterRepository {

    @PersistenceContext
    private EntityManager em;

    @SuppressWarnings({"unchecked", "SqlDialectInspection", "SqlNoDataSourceInspection"})
    public List<String> findAll() {
        return em.createNativeQuery("SELECT DISTINCT semester from (SELECT semester FROM INTERNSHIP_OFFER " +
                "union all SELECT semester FROM INTERVIEW " +
                "union all SELECT semester FROM STUDENT_APPLICATION " +
                "union all SELECT semesters FROM EMPLOYER_SEMESTERS " +
                "union all SELECT semesters FROM STUDENT_SEMESTERS)")
                .getResultList();
    }
}
