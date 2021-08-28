package com.power222.tuimspfcauppbj.util;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum SimpleNumbers {
    @JsonProperty("Um estagiário")
    ONE,
    @JsonProperty("Dois estagiários")
    TWO,
    @JsonProperty("Três estagiários")
    THREE,
    @JsonProperty("Mais de três")
    MORE
}
