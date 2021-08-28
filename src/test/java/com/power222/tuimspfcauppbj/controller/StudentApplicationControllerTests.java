package com.power222.tuimspfcauppbj.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.Resume;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.service.StudentApplicationService;
import com.power222.tuimspfcauppbj.util.StudentApplicationState;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@ActiveProfiles({"noSecurityTests", "noBootstrappingTests"})
@Import({TestsWithoutSecurityConfig.class})
@WebMvcTest(StudentApplicationController.class)
class StudentApplicationControllerTests {

    @Autowired
    MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StudentApplicationService svc;

    private StudentApplication expected;

    @BeforeEach
    void beforeEach() {
        expected = StudentApplication.builder()
                .id(1L)
                .offer(new InternshipOffer())
                .student(new Student())
                .resume(new Resume())
                .reasonForRejection("")
                .build();
    }

    @Test
    void getApplicationFound() throws Exception {
        when(svc.getApplicationById(anyLong())).thenReturn(Optional.of(new StudentApplication()));

        var actual = mvc.perform(get("/api/applications/5")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
    }

    @Test
    void getApplicationNotFound() throws Exception {
        when(svc.getApplicationById(anyInt())).thenReturn(Optional.empty());

        var actual = mvc.perform(get("/api/applications/5")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
    }

    @Test
    void createAppliSuccesTest() throws Exception {
        when(svc.createAndSaveNewApplication(anyLong(), anyLong())).thenReturn(Optional.of(expected));

        MvcResult result = mvc.perform(post("/api/applications/1/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.CREATED.value());
    }

    @Test
    void createAppliErrorTest() throws Exception {
        when(svc.createAndSaveNewApplication(anyLong(), anyLong())).thenReturn(Optional.empty());

        MvcResult result = mvc.perform(post("/api/applications/1/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.BAD_REQUEST.value());
    }

    @Test
    void updateAppliState() throws Exception {
        var modifiedApplication = expected.toBuilder().state(StudentApplicationState.JOB_OFFER_ACCEPTED_BY_STUDENT).build();

        when(svc.updateStudentApplicationState(expected.getId(), modifiedApplication)).thenReturn(Optional.of(modifiedApplication));

        MvcResult result = mvc.perform(put("/api/applications/state/" + expected.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(modifiedApplication))).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        verify(svc, times(1)).updateStudentApplicationState(expected.getId(), modifiedApplication);
    }

    @Test
    void updateAppliStateBadId() throws Exception {
        var id = 100L;
        when(svc.updateStudentApplicationState(id, expected)).thenReturn(Optional.empty());

        MvcResult result = mvc.perform(put("/api/applications/state/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expected))).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.NOT_FOUND.value());
    }

    @Test
    void updateAppliTest() throws Exception {
        MvcResult result = mvc.perform(put("/api/applications/" + expected.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expected))).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        verify(svc, times(1)).updateStudentApplication(expected.getId(), expected);
    }

    @Test
    void getAllStudentApplicationsTest() throws Exception {
        final int nbStudent = 3;

        List<StudentApplication> studentList = new ArrayList<>();
        for (int i = 0; i < nbStudent; i++)
            studentList.add(new StudentApplication());

        when(svc.getAllApplication()).thenReturn(studentList);

        MvcResult result = mvc.perform(get("/api/applications")).andReturn();
        var actuals = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(actuals.size(), nbStudent);
    }
}
