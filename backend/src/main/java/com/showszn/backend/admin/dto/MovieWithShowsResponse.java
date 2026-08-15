package com.showszn.backend.admin.dto;

import com.showszn.backend.catalog.dto.MovieDetailResponse;
import java.util.List;

public record MovieWithShowsResponse(MovieDetailResponse movie, List<ShowAdminResponse> shows) {}
