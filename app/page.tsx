'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, Check, CircleAlert, FileCheck2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { validatePlate, type PlateValidationResult } from '@/lib/validate-plate'

const findings = [
  {
    problem: 'Silently deleted unknown characters, so bad input counted as valid',
    example: 'MH12AB1234!!!, Cyrillic lookalike letters',
    fix: 'Reject anything except letters, digits, spaces and hyphens',
  },
  {
    problem: 'BH-series plates rejected',
    example: '22BH1234AA',
    fix: 'Added the BH-series pattern',
  },
  {
    problem: 'Old plates with no series letters rejected',
    example: 'MH121234',
    fix: 'Series letters are now optional (0 to 3)',
  },
  {
    problem: 'RTO code 00 and registration number 0000 accepted',
    example: 'MH00AB1234, MH12AB0000',
    fix: 'Treated as invalid (a design rule I chose)',
  },
  {
    problem: 'New Telangana state code TG missing',
    example: 'TG09AB1234',
    fix: 'Added TG, kept TS for older plates',
  },
  {
    problem: 'Legacy Uttarakhand code UA missing',
    example: 'UA07AB1234',
    fix: 'Added UA as a legacy code',
  },
  {
    problem: 'Letters I and O accepted in the series',
    example: 'MH12ABI1234',
    fix: 'Excluded I and O from the series letters',
  },
  {
    problem: 'Crash on null input',
    example: 'null',
    fix: 'Non-text input now returns invalid',
  },
  {
    problem: 'UI showed a blank RTO code for BH plates',
    example: '22BH1234AA',
    fix: 'Now shows Not applicable (BH series)',
  },
    {
    problem: 'UI showed a blank RTO code for BH plates',
    example: '22BH1234AA',
    fix: 'Now shows Not applicable (BH series)',
  },
  {
    problem: 'Input collapsed to a thin bar on phone-width screens',
    example: 'Any phone-width screen',
    fix: 'Fixed the layout so the input keeps its height on mobile',
  },
]

export default function Page() {
  const [plate, setPlate] = useState('')
  const [result, setResult] = useState<PlateValidationResult | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(validatePlate(plate))
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between border-b border-border/70 pb-6">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <FileCheck2 aria-hidden="true" className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Indian Plate Check</span>
          </div>
          <span className="text-xs font-medium text-muted-foreground">A small format utility</span>
        </header>

        <div className="flex flex-1 flex-col justify-center py-16 sm:py-24">
          <section className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Project</p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl sm:leading-[1.05]">
              Check an Indian vehicle plate in seconds.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Clean up messy plate input and check whether its format is valid, along with the state and RTO code.
            </p>
          </section>

          <section aria-labelledby="checker-heading" className="mt-12 max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <h2 id="checker-heading" className="text-lg font-semibold tracking-tight">Plate number</h2>
                <p className="mt-1 text-sm text-muted-foreground">Spaces and lowercase letters are handled automatically.</p>
              </div>
              <span className="hidden rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">Browser check</span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="plate-number" className="sr-only">Indian vehicle registration number</label>
              <input
                id="plate-number"
                value={plate}
                onChange={(event) => setPlate(event.target.value)}
                placeholder="e.g. MH 12 AB 1234"
                autoComplete="off"
                spellCheck="false"
                className="h-14 min-w-0 sm:flex-1 rounded-lg border border-input bg-background px-4 font-mono text-base uppercase tracking-wider outline-none transition placeholder:font-sans placeholder:tracking-normal focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              <Button type="submit" className="h-14 px-6" disabled={!plate.trim()}>
                Check <ArrowRight data-icon="inline-end" />
              </Button>
            </form>

            {result && (
              <div className={`mt-6 rounded-xl border p-5 ${result.valid ? 'border-primary/20 bg-primary/[0.04]' : 'border-destructive/20 bg-destructive/[0.04]'}`} role="status" aria-live="polite">
                <div className="flex items-center gap-3">
                  <span className={`flex size-9 items-center justify-center rounded-full ${result.valid ? 'bg-primary text-primary-foreground' : 'bg-destructive text-white'}`}>
                    {result.valid ? <Check aria-hidden="true" className="size-4" /> : <CircleAlert aria-hidden="true" className="size-4" />}
                  </span>
                  <div>
                    <p className="font-semibold">{result.valid ? 'Valid format' : 'Invalid format'}</p>
                    <p className="mt-0.5 font-mono text-xs tracking-wider text-muted-foreground">{result.normalized || '—'}</p>
                  </div>
                </div>
                {result.valid && (
                  <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border/70 pt-5">
                    <div><dt className="text-xs text-muted-foreground">State</dt><dd className="mt-1 text-sm font-medium">{result.state}</dd></div>
                    <div><dt className="text-xs text-muted-foreground">RTO code</dt><dd className="mt-1 font-mono text-sm font-semibold">{result.rtoCode ?? 'Not applicable (BH series)'}</dd></div>
                  </dl>
                )}
              </div>
            )}

            <p className="mt-5 text-xs leading-5 text-muted-foreground">Format check only. This does not confirm that a vehicle is registered.</p>
          </section>

          <section className="mt-16 max-w-3xl border-t border-border pt-8" aria-labelledby="audit-heading">
            <h2 id="audit-heading" className="text-lg font-semibold tracking-tight">Audit report</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              v0 generated this page and its validator in about a minute. I then ran 29 test cases for Indian plate formats.
              On the first run 17 passed and 12 failed. Every fix is its own commit. After the fixes there are 31 tests (two
              added for RTO codes) and all pass.
            </p>

            <h3 className="mt-8 text-sm font-semibold">What went wrong</h3>
            <div className="mt-3 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">What went wrong</th>
                    <th scope="col" className="px-4 py-3 font-medium">Example</th>
                    <th scope="col" className="px-4 py-3 font-medium">Fix</th>
                  </tr>
                </thead>
                <tbody>
                  {findings.map((item) => (
                    <tr key={item.problem} className="border-t border-border/70 align-top">
                      <td className="px-4 py-3">{item.problem}</td>
                      <td className="px-4 py-3 font-mono text-xs">{item.example}</td>
                      <td className="px-4 py-3">{item.fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-8 text-sm font-semibold">What it got right</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
              <li>The validator is a separate, pure function, which made it easy to test.</li>
              <li>Case, spaces and hyphens were handled correctly from the start.</li>
              <li>State codes sit in a lookup table instead of being buried in logic.</li>
              <li>The input has a proper label, and the result is announced to screen readers.</li>
              <li>The format-only disclaimer is clear and honest.</li>
            </ul>
              <h3 className="mt-8 text-sm font-semibold">Lighthouse, before and after</h3>
              <div className="mt-3 overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-xs text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium">Score</th>
                      <th scope="col" className="px-4 py-3 font-medium">Before</th>
                      <th scope="col" className="px-4 py-3 font-medium">After</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border/70"><td className="px-4 py-3">Mobile performance</td><td className="px-4 py-3">95</td><td className="px-4 py-3">96</td></tr>
                    <tr className="border-t border-border/70"><td className="px-4 py-3">Desktop performance</td><td className="px-4 py-3">90</td><td className="px-4 py-3">100</td></tr>
                    <tr className="border-t border-border/70"><td className="px-4 py-3">Accessibility</td><td className="px-4 py-3">100</td><td className="px-4 py-3">100</td></tr>
                    <tr className="border-t border-border/70"><td className="px-4 py-3">Best practices</td><td className="px-4 py-3">100</td><td className="px-4 py-3">100</td></tr>
                    <tr className="border-t border-border/70"><td className="px-4 py-3">SEO</td><td className="px-4 py-3">100</td><td className="px-4 py-3">100</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Middle value of three runs each. Performance varies between runs (my first three mobile runs ranged from 88 to 98),
                so these changes are within normal variation. My fixes were about correctness, not speed. The point worth noting:
                Lighthouse scored accessibility and best practices at 100 before and after, and it never saw the 12 validator bugs.
              </p>

            <h3 className="mt-8 text-sm font-semibold">A mistake of my own</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              One test in my plan was wrong. I expected the Delhi plate DL1CAB1234 to have RTO code 1C. Checking sources showed the
              RTO is 1 and the C belongs to the series, so the validator was right and I corrected the test.
            </p>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Another was in my setup. I installed the test tool with npm in a pnpm project, which left the lockfile out of date
              and made every Vercel build fail until I ran pnpm install. The live site kept serving the last good build, so
              visitors saw nothing broken, but my fixes were not live until I corrected it.
            </p>

            <h3 className="mt-8 text-sm font-semibold">Known gaps</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Andaman and Nicobar (AN) and the legacy DN code are not in the state list yet. This tool checks format only.
            </p>

            <p className="mt-8 text-sm">
              <a
                href="https://github.com/Sanskrutiraka/vehicle-plate-check-audit/commits/main"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                See every commit on GitHub
              </a>
            </p>
          </section>
        </div>

        <footer className="border-t border-border/70 py-6 text-center text-xs text-muted-foreground">
          Built by Sanskruti Raka ·{' '}
          <a
            href="https://github.com/Sanskrutiraka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-foreground"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 fill-current">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Sanskrutiraka
          </a>
        </footer>
      </div>
    </main>
  )
}
