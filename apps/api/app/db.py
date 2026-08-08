from sqlmodel import Session, SQLModel, create_engine


DATABASE_URL = "sqlite:///./marketsphere.db"


engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False,
    },
    echo=False,
)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


def migrate_database():
    with engine.begin() as connection:
        columns = connection.exec_driver_sql(
            "PRAGMA table_info(customer)"
        ).fetchall()

        has_owner_id = any(
            column[1] == "owner_id"
            for column in columns
        )

        if not has_owner_id:
            connection.exec_driver_sql(
                "ALTER TABLE customer "
                "ADD COLUMN owner_id INTEGER"
            )