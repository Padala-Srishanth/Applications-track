import { 
  Link2, 
  BarChart3, 
  Bell, 
  Folders, 
  Sparkles, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Link Assist",
    description: "Paste any job URL and we'll automatically extract company name, position, and details. No more manual data entry.",
  },
  {
    icon: Folders,
    title: "Smart Organization",
    description: "Track applications by status, company, role type, and custom tags. Find any application instantly.",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "See your application funnel, response rates, and trends over time with beautiful charts and insights.",
  },
  {
    icon: Bell,
    title: "Follow-up Reminders",
    description: "Never forget to follow up. Get smart reminders based on when you applied and typical response times.",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description: "Get personalized suggestions to improve your success rate based on your application patterns.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your data stays yours. We use enterprise-grade encryption and never share your information.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Features</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Everything You Need to{" "}
            <span className="text-gradient">Land Your Dream Job</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Built by job seekers, for job seekers. Every feature is designed to save you time and increase your chances.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-medium transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-3 rounded-lg gradient-primary w-fit mb-4 shadow-soft group-hover:shadow-glow transition-shadow duration-300">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
