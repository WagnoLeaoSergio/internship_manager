package com.power222.tuimspfcauppbj.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.model.BusinessEvaluation;
import com.power222.tuimspfcauppbj.service.BusinessEvaluationService;
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
@WebMvcTest(BusinessEvaluationController.class)
public class BusinessEvaluationControllerTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BusinessEvaluationService svc;

    private BusinessEvaluation expectedBusinessEvaluation;

    @BeforeEach
    void beforeEach() {
        expectedBusinessEvaluation = BusinessEvaluation.builder()
                .id(1L)
                .build();
    }

    @Test
    void createBusinessEvaluationTest() throws Exception {
        when(svc.createAndSaveNewBusinessEvaluation(expectedBusinessEvaluation)).thenReturn(expectedBusinessEvaluation);

        MvcResult result = mvc.perform(post("/api/businessEvaluation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expectedBusinessEvaluation))).andReturn();

        var actual = objectMapper.readValue(result.getResponse().getContentAsString(), BusinessEvaluation.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(expectedBusinessEvaluation, actual);
    }

    @Test
    void createBusinessEvaluationEmptyTest() throws Exception {
        when(svc.createAndSaveNewBusinessEvaluation(expectedBusinessEvaluation)).thenReturn(null);

        MvcResult result = mvc.perform(post("/api/businessEvaluation")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
    }

    @Test
    void getAllBusinessEvaluationTest() throws Exception {
        final int nbInternEvaluation = 3;

        List<BusinessEvaluation> list = new ArrayList<>();
        for (int i = 0; i < nbInternEvaluation; i++)
            list.add(new BusinessEvaluation());

        when(svc.getAllBusinessEvaluation()).thenReturn(list);

        MvcResult result = mvc.perform(get("/api/businessEvaluation")).andReturn();

        var actuals = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(actuals.size(), nbInternEvaluation);
    }

    @Test
    void getBusinessEvaluationFound() throws Exception {
        var id = 1L;
        when(svc.getBusinessEvaluationById(1L)).thenReturn(Optional.of(expectedBusinessEvaluation));

        var actual = mvc.perform(get("/api/businessEvaluation/" + id)).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
    }

    @Test
    void getBusinessEvaluationNotFound() throws Exception {
        var id = 1L;
        when(svc.getBusinessEvaluationById(1L)).thenReturn(Optional.empty());

        var actual = mvc.perform(get("/api/businessEvaluation/" + id)).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
    }


    @Test
    void deleteBusinessEvaluationTest() throws Exception {
        MvcResult result = mvc.perform(delete("/api/businessEvaluation/1")).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        verify(svc, times(1)).deleteBusinessEvaluationById(1);
    }

}
