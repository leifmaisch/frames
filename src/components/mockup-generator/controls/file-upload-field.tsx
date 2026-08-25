import { UploadIcon } from "@phosphor-icons/react"
import { useRef, type ReactNode } from "react"

import { iconWeight } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription } from "@/components/ui/field"

type FileUploadFieldProps = {
  label: string
  description?: string
  preview?: ReactNode
  onUpload: (file: File | undefined) => void | Promise<void>
}

export function FileUploadField({
  label,
  description,
  preview,
  onUpload,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Field>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          void onUpload(event.target.files?.[0])
          event.target.value = ""
        }}
      />

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => inputRef.current?.click()}
      >
        <UploadIcon weight={iconWeight} />
        {label}
      </Button>

      {preview}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  )
}
