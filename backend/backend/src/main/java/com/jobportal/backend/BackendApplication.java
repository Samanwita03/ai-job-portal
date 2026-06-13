package com.jobportal.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.security.Security;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        // Fix Java DNS caching issue
        Security.setProperty("networkaddress.cache.ttl", "0");
        Security.setProperty("networkaddress.cache.negative.ttl", "0");
        System.setProperty("java.net.preferIPv4Stack", "true");
        SpringApplication.run(BackendApplication.class, args);
    }
}