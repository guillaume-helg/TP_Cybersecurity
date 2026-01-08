# Stage 1: Build the Maven modules
FROM maven:3.6.3-jdk-8 AS builder

# Set working directory
WORKDIR /build

# Copy the parent pom.xml
COPY pom.xml .

# Copy all module directories with their pom.xml and source code
COPY magic-link/pom.xml magic-link/pom.xml
COPY magic-link/src magic-link/src

COPY themes/pom.xml themes/pom.xml
COPY themes/src themes/src

COPY token-validation/pom.xml token-validation/pom.xml
COPY token-validation/src token-validation/src

# Build all modules
RUN mvn clean package -DskipTests

# Stage 2: Create the Keycloak runtime image
FROM quay.io/keycloak/keycloak:9.0.2

# Copy the built JARs from the builder stage
COPY --from=builder /build/magic-link/target/magic-link.jar /opt/jboss/keycloak/standalone/deployments/
RUN touch /opt/jboss/keycloak/standalone/deployments/magic-link.jar.dodeploy

COPY --from=builder /build/themes/target/hyrule-theme.jar /opt/jboss/keycloak/standalone/deployments/
RUN touch /opt/jboss/keycloak/standalone/deployments/themes.jar.dodeploy

COPY --from=builder /build/token-validation/target/token-validation.jar /opt/jboss/keycloak/standalone/deployments/
RUN touch /opt/jboss/keycloak/standalone/deployments/token-validation.jar.dodeploy
