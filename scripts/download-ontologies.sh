#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

OBO_BASE_URL="http://purl.obolibrary.org/obo"

DIR="${0%/*}"
ROOT_DIR="$DIR/.."
MIRROR_DIR="$ROOT_DIR/mirrors"

echo "Cleaning directory..."
rm -rf $MIRROR_DIR/*.*

echo "Downloading the latest UBERON ontology..."
curl -L "$OBO_BASE_URL/uberon/uberon-base.owl" \
     --create-dirs -o "$MIRROR_DIR/uberon.owl" \
     --retry 4 \
     --max-time 200 && \
robot convert -i "$MIRROR_DIR/uberon.owl" \
     --format owl \
     -o "$MIRROR_DIR/uberon.owl"

echo "Downloading the latest FMA ontology..."
curl -L "http://sig.biostr.washington.edu/share/downloads/fma/release/latest/fma.zip" \
     --create-dirs -o "$MIRROR_DIR/fma.zip" \
     --retry 4 \
     --max-time 200 && \
unzip $MIRROR_DIR/fma.zip -x license.txt pun_fma.owl README.txt -d $MIRROR_DIR && \
robot convert -i "$MIRROR_DIR/fma.owl" \
     --format owl \
     -o "$MIRROR_DIR/fma.owl"
rm -rf $MIRROR_DIR/fma.zip

echo "Downloading the latest CL ontology..."
curl -L "$OBO_BASE_URL/cl/cl-base.owl" \
     --create-dirs -o "$MIRROR_DIR/cl.owl" \
     --retry 4 \
     --max-time 200 && \
robot convert -i "$MIRROR_DIR/cl.owl" \
     --format owl \
     -o "$MIRROR_DIR/cl.owl"

echo "Downloading the latest PCL ontology..."
curl -L "$OBO_BASE_URL/pcl/pcl-base.owl" \
     --create-dirs -o "$MIRROR_DIR/pcl.owl" \
     --retry 4 \
     --max-time 200 && \
robot convert -i "$MIRROR_DIR/pcl.owl" \
     --format owl \
     -o "$MIRROR_DIR/pcl.owl"

echo "Downloading the latest LHMA ontology..."
curl -L "https://www.lungmap.net/assets/Uploads/ontology/558488ae7f/LMHA_20190512_Cell.zip" \
     --create-dirs -o "$MIRROR_DIR/lmha.zip" \
     --retry 4 \
     --max-time 200 && \
unzip -o "$MIRROR_DIR/lmha.zip" -d $MIRROR_DIR && \
mv "$MIRROR_DIR/LMHA_20190512_Cell.owl" "$MIRROR_DIR/lmha.owl" && \
robot convert -i "$MIRROR_DIR/lmha.owl" \
     --format owl \
     -o "$MIRROR_DIR/lmha.owl" && \
rm -rf "$MIRROR_DIR/lmha.zip"

echo "Downloading the latest HGNC ontology..."
curl -L "https://github.com/musen-lab/hgnc2owl/raw/main/hgnc.owl.gz" \
     --create-dirs -o "$MIRROR_DIR/hgnc.owl.gz" \
     --retry 4 \
     --max-time 200 && \
gunzip -f "$MIRROR_DIR/hgnc.owl.gz" && \
robot convert -i "$MIRROR_DIR/hgnc.owl" \
     --format owl \
     -o "$MIRROR_DIR/hgnc.owl"

echo "Downloading the latest RO ontology..."
curl -L "$OBO_BASE_URL/ro/ro-base.owl" \
     --create-dirs -o "$MIRROR_DIR/ro.owl" \
     --retry 4 \
     --max-time 200 && \
robot convert -i "$MIRROR_DIR/ro.owl" \
     --format owl \
     -o "$MIRROR_DIR/ro.owl"
