package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    boolean existsByEmail(String username);

    Optional<Admin> findByEmail(String username);
}
