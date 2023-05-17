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

COPY scripts scripts
COPY schemas schemas
COPY requirements.txt package.json package-lock.json /build/

RUN ./scripts/setup-environment.sh /venv

ENV PATH="/venv/bin:$PATH"

COPY . .

RUN npm install -g .

WORKDIR /

ENTRYPOINT [ "/venv/bin/do-processor" ]
