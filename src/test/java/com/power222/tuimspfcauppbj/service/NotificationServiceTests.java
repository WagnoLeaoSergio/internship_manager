package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.AdminRepository;
import com.power222.tuimspfcauppbj.model.*;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.concurrent.ThreadLocalRandom;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTests {

    @Mock
    private MailSendingService mailSvc;

    @Mock
    private RsocketNotificationService rsocketNotifSvc;

    @Mock
    private AdminRepository adminRepo;

    @InjectMocks
    private NotificationService notifSvc;

    private Admin expectedAdmin;
    private Student expectedStudent;
    private Resume expectedResume;
    private Employer expectedEmployer;
    private InternshipOffer expectedOffer;
    private Contract expectedContract;

    @BeforeEach
    void setUp() {
        var rnd = ThreadLocalRandom.current();

        expectedAdmin = Admin.builder().id(rnd.nextLong()).build();

        expectedStudent = Student.builder().id(rnd.nextLong()).build();
        expectedResume = Resume.builder()
                .id(rnd.nextLong())
                .owner(expectedStudent)
                .build();

        expectedEmployer = Employer.builder().id(rnd.nextLong()).build();
        expectedOffer = InternshipOffer.builder()
                .id(rnd.nextLong())
                .employer(expectedEmployer)
                .build();

        StudentApplication expectedAppli = StudentApplication.builder()
                .id(rnd.nextLong())
                .student(expectedStudent)
                .resume(expectedResume)
                .offer(expectedOffer)
                .build();

        expectedContract = Contract.builder()
                .id(rnd.nextLong())
                .admin(expectedAdmin)
                .studentApplication(expectedAppli)
                .build();
    }

    @Test
    void notifyContractCreationTest() {
        notifSvc.notifyContractCreation(expectedContract);

        verify(mailSvc, times(1)).notifyAboutCreation(expectedContract);
        verify(rsocketNotifSvc, times(1)).notify(eq(expectedStudent.getId()), anyString());
        verify(rsocketNotifSvc, times(1)).notify(eq(expectedEmployer.getId()), anyString());
    }

    @Test
    void notifyContractUpdateWaitingEmployerTest() {
        expectedContract.setSignatureState(ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE);

        notifSvc.notifyContractUpdate(expectedContract);

        verify(mailSvc, times(1)).notifyConcernedUsers(expectedContract);
        verify(rsocketNotifSvc, times(1)).notify(eq(expectedEmployer.getId()), anyString());

    }

    @Test
    void notifyContractUpdateRejectedEmployerTest() {
        expectedContract.setSignatureState(ContractSignatureState.REJECTED_BY_EMPLOYER);

        notifSvc.notifyContractUpdate(expectedContract);

        verify(mailSvc, times(1)).notifyConcernedUsers(expectedContract);
        verify(rsocketNotifSvc, times(1)).notify(eq(expectedAdmin.getId()), anyString());
        verify(rsocketNotifSvc, times(1)).notify(eq(expectedStudent.getId()), anyString());

    }

    @Test
    void notifyContractUpdateWaitingStudentTest() {
        expectedContract.setSignatureState(ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE);

        notifSvc.notifyContractUpdate(expectedContract);

        verify(mailSvc, times(1)).notifyConcernedUsers(expectedContract);
        verify(rsocketNotifSvc, times(1)).notify(eq(expectedStudent.getId()), anyString());

    }

    @Test
    void notifyContractUpdateWaitingAdminTest() {
        expectedContract.setSignatureState(ContractSignatureState.WAITING_FOR_ADMIN_SIGNATURE);

        notifSvc.notifyContractUpdate(expectedContract);

        verify(mailSvc, times(1)).notifyConcernedUsers(expectedContract);
        verify(rsocketNotifSvc, times(1)).notify(eq(expectedAdmin.getId()), anyString());

    }

    @Test
    void notifyContractUpdateSignedTest() {
        expectedContract.setSignatureState(ContractSignatureState.SIGNED);

        notifSvc.notifyContractUpdate(expectedContract);

        verify(mailSvc, times(1)).notifyConcernedUsers(expectedContract);
        verify(rsocketNotifSvc, times(1)).notify(eq(expectedAdmin.getId()), anyString());
        verify(rsocketNotifSvc, times(1)).notify(eq(expectedStudent.getId()), anyString());
        verify(rsocketNotifSvc, times(1)).notify(eq(expectedEmployer.getId()), anyString());

    }

    @Test
    void notifyContractUpdateIllegalTest() {
        expectedContract.setSignatureState(ContractSignatureState.PENDING_FOR_ADMIN_REVIEW);

        assertThatThrownBy(() -> notifSvc.notifyContractUpdate(expectedContract))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("State of contract not part of ContractSignatureState: ");
    }

    @Test
    void notifyContractDeletionTest() {
        notifSvc.notifyContractDeletion(expectedContract);

        verify(mailSvc, times(1)).notifyAboutDeletion(expectedContract);
        verify(rsocketNotifSvc, times(1)).notify(eq(expectedStudent.getId()), anyString());
        verify(rsocketNotifSvc, times(1)).notify(eq(expectedEmployer.getId()), anyString());
    }

    @Test
    void notifyResumeCreationTest() {
        when(adminRepo.findAll()).thenReturn(Collections.singletonList(expectedAdmin));

        notifSvc.notifyResumeCreation(expectedResume);

        verify(rsocketNotifSvc, times(1)).notify(eq(expectedAdmin.getId()), anyString());
    }

    @Test
    void notifyResumeUpdateTest() {
        notifSvc.notifyResumeUpdate(expectedResume);

        verify(rsocketNotifSvc, times(1)).notify(eq(expectedStudent.getId()), anyString());
    }

    @Test
    void notifyOfferCreationTest() {
        when(adminRepo.findAll()).thenReturn(Collections.singletonList(expectedAdmin));

        notifSvc.notifyOfferCreation(expectedOffer);

        verify(rsocketNotifSvc, times(1)).notify(eq(expectedAdmin.getId()), anyString());
    }

    @Test
    void notifyOfferUpdateTest() {
        notifSvc.notifyOfferUpdate(expectedOffer);

        verify(rsocketNotifSvc, times(1)).notify(eq(expectedEmployer.getId()), anyString());
    }

    @Test
    void notifyOfferAssignedTest() {
        notifSvc.notifyOfferAssigned(expectedOffer, expectedStudent.getId());

        verify(rsocketNotifSvc, times(1)).notify(eq(expectedStudent.getId()), anyString());
    }
}