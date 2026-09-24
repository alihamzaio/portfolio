"use client"

import { AdminWorkspace } from "@/components/admin/admin-workspace"
import { AdminBlogPanel } from "@/components/admin/admin-blog-panel"

export default function AdminBlogListPage() {
  return (
    <AdminWorkspace tab="blog" pageTitle="Blog">
      {({ onNotice, onError }) => (
        <AdminBlogPanel onNotice={onNotice} onError={onError} />
      )}
    </AdminWorkspace>
  )
}
