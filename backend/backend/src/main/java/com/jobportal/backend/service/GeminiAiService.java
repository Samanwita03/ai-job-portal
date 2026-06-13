package com.jobportal.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiAiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper;

    private static final String GROQ_URL =
        "https://api.groq.com/openai/v1/chat/completions";

    public Map<String, Object> matchResumeToJob(
            String resumeText, String jobDescription, String skillsRequired) {

        String prompt = "You are an expert HR recruiter. Analyze this resume against the job description.\n\n"
            + "RESUME:\n" + resumeText + "\n\n"
            + "JOB DESCRIPTION:\n" + jobDescription + "\n\n"
            + "REQUIRED SKILLS:\n" + (skillsRequired != null ? skillsRequired : "Not specified") + "\n\n"
            + "Return ONLY this JSON, no markdown, no extra text:\n"
            + "{\"matchScore\": 75, \"matchedSkills\": [\"Java\"], \"missingSkills\": [\"Docker\"], "
            + "\"summary\": \"Good match.\", \"recommendation\": \"GOOD_MATCH\"}";

        try {
            // Build Groq request body (OpenAI format)
            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama-3.3-70b-versatile");
            body.put("messages", List.of(message));
            body.put("temperature", 0.3);
            body.put("max_tokens", 500);

            String jsonBody = objectMapper.writeValueAsString(body);
            log.info("Calling Groq API, body length: {}", jsonBody.length());

            URL url = new URL(GROQ_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Authorization", "Bearer " + apiKey);
            conn.setDoOutput(true);
            conn.setConnectTimeout(20000);
            conn.setReadTimeout(30000);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonBody.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int responseCode = conn.getResponseCode();
            log.info("Groq HTTP response code: {}", responseCode);

            InputStream is = responseCode >= 200 && responseCode < 300
                ? conn.getInputStream()
                : conn.getErrorStream();

            String response = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            log.info("Groq response body: {}", response);

            if (responseCode != 200) {
                log.error("Groq error: {}", response);
                return fallbackResult("HTTP error " + responseCode + ": " + response);
            }

            // Parse Groq response (OpenAI format)
            Map<String, Object> parsed = objectMapper.readValue(response, Map.class);
            List<?> choices = (List<?>) parsed.get("choices");

            if (choices == null || choices.isEmpty()) {
                return fallbackResult("No choices returned from Groq");
            }

            Map<?, ?> choice = (Map<?, ?>) choices.get(0);
            Map<?, ?> messageResponse = (Map<?, ?>) choice.get("message");
            String jsonText = (String) messageResponse.get("content");

            log.info("Groq AI result: {}", jsonText);

            // Clean markdown if present
            jsonText = jsonText.replaceAll("```json", "")
                               .replaceAll("```", "")
                               .trim();

            return objectMapper.readValue(jsonText, Map.class);

        } catch (Exception e) {
            log.error("Groq API error: {}", e.getMessage(), e);
            return fallbackResult(e.getMessage());
        }
    }

    private Map<String, Object> fallbackResult(String reason) {
        return Map.of(
            "matchScore", 0,
            "matchedSkills", List.of(),
            "missingSkills", List.of(),
            "summary", "AI analysis unavailable: " + reason,
            "recommendation", "ERROR"
        );
    }
}