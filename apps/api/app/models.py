from datetime import date, datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Customer(SQLModel, table=True):
    id: Optional[int] = Field(
        default=None,
        primary_key=True,
    )

    customer_id: str = Field(index=True)
    age: Optional[int] = None
    gender: Optional[str] = None
    income: Optional[float] = None
    city: Optional[str] = None
    purchase_amount: float = 0
    purchase_frequency: int = 0
    category: Optional[str] = None
    last_purchase_date: Optional[date] = None

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
    )


class User(SQLModel, table=True):
    id: Optional[int] = Field(
        default=None,
        primary_key=True,
    )

    name: str
    email: str = Field(index=True)
    password_hash: str

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
    )