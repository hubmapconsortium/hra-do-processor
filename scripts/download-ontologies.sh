#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

OBO_BASE_URL="http://purl.obolibrary.org/obo"

DIR="${0%/*}"
ROOT_DIR="$DIR/.."
MIRROR_DIR="$ROOT_DIR/mirrors"

# Download the latest UBERON ontology
curl -L "$OBO_BASE_URL/uberon/uberon-base.owl" \
     --create-dirs -o "$MIRROR_DIR/uberon.owl" \
     --retry 4 \
     --max-time 200 && \
robot convert -i "$MIRROR_DIR/uberon.owl" \
     --format ttl \
     -o "$MIRROR_DIR/uberon.ttl" && \
rm -rf "$MIRROR_DIR/uberon.owl"

# Download the latest CL ontology
curl -L "$OBO_BASE_URL/cl/cl-base.owl" \
     --create-dirs -o "$MIRROR_DIR/cl.owl" \
     --retry 4 \
     --max-time 200 && \
robot convert -i "$MIRROR_DIR/cl.owl" \
     --format ttl \
     -o "$MIRROR_DIR/cl.ttl" && \
rm -rf "$MIRROR_DIR/cl.owl"

# Download the latest HGNC ontology
curl -L "https://github.com/musen-lab/hgnc2owl/raw/main/hgnc.owl.gz" \
     --create-dirs -o "$MIRROR_DIR/hgnc.owl.gz" \
     --retry 4 \
     --max-time 200 && \
gunzip -f "$MIRROR_DIR/hgnc.owl.gz" && \
robot convert -i "$MIRROR_DIR/hgnc.owl" \
     --format ttl \
     -o "$MIRROR_DIR/hgnc.ttl" && \
rm -rf "$MIRROR_DIR/hgnc.owl" 
