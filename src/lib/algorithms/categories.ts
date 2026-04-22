import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'sorting',
    name: 'Sorting',
    section: 'fundamentals',
    icon: 'ArrowDownUp',
    description: 'Algorithms that put elements of a list into an order.'
  },
  {
    id: 'searching',
    name: 'Searching',
    section: 'fundamentals',
    icon: 'Search',
    description: 'Algorithms that find an item with specified properties among a collection of items.'
  },
  { id: 'graph-traversal', name: 'Graph Traversal', section: 'advanced', icon: 'Network', description: 'Explore graphs' },
  { id: 'shortest-path', name: 'Shortest Path', section: 'advanced', icon: 'Route', description: 'Find paths' },
  { id: 'mst', name: 'Minimum Spanning Tree', section: 'advanced', icon: 'GitFork', description: 'Connect nodes' },
  { id: 'tree', name: 'Tree', section: 'data-structures', icon: 'TreeDeciduous', description: 'Hierarchical data' },
  { id: 'linked-list', name: 'Linked List', section: 'data-structures', icon: 'Link', description: 'Chained nodes' }
];
