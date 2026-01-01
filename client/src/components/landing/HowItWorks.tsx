import { ArrowRight, Link2, ClipboardList, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Link2,
    title: "Paste Job URL",
    description: "Copy the job listing URL and paste it into JobTrackr. Our Link Assist will extract all the key details automatically.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Track Progress",
    description: "Update application status as you move through the process. Add notes, set reminders, and stay organized.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Land the Job",
    description: "Use insights to optimize your approach, follow up at the right time, and celebrate when you get the offer!",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Three Steps to{" "}
            <span className="text-gradient">Job Search Success</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple workflow that keeps you focused on what matters — landing interviews.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
            
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center text-center animate-fade-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Step circle */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-medium">
                      <step.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>

                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute right-0 top-10 text-primary/30 h-6 w-6" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
