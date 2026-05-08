import type { GraphNode, GraphEdge } from './types';

export function normalizeText(text: string): string {
  return text
    .replace(/[,!?;:()"""]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .toUpperCase();
}

export function splitSentences(text: string): string[] {
  return text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
}

export function buildSubstrings(words: string[], sentenceId: number, nodes: Map<string, GraphNode>): void {
  const n = words.length;

  // Create all possible substrings
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j <= n; j++) {
      const sub = words.slice(i, j).join(' ');
      if (!nodes.has(sub)) {
        nodes.set(sub, {
          label: sub,
          wordCount: j - i,
          sentenceIds: new Set([sentenceId]),
          x: 0, y: 0, z: 0,
          vx: 0, vy: 0, vz: 0
        });
      } else {
        nodes.get(sub)!.sentenceIds.add(sentenceId);
      }
    }
  }
}

export function buildInclusionEdges(words: string[], nodes: Map<string, GraphNode>, edges: GraphEdge[]): void {
  const n = words.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j <= n; j++) {
      if (j - i <= 1) continue; // Need at least 2 words to create sub-edges

      const curLabel = words.slice(i, j).join(' ');
      const cur = nodes.get(curLabel);
      if (!cur) continue;

      // Left substring: remove first word
      const leftLabel = words.slice(i + 1, j).join(' ');
      const left = nodes.get(leftLabel);

      // Right substring: remove last word
      const rightLabel = words.slice(i, j - 1).join(' ');
      const right = nodes.get(rightLabel);

      // Add edges if not already present
      if (left && !edges.some(e =>
        (e.a === cur && e.b === left) || (e.a === left && e.b === cur)
      )) {
        edges.push({ a: cur, b: left });
      }

      if (right && !edges.some(e =>
        (e.a === cur && e.b === right) || (e.a === right && e.b === cur)
      )) {
        edges.push({ a: cur, b: right });
      }
    }
  }
}

export function buildCharSubstrings(word: string, nodes: Map<string, GraphNode>): void {
  const n = word.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j <= n; j++) {
      const sub = word.slice(i, j);
      if (!nodes.has(sub)) {
        nodes.set(sub, {
          label: sub,
          wordCount: j - i,
          sentenceIds: new Set(),
          x: 0, y: 0, z: 0,
          vx: 0, vy: 0, vz: 0,
        });
      }
    }
  }
}

export function buildCharInclusionEdges(word: string, nodes: Map<string, GraphNode>, edges: GraphEdge[]): void {
  const n = word.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j <= n; j++) {
      if (j - i <= 1) continue;
      const cur = nodes.get(word.slice(i, j));
      if (!cur) continue;
      const left = nodes.get(word.slice(i + 1, j));
      const right = nodes.get(word.slice(i, j - 1));
      if (left && !edges.some(e => (e.a === cur && e.b === left) || (e.a === left && e.b === cur)))
        edges.push({ a: cur, b: left });
      if (right && !edges.some(e => (e.a === cur && e.b === right) || (e.a === right && e.b === cur)))
        edges.push({ a: cur, b: right });
    }
  }
}

export function buildNetworkFromText(text: string, mode: 'sentence' | 'word' | 'both'): {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  minWords: number;
  maxWords: number;
} {
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  const clean = normalizeText(text);
  const sentences = splitSentences(clean);

  // Word n-gram layer (Satzebene)
  if (mode === 'sentence' || mode === 'both') {
    sentences.forEach((sentence, sentenceId) => {
      const words = sentence.split(/\s+/).filter(Boolean);
      buildSubstrings(words, sentenceId, nodes);
    });
    sentences.forEach((sentence) => {
      const words = sentence.split(/\s+/).filter(Boolean);
      buildInclusionEdges(words, nodes, edges);
    });
  }

  // Character n-gram layer (Wortebene)
  if (mode === 'word' || mode === 'both') {
    const allWords = new Set<string>();
    sentences.forEach(sentence =>
      sentence.split(/\s+/).filter(Boolean).forEach(w => allWords.add(w))
    );
    allWords.forEach(word => buildCharSubstrings(word, nodes));
    allWords.forEach(word => buildCharInclusionEdges(word, nodes, edges));
  }

  let minW = Infinity;
  let maxW = -Infinity;
  nodes.forEach(node => {
    minW = Math.min(minW, node.wordCount);
    maxW = Math.max(maxW, node.wordCount);
  });

  return { nodes, edges, minWords: minW, maxWords: maxW };
}
