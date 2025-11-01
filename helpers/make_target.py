import struct
import re

def splitmix32(x: int) -> int:

    x = (x + 0x9E3779B97F4A7C15) & 0xFFFFFFFFFFFFFFFF
    x = (x ^ (x >> 30)) * 0xBF58476D1CE4E5B9 & 0xFFFFFFFFFFFFFFFF
    x = (x ^ (x >> 27)) * 0x94D049BB133111EB & 0xFFFFFFFFFFFFFFFF
    x = (x ^ (x >> 31)) & 0xFFFFFFFF
    return x

def tokenize(text: str):
    return re.findall(r"[a-zA-Z]+", text.lower())

def make_target_bin(txt_path: str, bin_path: str):
    with open(txt_path, "r", encoding="utf-8") as f:
        text = f.read()

    tokens = tokenize(text)
    hashes = []

    for token in tokens:
    
        seed = sum(bytearray(token.encode("utf-8")))
        hashed = splitmix32(seed)
        hashes.append(hashed)

   
    with open(bin_path, "wb") as out:
        for h in hashes:
            out.write(struct.pack("<I", h))

    print(f"Target resume converted: {bin_path} ({len(hashes)} tokens)")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python make_target.py <target_resume.txt>")
        sys.exit(1)

    txt_path = sys.argv[1]
    bin_path = txt_path.rsplit(".", 1)[0] + ".bin"
    make_target_bin(txt_path, bin_path)
