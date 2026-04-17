from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.shared.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin, utc_now
from app.shared.models.enums import AccessLevel, DocumentStatus
from app.shared.models.types import JSON_VARIANT, STRING_ARRAY_VARIANT, TEXT_ARRAY_VARIANT


class DocumentType(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "document_types"

    org_id: Mapped[str | None] = mapped_column(ForeignKey("organizations.id"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(100), index=True)
    display_name: Mapped[str] = mapped_column(String(255))
    extraction_schema: Mapped[dict] = mapped_column(JSON_VARIANT, default=dict)
    validation_schema: Mapped[dict] = mapped_column(JSON_VARIANT, default=dict)
    classification_keywords: Mapped[list[str]] = mapped_column(TEXT_ARRAY_VARIANT, default=list)
    auto_approve_threshold: Mapped[float] = mapped_column(Float, default=0.9)
    review_threshold: Mapped[float] = mapped_column(Float, default=0.7)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class Document(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "documents"
    __table_args__ = (
        Index("ix_documents_org_status", "org_id", "status"),
        Index("ix_documents_org_created", "org_id", "created_at"),
    )

    org_id: Mapped[str] = mapped_column(ForeignKey("organizations.id"), index=True)
    document_type_id: Mapped[str | None] = mapped_column(ForeignKey("document_types.id"), nullable=True, index=True)
    original_filename: Mapped[str] = mapped_column(String(500))
    file_format: Mapped[str] = mapped_column(String(20))
    file_size_bytes: Mapped[int | None] = mapped_column(nullable=True)
    page_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    raw_s3_key: Mapped[str] = mapped_column(String(1000), unique=True)
    processed_s3_prefix: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default=DocumentStatus.PENDING)
    overall_ocr_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    overall_extraction_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    classification_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    validation_status: Mapped[str | None] = mapped_column(String(50), nullable=True)
    access_level: Mapped[str] = mapped_column(String(20), default=AccessLevel.ORG)
    allowed_user_ids: Mapped[list[str]] = mapped_column(STRING_ARRAY_VARIANT, default=list)
    source: Mapped[str] = mapped_column(String(50), default="web_upload")
    uploaded_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    tags: Mapped[list[str]] = mapped_column(TEXT_ARRAY_VARIANT, default=list)
    custom_metadata: Mapped[dict] = mapped_column(JSON_VARIANT, default=dict)
    content_hash: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    duplicate_of_id: Mapped[str | None] = mapped_column(ForeignKey("documents.id"), nullable=True)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    pages: Mapped[list["DocumentPage"]] = relationship(back_populates="document", cascade="all, delete-orphan")
    chunks: Mapped[list["DocumentChunk"]] = relationship(back_populates="document", cascade="all, delete-orphan")
    duplicate_links: Mapped[list["DuplicateLink"]] = relationship(
        foreign_keys="DuplicateLink.document_id",
        back_populates="document",
    )


class DocumentPage(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "document_pages"
    __table_args__ = (UniqueConstraint("document_id", "page_number", name="uq_document_pages_doc_page"),)

    document_id: Mapped[str] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), index=True)
    page_number: Mapped[int] = mapped_column(Integer)
    processed_image_s3_key: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    thumbnail_s3_key: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    original_rotation_degrees: Mapped[float] = mapped_column(Float, default=0)
    applied_skew_correction: Mapped[float] = mapped_column(Float, default=0)
    image_quality_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    ocr_status: Mapped[str | None] = mapped_column(String(30), nullable=True)
    ocr_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    ocr_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_digital_native: Mapped[bool] = mapped_column(Boolean, default=False)
    detected_tables: Mapped[list[dict]] = mapped_column(JSON_VARIANT, default=list)
    width_px: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height_px: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    document: Mapped[Document] = relationship(back_populates="pages")
    ocr_output: Mapped["OCRSample | None"] = relationship(back_populates="page", uselist=False, cascade="all, delete-orphan")
    layout_elements: Mapped[list["LayoutElement"]] = relationship(back_populates="page", cascade="all, delete-orphan")


class OCRSample(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "ocr_outputs"

    document_id: Mapped[str] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), index=True)
    page_id: Mapped[str] = mapped_column(ForeignKey("document_pages.id", ondelete="CASCADE"), unique=True)
    payload: Mapped[dict] = mapped_column(JSON_VARIANT, default=dict)
    page_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    page: Mapped[DocumentPage] = relationship(back_populates="ocr_output")


class LayoutElement(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "layout_elements"

    document_id: Mapped[str] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), index=True)
    page_id: Mapped[str] = mapped_column(ForeignKey("document_pages.id", ondelete="CASCADE"), index=True)
    element_type: Mapped[str] = mapped_column(String(50), index=True)
    bbox: Mapped[dict] = mapped_column(JSON_VARIANT, default=dict)
    text_content: Mapped[str | None] = mapped_column(Text, nullable=True)
    table_data: Mapped[dict | None] = mapped_column(JSON_VARIANT, nullable=True)
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    reading_order: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    page: Mapped[DocumentPage] = relationship(back_populates="layout_elements")


class DocumentChunk(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "document_chunks"
    __table_args__ = (UniqueConstraint("document_id", "chunk_index", name="uq_document_chunks_doc_idx"),)

    document_id: Mapped[str] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), index=True)
    org_id: Mapped[str] = mapped_column(index=True)
    qdrant_point_id: Mapped[str] = mapped_column(String(64), unique=True)
    chunk_index: Mapped[int] = mapped_column(Integer)
    page_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    text_content: Mapped[str] = mapped_column(Text)
    token_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    embedding_model_version: Mapped[str | None] = mapped_column(String(100), nullable=True)
    embedded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    document: Mapped[Document] = relationship(back_populates="chunks")


class DuplicateLink(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "duplicate_links"

    org_id: Mapped[str] = mapped_column(index=True)
    document_id: Mapped[str] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), index=True)
    duplicate_document_id: Mapped[str] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), index=True)
    detection_type: Mapped[str] = mapped_column(String(50), default="exact")
    similarity_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    document: Mapped[Document] = relationship(foreign_keys=[document_id], back_populates="duplicate_links")

