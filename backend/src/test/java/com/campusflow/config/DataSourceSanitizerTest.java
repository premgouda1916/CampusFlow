package com.campusflow.config;

import com.zaxxer.hikari.HikariDataSource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DataSourceSanitizerTest {

    private DataSourceSanitizer sanitizer;

    @BeforeEach
    void setUp() {
        sanitizer = new DataSourceSanitizer();
    }

    @Test
    void testPrefixPassedAsUsername() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test");
        ds.setUsername("wBUbPksgrCdv4vP");

        sanitizer.postProcessBeforeInitialization(ds, "dataSource");

        assertEquals("wBUbPksgrCdv4vP.root", ds.getUsername());
    }

    @Test
    void testRootPassedWithoutPrefix() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test");
        ds.setUsername("root");

        sanitizer.postProcessBeforeInitialization(ds, "dataSource");

        assertEquals("wBUbPksgrCdv4vP.root", ds.getUsername());
    }

    @Test
    void testFullUsernamePassed() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test");
        ds.setUsername("wBUbPksgrCdv4vP.root");

        sanitizer.postProcessBeforeInitialization(ds, "dataSource");

        assertEquals("wBUbPksgrCdv4vP.root", ds.getUsername());
    }

    @Test
    void testDuplicatePrefixCorrected() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test");
        ds.setUsername("wBUbPksgrCdv4vP.wBUbPksgrCdv4vP");

        sanitizer.postProcessBeforeInitialization(ds, "dataSource");

        assertEquals("wBUbPksgrCdv4vP.root", ds.getUsername());
    }

    @Test
    void testQuotesTrimmed() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("\"jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test\"");
        ds.setUsername("\"wBUbPksgrCdv4vP\"");
        ds.setPassword("'secret123'");

        sanitizer.postProcessBeforeInitialization(ds, "dataSource");

        assertEquals("jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test", ds.getJdbcUrl());
        assertEquals("wBUbPksgrCdv4vP.root", ds.getUsername());
        assertEquals("secret123", ds.getPassword());
    }

    @Test
    void testNonTidbUrlUntouched() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:mysql://localhost:3306/campusflow");
        ds.setUsername("myuser");

        sanitizer.postProcessBeforeInitialization(ds, "dataSource");

        assertEquals("myuser", ds.getUsername());
    }
}
