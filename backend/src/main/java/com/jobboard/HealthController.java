package com.jobboard;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Simple URL for hosting health checks and uptime monitors. */
@RestController
public class HealthController {
    @GetMapping("/")
    public String health() { return "JobBoard API is running"; }
}
