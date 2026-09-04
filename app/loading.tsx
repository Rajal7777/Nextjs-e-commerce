// Generic app-wide fallback; route groups with distinct layouts (search, admin, etc.) should define their own loading.tsx
export default function LoadingPage() {
  return (
    <div className="flex min-h-100 w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
    </div>
  );
}

