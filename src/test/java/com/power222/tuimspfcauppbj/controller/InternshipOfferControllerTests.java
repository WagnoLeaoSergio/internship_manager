package com.power222.tuimspfcauppbj.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.InternshipOffer.InternshipOfferDetails;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.service.InternshipOfferService;
import com.power222.tuimspfcauppbj.util.ReviewState;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SuppressWarnings("MagicNumber")
@ActiveProfiles({"noSecurityTests", "noBootstrappingTests"})
@Import(TestsWithoutSecurityConfig.class)
@WebMvcTest(InternshipOfferController.class)
public class InternshipOfferControllerTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    @MockBean
    private InternshipOfferService svc;

    private InternshipOffer expectedOffer;
    private InternshipOffer expectedOffer2;
    private Employer expectedEmployer;
    private Student expectedStudent;

    @BeforeEach
    void beforeEach() {

        expectedEmployer = Employer.builder()
                .email("employeur@gmail.com")
                .build();

        expectedStudent = Student.builder()
                .id(1L)
                .firstName("Simon")
                .lastName("Longpré")
                .studentId("1386195")
                .email("student@cal.qc.ca")
                .phoneNumber("5144816959")
                .address("6600 St-Jacques Ouest")
                .build();

        expectedOffer = InternshipOffer.builder()
                .id(1)
                .title("Titre")
                .details(InternshipOfferDetails.builder()
                        .creationDate(LocalDate.parse("2020-08-01"))
                        .limitDateToApply(LocalDate.parse("2020-08-31"))
                        .description("desc")
                        .salary(15.87)
                        .build())
                .reviewState(ReviewState.APPROVED)
                .file("alalalala")
                .employer(expectedEmployer)
                .allowedStudents(Collections.singletonList(expectedStudent))
                .applications(Collections.emptyList())
                .build();

        expectedOffer2 = InternshipOffer.builder()
                .id(1)
                .title("Titre")
                .details(InternshipOfferDetails.builder()
                        .creationDate(LocalDate.parse("2020-08-01"))
                        .limitDateToApply(LocalDate.parse("2020-08-31"))
                        .description("desc")
                        .salary(15.87)
                        .build())
                .reviewState(ReviewState.APPROVED)
                .file("alalalala")
                .employer(expectedEmployer)
                .allowedStudents(Collections.singletonList(expectedStudent))
                .applications(Collections.emptyList())
                .build();
    }

    @Test
    void getAllOffers() throws Exception {
        when(svc.getAllInternshipOffers()).thenReturn(Arrays.asList(expectedOffer, expectedOffer2));

        mvc.perform(get("/api/offers"))
                .andExpect(status().isOk());
    }

    @Test
    void getAllOffersByStudentID() throws Exception {
        when(svc.getOfferByAllowedStudentId(expectedStudent.getId())).thenReturn(Arrays.asList(expectedOffer, expectedOffer2));

        mvc.perform(get("/api/offers/student/" + expectedStudent.getId()))
                .andExpect(status().isOk());
    }

    @Test
    void getAllOffersWithPendingApproval() throws Exception {
        when(svc.getInternshipOffersWithPendingApproval()).thenReturn(Arrays.asList(expectedOffer, expectedOffer2));

        mvc.perform(get("/api/offers/pending"))
                .andExpect(status().isOk());
    }

    @Test
    void getAllOffersApproved() throws Exception {
        when(svc.getApprovedInternshipOffers()).thenReturn(Arrays.asList(expectedOffer, expectedOffer2));

        mvc.perform(get("/api/offers/approved"))
                .andExpect(status().isOk());
    }

    @Test
    void getOffeById() throws Exception {
        when(svc.getInternshipOfferById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));

        mvc.perform(get("/api/offers/" + expectedOffer.getId()))
                .andExpect(status().isOk());
    }

    @Test
    void getOffeByInvalidId() throws Exception {
        when(svc.getInternshipOfferById(expectedOffer.getId())).thenReturn(Optional.empty());

        mvc.perform(get("/api/offers/" + expectedOffer.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void getOfferByEmployerId() throws Exception {
        when(svc.getInternshipOffersOfEmployer(expectedEmployer.getEmail())).thenReturn(Arrays.asList(expectedOffer, expectedOffer2));

        mvc.perform(get("/api/offers/employer/" + expectedEmployer.getEmail()))
                .andExpect(status().isOk());
    }

    @Test
    void createOffer() throws Exception {
        when(svc.createInternshipOffer(expectedOffer)).thenReturn(Optional.of(expectedOffer));

        mvc.perform(post("/api/offers").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(expectedOffer)))
                .andExpect(status().isCreated());
    }

    @Test
    void createInvalidOffer() throws Exception {
        when(svc.createInternshipOffer(expectedOffer)).thenReturn(Optional.empty());

        mvc.perform(post("/api/offers").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(expectedOffer)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateOffer() throws Exception {
        when(svc.updateInternshipOffer(expectedOffer.getId(), expectedOffer)).thenReturn(Optional.of(expectedOffer));

        mvc.perform(put("/api/offers/" + expectedOffer.getId())
                .contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(expectedOffer)))
                .andExpect(status().isOk());
    }

    @Test
    void updateInvalidStateOffer() throws Exception {
        when(svc.updateInternshipOffer(expectedOffer.getId(), expectedOffer)).thenReturn(Optional.empty());

        mvc.perform(put("/api/offers/" + expectedOffer.getId()).contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(expectedOffer)))
                .andExpect(status().isConflict());
    }

    @Test
    void addStudentToOffer() throws Exception {
        when(svc.switchOfferVisibilityForStudent(expectedOffer.getId(), expectedStudent.getId())).thenReturn(Optional.of(expectedOffer));

        mvc.perform(put("/api/offers/" + expectedOffer.getId() + "/addRemoveStudent/" + expectedStudent.getId()).
                contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk());
    }

    @Test
    void addStudentToOfferWithError() throws Exception {
        when(svc.switchOfferVisibilityForStudent(expectedOffer.getId(), expectedStudent.getId())).thenReturn(Optional.empty());

        mvc.perform(put("/api/offers/" + expectedOffer.getId() + "/addRemoveStudent/" + expectedStudent.getId()).
                contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteOfferTest() throws Exception {
        mvc.perform(delete("/api/offers/" + expectedOffer.getId()))
                .andExpect(status().isOk());

        verify(svc, times(1)).deleteOfferById(expectedOffer.getId());
    }
}
