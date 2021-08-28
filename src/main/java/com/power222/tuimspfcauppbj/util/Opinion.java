package com.power222.tuimspfcauppbj.util;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Opinion {

    @JsonProperty("Concordo plenamente")
    TOTALY_AGGREED,
    @JsonProperty("Concordo")
    AGGREED,
    @JsonProperty("Discordo")
    DISAGREED,
    @JsonProperty("Discordo plenamente")
    TOTALY_DISAGREED,
    @JsonProperty("N / D")
    N_A
}
