package com.rentflow.rentflow.payment;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class PaystackService {

    @Value("${paystack.secret.key}")
    private String secretKey;

    private final String BASE_URL = "https://api.paystack.co";
    private final RestTemplate restTemplate = new RestTemplate();

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    // Initialize a transaction (tenant authorizes first payment)
    public Map initializeTransaction(String email, Double amount) {
        String url = BASE_URL + "/transaction/initialize";

        Map<String, Object> body = Map.of(
                "email", email,
                "amount", (int)(amount * 100), // Paystack uses kobo/pesewas
                "currency", "GHS"
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, getHeaders());
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        return response.getBody();
    }

    // Charge tenant automatically using saved authorization code
    public Map chargeAuthorization(String authCode, String email, Double amount) {
        String url = BASE_URL + "/transaction/charge_authorization";

        Map<String, Object> body = Map.of(
                "authorization_code", authCode,
                "email", email,
                "amount", (int)(amount * 100),
                "currency", "GHS"
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, getHeaders());
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        return response.getBody();
    }

    // Verify a transaction
    public Map verifyTransaction(String reference) {
        String url = BASE_URL + "/transaction/verify/" + reference;
        HttpEntity<Void> request = new HttpEntity<>(getHeaders());
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
        return response.getBody();
    }

    /** Validates the `x-paystack-signature` HMAC-SHA512 digest Paystack sends on webhooks. */
    public boolean verifyWebhookSignature(String payload, String signature) {
        if (signature == null || signature.isBlank()) {
            return false;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec key = new SecretKeySpec(
                    secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(key);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString().equals(signature);
        } catch (Exception e) {
            return false;
        }
    }
}