package com.power222.tuimspfcauppbj.config;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class NoPopupBasicAuthenticationEntrypoint implements AuthenticationEntryPoint {

    public static final int TOKEN_EXPIRED = 498;
    private boolean expiredRaised = false;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {

        if (authException instanceof CredentialsExpiredException) {
            response.sendError(TOKEN_EXPIRED, authException.getMessage());
        } else if (!expiredRaised) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), authException.getMessage());
        }

        expiredRaised = authException instanceof CredentialsExpiredException;
    }
}
