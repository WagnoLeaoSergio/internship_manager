package com.power222.tuimspfcauppbj.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.service.StudentService;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@ActiveProfiles({"noSecurityTests", "noBootstrappingTests"})
@Import({TestsWithoutSecurityConfig.class})
@WebMvcTest(StudentController.class)
public class StudentControllerTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StudentService studentService;

    private Student expected;

    @BeforeEach
    void beforeEach() {
        expected = Student.builder()
                .firstName("Bob")
                .lastName("Brutus")
                .id(4L)
                .studentId("1234")
                .email("etudiant@gmail.ca")
                .phoneNumber("911")
                .address("9310 Lasalle")
                .build();
    }

    @Test
    void getStudentByIdTest() throws Exception {
        when(studentService.getStudentById(4L)).thenReturn(Optional.of(expected));

        MvcResult result = mvc.perform(get("/api/students/4").contentType(MediaType.APPLICATION_JSON)).andReturn();

        Student actual = objectMapper.readValue(result.getResponse().getContentAsString(), Student.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(expected, actual);
    }

    @Test
    void getAllStudents() throws Exception {
        final int nbStudent = 3;

        List<Student> studentList = new ArrayList<>();
        for (int i = 0; i < nbStudent; i++)
            studentList.add(new Student());

        when(studentService.getAllStudents()).thenReturn(studentList);

        MvcResult result = mvc.perform(get("/api/students")).andReturn();
        var actuals = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(actuals.size(), nbStudent);
    }

    @Test
    void createStudentTest() throws Exception {
        when(studentService.persistNewStudent(expected)).thenReturn(Optional.of(expected));

        MvcResult result = mvc.perform(post("/api/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expected))).andReturn();

        var actual = objectMapper.readValue(result.getResponse().getContentAsString(), Student.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.CREATED.value());
        assertEquals(expected, actual);
    }

    @Test
    void updateResumeTest() throws Exception {
        expected.setPassword(null);
        MvcResult result = mvc.perform(put("/api/students/" + expected.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expected))).andReturn();


        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        verify(studentService, times(1)).updateStudent(expected.getId(), expected);
    }

    @Test
    void deleteResumeTest() throws Exception {
        MvcResult result = mvc.perform(delete("/api/students/1")).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        verify(studentService, times(1)).deleteStudentById(1);
    }
}
