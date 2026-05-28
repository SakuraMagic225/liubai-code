package com.liubaicode.auth;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.liubaicode.common.exception.BizException;
import com.liubaicode.common.exception.ErrorCode;
import com.liubaicode.model.vo.auth.AdminProfileVo;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    private static final String HMAC_SHA256 = "HmacSHA256";
    private static final Base64.Encoder BASE64_URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder BASE64_URL_DECODER = Base64.getUrlDecoder();

    private final ObjectMapper objectMapper;
    private final String secret;
    private final long expireMillis;

    public JwtTokenProvider(
            ObjectMapper objectMapper,
            @Value("${liubai.auth.jwt-secret:${JWT_SECRET:liubai-code-local-dev-secret-change-me}}") String secret,
            @Value("${liubai.auth.jwt-expire-hours:${JWT_EXPIRE_HOURS:168}}") long expireHours
    ) {
        this.objectMapper = objectMapper;
        this.secret = secret;
        this.expireMillis = expireHours * 60 * 60 * 1000;
    }

    public String createToken(AdminProfileVo adminProfile) {
        long now = Instant.now().toEpochMilli();
        long expiresAt = now + expireMillis;
        Map<String, Object> header = new LinkedHashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", adminProfile.getId());
        payload.put("username", adminProfile.getUsername());
        payload.put("iat", now);
        payload.put("exp", expiresAt);

        String headerPart = encodeJson(header);
        String payloadPart = encodeJson(payload);
        String unsignedToken = headerPart + "." + payloadPart;
        return unsignedToken + "." + sign(unsignedToken);
    }

    public long getExpiresAt(String token) {
        return readPayload(token).getExpiresAt();
    }

    public Long parseAdminId(String token) {
        JwtPayload payload = readPayload(token);
        if (payload.getExpiresAt() < Instant.now().toEpochMilli()) {
            throw new BizException(ErrorCode.UNAUTHORIZED, "登录已过期，请重新登录");
        }
        return payload.getAdminId();
    }

    private JwtPayload readPayload(String token) {
        String[] parts = token == null ? new String[0] : token.split("\\.");
        if (parts.length != 3) {
            throw new BizException(ErrorCode.UNAUTHORIZED, "登录状态无效");
        }

        String unsignedToken = parts[0] + "." + parts[1];
        String expectedSignature = sign(unsignedToken);
        if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8), parts[2].getBytes(StandardCharsets.UTF_8))) {
            throw new BizException(ErrorCode.UNAUTHORIZED, "登录状态无效");
        }

        try {
            Map<String, Object> payload = objectMapper.readValue(
                    BASE64_URL_DECODER.decode(parts[1]),
                    new TypeReference<>() {
                    }
            );
            Long adminId = readLong(payload.get("sub"));
            Long expiresAt = readLong(payload.get("exp"));
            if (adminId == null || expiresAt == null) {
                throw new BizException(ErrorCode.UNAUTHORIZED, "登录状态无效");
            }
            return new JwtPayload(adminId, expiresAt);
        } catch (BizException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new BizException(ErrorCode.UNAUTHORIZED, "登录状态无效");
        }
    }

    private String encodeJson(Map<String, Object> value) {
        try {
            return BASE64_URL_ENCODER.encodeToString(objectMapper.writeValueAsBytes(value));
        } catch (Exception exception) {
            throw new BizException(ErrorCode.INTERNAL_ERROR, "Token 生成失败");
        }
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_SHA256));
            return BASE64_URL_ENCODER.encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new BizException(ErrorCode.INTERNAL_ERROR, "Token 签名失败");
        }
    }

    private Long readLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value instanceof String text) {
            try {
                return Long.parseLong(text);
            } catch (NumberFormatException exception) {
                return null;
            }
        }
        return null;
    }

    private static final class JwtPayload {

        private final Long adminId;
        private final Long expiresAt;

        private JwtPayload(Long adminId, Long expiresAt) {
            this.adminId = adminId;
            this.expiresAt = expiresAt;
        }

        private Long getAdminId() {
            return adminId;
        }

        private Long getExpiresAt() {
            return expiresAt;
        }
    }
}
