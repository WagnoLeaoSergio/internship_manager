package com.power222.tuimspfcauppbj.config;

import com.power222.tuimspfcauppbj.util.SemesterContext;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class DiscriminatorHeaderServletFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        final var servletPath = ((HttpServletRequest) request).getServletPath();
        if (!servletPath.contains("/api/") || servletPath.contains("/api/auth") || servletPath.contains("/api/semesters")) {
            chain.doFilter(request, response);
            return;
        }

        final var semesterHeader = ((HttpServletRequest) request).getHeader("X-Semester");
        if ((semesterHeader != null) && semesterHeader.matches("a[0-9]{4}h[0-9]{4}")) {
            SemesterContext.setCurrent(semesterHeader);
            chain.doFilter(request, response);
        } else if (semesterHeader != null) {
            var httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            httpResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
            httpResponse.getWriter().write("{\"error\": \"Malformed X-Semester header\"}");
            httpResponse.getWriter().flush();
        } else {
            SemesterContext.setCurrent(SemesterContext.getPresentSemester());
            chain.doFilter(request, response);
        }
    }
}
