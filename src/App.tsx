import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Scales, Plus, Check, X, Clock, Eye, Users, FileText } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { recordAudit } from '@/utils/audit'
import { formatDate, formatDateTime } from '@/utils/dateFormat'
import { ProposalDetail } from '@/components/ProposalDetail'

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

interface AuditEntry {
  id: string
  timestamp: string
  action: string
  actor: string
  details?: string
}

function App() {
  const [proposals, setProposals] = useKV<Proposal[]>('council-proposals', [])
  const [votes, setVotes] = useKV<Vote[]>('council-votes', [])
  const [auditLog, setAuditLog] = useKV<AuditEntry[]>('audit-log', [])
  
  const [newProposalTitle, setNewProposalTitle] = useState('')
  const [newProposalDescription, setNewProposalDescription] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null)

  const addAuditEntry = (action: string, actor: string, details?: any) => {
    try {
      const entry = recordAudit(action, actor, details)
      setAuditLog(current => [entry, ...(current || [])])
    } catch (error) {
      console.error('Failed to create audit entry:', error)
      toast.error('Failed to record audit entry')
    }
  }

  const submitProposal = () => {
    if (!newProposalTitle.trim() || !newProposalDescription.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    const proposal: Proposal = {
      id: Date.now().toString(),
      title: newProposalTitle.trim(),
      description: newProposalDescription.trim(),
      author: 'Council Member',
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    setProposals(current => [proposal, ...(current || [])])
    addAuditEntry('proposal_submitted', proposal.author, { 
      proposalId: proposal.id, 
      title: proposal.title 
    })
    
    setNewProposalTitle('')
    setNewProposalDescription('')
    setIsDialogOpen(false)
    toast.success('Proposal submitted successfully')
  }

  const castVote = (proposalId: string, vote: 'approve' | 'reject' | 'abstain') => {
    const existingVote = (votes || []).find(v => v.proposalId === proposalId && v.voter === 'Current Node')
    if (existingVote) {
      toast.error('You have already voted on this proposal')
      return
    }

    const newVote: Vote = {
      proposalId,
      voter: 'Current Node',
      vote,
      timestamp: new Date().toISOString()
    }

    setVotes(current => [...(current || []), newVote])
    addAuditEntry('vote_cast', 'Current Node', { 
      proposalId, 
      vote 
    })
    toast.success(`Vote ${vote} recorded`)
  }

  const getVoteCounts = (proposalId: string) => {
    const proposalVotes = (votes || []).filter(v => v.proposalId === proposalId)
    return {
      approve: proposalVotes.filter(v => v.vote === 'approve').length,
      reject: proposalVotes.filter(v => v.vote === 'reject').length,
      abstain: proposalVotes.filter(v => v.vote === 'abstain').length,
      total: proposalVotes.length
    }
  }

  const hasUserVoted = (proposalId: string) => {
    return (votes || []).some(v => v.proposalId === proposalId && v.voter === 'Current Node')
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      case 'active': return 'secondary'
      default: return 'outline'
    }
  }

  const activeProposals = (proposals || []).filter(p => p.status === 'pending' || p.status === 'active')
  const recentAudit = (auditLog || []).slice(0, 10)
  const selectedProposal = selectedProposalId 
    ? (proposals || []).find(p => p.id === selectedProposalId)
    : null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Scales size={32} className="text-primary" weight="fill" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Masternode Council</h1>
              <p className="text-sm text-muted-foreground">Decentralized Governance Platform</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText size={16} />
                Total Proposals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(proposals || []).length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock size={16} />
                Active Proposals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProposals.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users size={16} />
                Total Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(votes || []).length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye size={16} />
                Audit Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(auditLog || []).length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="proposals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="votes">Voting Records</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="proposals" className="space-y-6">
            {selectedProposal ? (
              <ProposalDetail
                proposal={selectedProposal}
                votes={votes || []}
                onBack={() => setSelectedProposalId(null)}
                onVote={(vote) => {
                  castVote(selectedProposal.id, vote)
                }}
                hasUserVoted={hasUserVoted(selectedProposal.id)}
              />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Council Proposals</h2>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus size={16} />
                        Submit Proposal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Submit New Proposal</DialogTitle>
                        <DialogDescription>
                          Present a proposal for council consideration and voting.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Proposal Title</Label>
                          <Input
                            id="title"
                            placeholder="Enter proposal title..."
                            value={newProposalTitle}
                            onChange={(e) => setNewProposalTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Describe the proposal in detail..."
                            rows={4}
                            value={newProposalDescription}
                            onChange={(e) => setNewProposalDescription(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={submitProposal}>Submit Proposal</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4">
                  {(proposals || []).map((proposal) => {
                    const voteCounts = getVoteCounts(proposal.id)
                    const userVoted = hasUserVoted(proposal.id)
                    
                    return (
                      <Card key={proposal.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader onClick={() => setSelectedProposalId(proposal.id)}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{proposal.title}</CardTitle>
                              <CardDescription className="mt-1">
                                By {proposal.author} • {formatDate(proposal.createdAt)}
                              </CardDescription>
                            </div>
                            <Badge variant={getStatusBadgeVariant(proposal.status)}>
                              {proposal.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-foreground line-clamp-2">{proposal.description}</p>
                          
                          {voteCounts.total > 0 && (
                            <div className="flex gap-6 text-sm">
                              <span className="flex items-center gap-1">
                                <span className="text-green-600">✅</span>
                                <span className="font-medium">{voteCounts.approve}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-red-600">❌</span>
                                <span className="font-medium">{voteCounts.reject}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-gray-600">⚪</span>
                                <span className="font-medium">{voteCounts.abstain}</span>
                              </span>
                              <span className="text-muted-foreground ml-auto">
                                {voteCounts.total} {voteCounts.total === 1 ? 'vote' : 'votes'}
                              </span>
                            </div>
                          )}
                          
                          {proposal.status === 'pending' && !userVoted && (
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  castVote(proposal.id, 'approve')
                                }}
                                className="gap-1"
                              >
                                <Check size={14} />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  castVote(proposal.id, 'reject')
                                }}
                                className="gap-1"
                              >
                                <X size={14} />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  castVote(proposal.id, 'abstain')
                                }}
                              >
                                Abstain
                              </Button>
                            </div>
                          )}
                          
                          {userVoted && (
                            <p className="text-sm text-muted-foreground italic">
                              You have already voted on this proposal.
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                  
                  {(proposals || []).length === 0 && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No proposals yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Submit the first proposal to get council deliberations started.
                        </p>
                        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                          <Plus size={16} />
                          Submit First Proposal
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="votes" className="space-y-6">
            <h2 className="text-xl font-semibold">Voting Records</h2>
            
            <div className="grid gap-4">
              {(votes || []).map((vote, index) => {
                const proposal = (proposals || []).find(p => p.id === vote.proposalId)
                return (
                  <Card key={index}>
                    <CardContent className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{proposal?.title || `Proposal ${vote.proposalId}`}</p>
                          <p className="text-sm text-muted-foreground">
                            {vote.voter} • {formatDateTime(vote.timestamp)}
                          </p>
                        </div>
                        <Badge variant={vote.vote === 'approve' ? 'default' : vote.vote === 'reject' ? 'destructive' : 'secondary'}>
                          {vote.vote}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              
              {(votes || []).length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No votes recorded</h3>
                    <p className="text-muted-foreground">
                      Votes will appear here as council members participate in proposals.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <h2 className="text-xl font-semibold">Audit Log</h2>
            
            <div className="space-y-2">
              {recentAudit.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{entry.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.actor} • {formatDateTime(entry.timestamp)}
                        </p>
                        {entry.details && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {typeof entry.details === 'string' 
                              ? entry.details 
                              : JSON.stringify(entry.details)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(auditLog || []).length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Eye size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No audit entries</h3>
                    <p className="text-muted-foreground">
                      All council activities will be logged here for transparency.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App