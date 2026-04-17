from __future__ import annotations

from fastapi import APIRouter, Depends

from app.core.deps import CurrentUser, SessionDep, require_permission
from app.modules.documents.schemas import (
    ApproveDocumentRequest,
    CorrectFieldRequest,
    DocumentDetail,
    RejectDocumentRequest,
    UploadUrlRequest,
    UploadUrlResponse,
)
from app.modules.documents.service import (
    approve_document,
    confirm_upload,
    correct_extracted_field,
    create_upload_url,
    get_document_detail,
    get_extractions,
    get_page_ocr,
    get_page_view_url,
    get_validation_results,
    list_documents,
    reject_document,
    review_queue,
)
from app.shared.schemas.common import PaginatedResponse

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload-url", response_model=UploadUrlResponse)
async def create_upload_url_route(
    payload: UploadUrlRequest,
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("document.create")),
) -> UploadUrlResponse:
    return await create_upload_url(session, payload, user)


@router.post("/{document_id}/confirm-upload")
async def confirm_upload_route(
    document_id: str,
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("document.create")),
) -> dict[str, str | int]:
    return await confirm_upload(session, document_id, user)


@router.get("", response_model=PaginatedResponse)
async def list_documents_route(
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("document.read")),
    status: str | None = None,
    document_type_id: str | None = None,
    page: int = 1,
    page_size: int = 20,
) -> PaginatedResponse:
    return await list_documents(session, user, status=status, document_type_id=document_type_id, page=page, page_size=page_size)


@router.get("/review-queue", response_model=PaginatedResponse)
async def review_queue_route(
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("document.review")),
    page: int = 1,
    page_size: int = 20,
) -> PaginatedResponse:
    return await review_queue(session, user, page, page_size)


@router.get("/{document_id}", response_model=DocumentDetail)
async def get_document_route(
    document_id: str,
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("document.read")),
) -> DocumentDetail:
    return await get_document_detail(session, document_id, user)


@router.get("/{document_id}/pages/{page_number}/view-url")
async def page_view_url_route(
    document_id: str,
    page_number: int,
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("document.read")),
) -> dict[str, str]:
    return await get_page_view_url(session, document_id, page_number, user)


@router.get("/{document_id}/pages/{page_number}/ocr")
async def page_ocr_route(
    document_id: str,
    page_number: int,
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("document.read")),
) -> dict:
    return await get_page_ocr(session, document_id, page_number, user)


@router.get("/{document_id}/extractions")
async def extractions_route(
    document_id: str,
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("document.read")),
) -> dict:
    return await get_extractions(session, document_id, user)


@router.patch("/{document_id}/extractions/{field_id}")
async def correct_field_route(
    document_id: str,
    field_id: str,
    payload: CorrectFieldRequest,
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("document.review")),
) -> dict:
    field = await correct_extracted_field(session, document_id, field_id, payload, user)
    return {"field": field}


@router.get("/{document_id}/validation")
async def validation_route(
    document_id: str,
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("document.read")),
) -> dict:
    return await get_validation_results(session, document_id, user)


@router.post("/{document_id}/approve")
async def approve_route(
    document_id: str,
    payload: ApproveDocumentRequest,
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("document.approve")),
) -> dict:
    return await approve_document(session, document_id, payload, user)


@router.post("/{document_id}/reject")
async def reject_route(
    document_id: str,
    payload: RejectDocumentRequest,
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("document.approve")),
) -> dict:
    return await reject_document(session, document_id, payload, user)

