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

# Detect OS, from https://stackoverflow.com/a/3466183
unameOut="$(uname -s)"
case "${unameOut}" in
  Linux*)     machine=Linux;;
  Darwin*)    machine=Mac;;
  CYGWIN*)    machine=Cygwin;;
  MINGW*)     machine=MinGw;;
  *)          machine="UNKNOWN:${unameOut}"
esac

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

  # Intall Relation-Graph
  if [ ! -e "$ENV/opt/relation-graph" ]; then
    mkdir -p $ENV/opt
    RG=2.3.1
    wget -nv https://github.com/INCATools/relation-graph/releases/download/v$RG/relation-graph-cli-$RG.tgz \
      && tar -zxvf relation-graph-cli-$RG.tgz \
      && mv relation-graph-cli-$RG $ENV/opt/relation-graph;
    ln -s ../opt/relation-graph/bin/relation-graph $ENV/bin/relation-graph
    rm -f relation-graph-cli-$RG.tgz
  fi

  # Install Blazegraph Runner
  if [ ! -e "$ENV/opt/blazegraph-runner" ]; then
    mkdir -p $ENV/opt
    BR=1.7
    wget -nv https://github.com/balhoff/blazegraph-runner/releases/download/v$BR/blazegraph-runner-$BR.tgz \
      && tar -zxvf blazegraph-runner-$BR.tgz \
      && mv blazegraph-runner-$BR $ENV/opt/blazegraph-runner;
    ln -s ../opt/blazegraph-runner/bin/blazegraph-runner $ENV/bin/blazegraph-runner
    rm -f blazegraph-runner-$BR.tgz
  fi

  # Install OWL CLI (for pretty turtle)
  if [ ! -e "$ENV/bin/owl-cli" ]; then
    if [ $machine == "Mac" ]; then
      wget -nv https://github.com/atextor/owl-cli/releases/download/snapshot/owl-x86_64-apple-darwin-snapshot -O $ENV/bin/owl-cli
    else
      wget -nv https://github.com/atextor/owl-cli/releases/download/snapshot/owl-x86_64-linux-snapshot -O $ENV/bin/owl-cli
    fi
    chmod +x $ENV/bin/owl-cli
  fi

  # Install node (latest LTS version)
  if [ ! -e "$ENV/bin/node" ]; then
    nodeenv --python-virtualenv --node lts
  fi

  # Install node deps
  npm ci
  npm install -g ${ROOT_DIR}

  # Download ontologies
  ${ROOT_DIR}/scripts/download-ontologies.sh

  # Setup schemas
  ${ROOT_DIR}/scripts/setup-schemas.sh
fi

if [ -e "$ENV/bin/activate" ]; then
  set +u # Just to be on the safe side
  deactivate
  set -u
fi
