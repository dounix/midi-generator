FROM alpine:latest
RUN /bin/sh -c "apk add --no-cache bash git wget"
RUN exec /bin/bash
RUN wget https://github.com/ammilam/generate-midi/releases/download/latest/generate-midi-alpine-x64
RUN mv generate-midi-alpine-x64 generate-midi
RUN chmod +x generate-midi
ENTRYPOINT ["./generate-midi" ]