import { ProcessSection } from "@/types/contentful";
import dynamic from "next/dynamic";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ProcessProps {
  content: ProcessSection;
}

export function Process({ content }: ProcessProps) {
  const { title, subtitle, steps, isVisible } = content;

  if (!isVisible) return null;

  // Función para determinar el layout basado en el número de elementos
  const getGridLayout = (numItems: number) => {
    // Para móviles siempre será una columna
    let baseClasses = "grid gap-8 ";

    // Para tablets y desktop
    switch (numItems) {
      case 1:
        return baseClasses + "md:grid-cols-1 max-w-2xl mx-auto";
      case 2:
        return baseClasses + "md:grid-cols-2 max-w-4xl mx-auto";
      case 3:
        return baseClasses + "md:grid-cols-3";
      case 4:
        return baseClasses + "md:grid-cols-2 lg:grid-cols-4";
      case 5:
        return baseClasses + "md:grid-cols-2 lg:grid-cols-3";
      case 6:
        return baseClasses + "md:grid-cols-2 lg:grid-cols-3";
      case 7:
      case 8:
        return baseClasses + "md:grid-cols-3 lg:grid-cols-4";
      default:
        return baseClasses + "md:grid-cols-3";
    }
  };

  // Función para ajustar el ancho del contenedor basado en el número de elementos
  const getContainerWidth = (numItems: number) => {
    switch (numItems) {
      case 1:
        return "max-w-2xl";
      case 2:
        return "max-w-4xl";
      default:
        return "max-w-7xl";
    }
  };

  // Función para centrar elementos cuando hay una fila incompleta
  const getCenteringClasses = (numItems: number) => {
    if (numItems <= 2) return "";

    // Para 5 elementos en desktop (grid-cols-3), el último elemento debe centrarse
    if (numItems === 5) {
      return "lg:last:col-start-2";
    }

    // Para 7 elementos en una grid de 4 columnas, los últimos 3 elementos deben centrarse
    if (numItems === 7) {
      return "lg:last:col-start-2 lg:last:col-span-2";
    }

    return "";
  };

  return (
    <section id="proceso" className="py-24 relative">
      <div className="absolute inset-0 gradient-bg opacity-50" />
      <div
        className={`container mx-auto px-4 ${getContainerWidth(steps.length)}`}
      >
        {/* Header */}
        <div className="text-center mb-16 relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Features Grid */}
        <div className={`${getGridLayout(steps.length)} relative`}>
          {steps.map((step, index) => {
            const IconComponent = step.fields?.icon
              ? dynamic(
                  () =>
                    import("lucide-react").then(
                      (mod) =>
                        mod[step.fields.icon as keyof typeof mod] as LucideIcon
                    ),
                  { ssr: false }
                )
              : null;

            return (
              <div
                key={step?.sys?.id}
                className={`group relative flex flex-col justify-between card-gradient rounded-lg p-8 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${getCenteringClasses(
                  steps.length
                )}`}
              >
                <div>
                  {IconComponent && (
                    <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                      <IconComponent size={48} className="text-primary" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-4">
                    {step.fields.title}
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    {step.fields.description}
                  </p>
                </div>
                {step.fields.ctaText && step.fields.ctaUrl && (
                  <div className="mt-6 pt-4 border-t border-border/10">
                    <Link
                      href={step.fields.ctaUrl}
                      className="inline-flex items-center text-primary font-medium hover:underline group-hover:translate-x-1 transition-transform"
                    >
                      {step.fields.ctaText}
                      <span className="ml-2 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
