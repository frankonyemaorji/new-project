import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AuthUtils, Permission } from '@/lib/auth'

// GET /api/admin/analytics - Get system analytics (Admin only)
export async function GET(request: NextRequest) {
  try {
    await AuthUtils.requirePermission(request, Permission.VIEW_ANALYTICS)

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Parallel queries for performance
    const [
      totalUsers,
      totalUniversities,
      totalApplications,
      totalSessions,
      recentUsers,
      usersByRole,
      applicationsByStatus,
      universitiesByCountry,
      recentApplications,
      sessionsByStatus
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.university.count(),
      prisma.application.count(),
      prisma.counselingSession.count(),

      // Users created in the period
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),

      // Users by role
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true
        }
      }),

      // Applications by status
      prisma.application.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      }),

      // Universities by country
      prisma.university.groupBy({
        by: ['country'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      }),

      // Recent applications
      prisma.application.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),

      // Sessions by status
      prisma.counselingSession.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      })
    ])

    // Growth metrics
    const previousPeriodStart = new Date()
    previousPeriodStart.setDate(previousPeriodStart.getDate() - (parseInt(period) * 2))
    previousPeriodStart.setDate(previousPeriodStart.getDate() + parseInt(period))

    const [
      previousPeriodUsers,
      previousPeriodApplications
    ] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            gte: previousPeriodStart,
            lt: startDate
          }
        }
      }),
      prisma.application.count({
        where: {
          createdAt: {
            gte: previousPeriodStart,
            lt: startDate
          }
        }
      })
    ])

    // Calculate growth rates
    const userGrowthRate = previousPeriodUsers > 0 
      ? ((recentUsers - previousPeriodUsers) / previousPeriodUsers) * 100 
      : 0

    const applicationGrowthRate = previousPeriodApplications > 0 
      ? ((recentApplications - previousPeriodApplications) / previousPeriodApplications) * 100 
      : 0

    // Daily registrations for the past 30 days
    const dailyRegistrations = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as count
      FROM User 
      WHERE createdAt >= ${startDate}
      GROUP BY DATE(createdAt)
      ORDER BY date
    `

    const analytics = {
      overview: {
        totalUsers,
        totalUniversities,
        totalApplications,
        totalSessions,
        period: parseInt(period)
      },
      growth: {
        newUsers: recentUsers,
        newApplications: recentApplications,
        userGrowthRate: Math.round(userGrowthRate * 100) / 100,
        applicationGrowthRate: Math.round(applicationGrowthRate * 100) / 100
      },
      distributions: {
        usersByRole: usersByRole.map(item => ({
          role: item.role,
          count: item._count.id
        })),
        applicationsByStatus: applicationsByStatus.map(item => ({
          status: item.status,
          count: item._count.id
        })),
        universitiesByCountry: universitiesByCountry.map(item => ({
          country: item.country,
          count: item._count.id
        })),
        sessionsByStatus: sessionsByStatus.map(item => ({
          status: item.status,
          count: item._count.id
        }))
      },
      trends: {
        dailyRegistrations
      },
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Error fetching analytics:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
      }
      if (error.message === 'Insufficient permissions') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}