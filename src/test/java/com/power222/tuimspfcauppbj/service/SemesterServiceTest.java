package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Admin;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.LinkedList;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SemesterServiceTest {

    @Mock
    UserRepository userRepo;

    @Mock
    AuthenticationService authSvc;

    @InjectMocks
    SemesterService semesterSvc;

    @Test
    void unaffectedUserTest() {
        var u = new Admin();
        semesterSvc.registerUserInSemester(u);

        verify(userRepo, times(0)).saveAndFlush(any());
    }

    @Test
    void userUpdateTest() {
        User u = Student.builder()
                .semesters(new LinkedList<>(Collections.singletonList("a2019h2020")))
                .build();

        semesterSvc.registerUserInSemester(u);

        verify(userRepo, times(1)).saveAndFlush(any());
    }

    @Test
    void userNoUpdateTest() {
        User u = Student.builder()
                .semesters(new LinkedList<>(Collections.singletonList(SemesterContext.getPresentSemester())))
                .build();

        semesterSvc.registerUserInSemester(u);

        verify(userRepo, times(0)).saveAndFlush(any());
    }
}
