package com.power222.tuimspfcauppbj.util;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum SimpleResponse {
    @JsonProperty("Sim")
    YES,
    @JsonProperty("Não")
    NO,
    @JsonProperty("Talvez")
    MAYBE
}
