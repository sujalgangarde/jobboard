package com.jobboard;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AdminRepository admins;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;
    private final LoginRateLimiter limiter;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletRequest req) {
        String ip = req.getRemoteAddr();
        if (limiter.blocked(ip)) {
            return ResponseEntity.status(429)
                .body(Map.of("error", "Too many failed attempts. Try again in 15 minutes."));
        }
        String user = body.get("username");
        String pass = body.get("password");
        if (user != null && pass != null) {
            var admin = admins.findByUsername(user.trim())
                .filter(a -> encoder.matches(pass, a.getPassword()));
            if (admin.isPresent()) {
                limiter.reset(ip);
                return ResponseEntity.ok(Map.of("token", jwt.generate(admin.get().getUsername())));
            }
        }
        limiter.fail(ip);
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }
}
