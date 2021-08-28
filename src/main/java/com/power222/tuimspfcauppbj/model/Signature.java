package com.power222.tuimspfcauppbj.model;

import lombok.Data;

import javax.persistence.Embeddable;
import javax.persistence.Lob;
import java.time.LocalDate;

@Data
@Embeddable
public class Signature {
    @Lob
    private String image;
    private String name;
    private LocalDate date;
}
