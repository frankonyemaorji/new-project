import uuid
import asyncio
from typing import List, Optional
from sqlmodel import select, and_
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.exc import InterfaceError
from fastapi import HTTPException, status
from datetime import datetime

from app.models.university import (
    University, 
    AcademicProgram,
    UniversityCreate, 
    UniversityUpdate,
    UniversityType,
    Ranking
)


class UniversityService:
    async def create_university(self, university_data: UniversityCreate, session: AsyncSession) -> University:
        """Create a new university with academic programs"""
        try:
            # Create university instance
            university_dict = university_data.model_dump(exclude={"academic_programs"})
            university = University(**university_dict)
            
            session.add(university)
            await session.flush()  # Flush to get the university UID
            
            # Create academic programs if provided
            if university_data.academic_programs:
                for program_data in university_data.academic_programs:
                    program = AcademicProgram(
                        **program_data.model_dump(),
                        university_uid=university.uid
                    )
                    session.add(program)
            
            await session.commit()
            await session.refresh(university)
            return university
            
        except Exception as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error creating university: {str(e)}"
            )

    async def get_university_by_id(self, university_id: uuid.UUID, session: AsyncSession) -> Optional[University]:
        """Get university by ID with academic programs"""
        try:
            statement = (
                select(University)
                .where(University.uid == university_id)
            )
            result = await session.exec(statement)
            university = result.first()
            
            if not university:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="University not found"
                )
            
            return university
            
        except InterfaceError as e:
            if "connection is closed" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Database connection error. Please try again."
                )
            raise

    async def get_universities(
        self, 
        session: AsyncSession,
        skip: int = 0, 
        limit: int = 100,
        country: Optional[str] = None,
        city: Optional[str] = None,
        university_type: Optional[UniversityType] = None,
        ranking: Optional[Ranking] = None,
        offers_scholarships: Optional[bool] = None,
        provides_accommodation: Optional[bool] = None,
        search: Optional[str] = None
    ) -> List[University]:
        """Get universities with filtering options"""
        
        try:
            statement = select(University).where(University.is_active == True)
            
            # Apply filters
            if country:
                statement = statement.where(University.country.ilike(f"%{country}%"))
            
            if city:
                statement = statement.where(University.city.ilike(f"%{city}%"))
                
            if university_type:
                statement = statement.where(University.university_type == university_type)
                
            if ranking:
                statement = statement.where(University.ranking == ranking)
                
            if offers_scholarships is not None:
                statement = statement.where(University.offers_scholarships == offers_scholarships)
                
            if provides_accommodation is not None:
                statement = statement.where(University.provides_accommodation == provides_accommodation)
                
            if search:
                statement = statement.where(
                    University.name.ilike(f"%{search}%")
                )
            
            # Apply pagination
            statement = statement.offset(skip).limit(limit)
            
            result = await session.exec(statement)
            universities = result.all()
            return universities
            
        except InterfaceError as e:
            if "connection is closed" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Database connection error. Please try again."
                )
            raise

    async def update_university(
        self, 
        university_id: uuid.UUID, 
        university_data: UniversityUpdate,
        session: AsyncSession
    ) -> University:
        """Update university information"""
        university = await self.get_university_by_id(university_id, session)
        
        # Update only provided fields
        update_data = university_data.model_dump(exclude_unset=True)
        
        if update_data:
            for field, value in update_data.items():
                setattr(university, field, value)
            
            university.updated_at = datetime.now()
            
            try:
                session.add(university)
                await session.commit()
                await session.refresh(university)
            except Exception as e:
                await session.rollback()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Error updating university: {str(e)}"
                )
        
        return university

    async def delete_university(self, university_id: uuid.UUID, session: AsyncSession) -> bool:
        """Soft delete university (mark as inactive)"""
        university = await self.get_university_by_id(university_id, session)
        
        try:
            # Soft delete by marking as inactive
            university.is_active = False
            university.updated_at = datetime.now()
            
            # Also deactivate all academic programs
            statement = select(AcademicProgram).where(
                AcademicProgram.university_uid == university_id
            )
            result = await session.exec(statement)
            programs = result.all()
            
            for program in programs:
                program.is_active = False
                program.updated_at = datetime.now()
                session.add(program)
            
            session.add(university)
            await session.commit()
            return True
            
        except Exception as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error deleting university: {str(e)}"
            )

    async def get_university_statistics(self, session: AsyncSession):
        """Get university statistics"""
        try:
            statement = select(University).where(University.is_active == True)
            result = await session.exec(statement)
            total_universities = result.all()
            
            stats = {
                "total_universities": len(total_universities),
                "by_country": {},
                "by_type": {},
                "by_ranking": {},
                "with_scholarships": 0,
                "with_accommodation": 0,
                "partner_universities": 0
            }
            
            for uni in total_universities:
                # Count by country
                stats["by_country"][uni.country] = stats["by_country"].get(uni.country, 0) + 1
                
                # Count by type
                stats["by_type"][uni.university_type.value] = stats["by_type"].get(uni.university_type.value, 0) + 1
                
                # Count by ranking
                stats["by_ranking"][uni.ranking.value] = stats["by_ranking"].get(uni.ranking.value, 0) + 1
                
                # Count features
                if uni.offers_scholarships:
                    stats["with_scholarships"] += 1
                if uni.provides_accommodation:
                    stats["with_accommodation"] += 1
                if uni.partner_university:
                    stats["partner_universities"] += 1
            
            return stats
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error getting statistics: {str(e)}"
            )


class AcademicProgramService:
    async def get_programs_by_university(self, university_id: uuid.UUID, session: AsyncSession) -> List[AcademicProgram]:
        """Get all academic programs for a university"""
        try:
            statement = (
                select(AcademicProgram)
                .where(
                    and_(
                        AcademicProgram.university_uid == university_id,
                        AcademicProgram.is_active == True
                    )
                )
            )
            result = await session.exec(statement)
            return result.all()
            
        except InterfaceError as e:
            if "connection is closed" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Database connection error. Please try again."
                )
            raise

    async def get_program_by_id(self, program_id: uuid.UUID, session: AsyncSession) -> Optional[AcademicProgram]:
        """Get academic program by ID"""
        try:
            statement = (
                select(AcademicProgram)
                .where(AcademicProgram.uid == program_id)
            )
            result = await session.exec(statement)
            program = result.first()
            
            if not program:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Academic program not found"
                )
            
            return program
            
        except InterfaceError as e:
            if "connection is closed" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Database connection error. Please try again."
                )
            raise
