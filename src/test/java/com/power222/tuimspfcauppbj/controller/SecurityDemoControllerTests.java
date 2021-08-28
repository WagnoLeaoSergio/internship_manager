package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Admin;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("noBootstrappingTests")
@WebMvcTest(SecurityDemoController.class)
public class SecurityDemoControllerTests {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private UserRepository userRepo;

    @Test
    void helloWorldTest() throws Exception {
        mvc.perform(get("/api/hello").contentType(MediaType.TEXT_PLAIN)).andExpect(status().isOk()).andExpect(content().string(containsString("Hello, world!")));
    }

    @Test
    void unauthenticatedPrivateHelloWorldTest() throws Exception {
        when(userRepo.findByEmail(any())).thenReturn(Optional.empty());

        mvc.perform(get("/api/hello/private").contentType(MediaType.TEXT_PLAIN)).andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser("test")
    void authenticatedPrivateHelloWorldTest() throws Exception {
        when(userRepo.findByEmail(any())).thenReturn(Optional.of(Admin.builder().email("admin@cal.qc.ca").password("password").build()));

        mvc.perform(get("/api/hello/private").contentType(MediaType.TEXT_PLAIN)).andExpect(status().isOk()).andExpect(content().string(containsString("Hello, private world!")));
    }
}
