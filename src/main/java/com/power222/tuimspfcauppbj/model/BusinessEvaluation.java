package com.power222.tuimspfcauppbj.model;

import com.power222.tuimspfcauppbj.util.InternshipCount;
import com.power222.tuimspfcauppbj.util.Opinion;
import com.power222.tuimspfcauppbj.util.SimpleNumbers;
import com.power222.tuimspfcauppbj.util.SimpleResponse;
import lombok.*;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
public class BusinessEvaluation extends SemesterDiscriminatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    private EvaluationCriterias evaluationCriterias;
    private Observations observations;
    private Signature signature;

    @OneToOne
    private Contract contract;

    @Data
    @Embeddable
    public static class EvaluationCriterias {
        private InternshipCount internshipCount;
        private Opinion workAsAnnoncement;
        private Opinion easyIntigration;
        private Opinion sufficientTime;
        private float hoursOfWeekFirstMonth;
        private float hoursOfWeekSecondMonth;
        private float hoursOfWeekThirdMonth;
        private Opinion securityWorkPlace;
        private Opinion pleasantEnvironnement;
        private Opinion accessiblePlace;
        private Opinion goodSalary;
        private float salary;
        private Opinion supervisorFacilitatesIntern;
        private Opinion adequateEquipement;
        private Opinion accetableWorkload;
        private String comment;
    }

    @Data
    @Embeddable
    public static class Observations {
        private InternshipCount preferedInternship;
        private SimpleNumbers numbersOfInterns;
        private SimpleResponse welcomeSameIntern;
        private SimpleResponse variablesShifts;
        private float startShiftsOne;
        private float startShiftsTwo;
        private float startShiftsThree;
        private float endShiftsOne;
        private float endShiftsTwo;
        private float endShiftsThree;
    }
}
