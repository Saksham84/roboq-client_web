import { Bot, Instagram, Youtube, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

// export function Footer() {
//   return (
//     <footer className="border-t border-border/40 mt-12 py-6">
//       <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
//         <div className="flex items-center gap-2">
//           <Bot className="h-6 w-6 text-primary" />
//           <p className="text-sm text-muted-foreground">
//             &copy; {new Date().getFullYear()} RoboQ. All rights reserved.
//           </p>
//         </div>
//         <div className="flex items-center gap-4">
//             <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
//             <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="h-5 w-5" /></Link>
//             <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></Link>
//             <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
//             <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></Link>
//         </div>
//       </div>
//     </footer>
//   );
// }


export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-12 py-6">
      <div className="container flex justify-center">
        <div className="flex items-center gap-2 text-center">
          <Bot className="h-6 w-6 text-primary" />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} RoboQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
