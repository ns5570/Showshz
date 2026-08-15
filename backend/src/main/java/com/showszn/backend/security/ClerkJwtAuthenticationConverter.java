package com.showszn.backend.security;

import com.showszn.backend.user.AppUser;
import com.showszn.backend.user.AppUserRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class ClerkJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final AppUserRepository appUserRepository;

    public ClerkJwtAuthenticationConverter(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        appUserRepository.findByClerkUserId(jwt.getSubject())
                .filter(AppUser::isAdmin)
                .ifPresent(user -> authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN")));

        return new JwtAuthenticationToken(jwt, authorities);
    }
}
