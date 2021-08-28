package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.AdminRepository;
import com.power222.tuimspfcauppbj.model.Admin;
import com.power222.tuimspfcauppbj.util.PasswordDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SuppressWarnings({"rawtypes", "unchecked"})
@ExtendWith(MockitoExtension.class)
class AdminServiceTests {

    public static final int PAGE = 0;
    public static final int PAGE_SIZE = 10;
    private final PageRequest pageRequest = PageRequest.of(PAGE, PAGE_SIZE);
    private Admin expected;


    @Mock
    private Page page;

    @Mock
    AdminRepository repo;

    @Mock
    PasswordEncoder encoder;

    @InjectMocks
    AdminService svc;

    @BeforeEach
    void setUp() {
        expected = Admin.builder()
                .id(1L)
                .name("Roméo Dupont")
                .email("lifeispain@masochist.com")
                .password("fuckno")
                .passwordExpired(false)
                .build();
    }

    @Test
    void getAllAdmins() {
        when(repo.findAll(pageRequest)).thenReturn(page);

        var actual = svc.getAllAdmins(PAGE, PAGE_SIZE);

        assertThat(actual).isEqualTo(page);
    }

    @Test
    void createAdmin() {
        when(repo.existsByEmail(expected.getEmail())).thenReturn(false);
        when(repo.saveAndFlush(expected)).thenReturn(expected);

        var actual = svc.createAdmin(expected);

        assertThat(actual).contains(expected);
    }

    @Test
    void createAdminDuplicateUsername() {
        when(repo.existsByEmail(expected.getEmail())).thenReturn(true);

        var actual = svc.createAdmin(expected);

        assertThat(actual).isEmpty();
    }

    @Test
    void toggleDisabledAdmin() {
        when(repo.findById(expected.getId())).thenReturn(Optional.of(expected));
        when(repo.saveAndFlush(expected)).thenReturn(expected);

        var actual = svc.toggleDisabledAdmin(expected.getId());

        assertThat(actual).isPresent();
        assertThat(actual.get().isDisabled()).isTrue();
    }

    @Test
    void toggleEnabledAdmin() {
        expected.setDisabled(true);
        when(repo.findById(expected.getId())).thenReturn(Optional.of(expected));
        when(repo.saveAndFlush(expected)).thenReturn(expected);

        var actual = svc.toggleDisabledAdmin(expected.getId());

        assertThat(actual).isPresent();
        assertThat(actual.get().isDisabled()).isFalse();
    }

    @Test
    void toggleDisabledInvalidAdmin() {
        when(repo.findById(expected.getId())).thenReturn(Optional.empty());

        var actual = svc.toggleDisabledAdmin(expected.getId());

        assertThat(actual).isEmpty();
    }

    @Test
    void updateUserPassword() {
        final var newPassword = "fuckyes";
        when(repo.findByEmail(expected.getEmail())).thenReturn(Optional.of(expected));
        when(repo.saveAndFlush(expected)).thenReturn(expected);
        when(encoder.encode(newPassword)).thenReturn(newPassword);
        PasswordDTO dto = PasswordDTO.builder()
                .newPassword(newPassword)
                .username(expected.getEmail())
                .build();

        var actual = svc.updateUserPassword(dto);

        assertThat(actual).isPresent();
        assertThat(actual.get().getPassword()).isEqualTo(newPassword);
    }

    @Test
    void updateInvalidUserPassword() {
        final var newPassword = "fuckyes";
        when(repo.findByEmail(expected.getEmail())).thenReturn(Optional.empty());
        PasswordDTO dto = PasswordDTO.builder()
                .newPassword(newPassword)
                .username(expected.getEmail())
                .build();

        var actual = svc.updateUserPassword(dto);

        assertThat(actual).isEmpty();
    }
}