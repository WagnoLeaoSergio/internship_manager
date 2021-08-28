package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.util.PasswordDTO;
import com.power222.tuimspfcauppbj.util.PasswordUpdateStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.function.Consumer;

@Service
public class AuthenticationService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final List<Consumer<User>> eventListeners;

    public AuthenticationService(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.eventListeners = new LinkedList<>();
    }

    private UserDetails getPrincipal() {
        var detail = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return (UserDetails) detail;
    }

    public User getCurrentUser() {
        final var user = userRepo.findByEmail(getPrincipal().getUsername()).orElse(null);
        eventListeners.forEach(userConsumer -> userConsumer.accept(user));
        return user;
    }

    public PasswordUpdateStatus updateUserPassword(PasswordDTO dto) {
        return userRepo.findByEmail(dto.getUsername())
                .map(u -> doPasswordUpdate(u, dto))
                .orElse(PasswordUpdateStatus.USER_NOT_FOUND);
    }

    private PasswordUpdateStatus doPasswordUpdate(User user, PasswordDTO dto) {
        if (encoder.matches(dto.getOldPassword(), user.getPassword())
                && !encoder.matches(dto.getNewPassword(), user.getPassword())) {
            user.setPassword(encoder.encode(dto.getNewPassword()));
            user.setPasswordExpired(false);
            userRepo.saveAndFlush(user);
            return PasswordUpdateStatus.SUCCESS;
        } else if (encoder.matches(dto.getNewPassword(), user.getPassword()))
            return PasswordUpdateStatus.OLD_AND_NEW_EQUAL;
        else
            return PasswordUpdateStatus.OLD_WRONG;
    }

    public void registerEventListeners(Consumer<User> userConsumer) {
        eventListeners.add(userConsumer);
    }
}
