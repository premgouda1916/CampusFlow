package com.campusflow.config;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DataSourceSanitizer implements BeanPostProcessor {

    private static final String DEFAULT_TIDB_PREFIX = "wBUbPksgrCdv4vP";

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof HikariDataSource hikari) {
            String url = hikari.getJdbcUrl();
            String username = hikari.getUsername();
            String password = hikari.getPassword();

            if (url != null) {
                hikari.setJdbcUrl(url.trim().replaceAll("^[\"']|[\"']$", ""));
            }

            if (password != null) {
                hikari.setPassword(password.trim().replaceAll("^[\"']|[\"']$", ""));
            }

            if (username != null) {
                String clean = username.trim().replaceAll("^[\"']|[\"']$", "");
                if (hikari.getJdbcUrl() != null && hikari.getJdbcUrl().contains("tidbcloud.com")) {
                    if (!clean.contains(".")) {
                        log.warn("TiDB Cloud Serverless requires user prefix. Auto-prepending '{}' to user '{}'", DEFAULT_TIDB_PREFIX, clean);
                        clean = DEFAULT_TIDB_PREFIX + "." + clean;
                    }
                }
                hikari.setUsername(clean);
                log.info("DataSourceSanitizer: Configured database user '{}'", clean);
            }
        }
        return bean;
    }
}
