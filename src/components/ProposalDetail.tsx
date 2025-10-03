import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Check, X, ArrowLeft, Clock, User } from '@phosphor-icons/react'
import { formatDateTime, formatDate } from '@/utils/dateFormat'

interface Proposal {
  id: string
  title: string
  description: string
  author: string
  status: 'pending' | 'active' | 'approved' | 'rejected'
  createdAt: string
  votingEndsAt?: string
}

interface Vote {
  proposalId: string
  voter: string
  vote: 'approve' | 'reject' | 'abstain'
  timestamp: string
}

interface ProposalDetailProps {
  proposal: Proposal
  votes: Vote[]
  onBack: () => void
  onVote: (vote: 'approve' | 'reject' | 'abstain') => void
  hasUserVoted: boolean
}

export function ProposalDetail({ proposal, votes, onBack, onVote, hasUserVoted }: ProposalDetailProps) {
  const proposalVotes = votes.filter(v => v.proposalId === proposal.id)
  const approveCoun = proposalVotes.filter(v => v.vote === 'approve').length
  const rejectCount = proposalVotes.filter(v => v.vote === 'reject').length
  const abstainCount = proposalVotes.filter(v => v.vote === 'abstain').length
  const totalVotes = proposalVotes.length
  
  // Calculate vote percentages
  const approvePercent = totalVotes > 0 ? (approveCoun / totalVotes) * 100 : 0
  const rejectPercent = totalVotes > 0 ? (rejectCount / totalVotes) * 100 : 0
  const abstainPercent = totalVotes > 0 ? (abstainCount / totalVotes) * 100 : 0
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      case 'active': return 'secondary'
      default: return 'outline'
    }
  }
  
  const getVoteBadgeVariant = (vote: string) => {
    switch (vote) {
      case 'approve': return 'default'
      case 'reject': return 'destructive'
      default: return 'secondary'
    }
  }
  
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft size={16} />
        Back to Proposals
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{proposal.title}</CardTitle>
              <CardDescription className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {proposal.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatDate(proposal.createdAt)}
                </span>
              </CardDescription>
            </div>
            <Badge variant={getStatusBadgeVariant(proposal.status)} className="text-sm">
              {proposal.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">DESCRIPTION</h3>
            <p className="text-foreground leading-relaxed">{proposal.description}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">VOTING RESULTS</h3>
            
            {totalVotes > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Votes Cast:</span>
                  <span className="font-semibold">{totalVotes}</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span>Approve</span>
                      </span>
                      <span className="text-sm font-semibold">{approveCoun} ({approvePercent.toFixed(1)}%)</span>
                    </div>
                    <Progress value={approvePercent} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm flex items-center gap-2">
                        <span className="text-red-600">❌</span>
                        <span>Reject</span>
                      </span>
                      <span className="text-sm font-semibold">{rejectCount} ({rejectPercent.toFixed(1)}%)</span>
                    </div>
                    <Progress value={rejectPercent} className="h-2 [&>div]:bg-destructive" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm flex items-center gap-2">
                        <span className="text-gray-600">⚪</span>
                        <span>Abstain</span>
                      </span>
                      <span className="text-sm font-semibold">{abstainCount} ({abstainPercent.toFixed(1)}%)</span>
                    </div>
                    <Progress value={abstainPercent} className="h-2 [&>div]:bg-gray-400" />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No votes have been cast yet.</p>
            )}
          </div>
          
          {proposal.status === 'pending' && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">CAST YOUR VOTE</h3>
                {hasUserVoted ? (
                  <p className="text-sm text-muted-foreground italic">
                    You have already voted on this proposal.
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onVote('approve')}
                      className="gap-2"
                    >
                      <Check size={16} />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onVote('reject')}
                      className="gap-2"
                    >
                      <X size={16} />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onVote('abstain')}
                    >
                      Abstain
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">VOTE TIMELINE</h3>
            {proposalVotes.length > 0 ? (
              <div className="space-y-2">
                {proposalVotes
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((vote, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-l-2 border-muted pl-3">
                      <div>
                        <p className="text-sm font-medium">{vote.voter}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(vote.timestamp)}</p>
                      </div>
                      <Badge variant={getVoteBadgeVariant(vote.vote)} className="text-xs">
                        {vote.vote}
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No votes recorded yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
