import Link from "next/link"
import Image from "next/image"
import { HomeFeatures } from "@/components/home-features"
import { SiteNavbar } from "@/components/site-navbar"
import { Button } from "@/components/ui/button"
import {
  Cta,
  CtaActions,
  CtaTitle,
} from "@/components/ui/cta"
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
  HeroDescription,
  HeroFrame,
  HeroIntro,
  HeroTitle,
} from "@/components/ui/hero"

export default function Home() {
  return (
    <>
      <SiteNavbar />

      <main id="main-content" className="flex min-w-0 flex-1 flex-col">
        <Hero>
          <HeroFrame>
            <HeroIntro>
              <HeroTitle>Put your screenshots in beautiful frames</HeroTitle>
              <HeroDescription>
                Combine preset backgrounds, device frames, uploads, and live
                website captures into export-ready visuals.
              </HeroDescription>
              <HeroActions>
                <Button
                  render={<Link href="/creator-studio" />}
                  nativeButton={false}
                >
                  Start creating
                </Button>
                <Button
                  variant="outline"
                  render={<Link href="#features" />}
                  nativeButton={false}
                >
                  Explore features
                </Button>
              </HeroActions>
            </HeroIntro>
            <Image
              src="/assets/frames.png"
              alt="Frames studio preview"
              width={1956}
              height={1224}
              priority
              sizes="(max-width: 768px) 100vw, 1152px"
              className="h-auto w-full"
            />
          </HeroFrame>
        </Hero>

        <HomeFeatures />

        <Cta>
          <CtaTitle>Ready to create?</CtaTitle>
          <CtaActions>
            <Button
              render={<Link href="/creator-studio" />}
              nativeButton={false}
            >
              Open studio
            </Button>
          </CtaActions>
        </Cta>
      </main>

      <Footer>
        <FooterPanel>
          <FooterMain>
            <FooterBrand
              name="Frames"
              logo={
                <Image
                  src="/logo.png"
                  alt="Frames logo"
                  width={36}
                  height={36}
                  className="size-9 shrink-0"
                />
              }
            >
              Framed product and website visuals with backgrounds, device
              frames, and live captures.
            </FooterBrand>
            <FooterColumns>
              <FooterColumn title="Product">
                <FooterLink label="Studio" href="/creator-studio" />
                <FooterLink label="Features" href="#features" />
              </FooterColumn>
              <FooterColumn title="Built with">
                <FooterLink
                  label="Leguan UI"
                  href="https://leguan-ui.pages.dev/get-started"
                />
                <FooterLink
                  label="Next.js"
                  href="https://nextjs.org/docs"
                />
              </FooterColumn>
            </FooterColumns>
          </FooterMain>
          <FooterBar>
            <FooterCopyright name="Frames" />
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
