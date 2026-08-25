"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

function isDataUrl(src: string) {
  return src.startsWith("data:")
}

type BackgroundThumbnailProps = {
  src: string
  alt: string
  className?: string
}

export function BackgroundThumbnail({
  src,
  alt,
  className,
}: BackgroundThumbnailProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      quality={25}
      sizes="120px"
      unoptimized={isDataUrl(src)}
      className={cn("object-cover", className)}
    />
  )
}

type PreviewBackgroundImageProps = {
  src: string
  blur: number
  scale: number
}

export function PreviewBackgroundImage({
  src,
  blur,
  scale,
}: PreviewBackgroundImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
  }, [src])

  const finishLoading = () => {
    setIsLoading(false)
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={cn(
          "absolute inset-0 origin-center transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        style={{
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          transform: scale !== 100 ? `scale(${scale / 100})` : undefined,
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          unoptimized={isDataUrl(src)}
          sizes="(max-width: 768px) 100vw, 960px"
          className="object-cover object-center"
          onLoad={finishLoading}
        />
      </div>
      {isLoading ? (
        <div aria-hidden className="absolute inset-0 animate-pulse bg-muted/50" />
      ) : null}
    </div>
  )
}
