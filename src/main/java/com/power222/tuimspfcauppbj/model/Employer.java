package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.power222.tuimspfcauppbj.util.SemesterAware;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Filter;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Entity
public class Employer extends User implements SemesterAware {

    private String companyName;
    private String contactName;
    private String phoneNumber;
    private String address;

    @ElementCollection
    private List<String> semesters;

    @OneToMany(mappedBy = "employer", cascade = CascadeType.ALL)
    @JsonIgnore
    @Filter(name = "semesterFilter", condition = "semester = :semester")
    private List<InternshipOffer> offers;

    @OneToMany(cascade = CascadeType.ALL)
    @JsonIgnore
    @Filter(name = "semesterFilter", condition = "semester = :semester")
    private List<Interview> interviews;

    @Override
    public String getFullName() {
        return contactName;
    }
}
