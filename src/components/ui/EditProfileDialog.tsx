"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Upload, Loader2 } from "lucide-react"

interface EditProfileDialogProps {
    open: boolean
    onClose: () => void
    currentUsername: string
    currentBio: string
    currentAvatarUrl: string
    onSave: (data: { username: string; bio: string; avatarUrl?: string }) => Promise<void>
}

export function EditProfileDialog({
    open,
    onClose,
    currentUsername,
    currentBio,
    currentAvatarUrl,
    onSave,
}: EditProfileDialogProps) {
    const [username, setUsername] = useState(currentUsername)
    const [bio, setBio] = useState(currentBio)
    const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB")
            return
        }

        // Validate file type
        if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
            alert("Only JPEG, PNG, and WebP images are allowed")
            return
        }

        setAvatarFile(file)
        setAvatarUrl(URL.createObjectURL(file))
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            let newAvatarUrl = avatarUrl

            // Upload avatar if changed
            if (avatarFile) {
                setUploading(true)
                const formData = new FormData()
                formData.append("file", avatarFile)

                const res = await fetch("/api/upload-avatar", {
                    method: "POST",
                    body: formData,
                })

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}))
                    throw new Error(errorData.error || "Failed to upload avatar")
                }

                const data = await res.json()
                newAvatarUrl = data.avatarUrl
                setUploading(false)
            }

            await onSave({
                username,
                bio,
                avatarUrl: newAvatarUrl,
            })

            onClose()
        } catch (error) {
            console.error("Failed to update profile:", error)
            alert("Failed to update profile. Please try again.")
        } finally {
            setLoading(false)
            setUploading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={avatarUrl} className="object-cover" />
                            <AvatarFallback className="text-2xl">{username[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploading ? "Uploading..." : "Change Photo"}
                        </Button>

                        <p className="text-xs text-slate-500 text-center">
                            JPG, PNG or WebP. Max size 5MB.
                        </p>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                            Username
                        </label>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            maxLength={50}
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                            Bio / Tagline
                        </label>
                        <Textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            maxLength={200}
                            rows={3}
                            className="resize-none"
                        />
                        <div className="text-xs text-slate-500 mt-1 text-right">
                            {bio.length}/200 characters
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !username.trim()}
                        className="bg-[#00A8FF] hover:bg-[#0090D9]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
