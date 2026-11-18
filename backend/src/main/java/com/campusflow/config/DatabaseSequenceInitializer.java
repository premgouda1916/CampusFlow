package com.campusflow.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.sql.Connection;

@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class DatabaseSequenceInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try (Connection conn = jdbcTemplate.getDataSource().getConnection()) {
            String dbProductName = conn.getMetaData().getDatabaseProductName().toLowerCase();
            log.info("DatabaseSequenceInitializer: Detected database engine '{}'", dbProductName);

            String[] tables = {
                "users", "students", "recruiters", "companies", "departments",
                "placement_drives", "jobs", "applications", "interviews", "placement_offers"
            };

            for (String table : tables) {
                try {
                    Long maxId = jdbcTemplate.queryForObject("SELECT COALESCE(MAX(id), 0) FROM " + table, Long.class);
                    long nextId = (maxId != null && maxId > 0) ? maxId + 50 : 100;

                    if (dbProductName.contains("h2")) {
                        jdbcTemplate.execute("ALTER TABLE " + table + " ALTER COLUMN id RESTART WITH " + nextId);
                    } else {
                        jdbcTemplate.execute("ALTER TABLE " + table + " AUTO_INCREMENT = " + nextId);
                    }
                    log.debug("Aligned auto-increment for table '{}' to {}", table, nextId);
                } catch (Exception e) {
                    log.debug("Auto-increment alignment skipped for table '{}': {}", table, e.getMessage());
                }
            }
            log.info("Database auto-increment sequences successfully aligned past seed IDs.");
        } catch (Exception e) {
            log.warn("DatabaseSequenceInitializer skipped or failed: {}", e.getMessage());
        }
    }
}
