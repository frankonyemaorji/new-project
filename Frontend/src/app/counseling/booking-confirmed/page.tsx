"use client";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  CheckCircle,
  Calendar,
  Clock,
  Video,
  MessageCircle,
  Package,
  Download,
  Star,
  ArrowRight,
  CalendarDays,
  Bell,
  ExternalLink,
  Copy,
  Share2
} from "lucide-react";

// Updated counselor data with real calendar links
const counselorsData = [
  {
    id: "counselor-001",
    name: "Dr. Amina Ibrahim",
    image: "/images/counselors/amina.jpg",
    title: "International Education Specialist",
    email: "amina@educonnect.com",
    phone: "+234 801 234 5678",
    calendarLinks: {
      video: "https://chat.google.com/dm/4LviiUAAAAE/k8COZN8IRsA/k8COZN8IRsA",
      chat: "https://chat.google.com/dm/4LviiUAAAAE/7tcrqeRUMUY/7tcrqeRUMUY",
      package: "https://chat.google.com/dm/4LviiUAAAAE/zuqFzgs24ms/zuqFzgs24ms"
    }
  },
  {
    id: "counselor-002",
    name: "Michael Okonkwo",
    image: "/images/counselors/michael.jpg",
    title: "Engineering Education Consultant",
    email: "michael@educonnect.com",
    phone: "+234 802 345 6789",
    calendarLinks: {
      video: "https://chat.google.com/dm/4LviiUAAAAE/k8COZN8IRsA/k8COZN8IRsA",
      chat: "https://chat.google.com/dm/4LviiUAAAAE/7tcrqeRUMUY/7tcrqeRUMUY",
      package: "https://chat.google.com/dm/4LviiUAAAAE/zuqFzgs24ms/zuqFzgs24ms"
    }
  },
  {
    id: "counselor-003",
    name: "Grace Adeyemi",
    image: "/images/counselors/grace.jpg",
    title: "Scholarship & Financial Aid Expert",
    email: "grace@educonnect.com",
    phone: "+234 803 456 7890",
    calendarLinks: {
      video: "https://chat.google.com/dm/4LviiUAAAAE/k8COZN8IRsA/k8COZN8IRsA",
      chat: "https://chat.google.com/dm/4LviiUAAAAE/7tcrqeRUMUY/7tcrqeRUMUY",
      package: "https://chat.google.com/dm/4LviiUAAAAE/zuqFzgs24ms/zuqFzgs24ms"
    }
  }
];

const consultationTypes = [
  {
    id: "video",
    name: "Video Call",
    icon: Video,
    duration: 45
  },
  {
    id: "chat",
    name: "Chat Session",
    icon: MessageCircle,
    duration: 60
  },
  {
    id: "package",
    name: "Comprehensive Package",
    icon: Package,
    duration: 120
  }
];

export default function BookingConfirmedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentId = searchParams.get("paymentId");
  const counselorId = searchParams.get("counselorId");
  const sessionType = searchParams.get("type");
  const sessionDate = searchParams.get("date");
  const sessionTime = searchParams.get("time");

  // State for calendar interaction
  const [calendarOpened, setCalendarOpened] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Find counselor and session type
  const counselor = counselorsData.find(c => c.id === counselorId) || counselorsData[0];
  const consultationType = consultationTypes.find(ct => ct.id === sessionType) || consultationTypes[0];

  // Get the real calendar link for this session type
  const calendarLink = counselor.calendarLinks[sessionType as keyof typeof counselor.calendarLinks];

  // Generate booking reference
  const bookingRef = `EC-${paymentId?.slice(-8).toUpperCase()}`;

  const getTypeIcon = () => {
    const Icon = consultationType.icon;
    return <Icon className="h-4 w-4" />;
  };

  const downloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    console.log("Downloading receipt for payment:", paymentId);
  };

  // Open real calendar link
  const openRealCalendar = () => {
    if (calendarLink) {
      window.open(calendarLink, '_blank');
      setCalendarOpened(true);
    }
  };

  // Copy calendar link
  const copyCalendarLink = async () => {
    if (calendarLink) {
      try {
        await navigator.clipboard.writeText(calendarLink);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const addToCalendar = () => {
    if (!sessionDate || !sessionTime) return;

    const startDate = parseISO(sessionTime);
    const endDate = new Date(startDate.getTime() + (consultationType.duration * 60000));

    const event = {
      title: `Consultation with ${counselor.name}`,
      start: `${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      end: `${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      description: `${consultationType.name} consultation session with ${counselor.name}, ${counselor.title}. Finalize time at: ${calendarLink}`,
      location: 'Online via EduConnect Africa'
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

    window.open(googleCalendarUrl, '_blank');
  };

  if (!paymentId || !counselorId || !sessionDate || !sessionTime) {
    return (
      <MainLayout>
        <div className="container max-w-4xl mx-auto py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Invalid Booking Information</h2>
              <p className="text-muted-foreground mb-4">
                We couldn't find your booking details. Please check your email for confirmation.
              </p>
              <Link href="/counseling">
                <Button>Browse Counselors</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8">
        {/* Success Header */}
        <Card className="mb-8">
          <CardContent className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-lg mb-4">
              Your consultation has been successfully booked and paid for.
            </p>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              Booking Reference: {bookingRef}
            </Badge>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Session Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Information */}
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Counselor Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={counselor.image} alt={counselor.name} />
                    <AvatarFallback>
                      {counselor.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{counselor.name}</h3>
                    <p className="text-muted-foreground">{counselor.title}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm">Verified Expert</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Session Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Session Type</p>
                    <div className="flex items-center">
                      {getTypeIcon()}
                      <span className="ml-2 font-medium">{consultationType.name}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Duration</p>
                    <p className="font-medium">{consultationType.duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">{format(parseISO(sessionDate), "EEEE, MMM d, yyyy")}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Time</p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="font-medium">{format(parseISO(sessionTime), "h:mm a")} WAT</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h4 className="font-medium mb-3">Counselor Contact</h4>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-sm">
                      <strong>Email:</strong> {counselor.email}
                    </p>
                    <p className="text-sm">
                      <strong>Phone:</strong> {counselor.phone}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your counselor may contact you before the session with additional information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* REAL CALENDAR INTEGRATION - NEW SECTION */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Finalize Your Appointment Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-green-700">
                  🎯 <strong>Important:</strong> Click the button below to access {counselor.name}'s real calendar and confirm your exact appointment time.
                </p>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={openRealCalendar}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open {counselor.name}'s Calendar
                  </Button>
                  
                  <Button
                    onClick={copyCalendarLink}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copySuccess ? "Copied!" : "Copy Link"}
                  </Button>
                </div>

                {calendarOpened && (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-green-700">
                        ✅ Calendar opened! Please select your preferred time slot.
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-green-600 space-y-1">
                  <p>• This will open {counselor.name}'s actual calendar</p>
                  <p>• Select your preferred time slot from available options</p>
                  <p>• You'll receive final confirmation once time is selected</p>
                </div>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card>
              <CardHeader>
                <CardTitle>What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-green-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Select Your Time</h4>
                      <p className="text-sm text-muted-foreground">
                        Click the calendar link above to choose your exact appointment time with {counselor.name}.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-green-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Confirmation Email</h4>
                      <p className="text-sm text-muted-foreground">
                        You'll receive a detailed confirmation email with session link and preparation tips.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-green-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Join Your Session</h4>
                      <p className="text-sm text-muted-foreground">
                        Join your session 5 minutes early using the link in your confirmation email.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={addToCalendar}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Add to My Calendar
                </Button>

                <Button
                  onClick={downloadReceipt}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>

                <Link href="/profile/consultations">
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    View All Bookings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Calendar Link Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-base text-blue-800">📅 Calendar Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-blue-700">
                  Direct link to {counselor.name}'s calendar for easy access:
                </p>
                <div className="bg-blue-100 p-2 rounded text-xs break-all text-blue-600">
                  {calendarLink}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={openRealCalendar}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open
                  </Button>
                  <Button
                    onClick={copyCalendarLink}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Continue Your Journey</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/counseling">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                    Book Another Session
                  </Button>
                </Link>

                <Link href="/universities">
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Explore Universities
                  </Button>
                </Link>

                <Link href="/tools/calculator">
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Grade Calculator
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  If you have any questions about your booking, please contact our support team.
                </p>
                <div className="space-y-1">
                  <p><strong>Email:</strong> support@educonnect-africa.com</p>
                  <p><strong>Phone:</strong> +234 800 123 4567</p>
                  <p><strong>Hours:</strong> Mon-Fri, 9AM-6PM WAT</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}