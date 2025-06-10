FROM openjdk:17-jdk-slim AS build
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
COPY src/ ./src/
RUN ./mvnw clean install -DskipTests

FROM eclipse-temurin:17-jre-jammy 
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
