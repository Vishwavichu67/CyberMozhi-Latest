import type { Metadata } from 'next';
import { GuideContent } from "@/components/guide/GuideContent";

export const metadata: Metadata = {
  title: 'Site Guide - CyberMozhi',
  description: 'Learn how to effectively use CyberMozhi to understand Indian cyber laws and cybersecurity.',
};

export default function GuidePage() {
  return <GuideContent />;
}