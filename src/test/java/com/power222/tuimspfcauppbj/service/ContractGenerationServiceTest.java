package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.*;
import com.power222.tuimspfcauppbj.model.InternshipOffer.InternshipOfferDetails;
import com.power222.tuimspfcauppbj.util.ContractDTO;
import com.power222.tuimspfcauppbj.util.ContractSignatureDTO;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.File;
import java.io.FileInputStream;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Base64;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@SuppressWarnings({"MagicNumber", "ClassWithTooManyFields"})
@ExtendWith(MockitoExtension.class)
public class ContractGenerationServiceTest {

    @Mock
    private AuthenticationService authService;

    @Mock
    private ContractService contractService;

    @Mock
    private StudentApplicationService studentApplicationService;

    @Mock
    @SuppressWarnings("unused") //Required dependency of ContractGenerationService
    private NotificationService notificationService;

    @InjectMocks
    private ContractGenerationService contractGenerationService;

    private ContractDTO contractDto;
    private StudentApplication expectedStudentApplication;
    private Contract contract;
    private ContractSignatureDTO signatureDto;
    private ContractSignatureDTO deniedSignatureDto;
    private Admin contractAdmin;

    @BeforeEach
    void setUp() throws Exception {
        contractDto = ContractDTO.builder()
                .engagementCollege("Engagement College")
                .engagementCompany("Engagement company")
                .engagementStudent("Engagement Etudiant")
                .studentApplicationId(1L)
                .file("tttt")
                .totalHoursPerWeek(20)
                .build();

        Employer employer = Employer.builder()
                .companyName("dacima")
                .build();

        InternshipOffer offer = InternshipOffer.builder()
                .employer(employer)
                .details(InternshipOfferDetails.builder()
                        .description("The coolest internship")
                        .startTime(LocalTime.of(8, 30))
                        .endTime(LocalTime.of(16, 0))
                        .internshipEndDate(LocalDate.parse("2020-11-01"))
                        .internshipStartDate(LocalDate.parse("2020-11-02"))
                        .build())
                .build();

        Student student = Student.builder()
                .firstName("ismail")
                .lastName("ghedamsi")
                .build();

        expectedStudentApplication = StudentApplication.builder()
                .id(1L)
                .offer(offer)
                .student(student)
                .build();

        contractAdmin = Admin.builder().id(1L).name("Simon Longpré-Landry").build();

        contract = Contract.builder()
                .id(1L)
                .signatureState(ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE)
                .admin(contractAdmin)
                .file("data:application/pdf;base64," + new String(Base64.getEncoder()
                        .encode(new FileInputStream(new File("bootstrapFiles/1.pdf")).readAllBytes())))
                .build();

        signatureDto = ContractSignatureDTO.builder()
                .contractId(1L)
                .isApproved(true)
                .nomSignataire("Andrei Belkin")
                .imageSignature("data:application/pdf;base64," + new String(Base64.getEncoder()
                        .encode(new FileInputStream(new File("bootstrapFiles/sign.png")).readAllBytes())))
                .build();

        deniedSignatureDto = ContractSignatureDTO.builder()
                .contractId(1L)
                .isApproved(false)
                .nomSignataire("Andrei Belkin")
                .imageSignature("data:application/pdf;base64," + new String(Base64.getEncoder()
                        .encode(new FileInputStream(new File("bootstrapFiles/sign.png")).readAllBytes())))
                .build();
    }

    @Test
    void updateContractSignatureApprovedByEmployerTest() {
        contract.setSignatureState(ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE);

        var modifiedContract = contract.toBuilder()
                .signatureState(ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE)
                .build();

        when(contractService.getContractById(contract.getId())).thenReturn(Optional.of(contract));
        when(contractService.updateContract(eq(contract.getId()), any(Contract.class))).thenReturn(Optional.of(modifiedContract));

        var actual = contractGenerationService.signContract(signatureDto);

        assertThat(actual).isNotEmpty();
        assertThat(actual.get().getSignatureState() == ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE);
        verify(contractService, times(1)).updateContract(contract.getId(), contract);
    }

    @Test
    void updateContractSignatureApprovedByStudentTest() {
        contract.setSignatureState(ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE);

        var modifiedContract = contract.toBuilder()
                .signatureState(ContractSignatureState.WAITING_FOR_ADMIN_SIGNATURE)
                .build();

        when(contractService.getContractById(contract.getId())).thenReturn(Optional.of(contract));
        when(contractService.updateContract(eq(contract.getId()), any(Contract.class))).thenReturn(Optional.of(modifiedContract));

        var actual = contractGenerationService.signContract(signatureDto);

        assertThat(actual).isNotEmpty();
        assertThat(actual.get().getSignatureState() == ContractSignatureState.WAITING_FOR_ADMIN_SIGNATURE);
        verify(contractService, times(1)).updateContract(contract.getId(), contract);
    }

    @Test
    void updateContractSignatureApprovedByAdminTest() {
        contract.setSignatureState(ContractSignatureState.WAITING_FOR_ADMIN_SIGNATURE);

        var modifiedContract = contract.toBuilder()
                .signatureState(ContractSignatureState.SIGNED)
                .build();

        when(contractService.getContractById(contract.getId())).thenReturn(Optional.of(contract));
        when(contractService.updateContract(eq(contract.getId()), any(Contract.class))).thenReturn(Optional.of(modifiedContract));

        var actual = contractGenerationService.signContract(signatureDto);

        assertThat(actual).isNotEmpty();
        assertThat(actual.get().getSignatureState() == ContractSignatureState.SIGNED);
        verify(contractService, times(1)).updateContract(contract.getId(), contract);
    }

    @Test
    void updateContractSignaturePendingForAdminTest() {
        contract.setSignatureState(ContractSignatureState.PENDING_FOR_ADMIN_REVIEW);

        var modifiedContract = contract.toBuilder()
                .signatureState(ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE)
                .build();

        when(contractService.getContractById(contract.getId())).thenReturn(Optional.of(contract));
        when(contractService.updateContract(eq(contract.getId()), any(Contract.class))).thenReturn(Optional.of(modifiedContract));

        var actual = contractGenerationService.signContract(signatureDto);

        assertThat(actual).isNotEmpty();
        assertThat(actual.get().getSignatureState() == ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE);
        verify(contractService, times(1)).updateContract(contract.getId(), contract);
    }

    @Test
    void updateContractSignatureNotApprovedNoContractTest() {
        contract.setSignatureState(ContractSignatureState.PENDING_FOR_ADMIN_REVIEW);

        when(contractService.getContractById(contract.getId())).thenReturn(Optional.of(contract));
        when(contractService.updateContract(anyLong(), any())).thenReturn(Optional.empty());

        var actual = contractGenerationService.signContract(deniedSignatureDto);

        assertThat(actual).isEmpty();
        verify(contractService, times(1)).updateContract(contract.getId(), contract);
    }

    @Test
    void updateContractSignatureDeniedTest() {
        String reasonForRejection = "Raison de test.";
        signatureDto.setApproved(false);
        signatureDto.setReasonForRejection(reasonForRejection);

        var modifiedContract = contract.toBuilder()
                .signatureState(ContractSignatureState.REJECTED_BY_EMPLOYER)
                .reasonForRejection(reasonForRejection)
                .build();

        when(contractService.getContractById(contract.getId())).thenReturn(Optional.of(contract));
        when(contractService.updateContract(eq(contract.getId()), any(Contract.class))).thenReturn(Optional.of(modifiedContract));

        var actual = contractGenerationService.signContract(signatureDto);

        assertThat(actual).isNotEmpty();
        assertEquals(actual.get().getReasonForRejection(), reasonForRejection);
        assertThat(actual.get().getSignatureState() == ContractSignatureState.REJECTED_BY_EMPLOYER);
        verify(contractService, times(1)).updateContract(contract.getId(), contract);
    }

    @Test
    void updateContractSignatureStateWithInvalidId() {
        assertThat(contractGenerationService.signContract(signatureDto)).isEmpty();
    }

    @Test
    void updateContractSignatureStateWithInvalidSignatureImageTest() {
        signatureDto.setImageSignature("data:image/png;base64," + Arrays.toString(Base64.getEncoder().encode("test12345".getBytes())));
        contract.setSignatureState(ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE);

        when(contractService.getContractById(contract.getId())).thenReturn(Optional.of(contract));

        var actual = contractGenerationService.signContract(signatureDto);

        assertThat(actual).isEmpty();
        verify(contractService, times(0)).updateContract(contract.getId(), contract);
    }

    @Test
    public void successfulPdfGenerationTestForActiveAdminAsEmployer() {
        when(authService.getCurrentUser()).thenReturn(Employer.builder().id(1L).build());

        boolean generatePdfSuccess = contractGenerationService.generateContract(contractDto);

        assertThat(generatePdfSuccess).isFalse();
    }

    @Test
    public void successfulPdfGenerationTestForActiveAdminAsAdmin() {
        when(contractGenerationService.getStudentApplication(contractDto)).thenReturn(Optional.of(expectedStudentApplication));
        when(studentApplicationService.getApplicationById(contractDto.getStudentApplicationId())).thenReturn(Optional.ofNullable(expectedStudentApplication));
        when(authService.getCurrentUser()).thenReturn(contractAdmin);

        boolean generatePdfSuccess = contractGenerationService.generateContract(contractDto);

        assertThat(generatePdfSuccess).isTrue();
    }

    @Test
    public void successfulPdfGenerationTestForGivenAdmin() {
        when(contractGenerationService.getStudentApplication(contractDto)).thenReturn(Optional.of(expectedStudentApplication));
        when(studentApplicationService.getApplicationById(contractDto.getStudentApplicationId())).thenReturn(Optional.ofNullable(expectedStudentApplication));

        boolean generatePdfSuccess = contractGenerationService.generateContract(contractDto, contractAdmin);

        assertThat(generatePdfSuccess).isTrue();
    }

    @Test
    public void getStudentApplicationWithWrongDtoTest() {
        boolean generatePdfSuccess = contractGenerationService.generateContract(contractDto, contractAdmin);

        assertThat(generatePdfSuccess).isFalse();
    }
}
