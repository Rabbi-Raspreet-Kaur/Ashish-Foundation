import ScrollReveal from "./ScrollReveal";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <ScrollReveal className={`mb-12 md:mb-16 ${centered ? "text-center" : ""} ${className}`}>
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 ${
          light ? "text-white" : "text-forest"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg md:text-xl max-w-2xl leading-relaxed ${
            centered ? "mx-auto" : ""
          } ${light ? "text-white/80" : "text-charcoal-light"}`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-6 h-1 w-16 rounded-full ${
          light ? "bg-saffron" : "bg-saffron"
        } ${centered ? "mx-auto" : ""}`}
      />
    </ScrollReveal>
  );
}
