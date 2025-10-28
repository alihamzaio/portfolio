"use client"

import { useEffect, useState } from "react"

type Skill = { name: string; level: number; image?: string; originalName?: string }
type Project = {
    id: number
    title: string
    description: string
    tags: string[]
    image?: string
    details?: string
    link?: string
    github?: string
}

export default function AdminPage() {
    const [token, setToken] = useState<string>("")
    const [authed, setAuthed] = useState<boolean>(false)
    const [tab, setTab] = useState<"skills" | "projects" | "cv">("skills")
    const [skills, setSkills] = useState<Skill[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [resumeFiles, setResumeFiles] = useState<string[]>([])
    const [activeResume, setActiveResume] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
        if (stored) {
            setToken(stored)
            setAuthed(true)
        }
    }, [])

    useEffect(() => {
        if (!authed) return
        fetch("/api/skills").then((r) => r.json()).then((list: Skill[]) => setSkills(list.map(s => ({ ...s, originalName: s.name }))))
        fetch("/api/projects").then((r) => r.json()).then(setProjects)
        fetch("/api/resume").then((r) => r.json()).then((d) => {
            setResumeFiles(d.files || [])
            setActiveResume(d.active || null)
        })
    }, [authed])

    const login = () => {
        if (!token) return
        localStorage.setItem('admin_token', token)
        setAuthed(true)
    }

    const logout = () => {
        localStorage.removeItem('admin_token')
        setAuthed(false)
        setToken("")
    }

    const createSkill = async (sk: Skill) => {
        const res = await fetch("/api/skills", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: sk.name, level: sk.level, image: sk.image }),
        })
        if (res.ok) {
            const created = await res.json()
            setSkills(arr => arr.map(s => (s === sk ? { ...created, originalName: created.name } : s)))
        }
    }

    const updateSkill = async (index: number) => {
        const s = skills[index]
        const nameToUse = s.originalName || s.name
        const res = await fetch(`/api/skills/${encodeURIComponent(nameToUse)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: s.name, level: s.level, image: s.image }),
        })
        if (res.ok) {
            const updated = await res.json()
            setSkills(arr => arr.map((x, i) => (i === index ? { ...updated, originalName: updated.name } : x)))
        }
    }

    const deleteSkill = async (index: number) => {
        const s = skills[index]
        const nameToUse = s.originalName || s.name
        const res = await fetch(`/api/skills/${encodeURIComponent(nameToUse)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) setSkills(arr => arr.filter((_, i) => i !== index))
    }

    const createProject = async (p: Project) => {
        const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(p),
        })
        if (res.ok) {
            const created = await res.json()
            setProjects(arr => arr.map(x => (x === p ? created : x)))
        }
    }

    const updateProject = async (index: number) => {
        const p = projects[index]
        const res = await fetch(`/api/projects/${p.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(p),
        })
        if (res.ok) {
            const updated = await res.json()
            setProjects(arr => arr.map((x, i) => (i === index ? updated : x)))
        }
    }

    const deleteProject = async (index: number) => {
        const p = projects[index]
        const res = await fetch(`/api/projects/${p.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) setProjects(arr => arr.filter((_, i) => i !== index))
    }

    const uploadResume = async (file: File) => {
        setUploading(true)
        const fd = new FormData()
        fd.append("file", file)
        await fetch("/api/resume", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
        })
        setUploading(false)
        const d = await fetch("/api/resume").then((r) => r.json())
        setResumeFiles(d.files || [])
    }

    const setActive = async (name: string) => {
        await fetch("/api/resume", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ active: name }),
        })
        setActiveResume(name)
    }

    const removeResume = async (name: string) => {
        await fetch(`/api/resume?name=${encodeURIComponent(name)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
        const d = await fetch("/api/resume").then((r) => r.json())
        setResumeFiles(d.files || [])
        setActiveResume(d.active || null)
    }

    if (!authed) {
        return (
            <main className="max-w-md mx-auto px-4 py-24 space-y-4">
                <h1 className="text-3xl font-bold text-center">Admin Login</h1>
                <input
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter ADMIN_TOKEN"
                    className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
                />
                <button onClick={login} className="w-full px-4 py-2 rounded bg-primary text-background">Login</button>
            </main>
        )
    }

    return (
        <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Admin</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setTab('skills')} className={`px-3 py-2 rounded ${tab === 'skills' ? 'bg-primary text-background' : 'bg-white/5'}`}>Skills</button>
                    <button onClick={() => setTab('projects')} className={`px-3 py-2 rounded ${tab === 'projects' ? 'bg-primary text-background' : 'bg-white/5'}`}>Projects</button>
                    <button onClick={() => setTab('cv')} className={`px-3 py-2 rounded ${tab === 'cv' ? 'bg-primary text-background' : 'bg-white/5'}`}>CV</button>
                    <button onClick={logout} className="px-3 py-2 rounded bg-red-600/80">Logout</button>
                </div>
            </div>

            {tab === 'skills' && (
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Skills</h2>
                        <button
                            onClick={() => setSkills((s) => [...s, { name: "New Skill", level: 50 }])}
                            className="px-3 py-2 rounded bg-primary text-background"
                        >Add</button>
                    </div>
                    <div className="space-y-3">
                        {skills.map((sk, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                                <input
                                    value={sk.name}
                                    onChange={(e) => {
                                        const v = e.target.value
                                        setSkills((arr) => arr.map((x, idx) => (idx === i ? { ...x, name: v } : x)))
                                    }}
                                    className="px-3 py-2 rounded bg-white/5 border border-white/10"
                                />
                                <input
                                    type="number"
                                    value={sk.level}
                                    onChange={(e) => {
                                        const v = Number(e.target.value)
                                        setSkills((arr) => arr.map((x, idx) => (idx === i ? { ...x, level: v } : x)))
                                    }}
                                    className="px-3 py-2 rounded bg-white/5 border border-white/10"
                                />
                                <input
                                    value={sk.image || ""}
                                    onChange={(e) => {
                                        const v = e.target.value
                                        setSkills((arr) => arr.map((x, idx) => (idx === i ? { ...x, image: v } : x)))
                                    }}
                                    placeholder="Image URL (optional)"
                                    className="px-3 py-2 rounded bg-white/5 border border-white/10"
                                />
                                <button
                                    onClick={() => (sk.originalName ? updateSkill(i) : createSkill(sk))}
                                    className="px-3 py-2 rounded bg-primary text-background"
                                >Save</button>
                                <button
                                    onClick={() => (sk.originalName ? deleteSkill(i) : setSkills(arr => arr.filter((_, idx) => idx !== i)))}
                                    className="px-3 py-2 rounded bg-red-600/80"
                                >Remove</button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {tab === 'projects' && (
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Projects</h2>
                        <button
                            onClick={() => setProjects((p) => [
                                ...p,
                                { id: Date.now(), title: "New Project", description: "", tags: [] },
                            ])}
                            className="px-3 py-2 rounded bg-primary text-background"
                        >Add</button>
                    </div>
                    <div className="space-y-3">
                        {projects.map((pr, i) => (
                            <div key={pr.id} className="space-y-2 border border-white/10 rounded p-3">
                                <input value={pr.title} onChange={(e) => {
                                    const v = e.target.value
                                    setProjects((arr) => arr.map((x, idx) => (idx === i ? { ...x, title: v } : x)))
                                }} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
                                <textarea value={pr.description} onChange={(e) => {
                                    const v = e.target.value
                                    setProjects((arr) => arr.map((x, idx) => (idx === i ? { ...x, description: v } : x)))
                                }} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
                                <input value={(pr.tags || []).join(', ')} onChange={(e) => {
                                    const v = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                                    setProjects((arr) => arr.map((x, idx) => (idx === i ? { ...x, tags: v } : x)))
                                }} placeholder="Tags (comma separated)" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
                                <input value={pr.image || ''} onChange={(e) => {
                                    const v = e.target.value
                                    setProjects((arr) => arr.map((x, idx) => (idx === i ? { ...x, image: v } : x)))
                                }} placeholder="Image URL" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
                                <input value={pr.details || ''} onChange={(e) => {
                                    const v = e.target.value
                                    setProjects((arr) => arr.map((x, idx) => (idx === i ? { ...x, details: v } : x)))
                                }} placeholder="Details" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <input value={pr.link || ''} onChange={(e) => {
                                        const v = e.target.value
                                        setProjects((arr) => arr.map((x, idx) => (idx === i ? { ...x, link: v } : x)))
                                    }} placeholder="Live Link" className="px-3 py-2 rounded bg-white/5 border border-white/10" />
                                    <input value={pr.github || ''} onChange={(e) => {
                                        const v = e.target.value
                                        setProjects((arr) => arr.map((x, idx) => (idx === i ? { ...x, github: v } : x)))
                                    }} placeholder="GitHub Link" className="px-3 py-2 rounded bg-white/5 border border-white/10" />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => updateProject(i)} className="px-3 py-2 rounded bg-primary text-background">Save</button>
                                    <button onClick={() => deleteProject(i)} className="px-3 py-2 rounded bg-red-600/80">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {tab === 'cv' && (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Resume PDFs</h2>
                    <input type="file" accept="application/pdf" onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) uploadResume(f)
                    }} />
                    {uploading && <div>Uploading...</div>}
                    <div className="space-y-2">
                        {resumeFiles.map((name) => (
                            <div key={name} className="flex items-center gap-3">
                                <span className="flex-1">{name}{activeResume === name ? " (active)" : ""}</span>
                                <button onClick={() => setActive(name)} className="px-3 py-2 rounded bg-primary text-background">Set Active</button>
                                <button onClick={() => removeResume(name)} className="px-3 py-2 rounded bg-red-600/80">Delete</button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    )
}


