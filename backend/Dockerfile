# Multi-stage Dockerfile for CampusFlow Backend
# Stage 1: Build with official Maven image (Java 21)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build production jar
COPY src src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Security: Create non-root system user and prepare uploads directory
RUN groupadd -r campusflow && useradd -r -g campusflow -m campusflow
RUN mkdir -p /app/uploads/resumes && chown -R campusflow:campusflow /app

USER campusflow

# Copy built artifact from builder stage
COPY --from=build /app/target/campusflow-backend-*.jar app.jar

# Expose HTTP port
EXPOSE 8080

# Configure JVM flags for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

