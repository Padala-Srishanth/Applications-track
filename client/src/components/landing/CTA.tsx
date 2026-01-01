import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Rocket } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Ready to get started?</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Start Organizing Your{" "}
            <span className="text-gradient">Job Search Today</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10">
            Join thousands of job seekers who've already simplified their search. 
            Free to start, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            ✨ Free plan includes unlimited applications tracking
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
