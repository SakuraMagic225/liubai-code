FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /workspace
COPY backend ./backend
RUN mvn -s backend/.mvn/maven-settings.xml -f backend/pom.xml package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /app
ENV TZ=Asia/Shanghai
COPY --from=builder /workspace/backend/web/target/web-0.1.0-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
