FROM ubuntu:22.04
WORKDIR /build

# Install base tools from Ubuntu.
RUN apt-get update && \
  DEBIAN_FRONTEND="noninteractive" apt-get install -y --no-install-recommends \
    git \
    openjdk-11-jre-headless \
    python3-pip \
    python-is-python3 \
    python3-six \
    python3-dev \
    python3-venv \
    make \
    unzip \
    wget \
    curl

# Dependencies for running mermaid cli headless
RUN DEBIAN_FRONTEND="noninteractive" apt-get install -y --no-install-recommends \
  gconf-service libasound2 libatk1.0-0 libc6 libcairo2 \
  libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libgconf-2-4 \
  libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
  libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
  libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
  libxss1 libxtst6 ca-certificates fonts-liberation libnss3 lsb-release xdg-utils

COPY scripts scripts
COPY schemas schemas
COPY src requirements.txt requirements-freeze.txt package.json package-lock.json puppeteer-config.json /build/

RUN ./scripts/setup-environment.sh /venv

ENV PATH="/venv/bin:$PATH"

COPY . .

RUN npm install -g .

WORKDIR /

ENTRYPOINT [ "/venv/bin/do-processor" ]
