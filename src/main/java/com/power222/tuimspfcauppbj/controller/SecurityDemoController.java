package com.power222.tuimspfcauppbj.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SuppressWarnings({"MethodReturnAlwaysConstant", "SameReturnValue"})
@RestController
@RequestMapping("/api/hello")
public class SecurityDemoController {

    @GetMapping
    public String helloWorld() {
        return "Hello, world!";
    }

    @GetMapping("/private")
    public String helloPrivate() {
        return "Hello, private world!";
    }
}
