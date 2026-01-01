import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Smart Job Tracking Made Simple</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Track Your Applications
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Stop losing track of applications. JobTrackr helps you organize, monitor, and optimize your job search with intelligent automation and beautiful insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
                Start Tracking Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/login">
                Login
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div className="mt-16 max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: "0.5s" }}>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border bg-card">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
            <div className="p-4 md:p-8">
              {/* Mock Dashboard */}
              <div className="bg-background rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-destructive" />
                    <div className="h-3 w-3 rounded-full bg-warning" />
                    <div className="h-3 w-3 rounded-full bg-success" />
                  </div>
                  <div className="h-8 w-48 bg-secondary rounded-md" />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Applied", value: "24", color: "bg-primary" },
                    { label: "Interviews", value: "8", color: "bg-accent" },
                    { label: "Offers", value: "3", color: "bg-success" },
                    { label: "Rejected", value: "5", color: "bg-destructive/50" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className={`h-2 w-12 ${stat.color} rounded mb-2`} />
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mock table */}
                <div className="space-y-2">
                  {[1, 2, 3].map((row) => (
                    <div key={row} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                      <div className="h-10 w-10 rounded-lg bg-secondary" />
                      <div className="flex-1">
                        <div className="h-4 w-32 bg-secondary rounded mb-1" />
                        <div className="h-3 w-24 bg-secondary/70 rounded" />
                      </div>
                      <div className="h-6 w-20 bg-primary/20 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
