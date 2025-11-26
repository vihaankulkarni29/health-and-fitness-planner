from app.core.config import settings
print(f"SECRET_KEY: {settings.SECRET_KEY}")
print(f"Database: {settings.SQLALCHEMY_DATABASE_URI}")
