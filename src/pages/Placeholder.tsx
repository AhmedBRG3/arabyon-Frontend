import { Container } from '../components/layout/Container'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-2xl font-bold text-teal-950">{title}</h1>
      <p className="mt-3 text-sm text-ink-500">This page is coming next.</p>
    </Container>
  )
}
