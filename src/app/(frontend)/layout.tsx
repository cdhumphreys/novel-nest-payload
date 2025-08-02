import React from 'react'
import './styles.css'
import './normalize.css'

export const metadata = {
  description: 'Novel Nest project with Payload CMS',
  title: 'Novel Nest',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
