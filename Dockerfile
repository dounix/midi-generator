FROM alpine:latest
WORKDIR /midi
ADD https://github.com/ammilam/midi-generator/releases/download/latest/midi-generator-alpine-x64 /midi/midi-generator
RUN chmod +x midi-generator
ENTRYPOINT ["./midi-generator" ]
