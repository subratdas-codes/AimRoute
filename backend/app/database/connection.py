import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    DATABASE_URL = DATABASE_URL.strip().strip('"')
    if DATABASE_URL.startswith("mysql") and "pymysql" not in DATABASE_URL:
        # mysql+mysqlconnector://... -> mysql+pymysql://...
        DATABASE_URL = "mysql+pymysql://" + DATABASE_URL.split("://", 1)[1]
    if "?" in DATABASE_URL and DATABASE_URL.split("://", 1)[0] in (
        "mysql", "mysql+pymysql", "mysql+mysqlconnector",
    ):
        # pymysql doesn't understand mysql-connector query flags — strip them
        DATABASE_URL = DATABASE_URL.split("?", 1)[0]
else:
    DB_HOST = os.getenv("MYSQL_HOST", "localhost")
    DB_PORT = os.getenv("MYSQL_PORT", "3306")
    DB_USER = os.getenv("MYSQL_USER", "root")
    DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "root123")
    DB_NAME = os.getenv("MYSQL_DATABASE", "career_guidance")
    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

_is_postgres = DATABASE_URL.split("://", 1)[0] in ("postgres", "postgresql", "postgresql+psycopg2")
_is_mysql = DATABASE_URL.split("://", 1)[0] in ("mysql", "mysql+pymysql", "mysql+mysqlconnector")

connect_args = {}
if _is_postgres and "postgresql+psycopg2" not in DATABASE_URL:
    DATABASE_URL = "postgresql+psycopg2://" + DATABASE_URL.split("://", 1)[1]
if _is_postgres:
    connect_args["connect_timeout"] = 10
    connect_args["sslmode"] = "require"
if _is_mysql:
    connect_args["connect_timeout"] = 10
    # TiDB Cloud requires SSL — detect by port 4000 or tidbcloud.com hostname
    _needs_ssl = ":4000" in DATABASE_URL or "tidbcloud.com" in DATABASE_URL
    if _needs_ssl:
        connect_args["ssl"] = {"ssl_disabled": False}

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()