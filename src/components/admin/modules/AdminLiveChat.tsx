import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, Send, Search, Clock, User, Users, 
  CheckCircle, Circle, Phone, Video, MoreVertical,
  Paperclip, Smile, Archive, Star, Filter, Settings,
  Plus, Zap, Tag, ArrowRight, XCircle, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock Chat Data
const mockConversations = [
  {
    id: "1",
    visitor: {
      name: "Sarah Johnson",
      email: "sarah@techcorp.com",
      company: "TechCorp Inc",
      avatar: null,
      location: "Mumbai, India",
      browser: "Chrome 120",
      page: "/pricing"
    },
    status: "active",
    priority: "high",
    unread: 3,
    lastMessage: "I need help with enterprise pricing",
    lastMessageTime: "2 mins ago",
    assignedTo: "Admin",
    tags: ["enterprise", "pricing"],
    messages: [
      { id: "1", sender: "visitor", text: "Hi, I'm interested in ATLAS for my company", time: "10:30 AM" },
      { id: "2", sender: "agent", text: "Hello Sarah! Thanks for reaching out. How can I help you today?", time: "10:31 AM" },
      { id: "3", sender: "visitor", text: "We have about 500 employees and need a comprehensive HR solution", time: "10:32 AM" },
      { id: "4", sender: "visitor", text: "I need help with enterprise pricing", time: "10:35 AM" }
    ]
  },
  {
    id: "2",
    visitor: {
      name: "Mike Chen",
      email: "mike@startup.io",
      company: "StartupIO",
      avatar: null,
      location: "Bangalore, India",
      browser: "Firefox 121",
      page: "/features"
    },
    status: "active",
    priority: "medium",
    unread: 1,
    lastMessage: "How does the payroll module work?",
    lastMessageTime: "15 mins ago",
    assignedTo: "Admin",
    tags: ["payroll", "demo-request"],
    messages: [
      { id: "1", sender: "visitor", text: "Hello! Quick question about ATLAS", time: "10:20 AM" },
      { id: "2", sender: "agent", text: "Hi Mike! Sure, what would you like to know?", time: "10:21 AM" },
      { id: "3", sender: "visitor", text: "How does the payroll module work?", time: "10:22 AM" }
    ]
  },
  {
    id: "3",
    visitor: {
      name: "Anonymous Visitor",
      email: null,
      company: null,
      avatar: null,
      location: "Delhi, India",
      browser: "Safari 17",
      page: "/about"
    },
    status: "waiting",
    priority: "low",
    unread: 1,
    lastMessage: "Is there a free trial available?",
    lastMessageTime: "32 mins ago",
    assignedTo: null,
    tags: ["trial"],
    messages: [
      { id: "1", sender: "visitor", text: "Is there a free trial available?", time: "10:05 AM" }
    ]
  },
  {
    id: "4",
    visitor: {
      name: "Priya Sharma",
      email: "priya@enterprise.in",
      company: "Enterprise Solutions",
      avatar: null,
      location: "Hyderabad, India",
      browser: "Chrome 120",
      page: "/contact"
    },
    status: "resolved",
    priority: "medium",
    unread: 0,
    lastMessage: "Thank you for your help!",
    lastMessageTime: "1 hour ago",
    assignedTo: "Admin",
    tags: ["support", "resolved"],
    messages: [
      { id: "1", sender: "visitor", text: "I'm having trouble logging in", time: "9:00 AM" },
      { id: "2", sender: "agent", text: "I can help with that. Can you try clearing your browser cache?", time: "9:02 AM" },
      { id: "3", sender: "visitor", text: "That worked! Thank you", time: "9:10 AM" },
      { id: "4", sender: "agent", text: "Great! Let me know if you need anything else.", time: "9:11 AM" },
      { id: "5", sender: "visitor", text: "Thank you for your help!", time: "9:12 AM" }
    ]
  }
];

// Canned Responses
const cannedResponses = [
  { id: "1", title: "Greeting", shortcut: "/greet", text: "Hello! Thanks for reaching out to ATLAS support. How can I help you today?" },
  { id: "2", title: "Pricing Info", shortcut: "/pricing", text: "Our pricing starts at ₹3,999/month for up to 25 employees. Would you like me to share more details based on your team size?" },
  { id: "3", title: "Demo Request", shortcut: "/demo", text: "I'd be happy to schedule a personalized demo for you! Please share your preferred date and time, and I'll arrange it." },
  { id: "4", title: "Feature List", shortcut: "/features", text: "ATLAS includes 15+ modules: HR, Payroll, Attendance, Recruitment, Compliance, Finance, BGV, Insurance, Projects, and more. Which specific feature interests you most?" },
  { id: "5", title: "Thank You", shortcut: "/thanks", text: "You're welcome! Feel free to reach out anytime. Have a great day!" },
  { id: "6", title: "Transfer", shortcut: "/transfer", text: "Let me connect you with our specialist who can better assist you. Please hold for a moment." },
  { id: "7", title: "Follow Up", shortcut: "/followup", text: "I'll send you a follow-up email with more details. Is there anything else I can help with right now?" },
  { id: "8", title: "Escalate", shortcut: "/escalate", text: "I'm escalating this to our senior team for faster resolution. You'll receive an update shortly." }
];

export const AdminLiveChat: React.FC = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedChat, setSelectedChat] = useState<typeof mockConversations[0] | null>(mockConversations[0]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCannedResponses, setShowCannedResponses] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "agent",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedConversations = conversations.map(conv => 
      conv.id === selectedChat.id 
        ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: message, lastMessageTime: "Just now" }
        : conv
    );

    setConversations(updatedConversations);
    setSelectedChat({ ...selectedChat, messages: [...selectedChat.messages, newMessage] });
    setMessage("");
    toast.success("Message sent");
  };

  const useCannedResponse = (response: typeof cannedResponses[0]) => {
    setMessage(response.text);
    setShowCannedResponses(false);
  };

  const resolveConversation = (convId: string) => {
    setConversations(conversations.map(conv => 
      conv.id === convId ? { ...conv, status: "resolved" } : conv
    ));
    toast.success("Conversation resolved");
  };

  const filteredConversations = conversations.filter(conv => {
    if (statusFilter !== "all" && conv.status !== statusFilter) return false;
    if (searchQuery && !conv.visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeCount = conversations.filter(c => c.status === 'active').length;
  const waitingCount = conversations.filter(c => c.status === 'waiting').length;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Chat</h1>
          <p className="text-muted-foreground">Real-time customer support messaging</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default" className="gap-1">
            <Circle className="w-2 h-2 fill-green-500 text-green-500" />
            {activeCount} Active
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" />
            {waitingCount} Waiting
          </Badge>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Conversation List */}
        <Card className="lg:col-span-4 flex flex-col min-h-0">
          <CardHeader className="p-4 pb-2">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("waiting")}>Waiting</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>Resolved</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Tabs defaultValue="open" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="mine">Mine</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-2 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChat(conv)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat?.id === conv.id 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conv.visitor.avatar || undefined} />
                          <AvatarFallback>{conv.visitor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                          conv.status === 'active' ? 'bg-green-500' : 
                          conv.status === 'waiting' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium truncate">{conv.visitor.name}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {conv.lastMessageTime}
                          </span>
                        </div>
                        {conv.visitor.company && (
                          <p className="text-xs text-muted-foreground truncate">{conv.visitor.company}</p>
                        )}
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conv.lastMessage}
                        </p>
                        <div className="flex gap-1 mt-2">
                          {conv.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                          {conv.unread > 0 && (
                            <Badge className="ml-auto">{conv.unread}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-5 flex flex-col min-h-0">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <CardHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedChat.visitor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedChat.visitor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedChat.visitor.company || selectedChat.visitor.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Video className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => resolveConversation(selectedChat.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolve
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="w-4 h-4 mr-2" />
                          Mark Important
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Users className="w-4 h-4 mr-2" />
                          Transfer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    {selectedChat.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${
                          msg.sender === 'agent' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        } rounded-lg px-4 py-2`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'agent' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                {showCannedResponses && (
                  <div className="mb-3 p-2 bg-muted/50 rounded-lg max-h-48 overflow-y-auto">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Canned Responses</p>
                    <div className="space-y-1">
                      {cannedResponses.map(response => (
                        <div
                          key={response.id}
                          onClick={() => useCannedResponse(response)}
                          className="p-2 hover:bg-muted rounded cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{response.shortcut}</Badge>
                            <span className="text-sm font-medium">{response.title}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{response.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowCannedResponses(!showCannedResponses)}
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input 
                    placeholder="Type a message..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button onClick={sendMessage} disabled={!message.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </Card>

        {/* Visitor Info Sidebar */}
        <Card className="lg:col-span-3 flex flex-col min-h-0">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-lg">Visitor Info</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-auto">
            {selectedChat ? (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Contact</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedChat.visitor.name}</span>
                    </div>
                    {selectedChat.visitor.email && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">📧</span>
                        <span className="text-sm">{selectedChat.visitor.email}</span>
                      </div>
                    )}
                    {selectedChat.visitor.company && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">🏢</span>
                        <span className="text-sm">{selectedChat.visitor.company}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Session Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Session</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span>{selectedChat.visitor.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Browser</span>
                      <span>{selectedChat.visitor.browser}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Page</span>
                      <span className="text-primary">{selectedChat.visitor.page}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedChat.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Create Quote
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Schedule Demo
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Create Ticket
                    </Button>
                  </div>
                </div>

                {/* Previous Conversations */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">History</h4>
                  <p className="text-sm text-muted-foreground">First conversation with this visitor</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-sm">Select a conversation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLiveChat;
