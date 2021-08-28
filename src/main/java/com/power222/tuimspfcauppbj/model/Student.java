package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.power222.tuimspfcauppbj.util.SemesterAware;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Filter;

import javax.persistence.*;
import java.util.List;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
public class Student extends User implements SemesterAware {

    private String firstName;
    private String lastName;
    private String studentId;
    private String phoneNumber;
    private String address;

    @ElementCollection
    private List<String> semesters;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("owner")
    private List<Resume> resumes;

    @ManyToMany(mappedBy = "allowedStudents")
    @JsonIgnoreProperties({"employer", "appliedStudents", "allowedStudents"})
    @Filter(name = "semesterFilter", condition = "semester = :semester")
    private List<InternshipOffer> allowedOffers;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("student")
    @Filter(name = "semesterFilter", condition = "semester = :semester")
    private List<StudentApplication> applications;

    @Override
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
