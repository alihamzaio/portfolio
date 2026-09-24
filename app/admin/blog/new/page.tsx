"use client"

import { AdminWorkspace } from "@/components/admin/admin-workspace"
import { AdminBlogEditor } from "@/components/admin/admin-blog-editor"

export default function AdminBlogNewPage() {
  return (
    <AdminWorkspace tab="blog" pageTitle="New blog post">
      {({ onNotice, onError }) => (
        <AdminBlogEditor mode="new" onNotice={onNotice} onError={onError} />
      )}
    </AdminWorkspace>
  )
}
