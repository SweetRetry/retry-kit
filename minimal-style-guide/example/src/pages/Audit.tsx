import { Section } from "@/components/layout-shell";
import { Divider } from "@/components/ui/divider";
import { Check, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { minimalMotion } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const auditItems = [
  {
    id: 1,
    label: "Subtractive Check",
    status: "pass",
    desc: "Removed 3 redundant elements.",
  },
  {
    id: 2,
    label: "Whitespace Ratio",
    status: "pass",
    desc: "Current ratio: 45%.",
  },
  {
    id: 3,
    label: "Color Constraint",
    status: "pass",
    desc: "Monochrome + 1 Accent.",
  },
  {
    id: 4,
    label: "Shadow Usage",
    status: "fail",
    desc: "Detected drop-shadow-lg on Card.",
  },
  {
    id: 5,
    label: "Typography Contrast",
    status: "pass",
    desc: "Minimum 5.2:1 ratio.",
  },
  {
    id: 6,
    label: "Touch Targets",
    status: "pass",
    desc: "All buttons > 44px.",
  },
  {
    id: 7,
    label: "Motion Physics",
    status: "pass",
    desc: "Stiffness 260 applied.",
  },
  {
    id: 8,
    label: "OLED Safety",
    status: "warn",
    desc: "Background #050505 is too dark.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVar = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: minimalMotion },
};

export default function Audit() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-medium tracking-tight">
            Audit Checklist
          </h1>
          <p className="text-muted-foreground mt-2">
            Automated design system compliance report.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Re-run Audit
        </Button>
      </div>

      <Divider />

      <Section>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full"
        >
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-border/20 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <div className="col-span-4 md:col-span-3">Rule</div>
            <div className="col-span-2 md:col-span-1">Status</div>
            <div className="col-span-6 md:col-span-8">Details</div>
          </div>

          {auditItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVar}
              className="grid grid-cols-12 gap-4 py-4 border-b border-border/10 items-center hover:bg-secondary/20 transition-colors -mx-2 px-2 rounded-lg"
            >
              <div className="col-span-4 md:col-span-3 font-medium">
                {item.label}
              </div>
              <div className="col-span-2 md:col-span-1">
                {item.status === "pass" && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                    <Check className="h-3 w-3" /> Pass
                  </div>
                )}
                {item.status === "fail" && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 px-2 py-1 rounded-full">
                    <AlertCircle className="h-3 w-3" /> Fail
                  </div>
                )}
                {item.status === "warn" && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-yellow-600 bg-yellow-400/10 px-2 py-1 rounded-full">
                    <AlertCircle className="h-3 w-3" /> Warn
                  </div>
                )}
              </div>
              <div className="col-span-6 md:col-span-8 text-sm text-muted-foreground truncate">
                {item.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>
    </div>
  );
}
