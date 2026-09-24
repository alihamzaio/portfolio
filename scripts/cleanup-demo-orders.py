"""One-shot: remove demo orders from content/live + used via gh api."""
from __future__ import annotations

import base64
import json
import subprocess
import urllib.error
import urllib.request


def gh_api(method: str, path: str, body: dict | None = None) -> dict:
    cmd = ["gh", "api", "-X", method, path]
    if body is not None:
        cmd.extend(["--input", "-"])
        raw = subprocess.check_output(
            cmd, input=json.dumps(body).encode("utf-8")
        )
    else:
        raw = subprocess.check_output(cmd)
    return json.loads(raw.decode("utf-8"))


def is_demo(o: dict) -> bool:
    email = (o.get("buyerEmail") or "").lower()
    name = (o.get("buyerName") or "").lower()
    tid = str(
        o.get("transactionId")
        or o.get("transactionOrProof")
        or o.get("proof")
        or ""
    ).upper()
    return (
        "demo" in email
        or "example.com" in email
        or email.endswith("@test.com")
        or name.startswith("demo")
        or name.startswith("test ")
        or "DEMO" in tid
        or "UI-TEST" in tid
    )


def main() -> None:
    meta = gh_api("GET", "repos/alihamzaio/portfolio/contents/content/orders.json?ref=content/live")
    data = json.loads(base64.b64decode(meta["content"]).decode("utf-8"))
    before = list(data.get("orders") or [])
    kept = [o for o in before if not is_demo(o)]
    removed = [o for o in before if is_demo(o)]
    print("before", len(before), "kept", len(kept), "removed", len(removed))
    for o in removed:
        print(" remove", o.get("id"), o.get("buyerName"), o.get("buyerEmail"))

    payload = (json.dumps({"orders": kept}, indent=2) + "\n").encode("utf-8")
    gh_api(
        "PUT",
        "repos/alihamzaio/portfolio/contents/content/orders.json",
        {
            "message": "Remove demo/test product orders.",
            "content": base64.b64encode(payload).decode("ascii"),
            "sha": meta["sha"],
            "branch": "content/live",
        },
    )
    print("updated content/live content/orders.json")


if __name__ == "__main__":
    main()
