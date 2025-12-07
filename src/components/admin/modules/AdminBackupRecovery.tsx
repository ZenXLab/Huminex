import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RefreshCw, 
  Database, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  HardDrive,
  Shield,
  Play,
  Pause,
  Settings
} from "lucide-react";

// Mock backup data
const backups = [
  { id: 1, name: "Full Backup", date: "Feb 7, 2025 03:00 AM", size: "2.4 GB", status: "completed", type: "automatic", duration: "12m 34s" },
  { id: 2, name: "Full Backup", date: "Feb 6, 2025 03:00 AM", size: "2.3 GB", status: "completed", type: "automatic", duration: "11m 52s" },
  { id: 3, name: "Full Backup", date: "Feb 5, 2025 03:00 AM", size: "2.3 GB", status: "completed", type: "automatic", duration: "12m 08s" },
  { id: 4, name: "Manual Backup", date: "Feb 4, 2025 02:15 PM", size: "2.2 GB", status: "completed", type: "manual", duration: "11m 45s" },
  { id: 5, name: "Full Backup", date: "Feb 4, 2025 03:00 AM", size: "2.2 GB", status: "completed", type: "automatic", duration: "11m 22s" },
  { id: 6, name: "Full Backup", date: "Feb 3, 2025 03:00 AM", size: "2.1 GB", status: "failed", type: "automatic", duration: "N/A" },
];

const recoveryPoints = [
  { id: 1, timestamp: "Feb 7, 2025 03:00:00 AM", type: "Full Backup", size: "2.4 GB", verified: true },
  { id: 2, timestamp: "Feb 6, 2025 03:00:00 AM", type: "Full Backup", size: "2.3 GB", verified: true },
  { id: 3, timestamp: "Feb 5, 2025 03:00:00 AM", type: "Full Backup", size: "2.3 GB", verified: true },
  { id: 4, timestamp: "Feb 4, 2025 02:15:00 PM", type: "Manual", size: "2.2 GB", verified: true },
];

const stats = {
  lastBackup: "3 hours ago",
  nextBackup: "In 21 hours",
  totalSize: "12.5 GB",
  retentionDays: 30
};

export const AdminBackupRecovery = () => {
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  const startBackup = () => {
    setBackupInProgress(true);
    setBackupProgress(0);
    
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackupInProgress(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Backup & Recovery</h1>
          <p className="text-muted-foreground">Manage database backups and disaster recovery</p>
        </div>
        <Button 
          className="gap-2" 
          onClick={startBackup}
          disabled={backupInProgress}
        >
          {backupInProgress ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Backing Up...
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              Create Backup
            </>
          )}
        </Button>
      </div>

      {/* Backup Progress */}
      {backupInProgress && (
        <Card className="border-primary/50">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Backup in progress...</span>
                <span className="text-sm text-muted-foreground">{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">Creating full database backup. This may take a few minutes.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Backup</p>
                <p className="text-2xl font-bold text-foreground">{stats.lastBackup}</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-100">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Backup</p>
                <p className="text-2xl font-bold text-foreground">{stats.nextBackup}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Storage</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalSize}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <HardDrive className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Retention</p>
                <p className="text-2xl font-bold text-foreground">{stats.retentionDays} days</p>
              </div>
              <div className="p-3 rounded-full bg-amber-100">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Backup History</TabsTrigger>
          <TabsTrigger value="recovery">Recovery Points</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>View all backup operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {backups.map((backup) => (
                  <div 
                    key={backup.id}
                    className="flex items-center justify-between p-4 bg-muted/30 border border-border/60 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        backup.status === "completed" ? "bg-emerald-100" : "bg-red-100"
                      }`}>
                        {backup.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{backup.name}</p>
                        <p className="text-sm text-muted-foreground">{backup.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <Badge variant="outline" className="capitalize">{backup.type}</Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Size</p>
                        <p className="font-medium text-foreground">{backup.size}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-medium text-foreground">{backup.duration}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {backup.status === "completed" && (
                          <>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Download className="h-3 w-3" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                              <RefreshCw className="h-3 w-3" />
                              Restore
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recovery">
          <Card>
            <CardHeader>
              <CardTitle>Point-in-Time Recovery</CardTitle>
              <CardDescription>Restore database to a specific point in time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recoveryPoints.map((point) => (
                  <div 
                    key={point.id}
                    className="flex items-center justify-between p-4 bg-muted/30 border border-border/60 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{point.timestamp}</p>
                        <p className="text-sm text-muted-foreground">{point.type} • {point.size}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {point.verified && (
                        <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        Restore to this point
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Backup Settings</CardTitle>
              <CardDescription>Configure automatic backup schedule and retention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/60 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Automatic Daily Backup</p>
                      <p className="text-sm text-muted-foreground">Run backup every day at 3:00 AM</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/60 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Backup Verification</p>
                      <p className="text-sm text-muted-foreground">Verify backup integrity after completion</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/60 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <HardDrive className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Offsite Storage</p>
                      <p className="text-sm text-muted-foreground">Store backups in secondary location</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/60 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Retention Period</p>
                      <p className="text-sm text-muted-foreground">Keep backups for 30 days before deletion</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
