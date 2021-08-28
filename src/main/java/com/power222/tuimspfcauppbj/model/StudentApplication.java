package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.power222.tuimspfcauppbj.util.StudentApplicationState;
import lombok.*;
import lombok.Builder.Default;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = true, exclude = {"interview"})
public class StudentApplication extends SemesterDiscriminatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Default
    private StudentApplicationState state = StudentApplicationState.APPLICATION_PENDING_FOR_EMPLOYER_INITIAL_REVIEW;

    @Default
    private String reasonForRejection = "";

    @ManyToOne
    @JsonIgnoreProperties({"file", "allowedStudents", "applications"})
    private InternshipOffer offer;

    @ManyToOne
    @JsonIgnoreProperties({"resumes", "allowedOffers", "applications"})
    private Student student;

    @ManyToOne
    @JsonIgnoreProperties({"owner", "applications"})
    private Resume resume;

    @OneToOne(mappedBy = "studentApplication")
    @JsonIgnoreProperties(value = "studentApplication", allowSetters = true)
    private Interview interview;

    @OneToOne(mappedBy = "studentApplication")
    @JsonIgnoreProperties("studentApplication")
    private Contract contract;
}
