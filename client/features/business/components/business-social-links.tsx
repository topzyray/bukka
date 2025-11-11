import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Business } from "@/data/interfaces/Business";
import { Facebook, Instagram, Linkedin, Music2, Twitter } from "lucide-react";
import React from "react";

export function BusinessSocialLinks({ business }: { business: Business }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow & Share</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        {business.socialLinks.facebook && (
          <Button variant="outline" size="icon" asChild>
            <a
              href={business.socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </Button>
        )}
        {business.socialLinks.instagram && (
          <Button variant="outline" size="icon" asChild>
            <a
              href={business.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </Button>
        )}
        {business.socialLinks.twitter && (
          <Button variant="outline" size="icon" asChild>
            <a
              href={business.socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </Button>
        )}
        {business.socialLinks.linkedin && (
          <Button variant="outline" size="icon" asChild>
            <a
              href={business.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </Button>
        )}
        {business.socialLinks.tiktok && (
          <Button variant="outline" size="icon" asChild>
            <a
              href={business.socialLinks.tiktok}
              target="_blank"
              rel="noreferrer"
            >
              <Music2 className="w-4 h-4" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
