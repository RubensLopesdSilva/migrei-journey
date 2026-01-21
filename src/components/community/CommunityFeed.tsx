import { useState } from 'react';
import { Plus, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import { PhaseSelector } from './PhaseSelector';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import type { CommunityPost, PostType } from '@/types/community';

interface CommunityFeedProps {
  posts: CommunityPost[];
  phases: Array<{ id: string; name: string; color: string; phase_number: number }>;
  currentPhaseId: string | null;
  selectedPhaseId: string | null;
  userPhaseNumber: number;
  loading: boolean;
  onSelectPhase: (phaseId: string) => void;
  onCreatePost: (postType: PostType, title: string, content: string) => Promise<{ error: Error | null }>;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => Promise<{ error: Error | null }>;
  onFetchComments: (postId: string) => Promise<any[]>;
}

export function CommunityFeed({
  posts,
  phases,
  currentPhaseId,
  selectedPhaseId,
  userPhaseNumber,
  loading,
  onSelectPhase,
  onCreatePost,
  onLike,
  onComment,
  onFetchComments
}: CommunityFeedProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Phase selector */}
      <PhaseSelector
        phases={phases}
        currentPhaseId={currentPhaseId}
        selectedPhaseId={selectedPhaseId}
        userPhaseNumber={userPhaseNumber}
        onSelect={onSelectPhase}
      />

      {/* Create post button */}
      <Button 
        onClick={() => setShowCreateModal(true)}
        className="w-full gap-2"
      >
        <Plus className="h-4 w-4" />
        Criar Post
      </Button>

      {/* Posts */}
      {loading ? (
        <LoadingSpinner message="Carregando posts do networking..." />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Nenhum post nesta fase ainda"
          description="Seja o primeiro a compartilhar sua experiência e conectar-se com outros migrantes!"
          action={{
            label: "Criar primeiro post",
            onClick: () => setShowCreateModal(true)
          }}
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={onLike}
              onComment={onComment}
              onFetchComments={onFetchComments}
            />
          ))}
        </div>
      )}

      {/* Create post modal */}
      <CreatePostModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={onCreatePost}
      />
    </div>
  );
}
