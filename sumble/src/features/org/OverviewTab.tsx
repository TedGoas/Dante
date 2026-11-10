import { ArrowUpRightIcon, CpuIcon, HistoryIcon, NetworkIcon, UsersIcon, UserRoundIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScoreBadge } from '@/components/ui/score-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { HEADCOUNT_BY_PERSONA, LIST_TOTALS, PEOPLE, RECENT_CHANGES, TEAMS } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import { BriefTile } from '@/features/brief/BriefTile'
import { cn } from '@/lib/utils'

const HEAD = 'h-9 px-2 whitespace-normal leading-tight'
const CELL = 'h-10 truncate px-2 py-0 text-body text-slate-700'

function Pagination({ total }: { total: number }) {
  return (
    <>
      <span className="text-xs text-slate-600 tabular-nums">1–5 of {total}</span>
      <Button size="xs" variant="ghost" className="ml-auto" disabled>
        Previous
      </Button>
      <Button size="xs" variant="ghost">
        Next
      </Button>
    </>
  )
}

function TechnologiesCard() {
  return (
    <Card icon={CpuIcon} title="Technologies" className="col-span-6">
      <div className="flex h-full flex-col items-center justify-center gap-1 p-6 text-center text-body">
        <p className="font-semibold text-slate-900">No matches found.</p>
        <p className="text-slate-600">We couldn't identify technologies at this organization.</p>
        <a
          href="#"
          className="mt-2 inline-flex items-center gap-0.5 font-medium text-green-700 underline-offset-4 hover:underline"
        >
          See all technologies
          <ArrowUpRightIcon aria-hidden className="size-3.5" />
        </a>
      </div>
    </Card>
  )
}

function PeopleCard() {
  const { openOutreach } = useBrief()
  return (
    <Card
      icon={UserRoundIcon}
      title="Top People to Target"
      className="col-span-8"
      footer={<Pagination total={LIST_TOTALS.people} />}
    >
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className={cn(HEAD, 'w-[184px] pl-4')}>Name</TableHead>
            <TableHead className={cn(HEAD, 'w-[88px]')}>Sumble Lead Score</TableHead>
            <TableHead className={HEAD}>Title</TableHead>
            <TableHead className={cn(HEAD, 'w-[140px]')}>Location</TableHead>
            <TableHead className={cn(HEAD, 'w-[120px]')}>Actions</TableHead>
            <TableHead className={cn(HEAD, 'w-[84px]')}>Matches</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PEOPLE.map((person) => (
            <TableRow key={person.id}>
              <TableCell className={cn(CELL, 'pl-4')} title={person.name}>
                <a href="#" className="font-semibold text-slate-900 underline-offset-2 hover:underline">
                  {person.name}
                </a>
              </TableCell>
              <TableCell className={CELL}>
                <ScoreBadge score={person.score} />
              </TableCell>
              <TableCell className={CELL} title={person.title}>
                {person.title}
              </TableCell>
              <TableCell className={CELL} title={person.location}>
                {person.location}
              </TableCell>
              <TableCell className={cn(CELL, 'overflow-visible')}>
                <Button size="xs" variant="outline" onClick={() => openOutreach(person)}>
                  Draft outreach
                </Button>
              </TableCell>
              <TableCell className={CELL}>
                <Badge>{person.matches}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

function HeadcountCard() {
  return (
    <Card icon={UsersIcon} title="Headcount & Growth by Persona" className="col-span-4">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className={cn(HEAD, 'pl-4')}>Headcount</TableHead>
            <TableHead className={cn(HEAD, 'w-[62px] text-right')}>Current</TableHead>
            <TableHead className={cn(HEAD, 'w-[62px] text-right')}>Year Ago</TableHead>
            <TableHead className={cn(HEAD, 'w-[76px] pr-4 text-right')}>YoY Growth</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {HEADCOUNT_BY_PERSONA.map((row) => (
            <TableRow key={row.persona}>
              <TableCell className={cn(CELL, 'h-12 pl-4 leading-tight font-medium whitespace-normal text-slate-900')}>
                {row.persona}
              </TableCell>
              <TableCell className={cn(CELL, 'text-right tabular-nums')}>{row.current.toLocaleString('en-US')}</TableCell>
              <TableCell className={cn(CELL, 'text-right tabular-nums')}>{row.yearAgo.toLocaleString('en-US')}</TableCell>
              <TableCell
                className={cn(
                  CELL,
                  'pr-4 text-right font-medium tabular-nums',
                  row.growth >= 0 ? 'text-green-700' : 'text-urgent'
                )}
              >
                {row.growth >= 0 ? '+' : ''}
                {row.growth.toFixed(1)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

function TeamsCard() {
  return (
    <Card
      icon={NetworkIcon}
      title="Top Teams to Target"
      className="col-span-8"
      footer={<Pagination total={LIST_TOTALS.teams} />}
    >
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className={cn(HEAD, 'w-[220px] pl-4')}>Team Name</TableHead>
            <TableHead className={cn(HEAD, 'w-[100px]')}>Sumble Teams Score</TableHead>
            <TableHead className={HEAD}>Matches</TableHead>
            <TableHead className={cn(HEAD, 'w-[90px] pr-4')}>Matching jobs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TEAMS.map((team) => (
            <TableRow key={team.id}>
              <TableCell className={cn(CELL, 'pl-4 font-semibold text-slate-900')}>{team.name}</TableCell>
              <TableCell className={CELL}>
                <Badge className="tabular-nums">{team.score.toFixed(1)}</Badge>
              </TableCell>
              <TableCell className={CELL}>
                <span className="flex gap-1">
                  {team.matches.map((match) => (
                    <Badge key={match}>{match}</Badge>
                  ))}
                </span>
              </TableCell>
              <TableCell className={cn(CELL, 'pr-4')}>
                <a
                  href="#"
                  aria-label={`${team.jobs} matching jobs at ${team.name}`}
                  className="inline-flex items-center gap-0.5 font-medium text-green-700 tabular-nums underline-offset-4 hover:underline"
                >
                  {team.jobs}
                  <ArrowUpRightIcon aria-hidden className="size-3.5" />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

function RecentChangesCard() {
  return (
    <Card icon={HistoryIcon} title="Recent Changes" className="col-span-4">
      <ul className="flex flex-col divide-y divide-slate-100 px-4 py-1">
        {RECENT_CHANGES.map((change) => (
          <li key={change.date} className="flex gap-3 py-2.5 text-body">
            <span className="w-12 shrink-0 text-slate-600 tabular-nums">{change.date}</span>
            <span className="text-slate-800">{change.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function OverviewTab() {
  return (
    <div className="grid grid-cols-12 gap-4 p-6 pb-16">
      <div className="col-span-6 min-w-0">
        <BriefTile />
      </div>
      <TechnologiesCard />
      <PeopleCard />
      <HeadcountCard />
      <TeamsCard />
      <RecentChangesCard />
    </div>
  )
}
