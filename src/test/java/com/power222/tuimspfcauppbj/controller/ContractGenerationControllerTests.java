package com.power222.tuimspfcauppbj.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.service.ContractGenerationService;
import com.power222.tuimspfcauppbj.util.ContractDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

@ActiveProfiles({"noSecurityTests", "noBootstrappingTests"})
@Import(TestsWithoutSecurityConfig.class)
@WebMvcTest(ContractGenerationController.class)
public class ContractGenerationControllerTests {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ContractGenerationService svc;

    private ContractDTO nullDto;

    @Test
    void createContract() throws Exception {
        when(svc.generateContract(any())).thenReturn(true);

        var actual = mvc.perform(post("/api/contractGeneration").contentType(MediaType.APPLICATION_JSON).content("{}")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.CREATED.value());
    }

    @Test
    void createContractFailed() throws Exception {
        when(svc.generateContract(any())).thenReturn(false);

        var actual = mvc.perform(post("/api/contractGeneration").contentType(MediaType.APPLICATION_JSON).content("{}")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    void updateContractSignatureSuccessfulTest() throws Exception {
        when(svc.signContract(any())).thenReturn(Optional.of(new Contract()));

        var actual = mvc.perform(put("/api/contractGeneration/sign").contentType(MediaType.APPLICATION_JSON).content("{}")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
    }

    @Test
    void updateContractSignatureFailedTest() throws Exception {
        when(svc.signContract(any())).thenReturn(Optional.empty());

        var actual = mvc.perform(put("/api/contractGeneration/sign").contentType(MediaType.APPLICATION_JSON).content("{}")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
    }

    @Test
    void tryCreateContractWithNullDto() throws Exception {
        when(svc.generateContract(nullDto)).thenReturn(false);

        var actual = mvc.perform(post("/api/contractGeneration")
                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(nullDto))).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    }

}
