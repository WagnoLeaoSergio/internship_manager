package com.power222.tuimspfcauppbj.config;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Admin;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.InternshipOffer.InternshipOfferDetails;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.util.ReviewState;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Collections;

@SuppressWarnings({"MagicNumber"})
@Profile("!noBootstrappingTests")
@Component
public class CliTestRunner implements CommandLineRunner {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final InternshipOfferRepository internshipRepo;

    public CliTestRunner(UserRepository userRepo, PasswordEncoder passwordEncoder, InternshipOfferRepository internshipRepo) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.internshipRepo = internshipRepo;
    }

    @Override
    @Transactional
    public void run(String... args) throws IOException {
        userRepo.saveAndFlush(Admin.builder()
                .name("Test admin")
                .email("admin@cal.qc.ca")
                .password(passwordEncoder.encode("password"))
                .build());


        var employer = userRepo.save(Employer.builder()
                .password(passwordEncoder.encode("password"))
                .companyName("Dacima")
                .contactName("Zack")
                .phoneNumber("5144317713")
                .address("1300 rue ducas")
                .email("employeur@gmail.com")
                .build());

        var student = userRepo.save(Student.builder()
                .password(passwordEncoder.encode("password"))
                .firstName("Bob")
                .lastName("Brutus")
                .studentId("1234567")
                .email("etudiant@gmail.com")
                .phoneNumber("911")
                .address("9310 Lasalle")
                .build());

        internshipRepo.save(InternshipOffer.builder()
                .semester("a2020h2021")
                .title("Offre de stage bootstrappée")
                .details(InternshipOfferDetails.builder()
                        .description("Description bootstrappée - Développement d'applications Web trois tiers.")
                        .salary(15.98)
                        .creationDate(LocalDate.now())
                        .limitDateToApply(LocalDate.now().plusWeeks(1))
                        .internshipStartDate(LocalDate.now().plusWeeks(2))
                        .internshipEndDate(LocalDate.now().plusWeeks(9))
                        .nbStudentToHire(25)
                        .build())
                .reviewState(ReviewState.APPROVED)
                .employer(employer)
                .allowedStudents(Collections.singletonList(student))
                .file(("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("bootstrapFiles/4.pdf")).readAllBytes()))))
                .build());

        internshipRepo.save(InternshipOffer.builder()
                .semester("a2021h2022")
                .title("Offre de stage bootstrappée 2022")
                .details(InternshipOfferDetails.builder()
                        .description("Description bootstrappée - Développement d'applications Web trois tiers.")
                        .salary(15.98)
                        .creationDate(LocalDate.now())
                        .limitDateToApply(LocalDate.now().plusWeeks(1))
                        .internshipStartDate(LocalDate.now().plusWeeks(2))
                        .internshipEndDate(LocalDate.now().plusWeeks(9))
                        .nbStudentToHire(25)
                        .build())
                .reviewState(ReviewState.APPROVED)
                .employer(employer)
                .allowedStudents(Collections.singletonList(student))
                .file(("data:application/pdf;base64," + new String(Base64.encodeBase64(new FileInputStream(new File("bootstrapFiles/5.pdf")).readAllBytes()))))
                .build());

        userRepo.flush();
        internshipRepo.flush();
    }
}
