package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import com.power222.tuimspfcauppbj.util.StudentApplicationState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentApplicationRepository extends JpaRepository<StudentApplication, Long> {
    List<StudentApplication> findAllByStateAndContractIsNull(StudentApplicationState state);

    List<StudentApplication> findAllByContractSignatureState(ContractSignatureState state);
}
