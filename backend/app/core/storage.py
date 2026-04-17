from __future__ import annotations

from datetime import timedelta

import boto3
from botocore.client import BaseClient
from botocore.config import Config

from app.core.settings import get_settings


class StorageService:
    def __init__(self) -> None:
        settings = get_settings()
        self.bucket = settings.s3_bucket
        self.client: BaseClient = boto3.client(
            "s3",
            endpoint_url=settings.s3_endpoint_url,
            aws_access_key_id=settings.s3_access_key,
            aws_secret_access_key=settings.s3_secret_key.get_secret_value(),
            region_name=settings.s3_region,
            use_ssl=settings.s3_use_ssl,
            config=Config(signature_version="s3v4"),
        )

    def create_presigned_upload(self, key: str, content_type: str) -> dict[str, str]:
        url = self.client.generate_presigned_url(
            "put_object",
            Params={"Bucket": self.bucket, "Key": key, "ContentType": content_type},
            ExpiresIn=int(timedelta(minutes=15).total_seconds()),
        )
        return {"upload_url": url, "object_key": key}

    def create_presigned_download(self, key: str) -> str:
        return self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": key},
            ExpiresIn=int(timedelta(minutes=15).total_seconds()),
        )

    def object_exists(self, key: str) -> bool:
        try:
            self.client.head_object(Bucket=self.bucket, Key=key)
        except Exception:
            return False
        return True


storage_service = StorageService()

