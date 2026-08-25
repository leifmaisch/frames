import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Cta,
  CtaActions,
  CtaDescription,
  CtaTitle,
} from "@/components/ui/cta"
import { FeatureCard, Features } from "@/components/ui/features"
import {
  Footer,
  FooterBar,
  FooterBrand,
  FooterColumn,
  FooterColumns,
  FooterCopyright,
  FooterLegal,
  FooterLink,
  FooterMain,
  FooterPanel,
} from "@/components/ui/footer"
import {
  Hero,
  HeroActions,
  HeroChip,
  HeroChips,
  HeroDescription,
  HeroFrame,
  HeroIntro,
  HeroLabel,
  HeroShowcase,
  HeroTitle,
} from "@/components/ui/hero"
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

export default function Home() {
  return (
    <>
      <Navbar sticky>
        <NavbarFrame>
          <NavbarBrand name="Mockup Generator" />
          <NavbarLinks>
            <NavbarLink href="#features" label="Features" />
            <NavbarLink
              href="https://leguan-ui.pages.dev/agents"
              label="Components"
            />
          </NavbarLinks>
          <NavbarActions>
            <Button
              render={
                <Link href="https://leguan-ui.pages.dev/get-started" />
              }
              nativeButton={false}
            >
              Get started
            </Button>
          </NavbarActions>
          <NavbarMenuButton />
        </NavbarFrame>
        <NavbarMobileMenu>
          <NavbarMobileLink href="#features" label="Features" />
          <NavbarMobileLink
            href="https://leguan-ui.pages.dev/agents"
            label="Components"
          />
          <NavbarMobileActions>
            <Button
              render={
                <Link href="https://leguan-ui.pages.dev/get-started" />
              }
              nativeButton={false}
              className="w-full"
            >
              Get started
            </Button>
          </NavbarMobileActions>
        </NavbarMobileMenu>
      </Navbar>

      <main className="flex-1">
        <Hero>
          <HeroFrame>
            <HeroIntro>
              <HeroLabel>Leguan UI</HeroLabel>
              <HeroTitle>Build mockups with finished components</HeroTitle>
              <HeroDescription>
                A Next.js starter wired to the Leguan UI registry with
                foundation, fonts, and landing sections ready to customize.
              </HeroDescription>
              <HeroActions>
                <Button render={<Link href="#features" />} nativeButton={false}>
                  Explore features
                </Button>
                <Button
                  variant="outline"
                  render={
                    <Link href="https://leguan-ui.pages.dev/AGENTS.md" />
                  }
                  nativeButton={false}
                >
                  View AGENTS.md
                </Button>
              </HeroActions>
              <HeroChips>
                <HeroChip>Next.js 16</HeroChip>
                <HeroChip>Tailwind CSS 4</HeroChip>
                <HeroChip>shadcn registry</HeroChip>
              </HeroChips>
            </HeroIntro>
            <HeroShowcase>
              <div className="flex h-full min-h-[200px] items-center justify-center p-8 text-description">
                mockup-generator preview
              </div>
            </HeroShowcase>
          </HeroFrame>
        </Hero>

        <Features
          id="features"
          title="What's included"
          description="Foundation setup and common landing blocks from the Leguan UI catalog."
        >
          <FeatureCard
            title="Foundation"
            description="Shared utilities, squircle helpers, and theme tokens."
          />
          <FeatureCard
            title="Typography"
            description="Inter, Rubik, and Geist Mono loaded through next/font."
          />
          <FeatureCard
            title="Website sections"
            description="Navbar, hero, features, CTA, and footer components."
            large
          />
        </Features>

        <Cta>
          <CtaTitle>Ready to generate mockups?</CtaTitle>
          <CtaDescription>
            Start from this template and add components with the Leguan registry
            commands.
          </CtaDescription>
          <CtaActions>
            <Button
              render={
                <Link href="https://leguan-ui.pages.dev/get-started" />
              }
              nativeButton={false}
            >
              Install components
            </Button>
          </CtaActions>
        </Cta>
      </main>

      <Footer>
        <FooterPanel>
          <FooterMain>
            <FooterBrand name="Mockup Generator">
              Next.js + Leguan UI starter.
            </FooterBrand>
            <FooterColumns>
              <FooterColumn title="Leguan UI">
                <FooterLink
                  label="Documentation"
                  href="https://leguan-ui.pages.dev/get-started"
                />
                <FooterLink
                  label="AGENTS.md"
                  href="https://leguan-ui.pages.dev/AGENTS.md"
                />
              </FooterColumn>
              <FooterColumn title="Project">
                <FooterLink label="Features" href="#features" />
              </FooterColumn>
            </FooterColumns>
          </FooterMain>
          <FooterBar>
            <FooterCopyright name="Mockup Generator" />
            <FooterLegal
              links={[
                { label: "Privacy", href: "#" },
                { label: "Terms", href: "#" },
              ]}
            />
          </FooterBar>
        </FooterPanel>
      </Footer>
    </>
  )
}
