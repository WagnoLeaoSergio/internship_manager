package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTests {

    @Mock
    private StudentRepository studentRepo;

    @Mock
    private UserRepository userRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private StudentService svc;

    private Student expectedStudent;

    @BeforeEach
    void beforeEach() {
        expectedStudent = Student.builder()
                .id(1L)
                .password("password")
                .firstName("Simon")
                .lastName("Longpré")
                .studentId("1386195")
                .email("student@cal.qc.ca")
                .phoneNumber("5144816959")
                .address("6600 St-Jacques Ouest")
                .applications(Collections.emptyList())
                .resumes(Collections.emptyList())
                .build();
    }

    @Test
    void getAllStudentsTest() {
        SemesterContext.setCurrent(SemesterContext.getPresentSemester());
        var s1 = Student.builder().id(1L).build();
        var s2 = Student.builder().id(2L).build();
        var s3 = Student.builder().id(3L).build();
        when(studentRepo.findAllBySemesters(SemesterContext.getPresentSemester())).thenReturn(Arrays.asList(s1, s2, s3));

        var actual = svc.getAllStudents();

        assertThat(actual).hasSize(3);
    }

    @Test
    void getNoStudentsTest() {
        SemesterContext.setCurrent(SemesterContext.getPresentSemester());
        when(studentRepo.findAllBySemesters(SemesterContext.getPresentSemester())).thenReturn(Collections.emptyList());

        var actual = svc.getAllStudents();

        assertThat(actual).hasSize(0);
    }

    @Test
    void getStudentById() {
        when(studentRepo.findById(1L)).thenReturn(Optional.of(expectedStudent));

        var actual = svc.getStudentById(1L);

        assertThat(actual).contains(expectedStudent);
    }

    @Test
    void getStudentByInvalidId() {
        when(studentRepo.findById(1L)).thenReturn(Optional.empty());

        var actual = svc.getStudentById(1L);

        assertThat(actual).isEmpty();
    }

    @Test
    void createStudent() {
        expectedStudent.setPassword("encodedPassword");
        var dto = expectedStudent;
        dto.setPassword("password");
        when(studentRepo.saveAndFlush(expectedStudent)).thenReturn(expectedStudent);
        when(passwordEncoder.encode(dto.getPassword())).thenReturn("encodedPassword");

        var actual = svc.persistNewStudent(dto);

        assertThat(actual).contains(expectedStudent);
    }

    @Test
    void createStudentWithExistingUsername() {
        when(userRepo.existsByEmail(expectedStudent.getEmail())).thenReturn(true);

        var actual = svc.persistNewStudent(expectedStudent);

        assertThat(actual).isEmpty();
    }

    @Test
    void updateStudent() {
        var actual = svc.updateStudent(expectedStudent.getId(), expectedStudent);

        assertThat(actual).isEqualTo(expectedStudent);
    }

    @Test
    void updateStudentWithModifiedId() {
        var idToPersistTo = expectedStudent.getId();
        final var idToOverwrite = 5L;
        var modifiedStudent = expectedStudent;
        modifiedStudent.setId(idToOverwrite);
        when(studentRepo.findById(idToPersistTo)).thenReturn(Optional.of(expectedStudent));
        when(studentRepo.saveAndFlush(expectedStudent)).thenReturn(expectedStudent);

        var actual = svc.updateStudent(idToPersistTo, modifiedStudent);

        assertThat(actual).isEqualTo(expectedStudent);
    }

    @Test
    void deleteStudent() {
        var idToDelete = expectedStudent.getId();

        svc.deleteStudentById(idToDelete);

        verify(studentRepo, times(1)).deleteById(idToDelete);
    }
}
