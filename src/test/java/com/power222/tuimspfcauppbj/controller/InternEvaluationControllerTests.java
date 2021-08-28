package com.power222.tuimspfcauppbj.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.model.InternEvaluation;
import com.power222.tuimspfcauppbj.service.InternEvaluationService;
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
@WebMvcTest(InternEvaluationController.class)
public class InternEvaluationControllerTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private InternEvaluationService svc;

    private InternEvaluation expectedInternEvaluation;

    @BeforeEach
    void beforeEach() {
        expectedInternEvaluation = InternEvaluation.builder()
                .id(1L)
                .build();
    }

    @Test
    void createInternEvaluationTest() throws Exception {
        when(svc.createAndSaveNewInternEvaluation(expectedInternEvaluation)).thenReturn(expectedInternEvaluation);

        MvcResult result = mvc.perform(post("/api/internEvaluation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expectedInternEvaluation))).andReturn();

        var actual = objectMapper.readValue(result.getResponse().getContentAsString(), InternEvaluation.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(expectedInternEvaluation, actual);
    }

    @Test
    void createInternEvaluationEmptyTest() throws Exception {
        when(svc.createAndSaveNewInternEvaluation(expectedInternEvaluation)).thenReturn(null);

        MvcResult result = mvc.perform(post("/api/internEvaluation")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
    }

    @Test
    void getAllInterEvaluationTest() throws Exception {
        final int nbInternEvaluation = 3;

        List<InternEvaluation> list = new ArrayList<>();
        for (int i = 0; i < nbInternEvaluation; i++)
            list.add(new InternEvaluation());

        when(svc.getAllInternEvaluation()).thenReturn(list);

        MvcResult result = mvc.perform(get("/api/internEvaluation")).andReturn();

        var actuals = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(actuals.size(), nbInternEvaluation);
    }

    @Test
    void getInternEvaluationFound() throws Exception {
        var id = 1L;
        when(svc.getInternEvaluationById(1L)).thenReturn(Optional.of(expectedInternEvaluation));

        var actual = mvc.perform(get("/api/internEvaluation/" + id)).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
    }

    @Test
    void getInternEvaluationNotFound() throws Exception {
        var id = 1L;
        when(svc.getInternEvaluationById(1L)).thenReturn(Optional.empty());

        var actual = mvc.perform(get("/api/internEvaluation/" + id)).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
    }

    @Test
    void deleteInterEvaluationTest() throws Exception {
        MvcResult result = mvc.perform(delete("/api/internEvaluation/1")).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        verify(svc, times(1)).deleteInternEvaluationById(1);
    }
}
