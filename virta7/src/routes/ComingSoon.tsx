import { PageContainer } from '../components/layout/PageContainer';

export function ComingSoon({ title }: { title: string }) {
  return (
    <PageContainer>
      <h1 className="mb-2 text-2xl font-bold text-text">{title}</h1>
      <p className="text-text-muted">This part of Virta7 is coming soon.</p>
    </PageContainer>
  );
}
