import Link from "next/link"
import { SiteNavbar } from "@/components/site-navbar"
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

export default function Home() {
  return (
    <>
      <SiteNavbar />

      <main className="flex-1">
        <Hero>
          <HeroFrame>
            <HeroIntro>
              <HeroLabel>Frames</HeroLabel>
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
              <HeroChips>
                <HeroChip>Device frames</HeroChip>
                <HeroChip>Website capture</HeroChip>
                <HeroChip>High-res export</HeroChip>
              </HeroChips>
            </HeroIntro>
            <HeroShowcase>
              <div className="flex h-full min-h-[200px] items-center justify-center p-8 text-description">
                Studio preview
              </div>
            </HeroShowcase>
          </HeroFrame>
        </Hero>

        <Features
          id="features"
          title="What's included"
          description="Everything you need to compose, preview, and export framed visuals."
        >
          <FeatureCard
            title="Scene controls"
            description="Preset backgrounds, blur, dim, zoom, and frame scale sliders."
          />
          <FeatureCard
            title="Content sources"
            description="Upload product images or capture live website screenshots."
          />
          <FeatureCard
            title="Export options"
            description="PNG, JPEG, or WebP exports at 1x to 4x resolution."
            large
          />
        </Features>

        <Cta>
          <CtaTitle>Ready to create?</CtaTitle>
          <CtaDescription>
            Open studio to compose scenes, pick frames, and download your final
            image.
          </CtaDescription>
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
            <FooterBrand name="Frames">
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
