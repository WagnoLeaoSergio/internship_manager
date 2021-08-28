package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.power222.tuimspfcauppbj.util.Opinion;
import com.power222.tuimspfcauppbj.util.SimpleResponse;
import lombok.*;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
@SuppressWarnings("JpaDataSourceORMInspection")
public class InternEvaluation extends SemesterDiscriminatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private GeneralInfo infos;
    private ProductivityCriterias productivity;
    private WorkQualityCriterias quality;
    private InterpersonalRelationsCriterias relationships;
    private PersonalSkills skills;
    private GlobalAppreciation appreciation;
    private Feedback feedback;
    private Signature signature;

    @OneToOne
    private Contract contract;

    @Data
    @Embeddable
    public static class GeneralInfo {
        private String studentProgram;
        private String supervisorRole;
        private String phoneNumber;
    }

    @Data
    @Embeddable
    public static class ProductivityCriterias {
        private Opinion efficiency;
        private Opinion comprehension;
        private Opinion rythm;
        private Opinion priorities;
        private Opinion deadlines;
        @Column(name = "PRODUCTIVITY_COMMENT")
        private String comment;
    }

    @Data
    @Embeddable
    public static class WorkQualityCriterias {
        private Opinion followsInstructions;
        private Opinion detailsAttention;
        private Opinion doubleChecks;
        private Opinion strivesForPerfection;
        private Opinion problemAnalysis;
        @Column(name = "QUALITY_COMMENT")
        private String comment;

    }

    @Data
    @Embeddable
    public static class InterpersonalRelationsCriterias {
        private Opinion connectsEasily;
        private Opinion teamworkContribution;
        private Opinion culturalAdaptation;
        private Opinion acceptsCriticism;
        private Opinion respectsOthers;
        private Opinion activelyListens;
        @Column(name = "RELATIONSHIPS_COMMENT")
        private String comment;
    }

    @Data
    @Embeddable
    public static class PersonalSkills {
        private Opinion showsInterest;
        private Opinion expressesOwnIdeas;
        private Opinion showsInitiative;
        private Opinion worksSafely;
        private Opinion dependable;
        private Opinion punctual;
        @Column(name = "SKILLS_COMMENT")
        private String comment;
    }

    @Data
    @Embeddable
    public static class GlobalAppreciation {
        private Expectations expectations;
        @Column(name = "GLOBAL_COMMENT")
        private String comment;
        private SimpleResponse discussedWithIntern;
    }

    @Data
    @Embeddable
    public static class Feedback {
        private float weeklySupervisionHours;
        private SimpleResponse hireAgain;
        private String technicalFormationOpinion;
    }

    public enum Expectations {
        @JsonProperty("Habilidades demonstradas excedem em muito as expectativas")
        GREATLY_EXCEEDED,
        @JsonProperty("Habilidades demonstradas excedem as expectativas")
        EXCEEDED,
        @JsonProperty("As habilidades demonstradas atendem plenamente às expectativas")
        MET,
        @JsonProperty("As habilidades demonstradas atendem parcialmente às expectativas")
        PARTIALLY_MET,
        @JsonProperty("Habilidades demonstradas não atendem às expectativas")
        NOT_MET
    }
}
