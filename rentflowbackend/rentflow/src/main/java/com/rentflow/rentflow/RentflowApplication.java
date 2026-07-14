package com.rentflow.rentflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RentflowApplication {

	public static void main(String[] args) {
		SpringApplication.run(RentflowApplication.class, args);
	}

}
