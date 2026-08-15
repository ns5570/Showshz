package com.showszn.backend.contact.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @Size(max = 100) String name,
        @Email @Size(max = 200) String email,
        @NotBlank @Size(max = 2000) String message) {}
