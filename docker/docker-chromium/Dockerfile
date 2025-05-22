FROM ghcr.io/linuxserver/baseimage-kasmvnc:debianbookworm

# set version label
ARG BUILD_DATE
ARG VERSION
LABEL build_version="Linuxserver.io version:- ${VERSION} Build-date:- ${BUILD_DATE}"
LABEL maintainer="thelamer"

# title
ENV TITLE=Chromium

# RUN \
#   echo "**** add icon ****" && \
#   curl -o \
#     /kclient/public/icon.png \
#     https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/chromium-logo.png && \
#   echo "**** install packages ****" && \
#   apt-get update && \
#   apt-get install -y --no-install-recommends \
#     chromium \
#     chromium-l10n && \
#   echo "**** cleanup ****" && \
#   apt-get autoclean && \
#   rm -rf \
#     /config/.cache \
#     /var/lib/apt/lists/* \
#     /var/tmp/* \
#     /tmp/*

# # add local files
# COPY /root /

# # replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update
RUN apt-get install -qqy wget git curl

# Download and install Node.js (you may need to restart the terminal)
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
RUN source ~/.nvm/nvm.sh \
  && nvm install 20 \
  && nvm alias default 20 \
  && nvm use default \
  && npm install -g yarn
  # && npm config set registry https://registry.npmmirror.com/ \

# Install Chrome
RUN cd /tmp && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb 
RUN cd /tmp && apt-get install -qqy ./google-chrome-stable_current_amd64.deb 
RUN rm -f /tmp/google-chrome-stable_current_amd64.deb

RUN npm i -g yarn

# Set up the working directory
WORKDIR /app


# ports and volumes
EXPOSE 3000

VOLUME /config
