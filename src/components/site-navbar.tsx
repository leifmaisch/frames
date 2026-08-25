"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarFrame,
  NavbarLink,
  NavbarLinks,
  NavbarMenuButton,
  NavbarMobileActions,
  NavbarMobileLink,
  NavbarMobileMenu,
} from "@/components/ui/navbar"

type SiteNavbarProps = {
  activePath?: "/" | "/creator-studio"
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname)
  }
}

function handleHomeClick(
  activePath: SiteNavbarProps["activePath"],
  event: React.MouseEvent<HTMLAnchorElement>
) {
  if (activePath === "/") {
    event.preventDefault()
    scrollToTop()
  }
}

export function SiteNavbar({ activePath = "/" }: SiteNavbarProps) {
  const featuresHref = activePath === "/" ? "#features" : "/#features"

  return (
    <Navbar sticky>
      <NavbarFrame>
        <NavbarBrand name="Frames" />
        <NavbarLinks>
          <NavbarLink
            href="/"
            label="Home"
            active={activePath === "/"}
            onClick={(event) => handleHomeClick(activePath, event)}
          />
          <NavbarLink href={featuresHref} label="Features" />
        </NavbarLinks>
        <NavbarActions>
          <Button
            render={<Link href="/creator-studio" />}
            nativeButton={false}
          >
            Open studio
          </Button>
        </NavbarActions>
        <NavbarMenuButton />
      </NavbarFrame>
      <NavbarMobileMenu>
        <NavbarMobileLink
          href="/"
          label="Home"
          active={activePath === "/"}
          onClick={(event) => handleHomeClick(activePath, event)}
        />
        <NavbarMobileLink href={featuresHref} label="Features" />
        <NavbarMobileActions>
          <Button
            render={<Link href="/creator-studio" />}
            nativeButton={false}
            className="w-full"
          >
            Open studio
          </Button>
        </NavbarMobileActions>
      </NavbarMobileMenu>
    </Navbar>
  )
}
