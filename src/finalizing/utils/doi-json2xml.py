import json
import sys

from datacite import schema45

if __name__ == "__main__":
    input = sys.argv[1]
    output = sys.argv[2]

    json_data = json.load(open(input, "r", encoding="utf8"))
    data = json_data["data"]["attributes"]

    schema45.validator.validate(data)

    doc = schema45.tostring(data)

    with open(output, "w") as out:
        out.write(doc)
