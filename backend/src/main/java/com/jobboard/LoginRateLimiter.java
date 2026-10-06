package com.jobboard;

import org.springframework.stereotype.Component;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Blocks an IP after 5 failed logins within 15 minutes. */
@Component
public class LoginRateLimiter {
    private static final int MAX_FAILS = 5;
    private static final long WINDOW_MS = 15 * 60 * 1000L;
    private final Map<String, Deque<Long>> fails = new ConcurrentHashMap<>();

    public boolean blocked(String key) {
        Deque<Long> d = fails.get(key);
        if (d == null) return false;
        synchronized (d) {
            prune(d);
            return d.size() >= MAX_FAILS;
        }
    }

    public void fail(String key) {
        if (fails.size() > 10000) fails.clear();
        Deque<Long> d = fails.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (d) {
            prune(d);
            d.addLast(System.currentTimeMillis());
        }
    }

    public void reset(String key) { fails.remove(key); }

    private void prune(Deque<Long> d) {
        long cutoff = System.currentTimeMillis() - WINDOW_MS;
        while (!d.isEmpty() && d.peekFirst() < cutoff) d.removeFirst();
    }
}
