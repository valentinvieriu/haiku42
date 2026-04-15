#!/usr/bin/env python3
"""
Syllable counter using the CMU Pronouncing Dictionary.

Usage:
  python3 count-syllables.py "line one" "line two" "line three"
  python3 count-syllables.py --haiku "line one / line two / line three"
  echo "some text" | python3 count-syllables.py
"""

import re
import sys
from nltk.corpus import cmudict

CMU = cmudict.dict()


def syllables_cmu(word):
    """Count syllables using CMU dict. Returns None if word not found."""
    word = word.lower().strip("'\".,;:!?()-")
    if not word:
        return None
    entries = CMU.get(word)
    if not entries:
        return None
    # Each vowel phoneme ends with a digit (stress marker)
    # Use the first pronunciation
    return sum(1 for ph in entries[0] if ph[-1].isdigit())


def syllables_fallback(word):
    """Rule-based fallback for words not in CMU dict."""
    word = re.sub(r"[^a-z]", "", word.lower())
    if not word:
        return 0
    count = len(re.findall(r"[aeiouy]+", word))
    if word.endswith("e") and not word.endswith("le"):
        count -= 1
    if word.endswith("ed") and len(word) > 3 and word[-3] not in "td":
        count -= 1
    return max(1, count)


def count_word(word):
    clean = re.sub(r"[^a-z'-]", "", word.lower())
    if not clean:
        return 0
    # Handle hyphenated words
    parts = [p for p in clean.split("-") if p]
    total = 0
    for part in parts:
        c = syllables_cmu(part)
        if c is None:
            c = syllables_fallback(part)
        total += c
    return total


def count_line(line):
    words = line.strip().split()
    breakdown = []
    total = 0
    for w in words:
        clean = re.sub(r"[^a-z'-]", "", w.lower())
        if not clean:
            continue
        c = count_word(w)
        total += c
        breakdown.append((clean, c))
    return total, breakdown


def main():
    args = sys.argv[1:]

    if "--haiku" in args:
        idx = args.index("--haiku")
        text = " ".join(args[idx + 1 :])
        lines = [l.strip() for l in text.split("/")]
        counts = [count_line(l) for l in lines]
        pattern = " / ".join(str(c[0]) for c in counts)
        target = "5 / 7 / 5"
        ok = pattern == target

        for line, (total, breakdown) in zip(lines, counts):
            detail = " ".join(f"{w}({c})" for w, c in breakdown)
            print(f"  {line}")
            print(f"    → {total} syllables: {detail}")
        symbol = "✓" if ok else f"✗ (expected {target})"
        print(f"\n  Pattern: {pattern}  {symbol}")
        sys.exit(0 if ok else 1)

    elif args:
        for line in args:
            total, breakdown = count_line(line)
            detail = " ".join(f"{w}({c})" for w, c in breakdown)
            print(f"{total}\t{line}\t{detail}")

    else:
        for line in sys.stdin:
            line = line.rstrip("\n")
            if not line:
                continue
            total, breakdown = count_line(line)
            detail = " ".join(f"{w}({c})" for w, c in breakdown)
            print(f"{total}\t{line}\t{detail}")


if __name__ == "__main__":
    main()
