package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.ResumeRepository;
import com.power222.tuimspfcauppbj.dao.StudentApplicationRepository;
import com.power222.tuimspfcauppbj.model.*;
import com.power222.tuimspfcauppbj.util.StudentApplicationState;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentApplicationServiceTests {

    @Mock
    private StudentApplicationRepository appliRepo;

    @Mock
    private InternshipOfferRepository offerRepo;

    @Mock
    private ResumeRepository resumeRepo;

    @Mock
    private AuthenticationService authSvc;

    @InjectMocks
    private StudentApplicationService appliSvc;

    private Student expectedUser;
    private InternshipOffer expectedOffer;
    private Resume expectedResume;
    private StudentApplication expectedAppli;

    @BeforeEach
    void beforeEach() {
        expectedUser = Student.builder()
                .id(1L)
                .build();

        expectedOffer = InternshipOffer.builder()
                .id(1L)
                .build();

        expectedResume = Resume.builder()
                .id(1L)
                .build();

        expectedAppli = StudentApplication.builder()
                .offer(expectedOffer)
                .student(expectedUser)
                .resume(expectedResume)
                .state(StudentApplicationState.APPLICATION_PENDING_FOR_EMPLOYER_INITIAL_REVIEW)
                .reasonForRejection("")
                .build();
    }

    @Test
    void createAndSaveNewApplication() {
        when(authSvc.getCurrentUser()).thenReturn(expectedUser);
        when(offerRepo.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));
        when(resumeRepo.findById(expectedResume.getId())).thenReturn(Optional.of(expectedResume));
        when(appliRepo.saveAndFlush(expectedAppli)).thenReturn(expectedAppli);

        var actual = appliSvc.createAndSaveNewApplication(expectedOffer.getId(), expectedResume.getId());

        assertThat(actual).contains(expectedAppli);
    }

    @Test
    void getApplicationById() {
        when(appliRepo.findById(1L)).thenReturn(Optional.of(expectedAppli));

        var actual = appliSvc.getApplicationById(1L);

        assertThat(actual).contains(expectedAppli);
    }

    @Test
    void getNonexistentApplicationById() {
        when(appliRepo.findById(1000L)).thenReturn(Optional.empty());

        var actual = appliSvc.getApplicationById(1000L);

        assertThat(actual).isEmpty();
    }

    @Test
    void createAndSaveNewApplicationWithNonStudentUser() {
        when(authSvc.getCurrentUser()).thenReturn(new Employer());
        when(offerRepo.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));
        when(resumeRepo.findById(expectedResume.getId())).thenReturn(Optional.of(expectedResume));

        var actual = appliSvc.createAndSaveNewApplication(expectedOffer.getId(), expectedResume.getId());

        assertThat(actual).isEmpty();
    }

    @Test
    void createAndSaveNewApplicationWithInvalidOfferId() {
        when(authSvc.getCurrentUser()).thenReturn(new Employer());
        when(offerRepo.findById(expectedOffer.getId())).thenReturn(Optional.empty());
        when(resumeRepo.findById(expectedResume.getId())).thenReturn(Optional.of(expectedResume));

        var actual = appliSvc.createAndSaveNewApplication(expectedOffer.getId(), expectedResume.getId());

        assertThat(actual).isEmpty();
    }

    @Test
    void createAndSaveNewApplicationWithInvalidResumeId() {
        when(authSvc.getCurrentUser()).thenReturn(new Employer());
        when(offerRepo.findById(expectedOffer.getId())).thenReturn(Optional.empty());
        when(resumeRepo.findById(expectedResume.getId())).thenReturn(Optional.of(expectedResume));

        var actual = appliSvc.createAndSaveNewApplication(expectedOffer.getId(), expectedResume.getId());

        assertThat(actual).isEmpty();
    }

    @Test
    void updateStudentApplication() {
        var actual = appliSvc.updateStudentApplication(expectedAppli.getId(), expectedAppli);
        assertThat(actual).isEqualTo(expectedAppli);
    }

    @Test
    void updateStudentApplicationWithModifiedId() {
        var idToPersistTo = expectedAppli.getId();
        var idToBeOverwritten = 50L;
        var studentApplicationWithIdToIgnore = expectedAppli.toBuilder().id(idToBeOverwritten).build();
        when(appliRepo.findById(idToPersistTo)).thenReturn(Optional.of(expectedAppli));
        when(appliRepo.saveAndFlush(expectedAppli)).thenReturn(expectedAppli);

        var actual = appliSvc.updateStudentApplication(idToPersistTo, studentApplicationWithIdToIgnore);

        assertThat(actual).isEqualTo(expectedAppli);
    }

    @Test
    void getAllStudentsApplicationTest() {
        var s1 = StudentApplication.builder().id(1L).build();
        var s2 = StudentApplication.builder().id(2L).build();
        var s3 = StudentApplication.builder().id(3L).build();
        when(appliRepo.findAll()).thenReturn(Arrays.asList(s1, s2, s3));

        var actual = appliSvc.getAllApplication();

        assertThat(actual).hasSize(3);
    }

    @Test
    void getAllPendingStudentsApplicationTest() {
        var s1 = StudentApplication.builder().id(1L).build();
        var s2 = StudentApplication.builder().id(2L).build();
        var s3 = StudentApplication.builder().id(3L).build();
        when(appliRepo.findAllByStateAndContractIsNull(StudentApplicationState.JOB_OFFER_ACCEPTED_BY_STUDENT))
                .thenReturn(Arrays.asList(s1, s2, s3));

        var actual = appliSvc.getAllContractsWaitingForAdmin();

        assertThat(actual).hasSize(3);
    }

    @Test
    void getNoStudentsApplicationTest() {
        when(appliRepo.findAll()).thenReturn(Collections.emptyList());

        var actual = appliSvc.getAllApplication();

        assertThat(actual).hasSize(0);
    }

    @Test
    void updateStudentApplicationState() {
        when(appliRepo.findById(expectedAppli.getId())).thenReturn(Optional.of(expectedAppli));
        when(appliRepo.saveAndFlush(expectedAppli)).thenReturn(expectedAppli);

        var actual = appliSvc.updateStudentApplicationState(expectedAppli.getId(), expectedAppli);
        assertThat(actual).isNotEmpty();
        assertThat(actual).contains(expectedAppli);
    }

    @Test
    void updateStudentApplicationStateNoneExistentId() {
        when(appliRepo.findById(expectedAppli.getId())).thenReturn(Optional.empty());

        var actual = appliSvc.updateStudentApplicationState(expectedAppli.getId(), expectedAppli);
        assertThat(actual).isEmpty();
    }


}
