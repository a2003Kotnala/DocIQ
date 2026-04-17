from pathlib import Path
import sys

BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.modules.feedback.exporter import export_feedback_dataset


if __name__ == "__main__":
    destination = Path("exports") / "feedback-dataset.jsonl"
    destination.parent.mkdir(parents=True, exist_ok=True)
    export_feedback_dataset(destination)

