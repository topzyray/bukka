"use client";

import { useTheme } from "next-themes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui";

export function ThemePreferenceCard() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Label htmlFor="theme">Theme Preference</Label>
        <div className="flex items-center gap-2">
          <Select value={theme} onValueChange={(value) => setTheme(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <ThemeToggle />
        </div>
      </CardContent>
    </Card>
  );
}
