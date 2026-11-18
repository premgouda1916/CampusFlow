# Multi-stage Dockerfile for CampusFlow Backend
# Stage 1: Build
FROM maven:3.9.9-eclipse-temurin-21-jammy AS build
WORKDIR /app

# Copy Maven descriptor and fetch dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build production jar
COPY src src
RUN mvn clean package -DskipTests -B

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

# Configure JVM flags for containers (optimized for 512MB free cloud tiers like Render/Koyeb)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=60.0 -XX:+UseSerialGC -Xss512k -XX:CICompilerCount=2"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
