import uuid
from sqlmodel import Column, Relationship, SQLModel, Field
from typing import List, Optional
from datetime import datetime
import sqlalchemy.dialects.postgresql as pg
from enum import Enum


# Enums
class UniversityType(str, Enum):
    PRIVATE = "private"
    PUBLIC = "public"  
    RESEARCH = "research"
    TECHNICAL = "technical"
    MEDICAL = "medical"
    AGRICULTURAL = "agricultural"


class Ranking(str, Enum):
    A_PLUS = "A+"
    A = "A"
    B_PLUS = "B+"
    B = "B"
    C_PLUS = "C+"
    C = "C"
    NOT_RANKED = "NOT_RANKED"


class Language(str, Enum):
    ENGLISH = "English"
    FRENCH = "French"
    ARABIC = "Arabic"
    PORTUGUESE = "Portuguese"
    SWAHILI = "Swahili"
    AFRIKAANS = "Afrikaans"


# Database Models
class University(SQLModel, table=True):
    __tablename__ = "universities"
    
    uid: uuid.UUID = Field(
        sa_column=Column(
            pg.UUID,
            nullable=False,
            primary_key=True,
            default=uuid.uuid4,
        )
    )
    
    # Basic Information
    name: str = Field(max_length=255, nullable=False)
    website: Optional[str] = Field(default=None, max_length=255)
    country: str = Field(max_length=100, nullable=False)
    city: str = Field(max_length=100, nullable=False)
    founded_year: Optional[int] = Field(default=None)
    university_type: UniversityType = Field(nullable=False)
    ranking: Ranking = Field(default=Ranking.NOT_RANKED)
    description: Optional[str] = Field(default=None)
    
    # Statistics
    nigerian_students: Optional[int] = Field(default=None)
    acceptance_rate: Optional[float] = Field(default=None)  # percentage
    average_annual_tuition: Optional[float] = Field(default=None)  # in USD
    
    # Contact Information
    contact_email: Optional[str] = Field(default=None, max_length=255)
    contact_phone: Optional[str] = Field(default=None, max_length=20)
    
    # Languages of Instruction (stored as JSON array)
    languages_of_instruction: List[Language] = Field(
        sa_column=Column(pg.JSON),
        default=[]
    )
    
    # Additional Features
    offers_scholarships: bool = Field(default=False)
    provides_accommodation: bool = Field(default=False)
    partner_university: bool = Field(default=False)
    
    # Metadata
    is_active: bool = Field(default=True)
    created_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now)
    )
    updated_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    )
    
    # Relationships
    academic_programs: List["AcademicProgram"] = Relationship(back_populates="university")

    def __repr__(self):
        return f"<University {self.name}>"


class AcademicProgram(SQLModel, table=True):
    __tablename__ = "academic_programs"
    
    uid: uuid.UUID = Field(
        sa_column=Column(
            pg.UUID,
            nullable=False,
            primary_key=True,
            default=uuid.uuid4,
        )
    )
    
    # Program Information
    name: str = Field(max_length=255, nullable=False)
    degree_type: str = Field(max_length=100, nullable=False)  # Bachelor's, Master's, PhD, Certificate, etc.
    faculty: Optional[str] = Field(default=None, max_length=255)
    department: Optional[str] = Field(default=None, max_length=255)
    duration_years: Optional[float] = Field(default=None)
    description: Optional[str] = Field(default=None)
    
    # Requirements and Details
    entry_requirements: Optional[str] = Field(default=None)
    tuition_fee: Optional[float] = Field(default=None)  # in USD
    
    # Foreign Key
    university_uid: uuid.UUID = Field(foreign_key="universities.uid")
    
    # Metadata
    is_active: bool = Field(default=True)
    created_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now)
    )
    updated_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    )
    
    # Relationships
    university: University = Relationship(back_populates="academic_programs")

    def __repr__(self):
        return f"<AcademicProgram {self.name}>"


# Pydantic Models for API
class AcademicProgramBase(SQLModel):
    name: str = Field(max_length=255)
    degree_type: str = Field(max_length=100)
    faculty: Optional[str] = Field(default=None, max_length=255)
    department: Optional[str] = Field(default=None, max_length=255)
    duration_years: Optional[float] = Field(default=None)
    description: Optional[str] = Field(default=None)
    entry_requirements: Optional[str] = Field(default=None)
    tuition_fee: Optional[float] = Field(default=None)
    is_active: bool = Field(default=True)


class AcademicProgramCreate(AcademicProgramBase):
    pass


class AcademicProgramResponse(AcademicProgramBase):
    uid: uuid.UUID
    university_uid: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UniversityBase(SQLModel):
    name: str = Field(max_length=255)
    website: Optional[str] = Field(default=None, max_length=255)
    country: str = Field(max_length=100)
    city: str = Field(max_length=100)
    founded_year: Optional[int] = Field(default=None)
    university_type: UniversityType
    ranking: Ranking = Field(default=Ranking.NOT_RANKED)
    description: Optional[str] = Field(default=None)
    nigerian_students: Optional[int] = Field(default=None)
    acceptance_rate: Optional[float] = Field(default=None)
    average_annual_tuition: Optional[float] = Field(default=None)
    contact_email: Optional[str] = Field(default=None, max_length=255)
    contact_phone: Optional[str] = Field(default=None, max_length=20)
    languages_of_instruction: List[Language] = Field(default=[])
    offers_scholarships: bool = Field(default=False)
    provides_accommodation: bool = Field(default=False)
    partner_university: bool = Field(default=False)
    is_active: bool = Field(default=True)


class UniversityCreate(UniversityBase):
    academic_programs: List[AcademicProgramCreate] = Field(default=[])


class UniversityUpdate(SQLModel):
    name: Optional[str] = Field(default=None, max_length=255)
    website: Optional[str] = Field(default=None, max_length=255)
    country: Optional[str] = Field(default=None, max_length=100)
    city: Optional[str] = Field(default=None, max_length=100)
    founded_year: Optional[int] = Field(default=None)
    university_type: Optional[UniversityType] = Field(default=None)
    ranking: Optional[Ranking] = Field(default=None)
    description: Optional[str] = Field(default=None)
    nigerian_students: Optional[int] = Field(default=None)
    acceptance_rate: Optional[float] = Field(default=None)
    average_annual_tuition: Optional[float] = Field(default=None)
    contact_email: Optional[str] = Field(default=None, max_length=255)
    contact_phone: Optional[str] = Field(default=None, max_length=20)
    languages_of_instruction: Optional[List[Language]] = Field(default=None)
    offers_scholarships: Optional[bool] = Field(default=None)
    provides_accommodation: Optional[bool] = Field(default=None)
    partner_university: Optional[bool] = Field(default=None)
    is_active: Optional[bool] = Field(default=None)


class UniversityResponse(UniversityBase):
    uid: uuid.UUID
    created_at: datetime
    updated_at: datetime
    academic_programs: List[AcademicProgramResponse] = Field(default=[])

    class Config:
        from_attributes = True


class UniversityListResponse(SQLModel):
    uid: uuid.UUID
    name: str
    country: str
    city: str
    university_type: UniversityType
    ranking: Ranking
    offers_scholarships: bool
    provides_accommodation: bool
    average_annual_tuition: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True
