package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.dao.SemesterRepository;
import com.power222.tuimspfcauppbj.util.SemesterContext;
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

import java.util.Arrays;
import java.util.LinkedList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@ActiveProfiles({"noSecurityTests", "noBootstrappingTests"})
@Import({TestsWithoutSecurityConfig.class})
@WebMvcTest(SemesterController.class)
public class SemesterControllerTests {

    public static final String EXPECTED = "[\"a2018h2019\",\"a2019h2020\",\"" + SemesterContext.getPresentSemester() + "\"]";
    @Autowired
    MockMvc mvc;

    @MockBean
    SemesterRepository repo;

    @Test
    void getAllSemstersTest() throws Exception {
        when(repo.findAll()).thenReturn(Arrays.asList("a2018h2019", "a2019h2020", SemesterContext.getPresentSemester()));

        MvcResult result = mvc.perform(get("/api/semesters").contentType(MediaType.APPLICATION_JSON)).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(EXPECTED, result.getResponse().getContentAsString());
    }

    @Test
    void getAllSemstersInjectCurrentTest() throws Exception {
        when(repo.findAll()).thenReturn(new LinkedList<>(Arrays.asList("a2018h2019", "a2019h2020")));

        MvcResult result = mvc.perform(get("/api/semesters").contentType(MediaType.APPLICATION_JSON)).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(EXPECTED, result.getResponse().getContentAsString());
    }

    @Test
    void getPresentSemstersTest() throws Exception {
        MvcResult result = mvc.perform(
                get("/api/semesters/present").contentType(MediaType.APPLICATION_JSON)
        ).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(SemesterContext.getPresentSemester(), result.getResponse().getContentAsString());
    }
}
