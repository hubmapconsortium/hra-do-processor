#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# Base paths

DIR="${0%/*}"
ROOT_DIR="$DIR/.."

# Parse arguments

ENV=${1:-.venv}
if [[ ! "$ENV" = /* ]]; then ENV="$ROOT_DIR/$ENV"; fi

if [ ! -e "$ENV/bin/activate" ]; then
    python3 -m venv $ENV
fi

# Install dependencies
if [ -e "$ENV/bin/activate" ]; then
    set +u # Disable in case we are running old venv versions that can't handle strict mode
    source "$ENV/bin/activate"
    set -u

    # Install python deps
    python -m pip install -r "$ROOT_DIR/requirements.txt"
    python -m pip install "cwltool"

    # Install Robot
    if [ ! -e "$ENV/bin/robot" ]; then
        curl https://raw.githubusercontent.com/ontodev/robot/master/bin/robot -o $ENV/bin/robot
        chmod +x $ENV/bin/robot
        curl -L https://github.com/ontodev/robot/releases/download/v1.9.3/robot.jar -o $ENV/bin/robot.jar
    fi

    # Install node (latest LTS version)
    if [ ! -e "$ENV/bin/node" ]; then
        nodeenv --python-virtualenv --node lts
    fi

    npm ci
    npm install -g .
    npm install -g ttl-merge
fi

if [ -e "$ENV/bin/activate" ]; then
    set +u # Just to be on the safe side
    deactivate
    set -u
fi
