
"use client";

import Image from 'next/image';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-300 ease-in-out">
      <div className="relative animate-logo-pulse">
        <Image
          src="/logo.png"
          alt="CyberMozhi Loading..."
          width={150}
          height={150}
          priority // Ensures logo loads quickly for splash
          className="rounded-full"
        />
      </div>
    </div>
  );
}
