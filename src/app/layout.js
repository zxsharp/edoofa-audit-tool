import './globals.css';

export const metadata = {
  title: 'Edoofa Audit Engine - Conversational Compliance',
  description: 'AI-driven auditing tool for WhatsApp chat transcripts, compliance monitoring, and career counseling quality assurance.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-bgPrimary text-textPrimary antialiased">
        {children}
      </body>
    </html>
  );
}

