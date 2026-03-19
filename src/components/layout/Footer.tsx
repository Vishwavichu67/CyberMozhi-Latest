
export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-background/95 py-4 text-center text-xs text-foreground/60 w-full flex-shrink-0">
      <div className="container mx-auto px-4">
        <p>&copy; {currentYear} CyberMozhi by Vishwa. All rights reserved.</p>
        <p className="mt-1">Empowering Indian netizens with cyber law knowledge.</p>
      </div>
    </footer>
  );
}
