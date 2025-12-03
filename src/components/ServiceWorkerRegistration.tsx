"use client"

import { useEffect } from "react"

export default function ServiceWorkerRegistration() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return

        if (process.env.NODE_ENV !== "production") {
            navigator.serviceWorker.getRegistrations().then((regs) => {
                regs.forEach((r) => r.unregister())
            })
            if ("caches" in window) {
                caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
            }
            return
        }

        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
                console.log("Service Worker registered:", registration)
            })
            .catch((error) => {
                console.log("Service Worker registration failed:", error)
            })
    }, [])

    return null
}
