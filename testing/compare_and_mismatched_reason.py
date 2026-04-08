# Robust RAW vs RECONSTRUCTED mismatch explainer for HRA DOs.
# - Uses line-based CSV parsing to avoid pandas delimiter issues.
# - Assumes header is on line --header (1-based, default 11).
# - Produces:
#     columns_only_in_raw.csv
#     columns_only_in_reconstructed.csv
#     value_mismatches.csv
#     value_mismatches_explained.csv  (adds "reason" + "evidence")
#
# Example:
#   python3 compare_and_mismatched_reason.py \
#     --raw "/.../asct-b/kidney/v1.6/raw/asct-b-vh-kidney.csv" \
#     --recon "/.../asct-b/kidney/v1.6/reconstructed/reconstructed.csv" \
#     --normalized "/.../asct-b/kidney/v1.6/normalized/normalized.yaml" \
#     --warnings "/.../asct-b/kidney/v1.6/normalized/warnings.yaml" \
#     --header 11

from __future__ import annotations
from pathlib import Path
import argparse
import csv
import sys
import pandas as pd

# -------- Config toggles --------
NORMALIZE_TEXT = True  # collapse whitespace in cell values
# --------------------------------

def canon_text(x):
    if isinstance(x, str):
        x = x.strip()
        if NORMALIZE_TEXT:
            x = " ".join(x.split())
    return x

def read_all_lines(path: Path, encoding: str) -> list[str]:
    with path.open("r", encoding=encoding, errors="replace", newline="") as f:
        return f.read().splitlines()

def choose_delimiter(header_line: str) -> str:
    # Pick the delimiter that yields the most fields for the header row
    candidates = [",", "\t", ";", "|"]
    best = ","
    best_n = -1
    for d in candidates:
        row = next(csv.reader([header_line], delimiter=d, quotechar='"', escapechar="\\"))
        if len(row) > best_n:
            best_n = len(row)
            best = d
    return best

def parse_csv_lines(lines: list[str], delimiter: str) -> list[list[str]]:
    reader = csv.reader(lines, delimiter=delimiter, quotechar='"', escapechar="\\")
    return [row for row in reader]

def pad_to_width(rows: list[list[str]]) -> list[list[str]]:
    width = max((len(r) for r in rows), default=0)
    return [r + [""] * (width - len(r)) for r in rows]

def norm_col_name(s: str, idx: int) -> str:
    name = "_".join(s.strip().split()).lower()
    return name if name else f"col_{idx+1}"

def build_df_from_file(path: Path, header_row_1based: int, encoding: str):
    lines = read_all_lines(path, encoding)
    if len(lines) < header_row_1based:
        raise ValueError(f"{path} has only {len(lines)} lines; cannot use line {header_row_1based} as header.")

    header_line = lines[header_row_1based - 1]
    delim = choose_delimiter(header_line)

    rows = parse_csv_lines(lines, delim)
    rows = pad_to_width(rows)

    header_idx0 = header_row_1based - 1
    header_row = rows[header_idx0]

    # Build unique, normalized column names
    cols, used = [], set()
    for i, raw_name in enumerate(header_row):
        name = norm_col_name(raw_name, i)
        base, k = name, 2
        while name in used:
            name = f"{base}_{k}"; k += 1
        used.add(name)
        cols.append(name)

    data_rows = rows[header_idx0 + 1:]
    df = pd.DataFrame(data_rows, columns=cols)
    df = df.map(canon_text)

    info = {
        "path": str(path),
        "n_lines": len(lines),
        "delimiter": repr(delim),
        "n_rows": df.shape[0],
        "n_cols": df.shape[1],
        "n_header_cols": len(cols),
    }
    return df, info

def load_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return ""

def contains_text(hay: str, needle: str) -> bool:
    if not needle:
        return False
    # normalize both for fair contains check
    H = canon_text(hay)
    N = canon_text(needle)
    return N in H if (H is not None and N is not None) else False

def explain_reason(raw_val: str, recon_val: str, normalized_text: str, warnings_text: str) -> tuple[str, str]:
    """
    Heuristic reason assignment:
      - Dropped during normalize (warning): warnings.yaml mentions raw_val
      - Filtered at normalize: raw_val absent in normalized.yaml
      - Transformed during normalize: recon_val present, raw_val absent in normalized.yaml
      - Reconstruction mapping/formatting difference: raw_val present in normalized.yaml but differs in recon
      - Indeterminate: fallback
    """
    if contains_text(warnings_text, raw_val):
        return "Dropped during normalize (warning)", "warnings.yaml contains RAW value"

    in_norm_raw = contains_text(normalized_text, raw_val)
    in_norm_recon = contains_text(normalized_text, recon_val)

    if not in_norm_raw:
        if in_norm_recon and raw_val != recon_val:
            return "Transformed during normalize", "normalized.yaml contains RECON value, not RAW"
        return "Filtered at normalize", "RAW value not found in normalized.yaml"

    # RAW present in normalized; RECON differs
    if raw_val != recon_val:
        if in_norm_recon:
            return "Reconstruction mapping/formatting difference", "Both RAW and RECON appear in normalized.yaml"
        return "Reconstruction mapping/formatting difference", "RAW present in normalized.yaml but RECON differs"

    return "Indeterminate", ""

def parse_args():
    ap = argparse.ArgumentParser(description="Explain RAW vs RECON mismatches using normalized + warnings.")
    ap.add_argument("--raw", required=False, default=None, help="Path to RAW CSV")
    ap.add_argument("--recon", required=False, default=None, help="Path to reconstructed CSV")
    ap.add_argument("--normalized", required=False, default=None, help="Path to normalized.yaml")
    ap.add_argument("--warnings", required=False, default=None, help="Path to warnings.yaml")
    ap.add_argument("--header", type=int, default=11, help="Header line number (1-based). Default: 11")
    ap.add_argument("--encoding", default="utf-8", help="Text encoding. Default: utf-8")
    return ap.parse_args()

def main():
    args = parse_args()

    # If paths not provided, try kidney v1.6 defaults (easy to override with flags)
    raw_p = Path(args.raw) if args.raw else Path("/Users/aishwarya/CNS-Code/hra-do-processor/digital-objects/asct-b/lung/v1.5/raw/asct-b-vh-lung.csv")
    recon_p = Path(args.recon) if args.recon else Path("/Users/aishwarya/CNS-Code/hra-do-processor/digital-objects/asct-b/lung/v1.5/reconstructed/reconstructed.csv")
    normalized_p = Path(args.normalized) if args.normalized else Path("/Users/aishwarya/CNS-Code/hra-do-processor/digital-objects/asct-b/lung/v1.5/normalized/normalized.yaml")
    warnings_p = Path(args.warnings) if args.warnings else Path("/Users/aishwarya/CNS-Code/hra-do-processor/digital-objects/asct-b/lung/v1.5/normalized/warnings.yaml")

    # Build dataframes using the robust reader
    raw_df, raw_info = build_df_from_file(raw_p, args.header, args.encoding)
    recon_df, recon_info = build_df_from_file(recon_p, args.header, args.encoding)

    print("RAW info  :", raw_info)
    print("RECON info:", recon_info)

    # Column presence
    raw_cols = set(raw_df.columns)
    recon_cols = set(recon_df.columns)
    only_in_raw = sorted(raw_cols - recon_cols)
    only_in_recon = sorted(recon_cols - raw_cols)
    in_both = sorted(raw_cols & recon_cols)

    out_dir = recon_p.parent
    out_dir.mkdir(parents=True, exist_ok=True)

    pd.DataFrame({"column_only_in_raw": only_in_raw}).to_csv(out_dir / "columns_only_in_raw.csv", index=False)
    pd.DataFrame({"column_only_in_reconstructed": only_in_recon}).to_csv(out_dir / "columns_only_in_reconstructed.csv", index=False)

    # Compare values in shared columns (row-wise up to min rows)
    n = min(len(raw_df), len(recon_df))
    raw_c = raw_df.iloc[:n].reset_index(drop=True)
    recon_c = recon_df.iloc[:n].reset_index(drop=True)

    # Save raw mismatches (no reasons) for reference
    mismatches_plain = []
    for col in in_both:
        diffs = raw_c[col] != recon_c[col]
        if diffs.any():
            for i in diffs[diffs].index.tolist():
                mismatches_plain.append({
                    "column": col,
                    "row_number_in_file": args.header + 1 + i,
                    "raw_value": raw_c.at[i, col],
                    "reconstructed_value": recon_c.at[i, col],
                })
    pd.DataFrame(mismatches_plain).to_csv(out_dir / "value_mismatches.csv", index=False)

    # Load normalized & warnings text to derive reasons
    normalized_text = load_text(normalized_p)
    warnings_text = load_text(warnings_p)

    explained = []
    for row in mismatches_plain:
        reason, evidence = explain_reason(row["raw_value"], row["reconstructed_value"], normalized_text, warnings_text)
        row2 = dict(row)
        row2["reason"] = reason
        row2["evidence"] = evidence
        explained.append(row2)

    pd.DataFrame(explained).to_csv(out_dir / "value_mismatches_explained.csv", index=False)

    print("Saved:")
    print(f"  - {out_dir/'columns_only_in_raw.csv'}")
    print(f"  - {out_dir/'columns_only_in_reconstructed.csv'}")
    print(f"  - {out_dir/'value_mismatches.csv'}")
    print(f"  - {out_dir/'value_mismatches_explained.csv'}")

if __name__ == "__main__":
    try:
        main()
    except BrokenPipeError:
        sys.exit(0)
