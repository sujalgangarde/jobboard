package com.jobboard;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component @RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final AdminRepository admins;
    private final JobRepository jobs;
    private final PasswordEncoder encoder;

    @Value("${app.admin.username}") private String adminUser;
    @Value("${app.admin.password}") private String adminPass;
    @Value("${app.seed-sample-jobs}") private boolean seedJobs;

    @Override
    public void run(String... args) {
        // Admin is created from env vars. Changing ADMIN_PASSWORD and restarting updates the password.
        Admin admin = admins.findByUsername(adminUser).orElseGet(() -> {
            Admin a = new Admin();
            a.setUsername(adminUser);
            return a;
        });
        if (admin.getPassword() == null || !encoder.matches(adminPass, admin.getPassword())) {
            admin.setPassword(encoder.encode(adminPass));
            admins.save(admin);
        }
        if ("admin123".equals(adminPass)) {
            log.warn("Using default admin password. Set ADMIN_PASSWORD before going live!");
        }

        if (seedJobs && jobs.count() == 0) {
            jobs.save(job("Java Backend Developer", "Acme Technologies", "Pune", "Full-time", "₹8-12 LPA",
                "Build REST APIs with Spring Boot and MySQL.\n\nRequirements:\n- Java 17, Spring Boot\n- SQL basics\n- Good problem solving"));
            jobs.save(job("React Frontend Developer", "PixelWorks", "Remote", "Full-time", "₹6-10 LPA",
                "Create responsive web apps with React and Tailwind CSS.\n\nRequirements:\n- React, JavaScript\n- Basic UI sense"));
            jobs.save(job("Software Engineering Intern", "CodeNest", "Mumbai", "Internship", "₹15,000/month",
                "6-month internship working with a friendly engineering team. Freshers welcome."));
            jobs.save(job("QA Tester", "BugHunters", "Bengaluru", "Part-time", "₹25,000/month",
                "Test web applications and report bugs. Flexible hours."));
            jobs.save(job("Technical Content Writer", "DevDocs", "Remote", "Contract", "₹30,000/month",
                "Write clear tutorials and documentation for developers. 3-month contract."));
        }
    }

    private Job job(String title, String company, String location, String type, String salary, String desc) {
        Job j = new Job();
        j.setTitle(title); j.setCompany(company); j.setLocation(location);
        j.setType(type); j.setSalary(salary); j.setDescription(desc);
        j.setContactEmail("hr@example.com");
        return j;
    }
}
