from __future__ import annotations

from dataclasses import dataclass


@dataclass(slots=True)
class PageWindow:
    page: int
    page_size: int

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size


def paginate(page: int, page_size: int) -> PageWindow:
    return PageWindow(page=page, page_size=page_size)

