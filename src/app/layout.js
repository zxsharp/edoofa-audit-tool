import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
});

export const metadata = {
  title: 'Edoofa Audit Engine - Conversational Compliance',
  description: 'AI-driven auditing tool for WhatsApp chat transcripts, compliance monitoring, and career counseling quality assurance.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-bgPrimary text-textPrimary antialiased">
        {children}
      </body>
    </html>
  );
}

