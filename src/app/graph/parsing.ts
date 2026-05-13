import type { GraphNode, GraphEdge } from './types';

export const MAX_NGRAM_WORDS = 4;
export const MAX_NGRAM_CHARS = 10;
export const MAX_TOTAL_NODES = 700; // Increased for 'both' mode which combines layers

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

/**
 * Build sentence-layer nodes: word n-grams extracted from a single sentence.
 * Creates all n-gram substrings up to MAX_NGRAM_WORDS length.
 */
function buildSentenceLayerNodes(words: string[], sentenceId: number, nodes: Map<string, GraphNode>): void {
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

/**
 * Build sentence-layer edges: inclusion relationships within a sentence's n-grams.
 * Connects longer n-grams to their immediate sub-n-grams (left/right removal).
 */
function buildSentenceLayerEdges(
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

/**
 * Build character-layer nodes: character n-grams extracted from a single word.
 * Creates all n-gram substrings up to MAX_NGRAM_CHARS length.
 */
function buildCharLayerNodes(word: string, nodes: Map<string, GraphNode>): void {
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

/**
 * Build character-layer edges: inclusion relationships within a word's character n-grams.
 * Connects longer character n-grams to their immediate sub-n-grams (left/right removal).
 */
function buildCharLayerEdges(
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

/**
 * Build cross-layer edges: connections between the sentence layer and character layer.
 * Connects each single word to its constituent character n-grams.
 * This keeps edges meaningful and prevents clutter while linking the two layers.
 */
function buildCrossLayerEdges(
  words: string[],
  nodes: Map<string, GraphNode>,
  edges: GraphEdge[],
  edgeSet: Set<string>
): void {
  // For each word, connect it to all its character n-grams
  for (const word of words) {
    const wordNode = nodes.get(word);
    if (!wordNode) continue;

    // Connect word to all its character n-grams
    for (let i = 0; i < word.length; i++) {
      for (let j = i + 1; j <= Math.min(word.length, i + MAX_NGRAM_CHARS); j++) {
        const charSubstring = word.slice(i, j);
        const charNode = nodes.get(charSubstring);
        if (charNode && charNode !== wordNode) {
          addEdgeIfNew(wordNode, charNode, edges, edgeSet);
        }
      }
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

  // === UNIFIED PARSING PIPELINE ===
  // Both modes build both layers internally; mode acts as a filter on output.

  // PHASE 1: Build sentence-layer nodes and edges
  if (mode === 'sentence' || mode === 'both') {
    for (let i = 0; i < sentences.length; i++) {
      if (nodes.size >= MAX_TOTAL_NODES) break;
      const words = sentences[i].split(/\s+/).filter(Boolean);
      buildSentenceLayerNodes(words, i, nodes);
    }
    sentences.forEach((sentence) => {
      const words = sentence.split(/\s+/).filter(Boolean);
      buildSentenceLayerEdges(words, nodes, edges, edgeSet);
    });
  }

  // PHASE 2: Build character-layer nodes and edges
  if (mode === 'word' || mode === 'both') {
    const allWords = new Set<string>();
    sentences.forEach(sentence =>
      sentence.split(/\s+/).filter(Boolean).forEach(w => allWords.add(w))
    );
    for (const word of allWords) {
      if (nodes.size >= MAX_TOTAL_NODES) break;
      buildCharLayerNodes(word, nodes);
    }
    allWords.forEach(word => buildCharLayerEdges(word, nodes, edges, edgeSet));
  }

  // PHASE 3: Build cross-layer edges (unified network)
  if (mode === 'both') {
    const allWords = new Set<string>();
    sentences.forEach(sentence =>
      sentence.split(/\s+/).filter(Boolean).forEach(w => allWords.add(w))
    );
    // Connect each word to its character n-grams
    for (const word of allWords) {
      if (nodes.has(word)) {
        buildCrossLayerEdges([word], nodes, edges, edgeSet);
      }
    }
  }

  // Calculate metrics over final graph
  let minW = Infinity;
  let maxW = -Infinity;
  nodes.forEach(node => {
    minW = Math.min(minW, node.wordCount);
    maxW = Math.max(maxW, node.wordCount);
  });

  return { nodes, edges, minWords: minW === Infinity ? 0 : minW, maxWords: maxW === -Infinity ? 0 : maxW };
}
