package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.InternshipOffer.InternshipOfferDetails;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.util.ReviewState;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.when;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SuppressWarnings("MagicNumber")
@ExtendWith(MockitoExtension.class)
class InternshipOfferServiceTests {
    @Mock
    private InternshipOfferRepository offerRepository;

    @Mock
    private StudentRepository studentRepo;

    @Mock
    private AuthenticationService authenticationService;

    @Mock
    @SuppressWarnings("unused") //Required dependency of InternshipOfferService
    private NotificationService notificationService;

    @InjectMocks
    private InternshipOfferService service;

    private InternshipOffer expectedOffer;
    private InternshipOffer expectedOffer2;
    private Employer expectedEmployer;
    private Student expectedStudent;

    @BeforeEach
    void setUp() {
        Employer employer = Employer.builder().email("a@gmail.com").build();
        String pdfContent = "yvDquEQNiEAAAAABJRU5ErkJggg==";

        expectedOffer = InternshipOffer.builder()
                .id(1L)
                .title("Title")
                .allowedStudents(new ArrayList<>())
                .details(InternshipOfferDetails.builder()
                        .description("description")
                        .creationDate(LocalDate.parse("2020-08-08"))
                        .limitDateToApply(LocalDate.parse("2020-08-31"))
                        .internshipStartDate(LocalDate.parse("2020-11-01"))
                        .internshipEndDate(LocalDate.parse("2021-04-01"))
                        .startTime(LocalTime.of(8, 30))
                        .endTime(LocalTime.of(16, 0))
                        .salary(20)
                        .build())
                .employer(employer)
                .file(pdfContent)
                .reviewState(ReviewState.PENDING)
                .build();

        expectedOffer2 = InternshipOffer.builder()
                .id(1L)
                .title("Title")
                .allowedStudents(new ArrayList<>())
                .details(InternshipOfferDetails.builder()
                        .description("description")
                        .creationDate(LocalDate.parse("2020-08-08"))
                        .limitDateToApply(LocalDate.parse("2020-08-31"))
                        .internshipStartDate(LocalDate.parse("2020-11-01"))
                        .internshipEndDate(LocalDate.parse("2021-05-01"))
                        .startTime(LocalTime.of(8, 30))
                        .endTime(LocalTime.of(16, 0))
                        .salary(20)
                        .build())
                .employer(employer)
                .file(pdfContent)
                .reviewState(ReviewState.PENDING)
                .build();

        expectedEmployer = Employer.builder()
                .email("employeur@gmail.com")
                .offers(new ArrayList<>())
                .build();

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
    }

    @Test
    void successfulInternshipOfferUpload() {
        when(authenticationService.getCurrentUser()).thenReturn(expectedEmployer);
        when(offerRepository.saveAndFlush(expectedOffer)).thenReturn(expectedOffer);
        expectedOffer.setEmployer(null);
        Optional<InternshipOffer> createdOffer = service.createInternshipOffer(expectedOffer);
        assertThat(createdOffer).contains(expectedOffer);
    }

    @Test
    void tryToUploadOfferForNonexistentUser() {
        when(authenticationService.getCurrentUser()).thenReturn(null);

        Optional<InternshipOffer> createdOffer = service.createInternshipOffer(expectedOffer);

        assertThat(createdOffer).isEmpty();
    }

    @Test
    void getAllInternshipOffersReturnsListOffer() {
        when(offerRepository.findAll()).thenReturn(Arrays.asList(expectedOffer, expectedOffer2));

        List<InternshipOffer> createdOffers = service.getAllInternshipOffers();

        assertThat(createdOffers.size()).isEqualTo(2);
        assertThat(createdOffers).contains(expectedOffer, expectedOffer2);
    }

    @Test
    void getAllInternshipOffersByStudentID() {
        when(offerRepository.findAllByAllowedStudentsId(expectedStudent.getId()))
                .thenReturn(Arrays.asList(expectedOffer, expectedOffer2));

        List<InternshipOffer> createdOffers = service.getOfferByAllowedStudentId(expectedStudent.getId());

        assertThat(createdOffers.size()).isEqualTo(2);
        assertThat(createdOffers).contains(expectedOffer, expectedOffer2);
    }

    @Test
    void getAllInternshipOffersWithPendingApproval() {
        when(offerRepository.findAllByReviewStatePending()).thenReturn(Arrays.asList(expectedOffer, expectedOffer2));

        List<InternshipOffer> createdOffers = service.getInternshipOffersWithPendingApproval();

        assertThat(createdOffers.size()).isEqualTo(2);
        assertThat(createdOffers).contains(expectedOffer, expectedOffer2);
    }

    @Test
    void getAllApprovedInternshipOffers() {
        when(offerRepository.findAllByReviewStateApproved()).thenReturn(Arrays.asList(expectedOffer, expectedOffer2));

        List<InternshipOffer> createdOffers = service.getApprovedInternshipOffers();

        assertThat(createdOffers.size()).isEqualTo(2);
        assertThat(createdOffers).contains(expectedOffer, expectedOffer2);
    }

    @Test
    void OfferFoundById() {
        when(offerRepository.findById(1L)).thenReturn(Optional.of(expectedOffer));
        var actual = service.getInternshipOfferById(1L);
        assertThat(actual).contains(expectedOffer);
    }

    @Test
    void OfferNotFoundById() {
        when(offerRepository.findById(5L)).thenReturn(Optional.empty());
        var actual = service.getInternshipOfferById(5L);
        assertThat(actual).isEmpty();

    }

    @Test
    void deleteResumeById() {
        var idToDelete = expectedOffer.getId();

        service.deleteOfferById(idToDelete);

        verify(offerRepository, times(1)).deleteById(idToDelete);
    }

    @Test
    void getInternshipOffersOfEmployer() {
        when(offerRepository.findByEmployerEmail(expectedEmployer.getEmail()))
                .thenReturn(Collections.singletonList(expectedOffer));

        List<InternshipOffer> actual = service.getInternshipOffersOfEmployer(expectedEmployer.getEmail());

        assertThat(actual).hasSize(1);
        assertThat(actual).contains(expectedOffer);
    }

    @Test
    void updateOffer() {
        var initialId = expectedOffer.getId();
        final var alteredId = 100L;
        var alteredResume = expectedOffer.toBuilder().id(alteredId).build();
        when(offerRepository.findById(initialId)).thenReturn(Optional.ofNullable(expectedOffer));
        when(offerRepository.saveAndFlush(expectedOffer)).thenReturn(expectedOffer);

        var actual = service.updateInternshipOffer(initialId, alteredResume);

        assertThat(actual).isNotEmpty();
        assertThat(actual).contains(expectedOffer);
        assertThat(actual.get().getSemester()).isEqualTo(expectedOffer.getSemester());
    }

    @Test
    void addStudentToOffer() {
        expectedOffer2 = expectedOffer.toBuilder().build();
        expectedOffer2.setAllowedStudents(Collections.singletonList(expectedStudent));
        when(offerRepository.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));
        when(studentRepo.findById(expectedStudent.getId())).thenReturn(Optional.of(expectedStudent));
        when(offerRepository.saveAndFlush(expectedOffer2)).thenReturn(expectedOffer2);

        var actual = service.switchOfferVisibilityForStudent(expectedOffer.getId(), expectedStudent.getId());

        assertThat(actual).contains(expectedOffer2);
    }

    @Test
    void deleteStudentFromOffer() {
        expectedOffer.getAllowedStudents().add(expectedStudent);
        expectedOffer2 = expectedOffer.toBuilder().build();
        expectedOffer2.setAllowedStudents(Collections.emptyList());
        when(offerRepository.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));
        when(studentRepo.findById(expectedStudent.getId())).thenReturn(Optional.of(expectedStudent));
        when(offerRepository.saveAndFlush(expectedOffer2)).thenReturn(expectedOffer2);

        var actual = service.switchOfferVisibilityForStudent(expectedOffer.getId(), expectedStudent.getId());

        assertThat(actual).contains(expectedOffer2);
    }

    @Test
    void addInvalidStudentToOffer() {
        when(offerRepository.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));
        when(studentRepo.findById(expectedStudent.getId())).thenReturn(Optional.empty());

        var actual = service.switchOfferVisibilityForStudent(expectedOffer.getId(), expectedStudent.getId());

        assertThat(actual).isEmpty();
    }

    @Test
    void addStudentToInvalidOffer() {
        when(offerRepository.findById(expectedOffer.getId())).thenReturn(Optional.empty());

        var actual = service.switchOfferVisibilityForStudent(expectedOffer.getId(), expectedStudent.getId());

        assertThat(actual).isEmpty();
    }

    @Test
    void updateOfferWithNonexistentId() {
        var actual = service.updateInternshipOffer(expectedOffer.getId(), expectedOffer);

        assertThat(actual).isEmpty();
    }

    @Test
    void updateOfferWithInvalidStateNullMessage() {
        var updatedOffer = expectedOffer.toBuilder().reviewState(ReviewState.DENIED).build();
        when(offerRepository.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));

        var actual = service.updateInternshipOffer(expectedOffer.getId(), updatedOffer);

        assertThat(actual).isEmpty();
    }

    @Test
    void updateOfferWithInvalidStateBlankMessage() {
        var updatedOffer = expectedOffer.toBuilder()
                .reviewState(ReviewState.DENIED)
                .reasonForRejection(" ")
                .build();
        when(offerRepository.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));

        var actual = service.updateInternshipOffer(expectedOffer.getId(), updatedOffer);

        assertThat(actual).isEmpty();
    }
}
