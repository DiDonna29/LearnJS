export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} LearnJS. All rights reserved.</p>
        <p className="text-sm mt-1">Your journey to JavaScript mastery starts here.</p>
      </div>
    </footer>
  );
}
