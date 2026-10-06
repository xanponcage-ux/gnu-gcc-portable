import json
import os
import sys
from pathlib import Path

try:
    import msvcrt
except ImportError:
    print("This launcher is for Windows CMD.")
    raise

BASE_DIR = Path(__file__).resolve().parent
MODEL_FILE = BASE_DIR / "models.json"


def cls():
    os.system("cls")


def read_key():
    ch = msvcrt.getwch()
    if ch in ("\x00", "\xe0"):
        code = ord(msvcrt.getwch())
        return {
            72: "UP",
            80: "DOWN",
            75: "LEFT",
            77: "RIGHT",
            71: "HOME",
            79: "END",
        }.get(code, "SPECIAL")
    if ch == "\r":
        return "ENTER"
    if ch == "\x1b":
        return "ESC"
    return ch


def load_profiles():
    raw = json.loads(MODEL_FILE.read_text(encoding="utf-8"))
    return raw["models"]


def choose_model(profiles):
    # Optimized default: GPT-5 Mini, because native tool calling + round-trip
    # were verified through CodeGenie.
    idx = next((i for i, p in enumerate(profiles) if p["id"] == "gpt-5-mini"), 0)

    while True:
        cls()
        print("=" * 72)
        print(" CODEGENIE ROO BRIDGE v5 - SELECT MODEL")
        print("=" * 72)
        print("UP/DOWN = select     ENTER = continue     ESC = cancel\n")

        for i, p in enumerate(profiles):
            marker = ">" if i == idx else " "
            default = " [DEFAULT]" if p["id"] == "gpt-5-mini" else ""
            print(f"{marker} {p['name']}{default}")
            print(f"    {p.get('speed_note', '')}")

        key = read_key()
        if key == "UP":
            idx = (idx - 1) % len(profiles)
        elif key == "DOWN":
            idx = (idx + 1) % len(profiles)
        elif key == "ENTER":
            return profiles[idx]
        elif key == "ESC":
            sys.exit(0)


def slider(label, values, default_index, description):
    idx = default_index

    while True:
        cls()
        width = 42
        ratio = idx / max(1, len(values) - 1)
        filled = round(ratio * width)
        bar = "#" * filled + "-" * (width - filled)

        display = values[idx][0]

        print("=" * 72)
        print(f" CODEGENIE ROO BRIDGE v5 - {label}")
        print("=" * 72)
        print(f"\n[{bar}]  {display}\n")
        print(description)
        print("\nLEFT/RIGHT = adjust")
        print("HOME = minimum       END = maximum")
        print("ENTER = confirm       ESC = cancel")

        key = read_key()
        if key == "LEFT":
            idx = max(0, idx - 1)
        elif key == "RIGHT":
            idx = min(len(values) - 1, idx + 1)
        elif key == "HOME":
            idx = 0
        elif key == "END":
            idx = len(values) - 1
        elif key == "ENTER":
            return values[idx][1]
        elif key == "ESC":
            sys.exit(0)


def choose_temperature(p):
    if p.get("temperature_fixed") is not None:
        cls()
        value = float(p["temperature_fixed"])
        print("=" * 72)
        print(" CODEGENIE ROO BRIDGE v5 - TEMPERATURE")
        print("=" * 72)
        print(f"\nModel: {p['name']}")
        print(f"Temperature: {value} [FIXED BY CODEGENIE PROFILE]")
        print("\nPress ENTER to continue.")
        while True:
            key = read_key()
            if key == "ENTER":
                return value
            if key == "ESC":
                sys.exit(0)

    lo = float(p.get("temperature_min", 0.0))
    hi = float(p.get("temperature_max", 1.0))
    step = float(p.get("temperature_step", 0.1))
    default = float(p.get("temperature_default", 0.2))

    count = int(round((hi - lo) / step))
    numbers = [round(lo + i * step, 10) for i in range(count + 1)]
    values = [(f"{x:g}", str(x)) for x in numbers]
    default_idx = min(range(len(numbers)), key=lambda i: abs(numbers[i] - default))

    result = slider(
        "TEMPERATURE",
        values,
        default_idx,
        f"Allowed by this CodeGenie profile: {lo:g} to {hi:g}\n"
        f"Optimized coding default: {default:g}",
    )
    return float(result)


def token_options(p):
    lo = int(p.get("output_tokens_min", 100))
    hi = int(p.get("output_tokens_max"))
    default = int(p.get("output_tokens_default", hi))

    candidates = [
        100, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000
    ]
    nums = sorted({x for x in candidates if lo <= x <= hi} | {lo, hi, default})

    values = []
    for x in nums:
        if x >= 1000 and x % 1000 == 0:
            label = f"{x // 1000}K"
        else:
            label = f"{x:,}"
        if x == hi:
            label += " [MAX]"
        if x == default:
            label += " [DEFAULT]"
        values.append((label, str(x)))

    default_idx = nums.index(default)
    return values, default_idx


def choose_tokens(p):
    values, default_idx = token_options(p)
    result = slider(
        "MAX OUTPUT TOKENS",
        values,
        default_idx,
        f"CodeGenie range for {p['name']}: "
        f"{p.get('output_tokens_min', 100):,} to {p['output_tokens_max']:,}\n"
        "The bridge ALWAYS sends a legal numeric max_tokens value.",
    )
    return int(result)


def confirm(p, temperature, max_tokens):
    while True:
        cls()
        print("=" * 72)
        print(" CODEGENIE ROO BRIDGE v5 - READY")
        print("=" * 72)
        print(f"\nModel              : {p['name']}")
        print(f"Deployment         : {p['deployment_name']}")
        print(f"Agent path         : {p['adapter']}")
        print(f"Temperature        : {temperature}")
        print(f"Max output tokens  : {max_tokens:,}")
        print("\nENTER = start bridge")
        print("E     = edit selections")
        print("ESC   = cancel")

        key = read_key()
        if key == "ENTER":
            return True
        if isinstance(key, str) and key.lower() == "e":
            return False
        if key == "ESC":
            sys.exit(0)


def main():
    profiles = load_profiles()

    while True:
        p = choose_model(profiles)
        temperature = choose_temperature(p)
        max_tokens = choose_tokens(p)

        if confirm(p, temperature, max_tokens):
            break

    os.environ["CODEGENIE_MODEL"] = p["id"]
    os.environ["CODEGENIE_FORCE_MODEL"] = "1"

    os.environ["CODEGENIE_TEMPERATURE"] = str(temperature)
    os.environ["CODEGENIE_FORCE_TEMPERATURE"] = "1"

    os.environ["CODEGENIE_MAX_TOKENS"] = str(max_tokens)
    os.environ["CODEGENIE_FORCE_MAX_TOKENS"] = "1"

    cls()
    print("=" * 72)
    print(" CODEGENIE ROO BRIDGE v5 RUNNING")
    print("=" * 72)
    print(f"Model       : {p['name']} ({p['deployment_name']})")
    print(f"Path        : {p['adapter']}")
    print(f"Temperature : {temperature}")
    print(f"Max tokens  : {max_tokens:,}")
    print("Endpoint    : http://127.0.0.1:8765")
    print("\nKeep this window open while using Roo.")
    print("Press CTRL+C to stop.\n")

    import uvicorn
    uvicorn.run(
        "codegenie_bridge:app",
        host="127.0.0.1",
        port=8765,
        log_level="info",
    )


if __name__ == "__main__":
    main()
