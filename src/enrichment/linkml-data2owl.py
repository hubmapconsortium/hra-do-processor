import sys

import rdflib
from funowl import literals
from linkml_owl.dumpers.owl_dumper import cli

# funowl converts plain strings to literals by wrapping them in quotes and parsing
# them as Turtle, so backslashes (e.g., LaTeX like "\cdot") are treated as escape
# sequences and either fail or silently corrupt the text. Treat them as literal text.
_original_to_n3 = literals.Literal._to_n3


def _to_n3(v):
    if isinstance(v, str) and not isinstance(v, rdflib.term.Node):
        return rdflib.Literal(v)
    return _original_to_n3(v)


literals.Literal._to_n3 = staticmethod(_to_n3)

if __name__ == "__main__":
    sys.exit(cli())
