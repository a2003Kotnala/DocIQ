from pathlib import Path

from app.modules.feedback.exporter import export_feedback_dataset


if __name__ == "__main__":
    destination = Path("exports") / "feedback-dataset.jsonl"
    destination.parent.mkdir(parents=True, exist_ok=True)
    export_feedback_dataset(destination)

