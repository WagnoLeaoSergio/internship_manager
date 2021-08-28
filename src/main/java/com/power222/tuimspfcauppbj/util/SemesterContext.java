package com.power222.tuimspfcauppbj.util;

import java.time.LocalDate;

public final class SemesterContext {

    private SemesterContext() {
    }

    private static final ThreadLocal<String> CURRENT_SEMESTER = new ThreadLocal<>();

    public static String getCurrent() {
        return CURRENT_SEMESTER.get();
    }

    public static void setCurrent(String value) {
        CURRENT_SEMESTER.set(value);
    }

    public static boolean isSet() {
        return CURRENT_SEMESTER.get() != null;
    }

    public static String getPresentSemester() {
        var date = LocalDate.now();
        if (date.getMonthValue() > 8)
            return "a" + date.getYear() + "h" + (date.getYear() + 1);
        else
            return "a" + (date.getYear() - 1) + "h" + date.getYear();
    }
}
