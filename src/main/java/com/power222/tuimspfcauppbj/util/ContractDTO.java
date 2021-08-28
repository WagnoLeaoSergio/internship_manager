package com.power222.tuimspfcauppbj.util;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContractDTO {
    private long studentApplicationId;
    private String engagementCollege;
    private String engagementCompany;
    private String engagementStudent;
    private float totalHoursPerWeek;
    private String file;
}
