package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.ResumeRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.Resume;
import com.power222.tuimspfcauppbj.model.Student;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResumeServiceTests {

    @Mock
    private ResumeRepository resumeRepo;

    @Mock
    private AuthenticationService authSvc;

    @Mock
    @SuppressWarnings("unused") //Required dependency of ResumeService
    private NotificationService notificationService;

    @InjectMocks
    private ResumeService resumeSvc;

    private Resume expectedResume;
    private Student expectedStudent;

    @BeforeEach
    void setUp() {
        expectedStudent = Student.builder()
                .id(1L)
                .password("password")
                .firstName("Simon")
                .lastName("Longpré")
                .studentId("1386195")
                .email("student@cal.qc.ca")
                .phoneNumber("5144816959")
                .address("6600 St-Jacques Ouest")
                .build();

        expectedResume = Resume.builder()
                .id(1L)
                .name("testResumeFileName")
                .file("qwerty")
                .owner(expectedStudent)
                .build();
    }

    @Test
    void getAllResumes() {
        var r1 = Resume.builder().id(1).build();
        var r2 = Resume.builder().id(2).build();
        var r3 = Resume.builder().id(3).build();

        when(resumeRepo.findAll()).thenReturn(Arrays.asList(r1, r2, r3));

        var actual = resumeSvc.getAllResumes();

        assertThat(actual).hasSize(3);
    }

    @Test
    void getAllResumesByOwnerId() {
        var r1 = Resume.builder().id(1).build();
        var r2 = Resume.builder().id(2).build();
        var r3 = Resume.builder().id(3).build();

        when(resumeRepo.findAllByOwner_Id(expectedStudent.getId())).thenReturn(Arrays.asList(r1, r2, r3));

        var actual = resumeSvc.getResumesByOwnerId(expectedStudent.getId());

        assertThat(actual).hasSize(3);
    }

    @Test
    void getResumesWithPendingApproval() {
        var r1 = Resume.builder().id(1L).build();
        var r2 = Resume.builder().id(2L).build();

        when(resumeRepo.findAllByReviewStatePending()).thenReturn(Arrays.asList(r1, r2));

        var actual = resumeSvc.getResumeWithPendingApproval();

        assertThat(actual).hasSize(2);
    }

    @Test
    void getResumeById() {
        when(resumeRepo.findById(1L)).thenReturn(Optional.of(expectedResume));

        var actual = resumeSvc.getResumeById(1L);

        assertThat(actual).contains(expectedResume);
    }

    @Test
    void persistNewResume() {
        Resume dto = expectedResume.toBuilder().owner(null).build();
        when(authSvc.getCurrentUser()).thenReturn(expectedStudent);
        when(resumeRepo.saveAndFlush(expectedResume)).thenReturn(expectedResume);

        var actual = resumeSvc.persistNewResume(dto);

        assertThat(actual).contains(expectedResume);
    }

    @Test
    void persistNewResumeWithInvalidOwner() {
        when(authSvc.getCurrentUser()).thenReturn(new Employer());

        var actual = resumeSvc.persistNewResume(expectedResume);

        assertThat(actual).isEmpty();
    }

    @Test
    void updateResume() {
        var initialId = expectedResume.getId();
        final var alteredId = 123L;
        var alteredResume = expectedResume.toBuilder().id(alteredId).build();
        when(resumeRepo.findById(initialId)).thenReturn(Optional.of(expectedResume));
        when(resumeRepo.saveAndFlush(alteredResume)).thenReturn(expectedResume);

        var actual = resumeSvc.updateResume(initialId, alteredResume);

        assertThat(actual).contains(expectedResume);
    }

    @Test
    void updateResumeWithNonexistentId() {
        var actual = resumeSvc.updateResume(expectedResume.getId(), expectedResume);

        assertThat(actual).isEmpty();
    }

    @Test
    void deleteResumeById() {
        var idToDelete = expectedResume.getId();

        resumeSvc.deleteResumeById(idToDelete);

        verify(resumeRepo, times(1)).deleteById(idToDelete);
    }
}
