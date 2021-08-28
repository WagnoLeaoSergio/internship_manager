package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.util.SemesterContext;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Aspect
@Component
public class SemesterAspect {

    @PersistenceContext
    EntityManager entityManager;

    @Before("execution(* org.springframework.data.repository.Repository+.*(..))")
    public void activateTenantFilter() {
        String semester = SemesterContext.isSet() ? SemesterContext.getCurrent() : SemesterContext.getPresentSemester();
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("semesterFilter")
                .setParameter("semester", semester);
    }
}
