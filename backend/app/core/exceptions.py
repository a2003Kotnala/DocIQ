from __future__ import annotations


class DocIQError(Exception):
    """Base application error."""


class AuthorizationError(DocIQError):
    """Raised when the current actor lacks permission."""


class NotFoundError(DocIQError):
    """Raised when an entity cannot be found."""


class ConflictError(DocIQError):
    """Raised for unique or state conflicts."""


class ValidationFailure(DocIQError):
    """Raised when business validation fails."""


class ExternalDependencyError(DocIQError):
    """Raised when an external provider is unavailable."""

