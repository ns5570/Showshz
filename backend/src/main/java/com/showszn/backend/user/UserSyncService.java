package com.showszn.backend.user;

import java.time.Instant;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class UserSyncService {

    private final AppUserRepository appUserRepository;
    private final Set<String> bootstrapAdminEmails;

    public UserSyncService(
            AppUserRepository appUserRepository,
            @Value("${app.admin-emails:}") String adminEmailsCsv) {
        this.appUserRepository = appUserRepository;
        this.bootstrapAdminEmails = Arrays.stream(StringUtils.commaDelimitedListToStringArray(adminEmailsCsv))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }

    @Transactional
    public AppUser syncFromJwt(Jwt jwt) {
        String clerkUserId = jwt.getSubject();
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");

        return appUserRepository.findByClerkUserId(clerkUserId)
                .map(existing -> updateIfChanged(existing, email, name))
                .orElseGet(() -> createUser(clerkUserId, email, name));
    }

    private boolean isBootstrapAdmin(String email) {
        return email != null && bootstrapAdminEmails.contains(email.toLowerCase());
    }

    private AppUser updateIfChanged(AppUser user, String email, String name) {
        boolean changed = false;
        if (email != null && !email.equals(user.getEmail())) {
            user.setEmail(email);
            changed = true;
        }
        if (name != null && !name.equals(user.getName())) {
            user.setName(name);
            changed = true;
        }
        if (!user.isAdmin() && isBootstrapAdmin(email)) {
            user.setAdmin(true);
            changed = true;
        }
        return changed ? appUserRepository.save(user) : user;
    }

    private AppUser createUser(String clerkUserId, String email, String name) {
        try {
            AppUser newUser = AppUser.builder()
                    .clerkUserId(clerkUserId)
                    .email(email)
                    .name(name)
                    .admin(isBootstrapAdmin(email))
                    .createdAt(Instant.now())
                    .build();
            return appUserRepository.save(newUser);
        } catch (DataIntegrityViolationException raceLostToConcurrentRequest) {
            return appUserRepository.findByClerkUserId(clerkUserId)
                    .orElseThrow(() -> raceLostToConcurrentRequest);
        }
    }
}
