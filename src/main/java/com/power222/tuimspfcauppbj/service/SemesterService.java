package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.util.SemesterAware;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SemesterService {

    private final UserRepository userRepo;

    public SemesterService(UserRepository userRepo, AuthenticationService authSvc) {
        this.userRepo = userRepo;
        authSvc.registerEventListeners(this::registerUserInSemester);
    }

    public void registerUserInSemester(User user) {
        if (user instanceof SemesterAware) {
            SemesterAware semesterUser = (SemesterAware) user;
            if (!semesterUser.getSemesters().contains(SemesterContext.getPresentSemester())) {
                semesterUser.getSemesters().add(SemesterContext.getPresentSemester());
                userRepo.saveAndFlush(user);
            }
        }
    }
}
