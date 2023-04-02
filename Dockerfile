FROM alpine:latest
RUN /bin/sh -c "apk add --no-cache bash git wget"
RUN exec /bin/bash
RUN wget https://github.com/ammilam/midi-generator/releases/download/latest/midi-generator-alpine-x64
RUN mv midi-generator-alpine-x64 midi-generator
RUN chmod +x midi-generator
ENTRYPOINT ["./midi-generator" ]