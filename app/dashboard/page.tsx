"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Search, Filter, Trash2, RefreshCw, LogOut, AlertTriangle, CheckCircle2 } from "lucide-react";
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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { mockSubscriptions } from "@/lib/mock-data";
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

  useEffect(() => {
    // Simulate API call to fetch subscriptions
    const fetchSubscriptions = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setSubscriptions(mockSubscriptions);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredSubscriptions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubscriptions.map(sub => sub.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(subId => subId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleUnsubscribe = () => {
    if (selectedIds.length === 0) return;
    
    // In a real app, this would call an API to unsubscribe
    setIsLoading(true);
    
    setTimeout(() => {
      // Remove unsubscribed items from the list
      const updatedSubscriptions = subscriptions.filter(
        sub => !selectedIds.includes(sub.id)
      );
      
      setSubscriptions(updatedSubscriptions);
      
      toast({
        title: "Successfully unsubscribed",
        description: `Unsubscribed from ${selectedIds.length} email${selectedIds.length > 1 ? 's' : ''}.`,
      });
      
      setSelectedIds([]);
      setIsLoading(false);
    }, 1500);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate refreshing the subscription list
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Refreshed",
        description: "Your subscription list has been updated.",
      });
    }, 1500);
  };

  // Filter subscriptions based on search query and active tab
  const filteredSubscriptions = subscriptions
    .filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           sub.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === "all") return matchesSearch;
      if (activeTab === "frequent" && sub.frequency > 10) return matchesSearch;
      if (activeTab === "inactive" && sub.lastOpened > 30) return matchesSearch;
      
      return false;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
      if (sortBy === "frequency") {
        return sortOrder === "asc" 
          ? a.frequency - b.frequency 
          : b.frequency - a.frequency;
      }
      if (sortBy === "lastOpened") {
        return sortOrder === "asc" 
          ? a.lastOpened - b.lastOpened 
          : b.lastOpened - a.lastOpened;
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
            <span className="text-xl font-bold">UnsubscribeMe</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">User menu</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    U
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/" className="flex w-full items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Email Subscriptions</h1>
              <p className="text-muted-foreground">
                Manage and unsubscribe from unwanted email subscriptions
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
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
                    Sort by: {sortBy === "name" ? "Name" : sortBy === "frequency" ? "Frequency" : "Last Opened"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    setSortBy("name");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}>
                    Name ({sortBy === "name" && sortOrder === "asc" ? "A-Z" : "Z-A"})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setSortBy("frequency");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}>
                    Frequency ({sortOrder === "desc" ? "High to Low" : "Low to High"})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setSortBy("lastOpened");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}>
                    Last Opened ({sortOrder === "desc" ? "Oldest First" : "Recent First"})
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
                  {subscriptions.filter(sub => sub.frequency > 10).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive
                <Badge variant="secondary" className="ml-2">
                  {subscriptions.filter(sub => sub.lastOpened > 30).length}
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
                      <h3 className="text-lg font-semibold">No subscriptions found</h3>
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
                                <h3 className="font-medium">{subscription.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {subscription.email}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant={getFrequencyColor(subscription.frequency)}>
                                  {getFrequencyLabel(subscription.frequency)}
                                </Badge>
                                <Badge variant="outline">
                                  {getLastOpenedLabel(subscription.lastOpened)}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{subscription.frequency} emails/month</span>
                              <span>•</span>
                              <span>Last opened {subscription.lastOpened} days ago</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="frequent" className="mt-0">
              <Card>
                <CardContent className="p-4">
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>High Volume Emails</AlertTitle>
                    <AlertDescription>
                      These subscriptions send you more than 10 emails per month. Consider unsubscribing to reduce inbox clutter.
                    </AlertDescription>
                  </Alert>
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
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
                      <CheckCircle2 className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">No high-frequency subscriptions</h3>
                      <p className="text-muted-foreground">
                        You don't have any subscriptions that send more than 10 emails per month.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y rounded-md border">
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
                                <h3 className="font-medium">{subscription.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {subscription.email}
                                </p>
                              </div>
                              <Badge variant={getFrequencyColor(subscription.frequency)}>
                                {subscription.frequency} emails/month
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inactive" className="mt-0">
              <Card>
                <CardContent className="p-4">
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Inactive Subscriptions</AlertTitle>
                    <AlertDescription>
                      You haven't opened emails from these subscriptions in over 30 days. Consider unsubscribing to reduce inbox clutter.
                    </AlertDescription>
                  </Alert>
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
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
                      <CheckCircle2 className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">No inactive subscriptions</h3>
                      <p className="text-muted-foreground">
                        You've opened emails from all your subscriptions in the last 30 days.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y rounded-md border">
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
                                <h3 className="font-medium">{subscription.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {subscription.email}
                                </p>
                              </div>
                              <Badge variant="outline">
                                Last opened {subscription.lastOpened} days ago
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} UnsubscribeMe. All rights reserved.
        </div>
      </footer>
    </div>
  );
}