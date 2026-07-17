import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Project Management SaaS",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (

    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >

      <body className="bg-gray-100">

        {children}

        <Toaster
          position="top-right"
          richColors
          closeButton
        />

      </body>

    </html>

  )

}