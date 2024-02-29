FROM postgres:latest

ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ENV POSTGRES_USER $DB_USER
ENV POSTGRES_PASSWORD $DB_PASSWORD
ENV POSTGRES_DB $DB_NAME

EXPOSE 5432

VOLUME ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

CMD ["postgres"]
