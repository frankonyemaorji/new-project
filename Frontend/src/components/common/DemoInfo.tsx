"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Users, Shield, Database, X } from "lucide-react";
import { useState } from "react";

export function DemoInfo() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-blue-600 mr-2" />
              <CardTitle className="text-sm text-blue-900">Demo Mode</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-blue-700 text-xs">
            This is a demo version with mock data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <Alert className="bg-white border-blue-200">
            <Database className="h-4 w-4" />
            <AlertDescription className="text-xs">
              All data is temporary and changes won't persist after refresh
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-blue-900">Demo Login Credentials:</h4>
            
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Student:</span>
                <Badge variant="outline" className="text-xs bg-green-50 border-green-200">
                  student@example.com
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Admin:</span>
                <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200">
                  admin@educonnect.africa
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Counselor:</span>
                <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200">
                  counselor@educonnect.africa
                </Badge>
              </div>
              <div className="text-center text-blue-600 font-mono text-xs mt-1">
                Password: <strong>password123</strong> (for student)<br/>
                Password: <strong>admin123</strong> (for admin)<br/>
                Password: <strong>counselor123</strong> (for counselor)
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-blue-900">Available Features:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• User registration & login</li>
              <li>• Browse universities & programs</li>
              <li>• View counselors & book sessions</li>
              <li>• Admin dashboard & management</li>
              <li>• Scholarship browsing</li>
            </ul>
          </div>

          <Alert className="bg-yellow-50 border-yellow-200">
            <Shield className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-xs text-yellow-800">
              This is a frontend-only demo. No real data is stored or processed.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}