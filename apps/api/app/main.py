import csv
from datetime import date
from io import StringIO

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, delete, select

from app.db import create_db_and_tables, engine
from app.models import Customer
from app.services.segmentation import run_segmentation


app = FastAPI(
    title="MarketSphere API",
    description="Customer intelligence and business analytics API",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


def classify_customer(customer: Customer) -> str:
    purchase_amount = customer.purchase_amount or 0
    purchase_frequency = customer.purchase_frequency or 0

    days_since_purchase = None

    if customer.last_purchase_date:
        days_since_purchase = (
            date.today() - customer.last_purchase_date
        ).days

    if (
        days_since_purchase is not None
        and days_since_purchase > 90
    ):
        return "At-Risk Customers"

    if purchase_amount >= 50000 or purchase_frequency >= 10:
        return "High Value Customers"

    if purchase_frequency >= 7:
        return "Loyal Repeat Buyers"

    return "Discount Hunters"


def calculate_churn_risk(customer: Customer) -> int:
    purchase_amount = customer.purchase_amount or 0
    purchase_frequency = customer.purchase_frequency or 0

    if customer.last_purchase_date:
        days_since_purchase = max(
            (date.today() - customer.last_purchase_date).days,
            0,
        )
    else:
        days_since_purchase = 120

    recency_score = min(
        (days_since_purchase / 120) * 70,
        70,
    )

    frequency_score = 20 if purchase_frequency < 5 else 0
    monetary_score = 10 if purchase_amount < 10000 else 0

    risk_score = round(
        recency_score + frequency_score + monetary_score
    )

    return min(max(risk_score, 1), 99)


def get_risk_level(risk_score: int) -> str:
    if risk_score >= 70:
        return "High"

    if risk_score >= 40:
        return "Medium"

    return "Low"


def get_recommended_action(
    risk_score: int,
    segment: str,
) -> str:
    if risk_score >= 70:
        return "Win-back campaign"

    if segment == "High Value Customers":
        return "VIP loyalty offer"

    if segment == "Loyal Repeat Buyers":
        return "Referral campaign"

    if segment == "Discount Hunters":
        return "Limited-time coupon"

    return "Personalized follow-up"


@app.get("/")
def root():
    return {
        "message": "Welcome to MarketSphere API",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "marketsphere-api",
        "database": "sqlite",
    }

@app.get("/customers")
def get_customers():
    with Session(engine) as session:
        statement = select(Customer).limit(100)
        customers = session.exec(statement).all()

        return customers

@app.post("/customers/upload")
async def upload_customers(
    file: UploadFile = File(...),
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file was selected.",
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported.",
        )

    contents = await file.read()

    try:
        text = contents.decode("utf-8-sig")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="The CSV file must use UTF-8 encoding.",
        )

    reader = csv.DictReader(StringIO(text))

    if not reader.fieldnames:
        raise HTTPException(
            status_code=400,
            detail="The CSV file does not contain column headers.",
        )

    actual_columns = {
        column.strip().lower(): column
        for column in reader.fieldnames
        if column
    }

    required_columns = [
        "customer id",
        "purchase amount",
        "purchase frequency",
        "last purchase date",
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in actual_columns
    ]

    if missing_columns:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Required columns are missing.",
                "missing_columns": missing_columns,
            },
        )

    def get_value(row: dict, column_name: str) -> str:
        original_column = actual_columns.get(column_name)

        if not original_column:
            return ""

        return (row.get(original_column, "") or "").strip()

    def parse_float(value: str) -> float:
        try:
            return float(
                value.replace(",", "")
                .replace("₹", "")
                .strip()
            )
        except (ValueError, AttributeError):
            return 0.0

    def parse_int(value: str) -> int:
        try:
            return int(float(value))
        except (ValueError, TypeError):
            return 0

    def parse_date(value: str):
        try:
            return date.fromisoformat(value)
        except (ValueError, TypeError):
            return None

    customers = []

    for row in reader:
        customer_id = get_value(row, "customer id")

        if not customer_id:
            continue

        customer = Customer(
            customer_id=customer_id,
            age=parse_int(get_value(row, "age")),
            gender=get_value(row, "gender") or None,
            income=parse_float(get_value(row, "income")),
            city=get_value(row, "city") or None,
            purchase_amount=parse_float(
                get_value(row, "purchase amount")
            ),
            purchase_frequency=parse_int(
                get_value(row, "purchase frequency")
            ),
            category=get_value(row, "category") or None,
            last_purchase_date=parse_date(
                get_value(row, "last purchase date")
            ),
        )

        customers.append(customer)

    if not customers:
        raise HTTPException(
            status_code=400,
            detail="No valid customer rows were found.",
        )

    with Session(engine) as session:
        session.exec(delete(Customer))
        

        session.add_all(customers)
        session.commit()

    return {
        "message": "Customer data uploaded successfully.",
        "filename": file.filename,
        "customers_imported": len(customers),
    }


@app.get("/analytics/overview")
def get_analytics_overview():
    with Session(engine) as session:
        statement = select(Customer)

        customers = session.exec(statement).all()

    if not customers:
        return {
            "total_customers": 0,
            "total_revenue": 0,
            "average_order_value": 0,
            "at_risk_customers": 0,
            "segments": [],
        }

    segment_data = {
        "High Value Customers": {
            "customers": 0,
            "revenue": 0,
        },
        "Loyal Repeat Buyers": {
            "customers": 0,
            "revenue": 0,
        },
        "Discount Hunters": {
            "customers": 0,
            "revenue": 0,
        },
        "At-Risk Customers": {
            "customers": 0,
            "revenue": 0,
        },
    }

    total_revenue = 0
    at_risk_customers = 0

    for customer in customers:
        purchase_amount = customer.purchase_amount or 0
        total_revenue += purchase_amount

        segment_name = classify_customer(customer)

        if segment_name == "At-Risk Customers":
            at_risk_customers += 1

        segment_data[segment_name]["customers"] += 1
        segment_data[segment_name]["revenue"] += purchase_amount

    segments = []

    for name, values in segment_data.items():
        revenue_share = 0

        if total_revenue > 0:
            revenue_share = round(
                (values["revenue"] / total_revenue) * 100,
                2,
            )

        segments.append(
            {
                "name": name,
                "customers": values["customers"],
                "revenue": round(values["revenue"], 2),
                "revenue_share": revenue_share,
            }
        )

    return {
        "total_customers": len(customers),
        "total_revenue": round(total_revenue, 2),
        "average_order_value": round(
            total_revenue / len(customers),
            2,
        ),
        "at_risk_customers": at_risk_customers,
        "segments": segments,
    }


@app.get("/analytics/customers")
def get_customer_health():
    with Session(engine) as session:
        statement = select(Customer)

        customers = session.exec(statement).all()

    customer_health = []

    for customer in customers:
        risk_score = calculate_churn_risk(customer)
        segment = classify_customer(customer)

        days_since_purchase = None

        if customer.last_purchase_date:
            days_since_purchase = max(
                (
                    date.today()
                    - customer.last_purchase_date
                ).days,
                0,
            )

        customer_health.append(
            {
                "id": customer.id,
                "customer_id": customer.customer_id,
                "age": customer.age,
                "gender": customer.gender,
                "city": customer.city,
                "segment": segment,
                "total_spend": round(
                    customer.purchase_amount or 0,
                    2,
                ),
                "purchase_frequency": (
                    customer.purchase_frequency or 0
                ),
                "last_purchase_date": (
                    customer.last_purchase_date
                ),
                "days_since_purchase": days_since_purchase,
                "churn_risk": risk_score,
                "risk_level": get_risk_level(risk_score),
                "recommended_action": get_recommended_action(
                    risk_score,
                    segment,
                ),
            }
        )

    customer_health.sort(
        key=lambda customer: customer["churn_risk"],
        reverse=True,
    )

    return {
        "total_customers": len(customer_health),
        "high_risk_customers": len(
            [
                customer
                for customer in customer_health
                if customer["risk_level"] == "High"
            ]
        ),
        "customers": customer_health,
    }


@app.get("/analytics/ml-segments")
def get_ml_segments():
    with Session(engine) as session:
        statement = select(Customer)

        customers = session.exec(statement).all()

    return run_segmentation(customers)