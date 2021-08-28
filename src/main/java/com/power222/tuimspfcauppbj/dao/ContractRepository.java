package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findAllByStudentApplication_Offer_Employer_Id(long id);

    Page<Contract> findAllBySignatureState(ContractSignatureState state, Pageable pageable);

    List<Contract> findAllBySignatureState(ContractSignatureState state);

    List<Contract> findAllByStudentApplication_Student_Id(long id);
}
