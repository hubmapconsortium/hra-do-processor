#!/bin/bash
set -ev

OUT=er-diagrams.md

echo "# HRA DO Processor Diagrams" > $OUT

for genSchemaFile in `ls schemas/generated/linkml/*.yaml | grep -v 'metadata'` schemas/generated/linkml/basic-metadata.yaml; do
  type=$(basename ${genSchemaFile%.yaml})
  echo "## $type" >> $OUT

  echo "" >> $OUT
  gen-erdiagram $genSchemaFile >> $OUT
  echo "" >> $OUT
done
