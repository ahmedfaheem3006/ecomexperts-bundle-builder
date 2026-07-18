"""Create Figma reference crops and exact per-pixel desktop/mobile diffs.

The authenticated MCP export can be swapped in directly when available. During
the current run Figma's Starter-plan call limit returned an error, so the input
is Figma's public file thumbnail. Each authentic frame crop is resized to its
measured node dimensions before comparison.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageChops, ImageStat


TARGETS = {
    "desktop": {
        "crop": (120, 0, 456, 248),
        "size": (1440, 1077),
    },
    "mobile": {
        "crop": (0, 0, 96, 288),
        "size": (390, 1252),
    },
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--thumbnail", type=Path, required=True)
    parser.add_argument("--app", type=Path, required=True)
    parser.add_argument("--reference", type=Path, required=True)
    parser.add_argument("--diff", type=Path, required=True)
    parser.add_argument("--target", choices=TARGETS, default="desktop")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    args.reference.parent.mkdir(parents=True, exist_ok=True)
    target = TARGETS[args.target]
    crop = target["crop"]
    target_size = target["size"]

    with Image.open(args.thumbnail) as thumbnail:
        reference = (
            thumbnail.convert("RGB")
            .crop(crop)
            .resize(target_size, Image.Resampling.LANCZOS)
        )
        reference.save(args.reference, format="PNG")

    with Image.open(args.app) as app_image:
        app = app_image.convert("RGB")
        if app.size != target_size:
            raise ValueError(
                f"App screenshot must be {target_size}, received {app.size}"
            )

    difference = ImageChops.difference(reference, app)
    difference.save(args.diff, format="PNG")

    histogram = difference.convert("L").histogram()
    different_pixels = sum(histogram[1:])
    total_pixels = target_size[0] * target_size[1]
    mean_error = sum(ImageStat.Stat(difference).mean) / 3
    print(f"different_pixels={different_pixels}")
    print(f"total_pixels={total_pixels}")
    print(f"different_percent={(different_pixels / total_pixels) * 100:.6f}")
    print(f"mean_absolute_channel_error={mean_error:.6f}")


if __name__ == "__main__":
    main()
