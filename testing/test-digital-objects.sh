#!/usr/bin/env bash
set -euo pipefail

# ------------------------------------------------------------
# Usage:
#   ./run_do_pipeline.sh [DO_PATH] [--base-iri URL] [--processor-home DIR] [--raw-file FILE] [--python PY]
#
# Defaults:
#   DO_PATH           = ./digital-objects/asct-b/mouth/v1.0
#   --base-iri        = https://purl.humanatlas.io
#   --processor-home  = "$(pwd)"
#   --raw-file        = auto-detected: first CSV in "$DO_PATH/raw/*.csv"
#   --python          = python (from current shell/venv)
#
# Steps:
#   1) do-processor normalize
#   2) do-processor enrich
#   3) do-processor build
#   4) do-processor reconstruct
#   5) python compare_and_mismatched_reason.py --raw --recon --normalized --warnings
# ------------------------------------------------------------
source /Users/aishwarya/CNS-Code/hra-do-processor/.venv/bin/activate
DO_PATH="${1:-/Users/aishwarya/CNS-Code/hra/hra-do-processor/digital-objects/asct-b/blood-pelvis/v1.4}"
shift || true

BASE_IRI="https://purl.humanatlas.io"
PROCESSOR_HOME="$(pwd)"
RAW_FILE=""
PYTHON_BIN="python"

# Parse optional flags
while [[ $# -gt 0 ]]; do
  case "$1" in
    --base-iri)
      BASE_IRI="${2:?need value for --base-iri}"; shift 2;;
    --processor-home)
      PROCESSOR_HOME="${2:?need value for --processor-home}"; shift 2;;
    --raw-file)
      RAW_FILE="${2:?need value for --raw-file}"; shift 2;;
    --python)
      PYTHON_BIN="${2:?need value for --python}"; shift 2;;
    -h|--help)
      echo "Usage: $0 [DO_PATH] [--base-iri URL] [--processor-home DIR] [--raw-file FILE] [--python PY]"
      exit 0;;
    *)
      echo "Unknown option: $1" >&2; exit 1;;
  esac
done

# Resolve important paths
RAW_DIR="${DO_PATH%/}/raw"
NORM_DIR="${DO_PATH%/}/normalized"
ENRICH_DIR="${DO_PATH%/}/enriched"
RECON_DIR="${DO_PATH%/}/reconstructed"

NORM_META_YAML="${NORM_DIR}/normalized-metadata.yaml"
NORM_MAIN_YAML="${NORM_DIR}/normalized.yaml"
WARNINGS_YAML="${NORM_DIR}/warnings.yaml"
RECON_CSV="${RECON_DIR}/reconstructed.csv"

# Pick a raw CSV if not provided: the first CSV in raw/
if [[ -z "${RAW_FILE}" ]]; then
  shopt -s nullglob
  RAW_CANDIDATES=("${RAW_DIR}"/*.csv)
  shopt -u nullglob
  if [[ ${#RAW_CANDIDATES[@]} -eq 0 ]]; then
    echo "ERROR: Could not auto-detect a raw CSV in ${RAW_DIR}. Use --raw-file to specify it." >&2
    exit 1
  fi
  RAW_FILE="${RAW_CANDIDATES[0]}"
fi

echo "==> DO_PATH          : ${DO_PATH}"
echo "==> BASE_IRI         : ${BASE_IRI}"
echo "==> PROCESSOR_HOME   : ${PROCESSOR_HOME}"
echo "==> RAW_FILE         : ${RAW_FILE}"
echo "==> PYTHON_BIN       : ${PYTHON_BIN}"
echo

# 1) Normalize
echo ">>> NORMALIZE"
do-processor normalize "${DO_PATH}" \
  --base-iri "${BASE_IRI}" \
  --exclude-bad-values \
  --processor-home "${PROCESSOR_HOME}"

# sanity: normalized artifacts
if [[ ! -f "${NORM_META_YAML}" && ! -f "${NORM_MAIN_YAML}" ]]; then
  echo "ERROR: normalize did not create ${NORM_META_YAML} or ${NORM_MAIN_YAML}" >&2
  exit 1
fi

# 2) Enrich
echo ">>> ENRICH"
do-processor enrich "${DO_PATH}" \
  --base-iri "${BASE_IRI}" \
  --exclude-bad-values \
  --processor-home "${PROCESSOR_HOME}"

# 3) Build (this may regenerate deployables)
echo ">>> BUILD"
do-processor build "${DO_PATH}" \
  --base-iri "${BASE_IRI}" \
  --exclude-bad-values \
  --processor-home "${PROCESSOR_HOME}"

# 4) Reconstruct
echo ">>> RECONSTRUCT"
do-processor reconstruct "${DO_PATH}" \
  --processor-home "${PROCESSOR_HOME}"

# sanity: reconstructed CSV
if [[ ! -f "${RECON_CSV}" ]]; then
  echo "ERROR: reconstruct did not create ${RECON_CSV}" >&2
  exit 1
fi

# 5) Compare & mismatched reason script
#    Uses: --raw, --recon, --normalized, --warnings
#    normalized: prefer normalized.yaml if present, else normalized-metadata.yaml
NORMALIZED_TO_USE=""
if [[ -f "${NORM_MAIN_YAML}" ]]; then
  NORMALIZED_TO_USE="${NORM_MAIN_YAML}"
elif [[ -f "${NORM_META_YAML}" ]]; then
  NORMALIZED_TO_USE="${NORM_META_YAML}"
else
  echo "WARNING: No normalized YAML found; skipping compare script." >&2
  exit 0
fi

WARNINGS_TO_USE=""
if [[ -f "${WARNINGS_YAML}" ]]; then
  WARNINGS_TO_USE="${WARNINGS_YAML}"
else
  # not fatal; some runs may not emit warnings.yaml
  echo "NOTE: ${WARNINGS_YAML} not found; proceeding without it."
fi

echo ">>> RUN compare_and_mismatched_reason.py"
# Adjust path if your script lives elsewhere:
COMPARE_SCRIPT="compare_and_mismatched_reason.py"

if ! command -v "${PYTHON_BIN}" >/dev/null 2>&1; then
  echo "ERROR: python interpreter '${PYTHON_BIN}' not found" >&2
  exit 1
fi

if [[ ! -f "${COMPARE_SCRIPT}" ]]; then
  # try inside repo root scripts/ if that's where you keep it
  if [[ -f "${COMPARE_SCRIPT}" ]]; then
    COMPARE_SCRIPT="${COMPARE_SCRIPT}"
  else
    echo "ERROR: ${COMPARE_SCRIPT} not found in current dir or scripts/" >&2
    exit 1
  fi
fi

COMPARE_CMD=( "${PYTHON_BIN}" "${COMPARE_SCRIPT}"
  --raw "${RAW_FILE}"
  --recon "${RECON_CSV}"
  --normalized "${NORMALIZED_TO_USE}"
)

# include warnings only if present
if [[ -n "${WARNINGS_TO_USE}" ]]; then
  COMPARE_CMD+=( --warnings "${WARNINGS_TO_USE}" )
fi

echo "+ ${COMPARE_CMD[*]}"
"${COMPARE_CMD[@]}"

echo "✅ Done."
