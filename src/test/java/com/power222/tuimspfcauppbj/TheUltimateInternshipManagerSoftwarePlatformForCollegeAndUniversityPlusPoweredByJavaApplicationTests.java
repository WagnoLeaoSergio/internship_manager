package com.power222.tuimspfcauppbj;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.LinkedHashMap;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@SuppressWarnings({"rawtypes", "unchecked"})
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, properties = {"spring.rsocket.server.port=0"})
class TheUltimateInternshipManagerSoftwarePlatformForCollegeAndUniversityPlusPoweredByJavaApplicationTests {

    @Autowired
    private TestRestTemplate restTemplate;

    private MultiValueMap<String, String> headers;

    @BeforeEach
    void beforeEach() {
        headers = new LinkedMultiValueMap<>();
        headers.add("X-Semester", "a2020h2021");
    }

    @Test
    void contextLoads() {
        assertThat(restTemplate, is(notNullValue()));
    }

    @Test
    void helloWorldTest() {
        ResponseEntity<String> response = restTemplate.exchange("/api/hello", HttpMethod.GET, new HttpEntity<Void>(headers), String.class);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.OK)));
        assertThat(response.getBody(), is(equalTo("Hello, world!")));
    }

    @Test
    void unauthenticatedPrivateHelloWorldTest() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/hello/private", String.class);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.UNAUTHORIZED)));
    }

    @Test
    void authenticatedPrivateHelloWorldTest() {
        ResponseEntity<String> response = restTemplate.withBasicAuth("employeur@gmail.com", "password")
                .exchange("/api/hello/private", HttpMethod.GET, new HttpEntity<Void>(headers), String.class);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.OK)));
        assertThat(response.getBody(), is(equalTo("Hello, private world!")));
    }

    @Test
    void wrongUserPrivateHelloWorldTest() {
        ResponseEntity<String> response = restTemplate.withBasicAuth("totolehacker", "password")
                .getForEntity("/api/hello/private", String.class);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.UNAUTHORIZED)));
    }

    @Test
    void malformedSemesterHeaderTest() {
        headers = new LinkedMultiValueMap<>();
        headers.add("X-Semester", "a2020d2021");

        ResponseEntity<String> response = restTemplate
                .withBasicAuth("admin@cal.qc.ca", "password")
                .exchange("/api/students", HttpMethod.GET, new HttpEntity<Void>(headers), String.class);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.BAD_REQUEST)));
        assertThat(response.getBody(), is(equalTo("{\"error\": \"Malformed X-Semester header\"}")));
    }

    @Test
    void getOfferForFirstSemester() {
        headers = new LinkedMultiValueMap<>();
        headers.add("X-Semester", "a2020h2021");

        ResponseEntity<List> response = restTemplate
                .withBasicAuth("admin@cal.qc.ca", "password")
                .exchange("/api/offers", HttpMethod.GET, new HttpEntity<Void>(headers), List.class);

        List<LinkedHashMap> offers = response.getBody();

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.OK)));
        assertThat(offers, is(notNullValue()));
        assertThat(offers.get(0).get("semester"), is(equalTo("a2020h2021")));
    }

    @Test
    void getOfferForSecondSemester() {
        headers = new LinkedMultiValueMap<>();
        headers.add("X-Semester", "a2021h2022");

        ResponseEntity<List> response = restTemplate
                .withBasicAuth("admin@cal.qc.ca", "password")
                .exchange("/api/offers", HttpMethod.GET, new HttpEntity<Void>(headers), List.class);

        List<LinkedHashMap> offers = response.getBody();

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.OK)));
        assertThat(offers, is(notNullValue()));
        assertThat(offers.get(0).get("semester"), is(equalTo("a2021h2022")));
    }
}
