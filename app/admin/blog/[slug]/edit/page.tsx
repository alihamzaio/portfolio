"use client"

import { use } from "react"
import { AdminWorkspace } from "@/components/admin/admin-workspace"
import { AdminBlogEditor } from "@/components/admin/admin-blog-editor"

type Props = {
  params: Promise<{ slug: string }>
}

export default function AdminBlogEditPage({ params }: Props) {
  const { slug } = use(params)

  return (
    <AdminWorkspace tab="blog" pageTitle={`Edit: ${slug}`}>
      {({ onNotice, onError }) => (
        <AdminBlogEditor mode="edit" slug={slug} onNotice={onNotice} onError={onError} />
      )}
    </AdminWorkspace>
  )
}
