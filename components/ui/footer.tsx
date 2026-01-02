export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full text-center text-sm text-muted-foreground'>
      <p>&copy; {currentYear} woop.foo. All rights reserved.</p>
    </footer>
  );
}
