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

export function SiteNavbar({ activePath = "/" }: SiteNavbarProps) {
  const featuresHref = activePath === "/" ? "#features" : "/#features"

  return (
    <Navbar sticky>
      <NavbarFrame>
        <NavbarBrand name="Frames" />
        <NavbarLinks>
          <NavbarLink href="/" label="Home" active={activePath === "/"} />
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
        <NavbarMobileLink href="/" label="Home" active={activePath === "/"} />
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
