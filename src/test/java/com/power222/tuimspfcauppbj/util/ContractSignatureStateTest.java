package com.power222.tuimspfcauppbj.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ContractSignatureStateTest {

    @Test
    void getNextStatefromPENDING_FOR_ADMIN_REVIEW() {
        var initialState = ContractSignatureState.PENDING_FOR_ADMIN_REVIEW;
        var finalState = ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE;

        var actual = ContractSignatureState.getNextState(initialState, true);
        assertThat(actual).isEqualTo(finalState);

        actual = ContractSignatureState.getNextState(initialState, true);
        assertThat(actual).isEqualTo(finalState);
    }

    @Test
    void getNextStatefromWAITING_FOR_EMPLOYER_SIGNATURE_approved() {
        var initialState = ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE;
        var finalState = ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE;

        var actual = ContractSignatureState.getNextState(initialState, true);
        assertThat(actual).isEqualTo(finalState);
    }

    @Test
    void getNextStatefromWAITING_FOR_EMPLOYER_SIGNATURE_rejected() {
        var initialState = ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE;
        var finalState = ContractSignatureState.REJECTED_BY_EMPLOYER;

        var actual = ContractSignatureState.getNextState(initialState, false);
        assertThat(actual).isEqualTo(finalState);
    }

    @Test
    void getNextStatefromWAITING_FOR_STUDENT_SIGNATURE() {
        var initialState = ContractSignatureState.WAITING_FOR_STUDENT_SIGNATURE;
        var finalState = ContractSignatureState.WAITING_FOR_ADMIN_SIGNATURE;

        var actual = ContractSignatureState.getNextState(initialState, true);
        assertThat(actual).isEqualTo(finalState);

        actual = ContractSignatureState.getNextState(initialState, false);
        assertThat(actual).isEqualTo(finalState);
    }

    @Test
    void getNextStatefromWAITING_FOR_Admin_SIGNATURE() {
        var initialState = ContractSignatureState.WAITING_FOR_ADMIN_SIGNATURE;
        var finalState = ContractSignatureState.SIGNED;

        var actual = ContractSignatureState.getNextState(initialState, true);
        assertThat(actual).isEqualTo(finalState);

        actual = ContractSignatureState.getNextState(initialState, false);
        assertThat(actual).isEqualTo(finalState);
    }
}
