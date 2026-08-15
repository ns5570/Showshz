package com.showszn.backend.cache;

import com.showszn.backend.catalog.dto.CityResponse;
import com.showszn.backend.catalog.dto.MovieSummaryResponse;
import com.showszn.backend.event.dto.EventSummaryResponse;
import java.time.Duration;
import java.util.List;
import org.springframework.boot.cache.autoconfigure.RedisCacheManagerBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.JacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;
import tools.jackson.databind.JavaType;
import tools.jackson.databind.json.JsonMapper;

@Configuration
public class CacheConfig {

    @Bean
    public RedisCacheManagerBuilderCustomizer cacheManagerBuilderCustomizer() {
        JsonMapper jsonMapper = JsonMapper.builder().build();

        JavaType citiesType = jsonMapper.getTypeFactory().constructCollectionType(List.class, CityResponse.class);
        JavaType moviesByCityType =
                jsonMapper.getTypeFactory().constructCollectionType(List.class, MovieSummaryResponse.class);
        JavaType eventsByCityType =
                jsonMapper.getTypeFactory().constructCollectionType(List.class, EventSummaryResponse.class);

        return builder -> builder
                .withCacheConfiguration("cities", typedConfig(citiesType))
                .withCacheConfiguration("moviesByCity", typedConfig(moviesByCityType))
                .withCacheConfiguration("eventsByCity", typedConfig(eventsByCityType));
    }

    private RedisCacheConfiguration typedConfig(JavaType javaType) {
        RedisSerializer<Object> serializer = new JacksonJsonRedisSerializer<>(javaType);
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(5))
                .disableCachingNullValues()
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));
    }
}
