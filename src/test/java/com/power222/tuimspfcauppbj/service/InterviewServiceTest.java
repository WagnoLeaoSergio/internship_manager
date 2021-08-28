package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.InterviewRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.Interview;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {

    @Mock
    private InterviewRepository interviewRepo;

    @Mock
    private AuthenticationService authSvc;

    @InjectMocks
    private InterviewService interviewSvc;

    private Interview expectedInterview;
    private Employer expectedEmployer;

    @BeforeEach
    void setUp() {
        expectedEmployer = Employer.builder()
                .id(1L)
                .build();

        StudentApplication expectedStudentApplication = StudentApplication.builder()
                .id(1L)
                .build();

        expectedInterview = Interview.builder()
                .id(1L)
                .studentApplication(expectedStudentApplication)
                .build();
    }

    @Test
    void getAllInterviewsTest() {
        var i1 = Interview.builder().id(1L).build();
        var i2 = Interview.builder().id(2L).build();
        var i3 = Interview.builder().id(3L).build();

        when(interviewRepo.findAll()).thenReturn(Arrays.asList(i1, i2, i3));

        var actual = interviewSvc.getAllInterviews();

        assertThat(actual).hasSize(3);
    }

    @Test
    void getAllInterviewsByEmployerIdTest() {
        var i1 = Interview.builder().id(1L).build();
        var i2 = Interview.builder().id(2L).build();
        var i3 = Interview.builder().id(3L).build();

        when(interviewRepo.findAllByStudentApplication_Offer_Employer_Id(1L)).thenReturn(Arrays.asList(i1, i2, i3));

        var actual = interviewSvc.getAllInterviewsByEmployerId(1L);

        assertThat(actual).hasSize(3);
    }

    @Test
    void getAllInterviewsByEmployerIdWithNonexistentIdTest() {
        var actual = interviewSvc.getAllInterviewsByEmployerId(1L);

        assertThat(actual).hasSize(0);
    }

    @Test
    void getAllInterviewsByStudentIdTest() {
        var i1 = Interview.builder().id(1L).build();
        var i2 = Interview.builder().id(2L).build();
        var i3 = Interview.builder().id(3L).build();

        when(interviewRepo.findAllByStudentApplication_Student_Id(1L)).thenReturn(Arrays.asList(i1, i2, i3));

        var actual = interviewSvc.getAllInterviewsByStudentId(1L);

        assertThat(actual).hasSize(3);
    }

    @Test
    void getAllInterviewsByStudentIdWithNonexistentIdTest() {
        var actual = interviewSvc.getAllInterviewsByStudentId(1L);

        assertThat(actual).hasSize(0);
    }

    @Test
    void getInterviewByIdTest() {
        when(interviewRepo.findById(1L)).thenReturn(Optional.of(expectedInterview));

        var actual = interviewSvc.getInterviewById(1L);

        assertThat(actual).contains(expectedInterview);
    }

    @Test
    void getInterviewByIdWithNonexistentIdTest() {
        var actual = interviewSvc.getInterviewById(1L);

        assertThat(actual).isEmpty();
    }

    @Test
    void persistNewInterviewTestAsEmployer() {
        when(authSvc.getCurrentUser()).thenReturn(expectedEmployer);
        when(interviewRepo.saveAndFlush(expectedInterview)).thenReturn(expectedInterview);

        var actual = interviewSvc.persistNewInterview(expectedInterview);

        assertThat(actual).contains(expectedInterview);
    }

    @Test
    void persistNewInterviewTestAsNotEmployer() {
        var student = Student.builder().id(1L).build();

        when(authSvc.getCurrentUser()).thenReturn(student);

        var actual = interviewSvc.persistNewInterview(expectedInterview);

        assertThat(actual).isEmpty();
    }

    @Test
    void updateInterviewTest() {
        var initialId = expectedInterview.getId();
        var alteredId = 123L;
        var alteredInterview = expectedInterview.toBuilder().id(alteredId).build();
        when(interviewRepo.findById(initialId)).thenReturn(Optional.of(expectedInterview));
        when(interviewRepo.saveAndFlush(alteredInterview)).thenReturn(expectedInterview);

        var actual = interviewSvc.updateInterview(initialId, alteredInterview);

        assertThat(actual).contains(expectedInterview);
    }

    @Test
    void updateInterviewWithNonexistentIdTest() {
        var actual = interviewSvc.updateInterview(expectedInterview.getId(), expectedInterview);

        assertThat(actual).isEmpty();
    }

    @Test
    void deleteInterviewByIdTest() {
        var idToDelete = expectedInterview.getId();

        interviewSvc.deleteInterviewById(idToDelete);

        verify(interviewRepo, times(1)).deleteById(idToDelete);
    }
}
