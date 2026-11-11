# Multi-stage Dockerfile for CampusFlow Backend
# Stage 1: Build
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copy Maven wrapper / files
COPY .mvn/ .mvn/
COPY pom.xml .
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and build production jar
COPY src src
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Security: Create non-root system user
RUN groupadd -r campusflow && useradd -r -g campusflow -m campusflow
USER campusflow

# Copy built artifact from builder stage
COPY --from=build /app/target/campusflow-backend-*.jar app.jar

# Expose HTTP port
EXPOSE 8081

# Configure JVM flags for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

