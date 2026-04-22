import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { SEOHead } from "@/components/seo/SEOHead";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, Dog, Calendar, Euro, Shield, Scale, AlertTriangle,
  BarChart3, Activity, CheckCircle, XCircle, Clock, FileCheck, FileX, Eye, Lock, Camera, Search,
  ShieldCheck, ShieldAlert, Wallet
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AdminMetrics from "@/components/dashboard-v2/AdminMetrics";
import SelectionFlowChart from "@/components/dashboard-v2/SelectionFlowChart";
import DisputeTracker from "@/components/dashboard-v2/DisputeTracker";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalWalkers: 0,
    activeWalkers: 0,
    pendingWalkers: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    revenue: 0,
    commission: 0,
    averageBookingValue: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<any[]>([]);
  const [openDisputes, setOpenDisputes] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .single();

    if (!roles) {
      toast.error("Accès réservé aux administrateurs");
      navigate('/dashboard');
      return;
    }

    fetchAdminStats();
  };

  const fetchAdminStats = async () => {
    try {
      // Fetch Profiles
      const { data: profilesData } = await supabase.from('profiles').select('user_type');
      const owners = profilesData?.filter(p => p.user_type === 'owner').length || 0;
      const walkers = profilesData?.filter(p => p.user_type === 'walker').length || 0;

      // Fetch Walker Profiles
      const { data: walkerProfiles } = await supabase.from('walker_profiles').select('verified');
      const activeWalkers = walkerProfiles?.filter(w => w.verified).length || 0;
      const pendingWalkers = walkerProfiles?.filter(w => !w.verified).length || 0;

      // Bookings stats
      const { data: bookingsData } = await supabase.from('bookings').select('status, price, created_at');
      const completed = bookingsData?.filter(b => b.status === 'completed') || [];
      const revenue = completed.reduce((sum, b) => sum + Number(b.price || 0), 0);
      const commission = revenue * 0.15; // Updated to 15% as per CDC

      // Recent bookings
      const { data: recentBookingsData } = await supabase
        .from('bookings')
        .select('*, dogs(name)')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentBookings(recentBookingsData || []);

      // Recent users
      const { data: recentUsersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentUsers(recentUsersData || []);

      // Pending documents
      const { data: docsData } = await supabase
        .from('walker_documents')
        .select('*')
        .eq('status', 'pending');
      setPendingDocuments(docsData || []);

      // Open disputes
      const { data: disputesData } = await supabase
        .from('disputes')
        .select('*')
        .eq('status', 'open');
      setOpenDisputes(disputesData || []);

      setStats({
        totalUsers: owners + walkers,
        totalOwners: owners,
        totalWalkers: walkers,
        activeWalkers,
        pendingWalkers,
        totalBookings: bookingsData?.length || 0,
        completedBookings: completed.length,
        pendingBookings: bookingsData?.filter(b => b.status === 'pending').length || 0,
        cancelledBookings: bookingsData?.filter(b => b.status === 'cancelled').length || 0,
        revenue,
        commission,
        averageBookingValue: completed.length > 0 ? revenue / completed.length : 0
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const mockStages = [
    { label: "Demandes", count: stats.totalUsers, percentage: 100, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Vérifiées", count: stats.activeWalkers + stats.pendingWalkers, percentage: 75, icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Confirmées", count: stats.completedBookings, percentage: 45, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Finalisées (35%)", count: Math.round(stats.totalUsers * 0.35), percentage: 35, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <div className="h-64 bg-muted rounded animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Dashboard Administrateur | DogWalking"
        description="Gestion administrative de la plateforme DogWalking"
      />
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-foreground">Dashboard Administrateur</h1>
              <p className="text-muted-foreground mt-2">Gestion globale de la plateforme DogWalking</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl font-bold">
                <BarChart3 className="w-4 h-4 mr-2" />
                Rapport
              </Button>
              <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">
                Exporter CSV
              </Button>
            </div>
          </div>

          <AdminMetrics 
            totalUsers={stats.totalUsers}
            activeWalkers={stats.activeWalkers}
            platformRevenue={Math.round(stats.commission)}
            openDisputes={openDisputes.length}
            conversionRate={Math.round((stats.completedBookings / (stats.totalBookings || 1)) * 100)}
            verificationRate={Math.round((stats.activeWalkers / (stats.totalWalkers || 1)) * 100)}
          />

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-background border-2 p-1 h-auto rounded-2xl grid grid-cols-2 md:grid-cols-5 gap-1 mb-8">
              <TabsTrigger value="overview" className="rounded-xl font-bold py-2.5">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="verification" className="rounded-xl font-bold py-2.5 relative">
                Vérifications
                {pendingDocuments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center">
                    {pendingDocuments.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="disputes" className="rounded-xl font-bold py-2.5 relative">
                Litiges
                {openDisputes.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {openDisputes.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="finance" className="rounded-xl font-bold py-2.5">Finance</TabsTrigger>
              <TabsTrigger value="users" className="rounded-xl font-bold py-2.5">Utilisateurs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <SelectionFlowChart totalRequests={stats.totalUsers} stages={mockStages} />
                </div>
                <div className="lg:col-span-4">
                  <DisputeTracker disputes={openDisputes.map(d => ({
                    id: d.id,
                    bookingId: d.booking_id,
                    ownerName: "Propriétaire",
                    walkerName: "Accompagnateur",
                    reason: d.reason,
                    status: d.status as any,
                    createdAt: d.created_at,
                    priority: "medium"
                  }))} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="finance">
              <Card className="border-2 rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-900 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    Flux Financiers (Commission 15%)
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Détail des revenus et commissions de la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Volume d'affaires</p>
                      <p className="text-3xl font-black text-slate-900">{stats.revenue.toFixed(2)}€</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-primary/5 border-2 border-primary/10">
                      <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Commission DogWalking</p>
                      <p className="text-3xl font-black text-primary">{stats.commission.toFixed(2)}€</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-green-50 border-2 border-green-100">
                      <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-1">Panier Moyen</p>
                      <p className="text-3xl font-black text-green-700">{stats.averageBookingValue.toFixed(2)}€</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
