from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
import uuid

from app.models.university import (
    University,
    UniversityCreate,
    UniversityUpdate,
    UniversityResponse,
    UniversityListResponse,
    UniversityType,
    Ranking,
    AcademicProgramResponse
)
from app.models.user import User
from app.services.university_service import UniversityService, AcademicProgramService
from app.auth.dependencies import get_admin_user, get_current_user_optional
from app.core.database import get_session

router = APIRouter(prefix="/universities", tags=["Universities"])

# Create service instances (no session in constructor anymore)
university_service = UniversityService()
program_service = AcademicProgramService()


@router.get("/", response_model=List[UniversityListResponse])
async def get_universities(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Number of records to return"),
    country: Optional[str] = Query(None, description="Filter by country"),
    city: Optional[str] = Query(None, description="Filter by city"),
    university_type: Optional[UniversityType] = Query(None, description="Filter by university type"),
    ranking: Optional[Ranking] = Query(None, description="Filter by ranking"),
    offers_scholarships: Optional[bool] = Query(None, description="Filter by scholarship availability"),
    provides_accommodation: Optional[bool] = Query(None, description="Filter by accommodation availability"),
    search: Optional[str] = Query(None, description="Search by university name"),
    session: AsyncSession = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get list of universities with filtering options.
    
    This endpoint is accessible to both authenticated and unauthenticated users.
    """
    universities = await university_service.get_universities(
        session=session,
        skip=skip,
        limit=limit,
        country=country,
        city=city,
        university_type=university_type,
        ranking=ranking,
        offers_scholarships=offers_scholarships,
        provides_accommodation=provides_accommodation,
        search=search
    )
    
    return [UniversityListResponse.model_validate(uni) for uni in universities]


@router.get("/{university_id}", response_model=UniversityResponse)
async def get_university(
    university_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get detailed information about a specific university including academic programs.
    
    This endpoint is accessible to both authenticated and unauthenticated users.
    """
    university = await university_service.get_university_by_id(university_id, session)
    return UniversityResponse.model_validate(university)


@router.post("/", response_model=UniversityResponse, status_code=status.HTTP_201_CREATED)
async def create_university(
    university_data: UniversityCreate,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """
    Create a new university with academic programs.
    
    Only admin users can create universities.
    """
    university = await university_service.create_university(university_data, session)
    return UniversityResponse.model_validate(university)


@router.put("/{university_id}", response_model=UniversityResponse)
async def update_university(
    university_id: uuid.UUID,
    university_data: UniversityUpdate,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """
    Update university information.
    
    Only admin users can update universities.
    """
    university = await university_service.update_university(university_id, university_data, session)
    return UniversityResponse.model_validate(university)


@router.delete("/{university_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_university(
    university_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """
    Delete a university (soft delete - marks as inactive).
    
    Only admin users can delete universities.
    """
    await university_service.delete_university(university_id, session)
    return {"message": "University deleted successfully"}


@router.get("/{university_id}/programs", response_model=List[AcademicProgramResponse])
async def get_university_programs(
    university_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get all academic programs for a specific university.
    
    This endpoint is accessible to both authenticated and unauthenticated users.
    """
    # First check if university exists
    await university_service.get_university_by_id(university_id, session)
    
    # Get programs
    programs = await program_service.get_programs_by_university(university_id, session)
    
    return [AcademicProgramResponse.model_validate(program) for program in programs]


@router.get("/statistics/summary")
async def get_university_statistics(
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """
    Get university statistics and analytics.
    
    Only admin users can access statistics.
    """
    stats = await university_service.get_university_statistics(session)
    return stats


# Additional utility endpoints (these don't need async since they don't use database)

@router.get("/enums/types")
async def get_university_types():
    """Get available university types"""
    return {"university_types": [t.value for t in UniversityType]}


@router.get("/enums/rankings")
async def get_rankings():
    """Get available ranking options"""
    return {"rankings": [r.value for r in Ranking]}


@router.get("/enums/languages")
async def get_languages():
    """Get available languages of instruction"""
    from app.models.university import Language
    return {"languages": [l.value for l in Language]}
