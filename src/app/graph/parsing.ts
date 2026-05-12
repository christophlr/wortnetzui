import type { GraphNode, GraphEdge } from './types';

export const MAX_NGRAM_WORDS = 4;
export const MAX_NGRAM_CHARS = 10;
export const MAX_TOTAL_NODES = 300;

export function normalizeText(text: string): string {
  return text
    .replace(/[,!?;:()""\"]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .toUpperCase();
}

export function splitSentences(text: string): string[] {
  return text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
}

export function buildSubstrings(words: string[], sentenceId: number, nodes: Map<string, GraphNode>): void {
  const n = words.length;

  // Create all possible substrings up to MAX_NGRAM_WORDS
  for (let i = 0; i < n; i++) {
    const maxJ = Math.min(n, i + MAX_NGRAM_WORDS);
    for (let j = i + 1; j <= maxJ; j++) {
      if (nodes.size >= MAX_TOTAL_NODES) return;
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

/** Add an edge if the canonical key hasn't been seen. O(1) per check. */
function addEdgeIfNew(
  a: GraphNode,
  b: GraphNode,
  edges: GraphEdge[],
  edgeSet: Set<string>
): void {
  const key = a.label < b.label ? `${a.label}|${b.label}` : `${b.label}|${a.label}`;
  if (edgeSet.has(key)) return;
  edgeSet.add(key);
  edges.push({ a, b });
}

export function buildInclusionEdges(
  words: string[],
  nodes: Map<string, GraphNode>,
  edges: GraphEdge[],
  edgeSet: Set<string>
): void {
  const n = words.length;

  for (let i = 0; i < n; i++) {
    const maxJ = Math.min(n, i + MAX_NGRAM_WORDS);
    for (let j = i + 1; j <= maxJ; j++) {
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

      // Add edges via O(1) Set lookup
      if (left) addEdgeIfNew(cur, left, edges, edgeSet);
      if (right) addEdgeIfNew(cur, right, edges, edgeSet);
    }
  }
}

export function buildCharSubstrings(word: string, nodes: Map<string, GraphNode>): void {
  const n = word.length;
  for (let i = 0; i < n; i++) {
    const maxJ = Math.min(n, i + MAX_NGRAM_CHARS);
    for (let j = i + 1; j <= maxJ; j++) {
      if (nodes.size >= MAX_TOTAL_NODES) return;
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

export function buildCharInclusionEdges(
  word: string,
  nodes: Map<string, GraphNode>,
  edges: GraphEdge[],
  edgeSet: Set<string>
): void {
  const n = word.length;
  for (let i = 0; i < n; i++) {
    const maxJ = Math.min(n, i + MAX_NGRAM_CHARS);
    for (let j = i + 1; j <= maxJ; j++) {
      if (j - i <= 1) continue;
      const cur = nodes.get(word.slice(i, j));
      if (!cur) continue;
      const left = nodes.get(word.slice(i + 1, j));
      const right = nodes.get(word.slice(i, j - 1));
      if (left) addEdgeIfNew(cur, left, edges, edgeSet);
      if (right) addEdgeIfNew(cur, right, edges, edgeSet);
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
  const edgeSet = new Set<string>();

  const clean = normalizeText(text);
  const sentences = splitSentences(clean);

  // Word n-gram layer (Satzebene)
  if (mode === 'sentence' || mode === 'both') {
    for (let i = 0; i < sentences.length; i++) {
      if (nodes.size >= MAX_TOTAL_NODES) break;
      const words = sentences[i].split(/\s+/).filter(Boolean);
      buildSubstrings(words, i, nodes);
    }
    sentences.forEach((sentence) => {
      const words = sentence.split(/\s+/).filter(Boolean);
      buildInclusionEdges(words, nodes, edges, edgeSet);
    });
  }

  // Character n-gram layer (Wortebene)
  if (mode === 'word' || mode === 'both') {
    const allWords = new Set<string>();
    sentences.forEach(sentence =>
      sentence.split(/\s+/).filter(Boolean).forEach(w => allWords.add(w))
    );
    for (const word of allWords) {
      if (nodes.size >= MAX_TOTAL_NODES) break;
      buildCharSubstrings(word, nodes);
    }
    allWords.forEach(word => buildCharInclusionEdges(word, nodes, edges, edgeSet));
  }

  let minW = Infinity;
  let maxW = -Infinity;
  nodes.forEach(node => {
    minW = Math.min(minW, node.wordCount);
    maxW = Math.max(maxW, node.wordCount);
  });

  return { nodes, edges, minWords: minW === Infinity ? 0 : minW, maxWords: maxW === -Infinity ? 0 : maxW };
}
