package com.power222.tuimspfcauppbj.util;

public enum ReviewState {
    PENDING("aguardando"), APPROVED("aprovado"), DENIED("recusado");

    private final String value;

    ReviewState(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
