# Etapa 1: Compilar en la arquitectura nativa de la máquina que construye
FROM --platform=$BUILDPLATFORM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /workspace

COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle settings.gradle ./
RUN chmod +x gradlew

COPY src src

RUN ./gradlew clean bootJar -x test --no-daemon \
    && JAR_FILE="$(find build/libs -maxdepth 1 -type f -name '*.jar' ! -name '*-plain.jar' | head -n 1)" \
    && test -n "$JAR_FILE" \
    && cp "$JAR_FILE" /tmp/app.jar

# Etapa 2: Imagen final para la plataforma de destino (amd64 en Northflank, arm64 en tu M4)
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

RUN groupadd -r app && useradd -r -g app app

COPY --from=build --chown=app:app /tmp/app.jar /app/app.jar

USER app

EXPOSE 8080

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=60", "-XX:+UseSerialGC", "-XX:TieredStopAtLevel=1", "-Xss256k", "-XX:MaxMetaspaceSize=128m", "-jar", "/app/app.jar"]