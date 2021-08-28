package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, Long> {
    List<Employer> findAllBySemesters(String semester);
}
