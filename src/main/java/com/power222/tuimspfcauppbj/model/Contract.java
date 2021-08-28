package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import lombok.*;
import lombok.Builder.Default;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = true, exclude = "studentApplication")
public class Contract extends SemesterDiscriminatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Lob
    private String file;

    @Lob
    private String engagementCollege;

    @Lob
    private String engagementCompany;

    @Lob
    private String engagementStudent;

    private float totalHoursPerWeek;
    private String reasonForRejection;

    @Default
    private ContractSignatureState signatureState = ContractSignatureState.PENDING_FOR_ADMIN_REVIEW;

    @OneToOne
    private StudentApplication studentApplication;

    @OneToOne(mappedBy = "contract")
    @JsonIgnoreProperties("contract")
    private InternEvaluation internEvaluation;

    @ManyToOne
    @JsonIgnoreProperties("contracts")
    private Admin admin;

    @OneToOne(mappedBy = "contract")
    @JsonIgnoreProperties("contract")
    private BusinessEvaluation businessEvaluation;
}
