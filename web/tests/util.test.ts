import { describe, it, expect } from 'vitest';
import { getTopCheapestAvailable } from '../lib/util';
import type { Product } from '../lib/types';

describe('getTopCheapestAvailable', () => {
  const sample: Product[] = [
    { id: 'a', name: 'A', price: 30, isAvailable: true, category: 'x', image: '/a' },
    { id: 'b', name: 'B', price: 10, isAvailable: true, category: 'x', image: '/b' },
    { id: 'c', name: 'C', price: 20, isAvailable: false, category: 'x', image: '/c' },
    { id: 'd', name: 'D', price: 15, isAvailable: true, category: 'x', image: '/d' },
  ];

  it('filtra por disponibilidad y ordena por precio asc', () => {
    const top = getTopCheapestAvailable(sample, 3);
    expect(top.map(p => p.id)).toEqual(['b', 'd', 'a']);
  });

  it('limita al tamaño solicitado', () => {
    const top = getTopCheapestAvailable(sample, 2);
    expect(top).toHaveLength(2);
    expect(top.map(p => p.id)).toEqual(['b', 'd']);
  });
});


