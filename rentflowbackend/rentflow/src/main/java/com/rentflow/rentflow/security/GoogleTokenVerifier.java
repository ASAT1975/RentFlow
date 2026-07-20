package com.rentflow.rentflow.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

/**
 * Verifies a Google OAuth access token by calling Google's userinfo endpoint.
 * Returns the verified email + name, or throws if the token is invalid.
 *
 * Note: this proves the token is a valid Google token and yields a verified
 * email, but does not bind the token to a specific OAuth client (audience). For
 * stronger security, switch to an ID token and validate the `aud` claim against
 * your web client ID.
 */
@Component
public class GoogleTokenVerifier {

    private static final String USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public record GoogleUser(String email, String name) {}

    public GoogleUser verify(String accessToken) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(USERINFO_URL))
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();

        HttpResponse<String> response =
                httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Invalid Google token");
        }

        JsonNode node;
        try {
            node = objectMapper.readTree(response.body());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse Google userinfo response", e);
        }

        String email = node.path("email").asText(null);
        boolean emailVerified = node.path("email_verified").asBoolean(false);
        String name = node.path("name").asText(email);

        if (email == null || !emailVerified) {
            throw new RuntimeException("Google email is not verified");
        }

        return new GoogleUser(email, name);
    }
}
