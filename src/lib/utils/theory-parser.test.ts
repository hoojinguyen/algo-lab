import { parseTheory } from './theory-parser';

describe('parseTheory', () => {
  it('should split theory into lead, sections, and interview insight', () => {
    const rawTheory = `This is the lead paragraph.\n\n**Time Complexity:** O(n^2) description.\n\n**Space Complexity:** O(1) description.\n\n**Key Interview Insight:** Focus on this.`;
    const result = parseTheory(rawTheory);
    expect(result.lead).toBe('This is the lead paragraph.');
    expect(result.sections).toHaveLength(2);
    expect(result.sections[0].title).toBe('Time Complexity');
    expect(result.interviewInsight).toBe('Focus on this.');
  });
});
