# Use official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Accept the GitHub token as a build argument
ARG GITHUB_TOKEN

# Store the GitHub token in an environment variable
ENV GITHUB_TOKEN=${GITHUB_TOKEN}

# Copy the jar file to the container
COPY target/tibco-props-compare-0.0.1-SNAPSHOT.jar /app/tibco-props-compare-0.0.1-SNAPSHOT.jar
COPY src/main/resources/static /app/static
COPY src/main/resources/repository.xsd /app/src/main/resources/

# Expose the application port
EXPOSE 8080

# Volume for git repositories
VOLUME /app/git

# Run the application
ENTRYPOINT ["java", "-jar", "/app/tibco-props-compare-0.0.1-SNAPSHOT.jar"]