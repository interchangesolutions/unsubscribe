"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  LogOut,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
// Remove the mock data import
// import { mockSubscriptions } from "@/lib/mock-data";
import { getSubscriptions, unsubscribe } from "@/lib/api";
import { Subscription } from "@/lib/types";

export default function DashboardPage() {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "frequency" | "lastOpened">("frequency");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const router = useRouter();
  const searchParams = useSearchParams();

  // extract JWS token from header
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  // Fetch subscriptions from the backend API
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        const data = await getSubscriptions();
        setSubscriptions(data);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredSubscriptions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubscriptions.map((sub) => sub.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((subId) => subId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleUnsubscribe = async () => {
    if (selectedIds.length === 0) return;
    
    setIsLoading(true);
    
    try {
      let manualRequired = false;
      let confirmationURLs = [];
      
      for (const id of selectedIds) {
        const res = await unsubscribe(id);
        if (res.status === "manual") {
          manualRequired = true;
          if (res.confirmation_url) {
            confirmationURLs.push({ id, url: res.confirmation_url });
          }
        } else if (res.status !== "success") {
          toast({
            title: "Error",
            description: `Failed to unsubscribe from subscription with id ${id}.`,
          });
        }
      }
      
      if (manualRequired) {
        toast({
          title: "Manual Action Required",
          description: "Some subscriptions require manual confirmation. Please check your email or follow the provided link.",
        });
        // Optionally, open the confirmation URLs:
        confirmationURLs.forEach(item => {
          // For example, open in a new tab:
          window.open(item.url, '_blank');
        });
      } else {
        const updatedSubscriptions = subscriptions.filter(
          (sub) => !selectedIds.includes(sub.id)
        );
        setSubscriptions(updatedSubscriptions);
        toast({
          title: "Successfully unsubscribed",
          description: `Unsubscribed from ${selectedIds.length} subscription${selectedIds.length > 1 ? "s" : ""}.`,
        });
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Unsubscribe error:", error);
      toast({
        title: "Error",
        description: "Failed to unsubscribe. Please try again.",
      });
    }
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await getSubscriptions();
      setSubscriptions(data);
      toast({
        title: "Refreshed",
        description: "Your subscription list has been updated.",
      });
    } catch (error) {
      console.error("Refresh error:", error);
    }
    setIsLoading(false);
  };

  // Filter and sort subscriptions based on search query, active tab, etc.
  const filteredSubscriptions = subscriptions
  .filter((sub) => {
    const name = sub.name ?? "";
    const email = sub.email ?? "";
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "frequent" && (sub.frequency ?? 0) > 10) return matchesSearch;
    if (activeTab === "inactive" && (sub.lastOpened ?? 0) > 30) return matchesSearch;

    return false;
  })
  .sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? (a.name ?? "").localeCompare(b.name ?? "")
        : (b.name ?? "").localeCompare(a.name ?? "");
    }
    if (sortBy === "frequency") {
      return sortOrder === "asc"
        ? (a.frequency ?? 0) - (b.frequency ?? 0)
        : (b.frequency ?? 0) - (a.frequency ?? 0);
    }
    if (sortBy === "lastOpened") {
      return sortOrder === "asc"
        ? (a.lastOpened ?? 0) - (b.lastOpened ?? 0)
        : (b.lastOpened ?? 0) - (a.lastOpened ?? 0);
    }
    return 0;
  });

  const getFrequencyLabel = (frequency: number) => {
    if (frequency > 20) return "Very High";
    if (frequency > 10) return "High";
    if (frequency > 5) return "Medium";
    return "Low";
  };

  const getFrequencyColor = (frequency: number) => {
    if (frequency > 20) return "destructive";
    if (frequency > 10) return "default";
    if (frequency > 5) return "secondary";
    return "outline";
  };

  const getLastOpenedLabel = (days: number) => {
    if (days > 90) return "Inactive (3+ months)";
    if (days > 30) return "Inactive (1+ month)";
    if (days > 14) return "2+ weeks ago";
    if (days > 7) return "1+ week ago";
    return "Recently";
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            <span className="text-xl font-bold">TidyInbox</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* User menu dropdown here */}
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Email Subscriptions
              </h1>
              <p className="text-muted-foreground">
                Manage and unsubscribe from unwanted email subscriptions
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="destructive"
                onClick={handleUnsubscribe}
                disabled={selectedIds.length === 0 || isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Unsubscribe ({selectedIds.length})
              </Button>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search subscriptions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Sort by:{" "}
                    {sortBy === "name"
                      ? "Name"
                      : sortBy === "frequency"
                      ? "Frequency"
                      : "Last Opened"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("name");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Name ({sortBy === "name" && sortOrder === "asc" ? "A-Z" : "Z-A"})
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("frequency");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Frequency (
                    {sortOrder === "desc" ? "High to Low" : "Low to High"})
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("lastOpened");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Last Opened (
                    {sortOrder === "desc" ? "Oldest First" : "Recent First"})
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Subscriptions</TabsTrigger>
              <TabsTrigger value="frequent">
                Frequent
                <Badge variant="secondary" className="ml-2">
                  {subscriptions.filter((sub) => (sub.frequency ?? 0) > 10).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive
                <Badge variant="secondary" className="ml-2">
                  {subscriptions.filter((sub) => (sub.lastOpened ?? 0) > 30).length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="space-y-4 p-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-4 w-4" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredSubscriptions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <AlertTriangle className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">
                        No subscriptions found
                      </h3>
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? "Try adjusting your search query"
                          : "We couldn't find any subscriptions in this category"}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      <div className="flex items-center gap-4 p-4">
                        <Checkbox
                          checked={
                            filteredSubscriptions.length > 0 &&
                            selectedIds.length === filteredSubscriptions.length
                          }
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                        <div className="flex-1 font-medium">
                          Select All ({filteredSubscriptions.length})
                        </div>
                      </div>

                      {filteredSubscriptions.map((subscription) => (
                        <div
                          key={subscription.id}
                          className="flex items-start gap-4 p-4 hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={selectedIds.includes(subscription.id)}
                            onCheckedChange={() => handleSelect(subscription.id)}
                            aria-label={`Select ${subscription.name}`}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h3 className="font-medium">
                                  {subscription.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {subscription.email}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant={getFrequencyColor(subscription.frequency ?? 0)}>
                                  {getFrequencyLabel(subscription.frequency ?? 0)}
                                </Badge>
                                <Badge variant="outline">
                                  {getLastOpenedLabel(subscription.lastOpened ?? 0)}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{subscription.frequency ?? 0} emails/month</span>
                              <span>•</span>
                              <span>Last opened {subscription.lastOpened ?? 0} days ago</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* The "frequent" and "inactive" tabs can be updated similarly */}
            <TabsContent value="frequent" className="mt-0">
              {/* Similar content, using filteredSubscriptions */}
            </TabsContent>
            <TabsContent value="inactive" className="mt-0">
              {/* Similar content, using filteredSubscriptions */}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TidyInbox. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
