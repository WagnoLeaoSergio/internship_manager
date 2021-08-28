package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

@Data
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
@FilterDef(name = "semesterFilter", parameters = {@ParamDef(name = "semester", type = "string")})
@Filter(name = "semesterFilter", condition = "semester = :semester")
public abstract class SemesterDiscriminatedEntity {

    @JsonProperty(access = Access.READ_ONLY)
    private String semester;

    @PrePersist
    @PreUpdate
    public void onPrePersist() {
        if ((semester == null) || semester.isBlank())
            semester = SemesterContext.isSet() ? SemesterContext.getCurrent() : SemesterContext.getPresentSemester();
    }
}
