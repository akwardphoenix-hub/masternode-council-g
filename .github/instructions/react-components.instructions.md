# React Components Instructions

These instructions apply when editing React components in the `src/components/` directory.

## Component Architecture

### Component Structure
- Use functional components with React Hooks
- Place reusable UI components in `src/components/ui/`
- Place feature-specific components in `src/components/`
- Export components as default exports for main components, named exports for utilities

### TypeScript & Props
- **Always use TypeScript** for type safety (`.tsx` extension)
- Define prop interfaces explicitly:
  ```typescript
  interface ProposalCardProps {
    proposal: Proposal;
    billMeta?: BillMetadata;
  }
  
  export default function ProposalCard({ proposal, billMeta }: ProposalCardProps) {
    // ...
  }
  ```
- Use optional props (`?`) for non-required data
- Destructure props in the function signature for clarity

### State Management
- Use `useState` for local component state
- Use `useKV` hook from `@github/spark/hooks` for persistent key-value storage
- Always initialize state with proper default values:
  ```typescript
  const [proposals, setProposals] = useKV<Proposal[]>('council-proposals', [] as Proposal[])
  ```

### Styling Conventions

#### Tailwind CSS
- **Primary styling method**: Use Tailwind CSS utility classes
- Follow mobile-first responsive design:
  ```tsx
  className="grid grid-cols-1 lg:grid-cols-4 gap-6"
  ```
- Use semantic spacing: `gap-2`, `gap-4`, `gap-6`, `p-4`, `px-6`, `py-8`
- Consistent border radius: `rounded`, `rounded-lg`, `rounded-xl`

#### shadcn/ui Components
- Import from `@/components/ui/` path alias
- Use pre-built components: `Button`, `Card`, `Badge`, `Tabs`, `Dialog`, etc.
- Extend with `className` prop for custom styling:
  ```tsx
  <Button variant="default" size="sm" className="gap-1">
    <Check size={14} />
    Approve
  </Button>
  ```
- Common variants:
  - Button: `default`, `destructive`, `outline`, `ghost`, `link`
  - Badge: `default`, `secondary`, `destructive`, `outline`

#### Icons
- Use `@phosphor-icons/react` for all icons
- Import specific icons: `import { Scales, Check, X } from '@phosphor-icons/react'`
- Consistent sizing: `size={14}` (small), `size={16}` (medium), `size={48}` (large/empty states)

### Component Patterns

#### Card-based Layouts
- Wrap content in `Card` components for visual hierarchy
- Structure: `Card` > `CardHeader` > `CardTitle` / `CardDescription` > `CardContent`
- Example:
  ```tsx
  <Card>
    <CardHeader>
      <CardTitle>Proposal Title</CardTitle>
      <CardDescription>Submitted by Author</CardDescription>
    </CardHeader>
    <CardContent>
      {/* content */}
    </CardContent>
  </Card>
  ```

#### Date Formatting
- Always handle invalid dates gracefully:
  ```typescript
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? "Invalid Date"
      : d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };
  ```

#### Conditional Rendering
- Use early returns for loading/error states
- Prefer ternary for simple conditions: `{isActive ? <Active /> : <Inactive />}`
- Use `&&` for single-condition renders: `{showDetails && <Details />}`
- Show empty states with helpful messaging and icons

### Audit Trail Integration
- Every user action that modifies state MUST create an audit log entry
- Use the `addAuditEntry` pattern:
  ```typescript
  const addAuditEntry = (action: string, actor: string, details?: string) => {
    const entry: AuditEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      actor,
      details
    }
    setAuditLog(current => [entry, ...(current || [])])
  }
  ```

### Masternode Council Specific Rules

#### Proposals
- Must include: `id`, `title`, `description`, `author`, `status`, `createdAt`
- Status values: `pending`, `active`, `approved`, `rejected`, `closed`
- Always display status with appropriate Badge variant

#### Votes
- Must include: `proposalId`, `voter`, `vote`, `timestamp`
- Vote values: `approve`, `reject`, `abstain`
- Display vote counts prominently on proposal cards
- Disable voting buttons after user has voted

#### Node Balance
- Follow "repair-first" ethic: prefer fixing/updating over deleting
- Show harmonic balance in vote tallies
- Abstain votes must still be logged and counted

### Accessibility
- Use semantic HTML elements
- Add `aria-label` for icon-only buttons
- Ensure keyboard navigation works for all interactive elements
- Use `disabled` prop to prevent invalid actions

### Performance
- Avoid unnecessary re-renders with proper dependency arrays in `useEffect`
- Use `key` prop for list items (prefer stable IDs over indexes)
- Memoize expensive calculations with `useMemo` if needed

### Error Handling
- Wrap async operations in try-catch
- Use `toast.error()` for user-facing errors from `sonner`
- Provide fallback UI for missing data
- Never let the app crash - handle edge cases gracefully

## Examples

### Minimal Proposal Card
```tsx
interface ProposalCardProps {
  proposal: Proposal;
  onVote?: (proposalId: string, vote: string) => void;
}

export default function ProposalCard({ proposal, onVote }: ProposalCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{proposal.title}</CardTitle>
        <CardDescription>
          By {proposal.author} | {formatDate(proposal.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Badge>{proposal.status}</Badge>
        {onVote && proposal.status === 'pending' && (
          <div className="flex gap-2 mt-4">
            <Button onClick={() => onVote(proposal.id, 'approve')}>
              <Check size={14} /> Approve
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### Empty State Pattern
```tsx
{proposals.length === 0 && (
  <Card>
    <CardContent className="py-12 text-center">
      <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No proposals yet</h3>
      <p className="text-muted-foreground">
        Submit a proposal to get started with council governance.
      </p>
    </CardContent>
  </Card>
)}
```

## Related Documentation
- See `BRAVE_CODEX.md` for the philosophical foundation of the system
- See `tests.instructions.md` for testing these components
