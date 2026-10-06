package com.jobboard;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Entity @Data @Table(name = "jobs")
public class Job {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Job title is required") @Size(max = 150, message = "Max 150 characters")
    private String title;
    @NotBlank(message = "Company is required") @Size(max = 150, message = "Max 150 characters")
    private String company;
    @Size(max = 100, message = "Max 100 characters") private String location;
    @Size(max = 50) private String type;
    @Size(max = 100, message = "Max 100 characters") private String salary;
    @Email(message = "Enter a valid email") @Size(max = 150) private String contactEmail;
    @Size(max = 3000, message = "Max 3000 characters")
    @Column(length = 3000) private String description;
    private LocalDate postedOn = LocalDate.now();
}
