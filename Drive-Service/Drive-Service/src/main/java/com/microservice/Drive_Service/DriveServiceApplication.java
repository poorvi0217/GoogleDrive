
package com.microservice.Drive_Service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableConfigurationProperties
@EnableFeignClients(basePackages = "com.microservice.Drive_Service.client")
public class DriveServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DriveServiceApplication.class, args);
	}
}
