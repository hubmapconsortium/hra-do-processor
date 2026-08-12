# HRA-DO Processor – Testing and Debugging Notes

## 1. Environment Setup and Debugging

If you encounter a **`riot class not found`** error even when using Java 11, ensure that Apache Jena is properly configured in your environment.

Run the following commands in your terminal:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 11)
export PATH="$JAVA_HOME/bin:$PATH"
export JENA_HOME="$(pwd)/.venv/opt/apache-jena"
export PATH="$JENA_HOME/bin:$PATH"
hash -r
which riot
```

✅ **Expected output:**
```
.venv/opt/apache-jena/bin/riot
```

If `which riot` points to another location, the `riot` CLI tool might not be using the correct Jena installation. Ensure `.venv/opt/apache-jena/bin` appears first in your `PATH`.

---
## 3. Run Testing Script
The main automation script is located at:
```
hra-do-processor/testing/testing-digital-objects.sh
```
It must be **executed from the root of the repository**, not from inside the `testing` folder.

## 🧭 Paths to Update Before Running

Open the script and review these key variables near the top:

| Variable | Current Default | What to Change |
|-----------|------------------|----------------|
| `source` | `/home/hra-do-processor/.venv/bin/activate` | Update if your virtual environment path is different |
| `DO_PATH` | `/home/hra-do-processor/digital-objects/asct-b/blood-pelvis/v1.4` | Change to the specific Digital Object directory you want to test |
| `COMPARE_SCRIPT` | `compare_and_mismatched_reason.py` | Update if your comparison script is located in another folder. No need to change, this by default is in testing/ folder|

If your project is in a different location, simply replace `/home/hra-do-processor` with your actual path.

---
## 🚀 How to Run

From the **project root**, run:
```bash
bash testing/testing-digital-objects.sh 
```

## ⚙️ What the Script Does

This script automates the full **HRA Digital Object (DO)** processing workflow using the `do-processor` CLI and a comparison script.

It performs the following steps:

| Step | Command | Description |
|------|----------|-------------|
| 1️⃣ | `do-processor normalize` | Normalizes the raw CSV data into standardized YAML form |
| 2️⃣ | `do-processor enrich` | Adds ontology links and metadata enrichment |
| 3️⃣ | `do-processor build` | Builds deployable RDF/JSON artifacts |
| 4️⃣ | `do-processor reconstruct` | Reconstructs CSV from normalized data |
| 5️⃣ | `compare_and_mismatched_reason.py` | Compares **raw → normalized → reconstructed** outputs and summarizes mismatches |

Outputs are stored under the Digital Object’s own folders:
```
normalized/
enriched/
reconstructed/
    columns_only_in_raw
    columns_only_in_recon
    value_mismatches_explained.csv
```

---

## 2. Digital Object Testing Summary

| **Digital Object** | **Columns Dropped (only in raw)** | **Key Observations** | **Suggested Changes** |
|--------------------|-----------------------------------|----------------------|------------------------|
| **Allen Brain** | `all_gene_biomarkers` (others empty/dropped) | - Most diffs due to normalization transforms (2,759 records)<br>- `all_gene_biomarkers` dropped during normalize (comma-separated values)<br>- Missing RDFS labels for some LOC IDs | - Add `all_gene_biomarkers` field to schema (array of strings)<br>- Update normalize step to keep and parse this column<br>- Implement ontology label fallback for LOC IDs |
| **Blood – Pelvis** | `all_gene_biomarkers`, `ftu/1`, `ftu/1/id`, `ftu/1/label`, `ref/2`, `ref/2/id`, `ref/2/notes` | - Most diffs from normalization transforms (174)<br>- Gene/protein labels standardized (e.g., “CD19 molecule” → “CD19”)<br>- Metadata order mismatches<br>- Example filtered rows: `bgene/10/label` row 28–29 (“tryptophanyl-tRNA synthetase 1” → “WARS1”) filtered at normalize | - Keep normalization label standardization<br>- Add filter exception handling for `bgene/*/label` when raw not found in `normalized.yaml` |
| **Kidney** | `bprotein/4`, `bprotein/4/id`, `bprotein/4/label`, `bprotein/4/notes`, `ct/1/abbr`, `ct/2/abbr`, `ftu/2/id/notes` | - Diffs from normalization (415) + mapping/format (313)<br>- `bprotein/4*` dropped due to invalid ID format<br>- `ct/*/abbr` dropped across DOs (missing in schema)<br>- `ftu/2/id/notes` empty | 1️⃣ Generate or repair valid IDs for `bprotein/4` items before normalize<br>2️⃣ Add `ct/*/abbr` to schema<br>3️⃣ Allowlist raw-only fields if needed<br>4️⃣ Review 313 mapping/format diffs for consistent URI/CURIE formatting |
| **Large Intestine** | `bprotein/6/id` (HGNC:1678 rows) | - `HGNC:1678` dropped because normalizer found no RDFS label<br>- 7,345 mismatch rows: 4,115 filtered, 2,970 transformed during normalize<br>- Diffs mainly due to normalization (not reconstruction bugs) | - Add fallback for missing RDFS label to retain ID<br>- Review normalization logic for label lookup |
| **Heart** | `combined_gene_markers` | - Combined gene marker values split/dropped by normalizer<br>- Array cells like `GENE1;GENE2` treated as single biomarker or dropped if lookup fails | - Add splitting logic in `setData()` to handle multi-marker cells<br>- Ensure `GENE1;GENE2` → two biomarker entries |
| **Pancreas** | — | - Entries previously appeared shifted due to normalization reordering<br>- Comparator now uses stable key to fix alignment | - Continue using stable key comparator to prevent array misalignment |

---

## 3. Summary

- **Normalization step** is the main source of differences across digital objects.  
- **Schema gaps** (like missing `abbr` fields or combined marker arrays) must be addressed for consistency.  
- **Ontology label lookups** (e.g., LOC IDs, HGNC symbols) should implement **fallbacks** to prevent data loss during normalization.  
