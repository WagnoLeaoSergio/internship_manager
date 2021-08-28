package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.ContractRepository;
import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.StudentApplication;
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
public class ContractServiceTests {

    @Mock
    private ContractRepository contractRepo;

    @Mock
    @SuppressWarnings("unused") //Required dependency of MailSendingService
    private ContractGenerationService contractGenSvc;

    @Mock
    @SuppressWarnings("unused") //Required dependency of MailSendingService
    private AuthenticationService authSvc;

    @Mock
    @SuppressWarnings("unused") //Required dependency of MailSendingService
    private NotificationService notificationService;

    @Mock
    private MailSendingService mailSvc;

    @InjectMocks
    private ContractService contractSvc;

    private Contract expectedContract;

    public ContractServiceTests() {
    }

    @BeforeEach
    void setUp() {

        StudentApplication expectedApplication = StudentApplication.builder()
                .id(1L)
                .build();

        expectedContract = Contract.builder()
                .id(1L)
                .studentApplication(expectedApplication)
                .build();
    }

    @Test
    void createAndSaveNewContractTest() {
        when(contractRepo.saveAndFlush(expectedContract)).thenReturn(expectedContract);

        var actual = contractSvc.createAndSaveNewContract(expectedContract);

        assertThat(actual).isNotNull();
        assertThat(actual).isEqualTo(expectedContract);

        verify(notificationService, times(1)).notifyContractCreation(expectedContract);
    }

    @Test
    void getAllContractTest() {
        var c1 = Contract.builder().id(1).build();
        var c2 = Contract.builder().id(2).build();
        var c3 = Contract.builder().id(3).build();

        when(contractRepo.findAll()).thenReturn(Arrays.asList(c1, c2, c3));

        var actual = contractSvc.getAllContract();

        assertThat(actual).hasSize(3);
    }

    @Test
    void getAllContractsByEmployerId() {
        var c1 = Contract.builder().id(1).build();
        var c2 = Contract.builder().id(1).build();
        var c3 = Contract.builder().id(1).build();
        var employerId = 1;

        when(contractRepo.findAllByStudentApplication_Offer_Employer_Id(employerId)).thenReturn(Arrays.asList(c1, c2, c3));

        var actual = contractSvc.getAllContractsByEmployerId(employerId);

        assertThat(actual).hasSize(3);
    }

    @Test
    void getAllContractsByEmployerIdWithInvalidId() {
        var employerId = 1;

        var actual = contractSvc.getAllContractsByEmployerId(employerId);

        assertThat(actual).hasSize(0);
    }

    @Test
    void getAllContractsByStudentsId() {
        var c1 = Contract.builder().id(1L).build();
        var c2 = Contract.builder().id(1L).build();
        var c3 = Contract.builder().id(1L).build();
        var studentId = 1;

        when(contractRepo.findAllByStudentApplication_Student_Id(studentId)).thenReturn(Arrays.asList(c1, c2, c3));

        var actual = contractSvc.getAllContractsByStudentId(studentId);

        assertThat(actual).hasSize(3);
    }

    @Test
    void getAllContractsByStudentIdWithInvalidId() {
        var studentId = 1;

        var actual = contractSvc.getAllContractsByEmployerId(studentId);

        assertThat(actual).hasSize(0);
    }

    @Test
    void getContractIdTest() {
        when(contractRepo.findById(1L)).thenReturn(Optional.of(expectedContract));

        var actual = contractSvc.getContractById(1L);

        assertThat(actual).contains(expectedContract);
    }

    @Test
    void getContractWithNoneExistentIdTest() {
        when(contractRepo.findById(1L)).thenReturn(Optional.empty());

        var actual = contractSvc.getContractById(1L);

        assertThat(actual).isEmpty();
    }

    @Test
    void updateContractTest() {
        var initialId = expectedContract.getId();
        final var alteredId = 123L;
        var alteredContract = expectedContract.toBuilder().id(alteredId).build();
        when(contractRepo.findById(initialId)).thenReturn(Optional.of(expectedContract));
        when(contractRepo.saveAndFlush(alteredContract)).thenReturn(expectedContract);

        var actual = contractSvc.updateContract(initialId, alteredContract);

        assertThat(actual).contains(expectedContract);
    }

    @Test
    void updateContractWithNonexistentIdTest() {
        var actual = contractSvc.updateContract(expectedContract.getId(), expectedContract);

        assertThat(actual).isEmpty();
    }

    @Test
    void deleteContractByInvalidIdTest() {
        var idToDelete = expectedContract.getId();
        when(contractSvc.getContractById(idToDelete)).thenReturn(Optional.empty());

        contractSvc.deleteContractById(idToDelete);

        verify(mailSvc, times(0)).notifyAboutDeletion(expectedContract);
        verify(contractRepo, times(0)).deleteById(idToDelete);
    }

    @Test
    void deleteContractByIdTest() {
        var idToDelete = expectedContract.getId();
        when(contractSvc.getContractById(idToDelete)).thenReturn(Optional.of(expectedContract));

        contractSvc.deleteContractById(idToDelete);

        verify(notificationService, times(1)).notifyContractDeletion(expectedContract);
        verify(contractRepo, times(1)).deleteById(idToDelete);
    }
}
