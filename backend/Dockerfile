FROM openjdk:17
WORKDIR /app
COPY . .
RUN ./mvnw package
EXPOSE 8080
CMD ["java", "-jar", "target/backend-1.0-SNAPSHOT.jar"]
