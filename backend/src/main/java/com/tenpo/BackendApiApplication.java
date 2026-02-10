package com.tenpo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class BackendApiApplication {

    public static void main(String[] args) {
        // Set default timezone to America/Bogota (GMT-5) for local datetime validation
        TimeZone.setDefault(TimeZone.getTimeZone("America/Bogota"));
        SpringApplication.run(BackendApiApplication.class, args);
    }

}
