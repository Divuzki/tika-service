FROM eclipse-temurin:17-jre-jammy

# Set Tika version
ENV TIKA_VERSION=3.1.0

# Install wget
RUN apt-get update && \
    apt-get install -y wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Download Tika server jar
RUN wget -O /tika-server.jar https://dlcdn.apache.org/tika/${TIKA_VERSION}/tika-server-standard-${TIKA_VERSION}.jar

# Create a non-root user to run Tika
RUN groupadd -r tika && useradd --no-log-init -r -g tika tika
RUN mkdir -p /opt/tika/logs && chown -R tika:tika /opt/tika

# Set working directory
WORKDIR /opt/tika

# Switch to non-root user
USER tika

# Expose the port Tika will run on
EXPOSE 9998

# Set memory limits for Java
ENV JAVA_OPTS="-Xmx512m -Dorg.eclipse.jetty.server.Request.maxFormKeys=1000"

# Command to run Tika server
CMD java $JAVA_OPTS -jar /tika-server.jar -h 0.0.0.0 -p 9998