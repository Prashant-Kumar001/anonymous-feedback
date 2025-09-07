import React from 'react'
import "../globals.css"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            {children}
        </main>
    )
}

export default AuthLayout
