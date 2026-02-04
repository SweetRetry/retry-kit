import { Section } from "@/components/layout-shell";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { fadeInVar, minimalMotion } from "@/lib/constants";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <Section className="items-start gap-8 md:gap-12 pt-8 md:pt-16">
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.1, ...minimalMotion },
            },
          }}
          className="space-y-8"
        >
          <motion.h1
            variants={fadeInVar}
            className="text-5xl font-medium tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-primary leading-[0.9]"
          >
            Smart <br />
            Simplicity.
          </motion.h1>

          <motion.p
            variants={fadeInVar}
            className="max-w-[42rem] leading-relaxed text-muted-foreground text-xl sm:text-2xl"
          >
            Making addition by subtraction. <br className="hidden md:block" />
            Managing cognitive load through structure and bio-reaction.
          </motion.p>

          <motion.div variants={fadeInVar} className="flex gap-4 pt-4">
            <Link href="/showcase">
              <Button
                variant="default"
                size="lg"
                className="rounded-full h-12 px-8 text-base"
              >
                Explore System <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </Section>

      <Divider />

      {/* Philosophy Section */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div className="space-y-8">
            <h2 className="text-3xl font-medium tracking-tight">
              The Art of Subtraction
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              In the 2026 paradigm, minimalism isn't about emptiness. It's about
              the <strong>Intelligence of Space</strong>. We remove noise to
              amplify the signal. Every pixel serves a purpose, every motion
              communicates a material logic.
            </p>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-2 border-b border-border/20 pb-2">
                Core Mandate
              </span>
              <ul className="space-y-4">
                <li className="flex items-baseline gap-4">
                  <span className="text-primary font-medium">01</span>
                  <span className="text-muted-foreground">
                    Maximize Signal-to-Noise Ratio
                  </span>
                </li>
                <li className="flex items-baseline gap-4">
                  <span className="text-primary font-medium">02</span>
                  <span className="text-muted-foreground">
                    Whitespace is Active Content
                  </span>
                </li>
                <li className="flex items-baseline gap-4">
                  <span className="text-primary font-medium">03</span>
                  <span className="text-muted-foreground">
                    Typography is Infrastructure
                  </span>
                </li>
                <li className="flex items-baseline gap-4">
                  <span className="text-primary font-medium">04</span>
                  <span className="text-muted-foreground">
                    Motion is Biological Reaction
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
