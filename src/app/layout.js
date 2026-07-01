import './globals.css';

export const metadata = {
  title: "INEXON'26 - MCA Symposium | KIOT Salem",
  description: "Technical & Non-Technical Symposium by Department of MCA, KIOT Salem. Innovate | Integrate | Inspire on March 12, 2026.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/media/image.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
