package com.power222.tuimspfcauppbj;

import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Admin;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.reactive.ReactiveSecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.reactive.ReactiveUserDetailsServiceAutoConfiguration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Hooks;

import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

@SpringBootApplication(exclude = {ReactiveSecurityAutoConfiguration.class, ReactiveUserDetailsServiceAutoConfiguration.class})
@Slf4j
public class TheUltimateInternshipManagerSoftwarePlatformForCollegeAndUniversityPlusPoweredByJavaApplication {

    public static void main(String[] args) {
        Hooks.onErrorDropped(ex -> log.info("Caught exception in Publisher: " + ex.getLocalizedMessage()));
        SpringApplication.run(TheUltimateInternshipManagerSoftwarePlatformForCollegeAndUniversityPlusPoweredByJavaApplication.class, args);
    }

    @Profile("!noBootstrappingTests")
    @Component
    public static class BootstrapConfig implements CommandLineRunner {

        private final UserRepository userRepo;
        private final PasswordEncoder passwordEncoder;

        public BootstrapConfig(UserRepository userRepo, PasswordEncoder passwordEncoder) {
            this.userRepo = userRepo;
            this.passwordEncoder = passwordEncoder;
        }

        @Override
        @Transactional
        public void run(String... args) {
            if (userRepo.count() == 0)
                userRepo.saveAndFlush(Admin.builder()
                        .email("root@local.host")
                        .password(passwordEncoder.encode("password"))
                        .name("Default Admin")
                        .passwordExpired(true)
                        .build());

            List<String> firstNames = Arrays.asList("Andrei", "Ernesto", "Simon", "Song", "Ismail", "Fabory", "Mathieu", "François", "Félix");
            List<String> lastNames = Arrays.asList("Belkin", "Mejia Mendez", "Longpré-Landry", "Xin Yu", "Ghedamsi", "Bangoura", "D'Onofrio", "Lacoursière", "St-Gelais");
            List<String> companies = Arrays.asList("Desjardins", "Dacima", "Generix", "Banque Nationale", "IGA", "Ministère du Transport");
            Random random = new Random();

            for (int i = 0; i < 5; i++)
                userRepo.saveAndFlush(Student.builder()
                        .firstName(firstNames.get(random.nextInt(firstNames.size())))
                        .lastName(lastNames.get(random.nextInt(lastNames.size())))
                        .email("projetemployeur+etudiant" + i + "@gmail.com")
                        .password(passwordEncoder.encode("password"))
                        .studentId(String.valueOf(i))
                        .phoneNumber(getRandomPhoneNumber(random))
                        .semesters(Collections.singletonList(((i % 2) == 0) ? SemesterContext.getPresentSemester() : "a2019h2020"))
                        .build());

            for (int i = 0; i < 5; i++)
                userRepo.saveAndFlush(Employer.builder()
                        .contactName(firstNames.get(random.nextInt(firstNames.size())) + " " + lastNames.get(random.nextInt(lastNames.size())))
                        .email("projetemployeur+employeur" + i + "@gmail.com")
                        .password(passwordEncoder.encode("password"))
                        .companyName(String.valueOf(companies.get(random.nextInt(companies.size()))))
                        .phoneNumber(getRandomPhoneNumber(random))
                        .semesters(Collections.singletonList(((i % 2) == 0) ? SemesterContext.getPresentSemester() : "a2019h2020"))
                        .build());
        }

        private static String getRandomPhoneNumber(Random random) {
            StringBuilder phoneNumber = new StringBuilder("");

            phoneNumber.append((random.nextInt(2) == 0) ? "(514) " : "(438) ");

            for (int i = 0; i < 3; i++)
                phoneNumber.append(random.nextInt(10));

            phoneNumber.append("-");

            for (int i = 0; i < 4; i++)
                phoneNumber.append(random.nextInt(10));

            return phoneNumber.toString();
        }
    }
}
