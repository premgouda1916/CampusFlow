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
                    if (clean.contains(".")) {
                        String[] parts = clean.split("\\.", 2);
                        if (parts[0].equalsIgnoreCase(parts[1])) {
                            clean = parts[0] + ".root";
                            log.warn("TiDB Cloud user had duplicate prefix '{}'. Corrected to '{}'", username, clean);
                        }
                    } else {
                        if (clean.equalsIgnoreCase("root") || clean.equalsIgnoreCase("admin")) {
                            clean = DEFAULT_TIDB_PREFIX + "." + clean;
                            log.warn("TiDB Cloud user missing prefix. Prepending '{}' -> '{}'", DEFAULT_TIDB_PREFIX, clean);
                        } else {
                            // User provided only the cluster prefix (e.g. 'wBUbPksgrCdv4vP')
                            clean = clean + ".root";
                            log.warn("TiDB Cloud user provided cluster prefix only. Appending '.root' -> '{}'", clean);
                        }
                    }
                }
                hikari.setUsername(clean);
                log.info("DataSourceSanitizer: Configured database user '{}'", clean);
            }
        }
        return bean;
    }
}
