import { Section } from "@/components/layout-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { minimalMotion } from "@/lib/constants";

export default function Showcase() {
  return (
    <div className="space-y-16">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight">
          System Showcase
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Exploring the physical presence of the digital interface through Bento
          Grids, Smart Motion, and Interaction Depth.
        </p>
      </div>

      <Divider />

      {/* Bento Grid Section */}
      <Section>
        <h2 className="text-2xl font-medium mb-8">Bento Grid Standard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {/* Large Hero Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={minimalMotion}
            className="md:col-span-2 row-span-2"
          >
            <Card className="h-full bg-secondary/30 border border-border/40 relative overflow-hidden group">
              <CardHeader>
                <CardTitle className="text-3xl">Tangible Boundaries</CardTitle>
                <CardDescription className="text-lg mt-2">
                  We use surface tones and micro-borders to anchor content in
                  space, preventing the "floating" effect.
                </CardDescription>
              </CardHeader>
              <CardContent className="absolute bottom-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                <Command className="w-96 h-96" strokeWidth={0.2} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Interactive Input Card */}
          <Card className="bg-background border border-border/40 flex flex-col justify-center p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Smart Input</label>
                <Input placeholder="Type something..." />
              </div>
              <Button className="w-full">Submit Action</Button>
            </div>
          </Card>

          {/* Dark Mode Card */}
          <Card className="bg-foreground text-background border border-foreground/10 flex flex-col justify-between">
            <CardHeader>
              <Sparkles className="h-6 w-6 mb-2 opacity-80" />
              <CardTitle className="text-background">OLED Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-background/70">
                Using #1A1A1A instead of pure black to reduce smearing.
              </p>
            </CardContent>
          </Card>

          {/* Physics Card */}
          <motion.div className="md:col-span-3">
            <Card className="bg-secondary/10 border border-border/40 h-full flex flex-col md:flex-row items-center gap-8 p-8">
              <div className="flex-1 space-y-4">
                <CardTitle>Bio-Reaction Motion</CardTitle>
                <CardDescription>
                  Interact with this block. It responds with a stiffness of 260
                  and damping of 20.
                </CardDescription>
              </div>
              <div className="flex-1 w-full flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  whileTap={{ scale: 0.9 }}
                  transition={minimalMotion}
                  className="w-32 h-32 bg-primary rounded-2xl cursor-pointer shadow-none"
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </Section>

      <Divider />

      {/* Typography Scale */}
      <Section>
        <h2 className="text-2xl font-medium mb-8">Typography Scale</h2>
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 items-baseline gap-4 border-b border-border/20 pb-4">
            <span className="text-xs text-muted-foreground font-mono">
              Display
            </span>
            <span className="md:col-span-3 text-6xl md:text-7xl font-medium tracking-tight">
              Heavy Impact
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 items-baseline gap-4 border-b border-border/20 pb-4">
            <span className="text-xs text-muted-foreground font-mono">
              H1 / Heading
            </span>
            <span className="md:col-span-3 text-4xl md:text-5xl font-medium tracking-tight">
              Section Title
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 items-baseline gap-4 border-b border-border/20 pb-4">
            <span className="text-xs text-muted-foreground font-mono">
              Body
            </span>
            <span className="md:col-span-3 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-prose">
              The quick brown fox jumps over the lazy dog. Information density
              is managed through line-height and letter-spacing rather than
              visual decoration.
            </span>
          </div>
        </div>
      </Section>
    </div>
  );
}
