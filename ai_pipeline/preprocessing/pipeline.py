from __future__ import annotations

from ai_pipeline.preprocessing.binarizer import normalize_mode
from ai_pipeline.preprocessing.denoiser import estimate_noise
from ai_pipeline.preprocessing.deskew import estimate_skew
from ai_pipeline.preprocessing.quality_scorer import score_quality


def preprocess_document(file_name: str, file_format: str) -> dict:
    quality = score_quality(file_name, file_format)
    return {
        "page_count": 1,
        "pages": [
            {
                "page_number": 1,
                "quality_score": quality,
                "skew_correction": estimate_skew(file_name),
                "noise_level": estimate_noise(file_name),
                "mode": normalize_mode(file_format),
                "processed_key_suffix": "page-1.png",
                "width_px": 1654,
                "height_px": 2339,
            }
        ],
    }

