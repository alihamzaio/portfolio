import { NextResponse } from "next/server"
import { storeSyncMessage, type StoreWriteResult } from "@/lib/store"

export function jsonWithStoreSync<T>(body: T, writeResult: StoreWriteResult, init?: ResponseInit) {
  const res = NextResponse.json(body, init)
  const message = storeSyncMessage(writeResult)
  if (message) {
    res.headers.set("X-Portfolio-Sync", writeResult.persisted)
    res.headers.set("X-Portfolio-Sync-Message", message)
  }
  if (writeResult.github?.prUrl) {
    res.headers.set("X-Portfolio-Sync-Url", writeResult.github.prUrl)
  }
  return res
}
