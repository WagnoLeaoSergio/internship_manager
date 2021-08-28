package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepo, UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.studentRepo = studentRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Student> getAllStudents() {
        return studentRepo.findAllBySemesters(SemesterContext.getCurrent());
    }

    public Optional<Student> getStudentById(long id) {
        return studentRepo.findById(id);
    }

    public Optional<Student> persistNewStudent(Student student) {
        if (userRepo.existsByEmail(student.getEmail()))
            return Optional.empty();

        student.setPassword(passwordEncoder.encode(student.getPassword()));
        student.setResumes(Collections.emptyList());
        student.setApplications(Collections.emptyList());
        return Optional.of(studentRepo.saveAndFlush(student));
    }

    public Student updateStudent(long id, Student student) {
        return studentRepo.findById(id)
                .map(oldStudent -> {
                    student.setId(oldStudent.getId());
                    return studentRepo.saveAndFlush(student);
                })
                .orElse(student);
    }

    @Transactional
    public void deleteStudentById(long id) {
        studentRepo.deleteById(id);
    }
}
