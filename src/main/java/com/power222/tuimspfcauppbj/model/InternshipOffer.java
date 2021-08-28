package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.power222.tuimspfcauppbj.util.ReviewState;
import lombok.*;
import lombok.Builder.Default;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true, exclude = "applications")
public class InternshipOffer extends SemesterDiscriminatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;

    @Embedded
    private InternshipOfferDetails details;

    @Default
    private ReviewState reviewState = ReviewState.PENDING;
    private String reasonForRejection;

    @Lob
    private String file;

    @ManyToOne(optional = false)
    @JsonIgnoreProperties("offers")
    private Employer employer;

    @SuppressWarnings("JpaDataSourceORMInspection")
    @ManyToMany
    @JoinTable(name = "OFFER_ALLOWED_STUDENT")
    @JsonIgnoreProperties({"applications", "resumes", "allowedOffers"})
    private List<Student> allowedStudents;

    @OneToMany(mappedBy = "offer", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"offer"})
    private List<StudentApplication> applications;

    @Embeddable
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InternshipOfferDetails {
        private String description;
        private LocalDate creationDate;
        private LocalDate limitDateToApply;
        private LocalDate internshipStartDate;
        private LocalDate internshipEndDate;
        private double salary;
        private int nbStudentToHire;
        private LocalTime startTime;
        private LocalTime endTime;
    }
}
