package com.jobboard;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    private final SecretKey key;

    public JwtUtil(@Value("${app.jwt.secret}") String secret) {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET must be at least 32 characters long");
        }
        this.key = Keys.hmacShaKeyFor(bytes);
    }

    public String generate(String username) {
        return Jwts.builder().subject(username)
            .expiration(new Date(System.currentTimeMillis() + 12 * 3600 * 1000L))
            .signWith(key).compact();
    }

    public String validate(String token) {
        return Jwts.parser().verifyWith(key).build()
            .parseSignedClaims(token).getPayload().getSubject();
    }
}
