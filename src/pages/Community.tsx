import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { MessageSquare, Users, Gift, Calendar } from 'lucide-react';
import { useCommunity } from '@/hooks/useCommunity';
import { CommunityFeed } from '@/components/community/CommunityFeed';
import { NetworkingProfile } from '@/components/community/NetworkingProfile';
import { ConnectionsSection } from '@/components/community/ConnectionsSection';
import { GiveAskSection } from '@/components/community/GiveAskSection';
import { EventsSection } from '@/components/community/EventsSection';
import { NotificationsPanel } from '@/components/community/NotificationsPanel';

const Community = () => {
  const {
    loading,
    posts,
    phases,
    currentPhaseId,
    networkingProfile,
    connections,
    pendingConnections,
    giveAskPosts,
    events,
    matchSuggestions,
    notifications,
    unreadCount,
    setCurrentPhaseId,
    fetchPosts,
    createPost,
    toggleLike,
    fetchComments,
    addComment,
    updateNetworkingProfile,
    respondToConnection,
    fetchGiveAskPosts,
    createGiveAskPost,
    registerForEvent,
    respondToMatch,
    markNotificationRead,
    markAllNotificationsRead
  } = useCommunity();

  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const userPhaseNumber = phases.find(p => p.id === currentPhaseId)?.phase_number || 1;

  const handleSelectPhase = (phaseId: string) => {
    setSelectedPhaseId(phaseId);
    fetchPosts(phaseId);
  };

  return (
    <PageLayout>
      <PageContent>
        {/* Breadcrumb */}
        <PageBreadcrumb
          items={[{ label: "Comunidade", current: true }]}
          className="mb-4"
        />

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Comunidade</h1>
            <p className="text-muted-foreground">
              Conecte-se com pessoas na mesma fase da jornada e avance junto
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <AnimatedTabs defaultValue="feed" className="w-full">
                <AnimatedTabsList className="grid w-full grid-cols-4 mb-6">
                  <AnimatedTabsTrigger value="feed" className="gap-2">
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    Feed
                  </AnimatedTabsTrigger>
                  <AnimatedTabsTrigger value="connections" className="gap-2">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    Conexões
                  </AnimatedTabsTrigger>
                  <AnimatedTabsTrigger value="give-ask" className="gap-2">
                    <Gift className="h-4 w-4" aria-hidden="true" />
                    Dar & Receber
                  </AnimatedTabsTrigger>
                  <AnimatedTabsTrigger value="events" className="gap-2">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    Eventos
                  </AnimatedTabsTrigger>
                </AnimatedTabsList>

                <AnimatedTabsContent value="feed">
                  <CommunityFeed
                    posts={posts}
                    phases={phases}
                    currentPhaseId={currentPhaseId}
                    selectedPhaseId={selectedPhaseId || currentPhaseId}
                    userPhaseNumber={userPhaseNumber}
                    loading={loading}
                    onSelectPhase={handleSelectPhase}
                    onCreatePost={createPost}
                    onLike={toggleLike}
                    onComment={addComment}
                    onFetchComments={fetchComments}
                  />
                </AnimatedTabsContent>

                <AnimatedTabsContent value="connections">
                  <ConnectionsSection
                    connections={connections}
                    pendingConnections={pendingConnections}
                    matchSuggestions={matchSuggestions}
                    onRespondToConnection={respondToConnection}
                    onRespondToMatch={respondToMatch}
                  />
                </AnimatedTabsContent>

                <AnimatedTabsContent value="give-ask">
                  <GiveAskSection
                    posts={giveAskPosts}
                    onCreatePost={createGiveAskPost}
                    onFilter={fetchGiveAskPosts}
                  />
                </AnimatedTabsContent>

                <AnimatedTabsContent value="events">
                  <EventsSection
                    events={events}
                    onRegister={registerForEvent}
                  />
                </AnimatedTabsContent>
              </AnimatedTabs>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6 order-first lg:order-last">
              <NetworkingProfile
                profile={networkingProfile}
                onSave={updateNetworkingProfile}
              />
              <NotificationsPanel
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkRead={markNotificationRead}
                onMarkAllRead={markAllNotificationsRead}
              />
          </div>
        </div>
      </PageContent>
    </PageLayout>
  );
};

export default Community;
