package com.showszn.backend.user;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MeController {

    private final UserSyncService userSyncService;

    public MeController(UserSyncService userSyncService) {
        this.userSyncService = userSyncService;
    }

    @GetMapping("/api/me")
    public AppUserResponse me(JwtAuthenticationToken authentication) {
        Jwt jwt = authentication.getToken();
        AppUser user = userSyncService.syncFromJwt(jwt);
        return new AppUserResponse(user.getId(), user.getClerkUserId(), user.getEmail(), user.getName(), user.isAdmin());
    }

    public record AppUserResponse(Long id, String clerkUserId, String email, String name, boolean isAdmin) {}
}
