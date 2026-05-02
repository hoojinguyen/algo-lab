import { Metadata } from 'next';
import { ALGORITHM_REGISTRY } from '@/lib/algorithms/registry';
import { AlgorithmLesson } from './AlgorithmLesson';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ category: string; algorithm: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const entry = ALGORITHM_REGISTRY[resolvedParams.algorithm];

  if (!entry || entry.category !== resolvedParams.category) {
    return {
      title: 'Algorithm Not Found | AlgoLab',
    };
  }

  const categoryName = entry.category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${entry.name} - ${categoryName} | AlgoLab`,
    description: `Learn ${entry.name} with interactive visualizations, complexity analysis, and implementation details. Master ${categoryName} fundamentals on AlgoLab.`,
    keywords: [
      entry.name,
      entry.category,
      'algorithms',
      'data structures',
      'interactive learning',
      ...entry.tags,
    ],
    openGraph: {
      title: `${entry.name} - Interactive Algorithm Visualizer`,
      description: `Step-by-step visualization and theory for ${entry.name}.`,
      type: 'website',
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const entry = ALGORITHM_REGISTRY[resolvedParams.algorithm];

  if (!entry || entry.category !== resolvedParams.category) {
    notFound();
  }

  return <AlgorithmLesson params={params} />;
}
