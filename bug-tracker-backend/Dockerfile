
FROM openjdk:21-jdk-slim AS build 
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline
COPY src/ ./src/
RUN ./mvnw clean install -DskipTests


FROM eclipse-temurin:21-jre-jammy 
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
