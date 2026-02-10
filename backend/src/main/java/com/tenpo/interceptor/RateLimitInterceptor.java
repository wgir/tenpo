package com.tenpo.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final Map<Integer, TenpistaRequestInfo> tenpistaRequests = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_MINUTE = 3;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull Object handler)
            throws Exception {
        // Only rate limit POST requests (specifically for transaction creation)
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        Integer tenpistaId;
        try {
            // Read tenpistaId from the cached body
            JsonNode node = objectMapper.readTree(request.getInputStream());
            if (node.has("tenpista_id")) {
                tenpistaId = node.get("tenpista_id").asInt();
            } else {
                // If no tenpistaId is present, maybe allow or block?
                // Given the requirement, we should probably expect it.
                return true;
            }
        } catch (Exception e) {
            // If body is not readable or not JSON, skip rate limiting or handle error
            return true;
        }

        long currentTime = System.currentTimeMillis();
        TenpistaRequestInfo info = tenpistaRequests.computeIfAbsent(tenpistaId,
                k -> new TenpistaRequestInfo(currentTime));

        synchronized (info) {
            if (currentTime - info.startTime.get() > 60000) {
                info.startTime.set(currentTime);
                info.count.set(1);
                return true;
            }

            if (info.count.incrementAndGet() > MAX_REQUESTS_PER_MINUTE) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"detail\": \"Too many requests - Rate limit is 3 per minute for tenpista "
                        + tenpistaId + "\"}");
                return false;
            }
        }

        return true;
    }

    private static class TenpistaRequestInfo {
        AtomicLong startTime;
        AtomicInteger count;

        TenpistaRequestInfo(long startTime) {
            this.startTime = new AtomicLong(startTime);
            this.count = new AtomicInteger(0);
        }
    }
}
