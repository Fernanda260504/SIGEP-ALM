# Dockerfile
FROM openjdk:17-jdk-slim

# Carpeta de trabajo
WORKDIR /app

# Copiar el jar
COPY target/sigepalm-0.0.1-SNAPSHOT.jar app.jar

# Exponer puerto
EXPOSE 8080

# Ejecutar
ENTRYPOINT ["java","-jar","app.jar"]