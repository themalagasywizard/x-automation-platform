import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "X Automation Platform",
  description: "Automate your X interactions with AI-powered replies and scheduling",
  generator: 'v0.dev',
  other: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://dapxfjkdfrcwxfqrdvga.supabase.co https://twitter.com https://x.com; connect-src 'self' https://dapxfjkdfrcwxfqrdvga.supabase.co https://api.twitter.com https://upload.twitter.com https://twitter.com https://x.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self' https://dapxfjkdfrcwxfqrdvga.supabase.co; frame-ancestors 'none'; frame-src https://twitter.com https://x.com https://dapxfjkdfrcwxfqrdvga.supabase.co;"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://dapxfjkdfrcwxfqrdvga.supabase.co https://twitter.com https://x.com; connect-src 'self' https://dapxfjkdfrcwxfqrdvga.supabase.co https://api.twitter.com https://upload.twitter.com https://twitter.com https://x.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self' https://dapxfjkdfrcwxfqrdvga.supabase.co; frame-ancestors 'none'; frame-src https://twitter.com https://x.com https://dapxfjkdfrcwxfqrdvga.supabase.co;" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex min-h-screen bg-background text-foreground">
              <Sidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
