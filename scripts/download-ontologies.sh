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
     --format owl \
     -o "$MIRROR_DIR/uberon.owl"

# Download the latest FMA ontology
curl -L "http://sig.biostr.washington.edu/share/downloads/fma/release/latest/fma.zip" \
     --create-dirs -o "$MIRROR_DIR/fma.zip" \
     --retry 4 \
     --max-time 200 && \
unzip $MIRROR_DIR/fma.zip -x license.txt pun_fma.owl README.txt -d $MIRROR_DIR && \
robot convert -i "$MIRROR_DIR/fma.owl" \
     --format owl \
     -o "$MIRROR_DIR/fma.owl"
rm -rf $MIRROR_DIR/fma.zip

# Download the latest CL ontology
curl -L "$OBO_BASE_URL/cl/cl-base.owl" \
     --create-dirs -o "$MIRROR_DIR/cl.owl" \
     --retry 4 \
     --max-time 200 && \
robot convert -i "$MIRROR_DIR/cl.owl" \
     --format owl \
     -o "$MIRROR_DIR/cl.owl"

# Download the latest HGNC ontology
curl -L "https://github.com/musen-lab/hgnc2owl/raw/main/hgnc.owl.gz" \
     --create-dirs -o "$MIRROR_DIR/hgnc.owl.gz" \
     --retry 4 \
     --max-time 200 && \
gunzip -f "$MIRROR_DIR/hgnc.owl.gz" && \
robot convert -i "$MIRROR_DIR/hgnc.owl" \
     --format owl \
     -o "$MIRROR_DIR/hgnc.owl"

# Download the latest RO ontology
curl -L "$OBO_BASE_URL/ro/ro.owl" \
     --create-dirs -o "$MIRROR_DIR/ro.owl" \
     --retry 4 \
     --max-time 200 && \
robot convert -i "$MIRROR_DIR/ro.owl" \
     --format owl \
     -o "$MIRROR_DIR/ro.owl"
