package com.power222.tuimspfcauppbj.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.model.Interview;
import com.power222.tuimspfcauppbj.service.InterviewService;
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

import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@ActiveProfiles({"noSecurityTests", "noBootstrappingTests"})
@Import(TestsWithoutSecurityConfig.class)
@WebMvcTest(InterviewController.class)
class InterviewControllerTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private InterviewService svc;

    private Interview expectedInterview;

    @BeforeEach
    void setUp() {
        expectedInterview = Interview.builder()
                .id(1L)
                .dateTime(ZonedDateTime.now())
                .build();
    }

    @Test
    void getAllInterviews() throws Exception {
        var i1 = Interview.builder().id(1).build();
        var i2 = Interview.builder().id(2).build();
        var i3 = Interview.builder().id(3).build();

        when(svc.getAllInterviews()).thenReturn(Arrays.asList(i1, i2, i3));

        MvcResult result = mvc.perform(get("/api/interviews")).andReturn();

        var actuals = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(actuals.size(), 3);
    }

    @Test
    void getInterviewsByEmployerId() throws Exception {
        var i1 = Interview.builder().id(1L).build();
        var i2 = Interview.builder().id(2L).build();
        var i3 = Interview.builder().id(3L).build();

        when(svc.getAllInterviewsByEmployerId(1L)).thenReturn(Arrays.asList(i1, i2, i3));

        var result = mvc.perform(get("/api/interviews/employer/1")).andReturn();
        var actuals = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(actuals.size(), 3);
    }

    @Test
    void getInterviewsByEmployerIdWithBadId() throws Exception {
        var result = mvc.perform(get("/api/interviews/employer/1")).andReturn();
        var actuals = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(actuals.size(), 0);
    }

    @Test
    void getInterviewsByStudentId() throws Exception {
        var i1 = Interview.builder().id(1L).build();
        var i2 = Interview.builder().id(2L).build();
        var i3 = Interview.builder().id(3L).build();

        when(svc.getAllInterviewsByStudentId(1L)).thenReturn(Arrays.asList(i1, i2, i3));

        var result = mvc.perform(get("/api/interviews/student/1")).andReturn();
        var actuals = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(actuals.size(), 3);
    }

    @Test
    void getInterviewsByStudentIdWithBadId() throws Exception {
        var result = mvc.perform(get("/api/interviews/student/1")).andReturn();
        var actuals = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(actuals.size(), 0);
    }

    @Test
    void getInterviewFound() throws Exception {
        when(svc.getInterviewById(anyLong())).thenReturn(Optional.of(new Interview()));

        var actual = mvc.perform(get("/api/interviews/5")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
    }

    @Test
    void getInterviewNotFound() throws Exception {
        when(svc.getInterviewById(anyInt())).thenReturn(Optional.empty());

        var actual = mvc.perform(get("/api/interviews/5")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
    }

    @Test
    void createInterview() throws Exception {
        when(svc.persistNewInterview(any())).thenReturn(Optional.of(new Interview()));

        var actual = mvc.perform(post("/api/interviews").contentType(MediaType.APPLICATION_JSON).content("{}")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.CREATED.value());
    }

    @Test
    void updateInterviewTest() throws Exception {
        expectedInterview.setDateTime(null);
        when(svc.updateInterview(expectedInterview.getId(), expectedInterview)).thenReturn(Optional.of(expectedInterview));

        MvcResult result = mvc.perform(put("/api/interviews/" + expectedInterview.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expectedInterview)))
                .andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        verify(svc, times(1)).updateInterview(expectedInterview.getId(), expectedInterview);
    }

    @Test
    void errorOnUpdateTest() throws Exception {
        expectedInterview.setDateTime(null);
        when(svc.updateInterview(expectedInterview.getId(), expectedInterview)).thenReturn(Optional.empty());

        MvcResult result = mvc.perform(put("/api/interviews/" + expectedInterview.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expectedInterview)))
                .andReturn();

        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
        verify(svc, times(1)).updateInterview(expectedInterview.getId(), expectedInterview);
    }

    @Test
    void deleteInterviewTest() throws Exception {
        MvcResult result = mvc.perform(delete("/api/interviews/1")).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        verify(svc, times(1)).deleteInterviewById(1);
    }
}
