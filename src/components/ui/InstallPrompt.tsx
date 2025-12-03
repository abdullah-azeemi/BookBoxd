"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {
        // Check if already installed (standalone mode)
        const standalone = window.matchMedia("(display-mode: standalone)").matches
        setIsStandalone(standalone)

        // Check if iOS
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window)
        setIsIOS(ios)

        // Check if user previously dismissed
        const dismissed = localStorage.getItem("pwa-install-dismissed")
        if (dismissed) return

        // Listen for beforeinstallprompt event (Chrome, Edge)
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)

            // Show prompt after slight delay (better UX)
            setTimeout(() => setShowPrompt(true), 3000)
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstall)

        // For iOS, show custom prompt if not in standalone mode
        if (ios && !standalone && !dismissed) {
            setTimeout(() => setShowPrompt(true), 3000)
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
        }
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === "accepted") {
            setDeferredPrompt(null)
            setShowPrompt(false)
        }
    }

    const handleDismiss = () => {
        setShowPrompt(false)
        localStorage.setItem("pwa-install-dismissed", "true")
    }

    // Don't show if already installed or dismissed
    if (!showPrompt || isStandalone) return null

    return (
        <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40 animate-slide-up">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Download className="h-5 w-5 text-white" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                            Install BookBoxd
                        </h3>

                        {isIOS ? (
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Tap the Share button <span className="inline-block">📤</span> then &quot;Add to Home Screen&quot;
                            </p>
                        ) : (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                Install our app for a better experience with offline access
                            </p>
                        )}

                        {!isIOS && deferredPrompt && (
                            <button
                                onClick={handleInstall}
                                className="mt-2 w-full px-3 py-2 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                            >
                                Install Now
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        aria-label="Dismiss"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
