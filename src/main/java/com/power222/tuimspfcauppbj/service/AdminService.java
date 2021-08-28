package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.AdminRepository;
import com.power222.tuimspfcauppbj.model.Admin;
import com.power222.tuimspfcauppbj.util.PasswordDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository repo;
    private final PasswordEncoder encoder;

    public AdminService(AdminRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public Page<Admin> getAllAdmins(int page, int itemsPerPage) {
        return repo.findAll(PageRequest.of(page, itemsPerPage));
    }

    public Optional<Admin> createAdmin(Admin admin) {
        return Optional.of(admin)
                .filter(a -> !repo.existsByEmail(a.getEmail()))
                .map(a -> {
                    a.setPassword(encoder.encode(a.getPassword()));
                    a.setPasswordExpired(true);
                    return a;
                })
                .map(repo::saveAndFlush);
    }

    public Optional<Admin> toggleDisabledAdmin(long adminId) {
        return repo.findById(adminId)
                .map(a -> {
                    a.setDisabled(!a.isDisabled());
                    return a;
                })
                .map(repo::saveAndFlush);
    }

    public Optional<Admin> updateUserPassword(PasswordDTO dto) {
        return repo.findByEmail(dto.getUsername())
                .map(a -> {
                    a.setPassword(encoder.encode(dto.getNewPassword()));
                    return a;
                })
                .map(repo::saveAndFlush);
    }
}
