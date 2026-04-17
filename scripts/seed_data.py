import asyncio
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.db import AsyncSessionLocal
from app.modules.admin.seed import seed_platform_data


async def main() -> None:
    config_dir = Path(__file__).resolve().parents[1] / "config"
    async with AsyncSessionLocal() as session:
        await seed_platform_data(
            session=session,
            schemas_dir=config_dir / "schemas",
            rules_dir=config_dir / "rules",
            workflows_dir=config_dir / "workflows",
        )


if __name__ == "__main__":
    asyncio.run(main())

