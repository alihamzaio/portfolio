"use client"

import { cn } from "@/lib/utils"

type BaseProps = {
  label: string
  id?: string
  className?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

type InputProps = BaseProps & {
  as?: "input"
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseProps>

type TextareaProps = BaseProps & {
  as: "textarea"
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseProps>

function resolveFieldId(label: string, explicit?: string, name?: string) {
  if (explicit) return explicit
  if (name) return `field-${name}`
  return `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}

export function FloatingField(props: InputProps | TextareaProps) {
  const { label, id: idProp, className, value, onChange, as = "input", ...rest } = props
  const id = resolveFieldId(label, idProp, "name" in rest ? String(rest.name ?? "") : undefined)
  const filled = String(value ?? "").length > 0

  return (
    <div className={cn("floating-field relative", className)}>
      {as === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          className="floating-input peer resize-none w-full"
          placeholder=" "
          aria-labelledby={`${id}-label`}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={onChange}
          className="floating-input peer w-full"
          placeholder=" "
          aria-labelledby={`${id}-label`}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      <label
        id={`${id}-label`}
        htmlFor={id}
        className={cn("floating-label", filled && "floating-label-active")}
      >
        {label}
      </label>
    </div>
  )
}
