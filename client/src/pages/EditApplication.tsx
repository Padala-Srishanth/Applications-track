import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Briefcase, ArrowLeft, Link2, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getApplication, updateApplication } from "@/lib/api";

const EditApplication = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [url, setUrl] = useState("");
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [status, setStatus] = useState("applied");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchApplication = async () => {
            if (!id) return;
            try {
                const data = await getApplication(id);
                setCompany(data.company || "");
                setPosition(data.position || "");
                setStatus(data.status || "applied");
                setUrl(data.link || "");
                setDate(data.date || new Date().toISOString());
                // Notes might not be persistent yet but if they were:
                setNotes(data.notes || "");
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load application details",
                    variant: "destructive",
                });
                navigate("/dashboard");
            } finally {
                setIsFetching(false);
            }
        };

        fetchApplication();
    }, [id, navigate, toast]);

    const handleLinkAssist = async () => {
        if (!url) {
            toast({
                title: "URL required",
                description: "Please enter a job listing URL first",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true); // Reuse loading state or add separate fetching state if needed

        // Simulate API call - in production, this would call a Supabase Edge Function
        setTimeout(() => {
            // Mock extracted data
            const mockData = {
                company: url.includes("google") ? "Google" :
                    url.includes("meta") ? "Meta" :
                        url.includes("stripe") ? "Stripe" : "Example Company",
                position: "Software Engineer",
            };

            setCompany(mockData.company);
            setPosition(mockData.position);
            setIsLoading(false);

            toast({
                title: "Link Assist Complete",
                description: "Job details have been auto-filled",
            });
        }, 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!company || !position || !id) {
            toast({
                title: "Missing information",
                description: "Please fill in company and position",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            await updateApplication(id, {
                company,
                position,
                date: date || new Date().toISOString(), // Use preserved date or new if missing
                platform: "Web",
                link: url,
                status,
                notes // sending it even if backend ignores it currently
            });

            toast({
                title: "Application updated!",
                description: `${position} at ${company} has been updated`,
            });
            navigate("/dashboard");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update application",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/dashboard">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg gradient-primary shadow-soft">
                            <Briefcase className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg text-foreground">Edit Application</span>
                    </div>
                </div>
            </header>

            {/* Form */}
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-soft animate-fade-up">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-foreground mb-2">Edit Application</h1>
                        <p className="text-muted-foreground">
                            Update details for {company}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Link Assist Section */}
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="font-medium text-primary">Link Assist</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Paste job listing URL..."
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="default"
                                    onClick={handleLinkAssist}
                                    disabled={isLoading}
                                >
                                    {isLoading ? ( // Reusing isLoading for link assist here might be confusing if saving, bit unlikely.
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4" />
                                            Auto-fill
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Manual Fields */}
                        <div className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company *</Label>
                                    <Input
                                        id="company"
                                        placeholder="e.g. Google"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position">Position *</Label>
                                    <Input
                                        id="position"
                                        placeholder="e.g. Software Engineer"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="applied">Applied</SelectItem>
                                        <SelectItem value="interviewing">Interviewing</SelectItem>
                                        <SelectItem value="offer">Offer</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes (optional)</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Add any notes about this application..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                            <Button type="button" variant="outline" className="flex-1" asChild>
                                <Link to="/dashboard">Cancel</Link>
                            </Button>
                            <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        Update Application
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditApplication;
