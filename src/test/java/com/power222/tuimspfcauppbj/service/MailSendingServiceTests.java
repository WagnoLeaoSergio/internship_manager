package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.*;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import com.power222.tuimspfcauppbj.util.EmailContentsType;
import com.power222.tuimspfcauppbj.util.StudentApplicationState;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import javax.mail.internet.MimeMessage;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MailSendingServiceTests {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @Spy
    @InjectMocks
    private MailSendingService service;

    StudentApplication expectedStudentApplication;
    StudentApplication failStudentApplication;
    InternshipOffer offerWithInvalidUser;
    InternshipOffer offer;
    Employer employer;
    Contract contract;
    InternEvaluation internEvaluation;

    @BeforeEach
    public void setUp() {
        employer = Employer.builder()
                .password("Projet_employeur1")
                .companyName("Dacima")
                .contactName("Zack")
                .phoneNumber("5144317713")
                .address("1300 rue ducas")
                .email("employeur@gmail.com")
                .build();

        offer = InternshipOffer.builder()
                .employer(employer)
                .title("Building music selling app with Blazor")
                .build();

        expectedStudentApplication = StudentApplication.builder()
                .id(1L)
                .offer(offer)
                .student(
                        Student.builder()
                                .firstName("Ismail")
                                .lastName("ghedamsi")
                                .email("random.user.entity@pm.me")
                                .build())
                .state(StudentApplicationState.APPLICATION_PENDING_FOR_EMPLOYER_INITIAL_REVIEW)
                .reasonForRejection("")
                .build();

        offerWithInvalidUser = InternshipOffer.builder()
                .employer(Employer.builder().email("").build())
                .title("Building music selling app with Blazor")
                .build();

        failStudentApplication = StudentApplication.builder()
                .student(Student.builder().firstName("Ismail").lastName("ghedamsi").build())
                .offer(offerWithInvalidUser)
                .build();

        contract = Contract.builder()
                .id(1L)
                .studentApplication(expectedStudentApplication)
                .admin(
                        Admin.builder()
                                .id(1L)
                                .email("andrei.belkin.0@pm.me")
                                .build()
                )
                .build();

        internEvaluation = InternEvaluation.builder()
                .id(1L)
                .contract(contract)
                .build();
    }

    @Test
    public void notifyAboutContractCreationTest() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        service.notifyAboutCreation(contract);

        verify(service, times(1)).sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_CONTRACT, contract, contract.getStudentApplication().getStudent().getEmail());
        verify(service, times(1)).sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_CONTRACT, contract, contract.getStudentApplication().getOffer().getEmployer().getEmail());
    }

    @Test
    public void notifyAboutInternEvaluationCreationTest() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        service.notifyAboutCreation(internEvaluation);

        verify(service, times(1)).sendEmail(EmailContentsType.NOTIFY_ABOUT_EVALUATION_CREATED, contract, contract.getAdmin().getEmail());
    }

    @Test
    public void notifyAboutDeletionTest() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        service.notifyAboutDeletion(contract);

        verify(service, times(1)).sendEmail(EmailContentsType.NOTIFY_ABOUT_CONTRACT_DELETION, contract, contract.getStudentApplication().getStudent().getEmail());
        verify(service, times(1)).sendEmail(EmailContentsType.NOTIFY_ABOUT_CONTRACT_DELETION, contract, contract.getStudentApplication().getOffer().getEmployer().getEmail());
    }

    @Test
    public void notifyConcernedUsers_waitingForEmployerSignatureTest() {
        contract.setSignatureState(ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        service.notifyConcernedUsers(contract);

        verify(service, times(1)).sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_SIGNATURE, contract, contract.getStudentApplication().getOffer().getEmployer().getEmail());
    }

    @Test
    public void notifyConcernedUsers_rejectedByEmployerTest() {
        contract.setSignatureState(ContractSignatureState.REJECTED_BY_EMPLOYER);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        service.notifyConcernedUsers(contract);

        verify(service, times(1)).sendEmail(EmailContentsType.NOTIFY_ABOUT_CONTRACT_REJECTION, contract, contract.getAdmin().getEmail());
        verify(service, times(1)).sendEmail(EmailContentsType.NOTIFY_ABOUT_CONTRACT_REJECTION, contract, contract.getStudentApplication().getStudent().getEmail());
    }

    @Test
    public void notifyConcernedUsers_waitingForStudentSignatureTest() {
        contract.setSignatureState(ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        service.notifyConcernedUsers(contract);

        verify(service, times(1)).sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_SIGNATURE, contract, contract.getStudentApplication().getStudent().getEmail());
    }

    @Test
    public void notifyConcernedUsers_waitingForAdminSignatureTest() {
        contract.setSignatureState(ContractSignatureState.WAITING_FOR_ADMIN_SIGNATURE);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        service.notifyConcernedUsers(contract);

        verify(service, times(1)).sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_SIGNATURE, contract, contract.getAdmin().getEmail());
    }

    @Test
    public void notifyConcernedUsers_signedTest() {
        contract.setSignatureState(ContractSignatureState.SIGNED);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        service.notifyConcernedUsers(contract);

        verify(service, times(1)).sendEmail(EmailContentsType.NOTIFY_AND_ATTACH_SIGNED_CONTRACT, contract, contract.getAdmin().getEmail());
        verify(service, times(1)).sendEmail(EmailContentsType.NOTIFY_AND_ATTACH_SIGNED_CONTRACT, contract, contract.getStudentApplication().getStudent().getEmail());
        verify(service, times(1)).sendEmail(EmailContentsType.NOTIFY_AND_ATTACH_SIGNED_CONTRACT, contract, contract.getStudentApplication().getOffer().getEmployer().getEmail());
    }


}
