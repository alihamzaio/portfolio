import { NextResponse } from "next/server"
import { storeSyncMessage, type StoreWriteResult } from "@/lib/store"

function asciiHeader(value: string): string {
  return value.replace(/[^\x20-\x7E]/g, "-")
}

export function jsonWithStoreSync<T>(body: T, writeResult: StoreWriteResult, init?: ResponseInit) {
  const res = NextResponse.json(body, init)
  const message = storeSyncMessage(writeResult)
  if (message) {
    res.headers.set("X-Portfolio-Sync", asciiHeader(writeResult.persisted))
    res.headers.set("X-Portfolio-Sync-Message", asciiHeader(message))
  }
  return res
}
