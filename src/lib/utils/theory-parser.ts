export interface TheorySection {
  title: string;
  content: string;
}

export interface ParsedTheory {
  lead: string;
  sections: TheorySection[];
  interviewInsight?: string;
}

/**
 * Parses the raw theory markdown string into structured components.
 *
 * Expectations:
 * - Lead paragraph is the first block (delimited by \n\n).
 * - Sections are blocks starting with **Title:**.
 * - Interview Insight is a block starting with **Key Interview Insight:** or similar.
 */
export function parseTheory(theory: string): ParsedTheory {
  const parts = theory.split('\n\n').filter(Boolean);
  const lead = parts[0] || '';
  const remaining = parts.slice(1);

  const sections: TheorySection[] = [];
  let interviewInsight: string | undefined;

  remaining.forEach((part) => {
    // Match "**Title:** Content"
    const match = part.match(/^\*\*(.*?):\*\*\s*(.*)/s);
    if (match) {
      const title = match[1].trim();
      const content = match[2].trim();

      if (title.toLowerCase().includes('interview insight')) {
        interviewInsight = content;
      } else {
        sections.push({ title, content });
      }
    } else {
      // If it doesn't match the pattern but is in the remaining parts,
      // append it to the last section or the lead if no sections exist.
      if (sections.length > 0) {
        sections[sections.length - 1].content += '\n\n' + part.trim();
      } else {
        // Fallback: If no sections yet, maybe the lead was split?
        // This is unlikely given the splitting logic but good for robustness.
      }
    }
  });

  return { lead, sections, interviewInsight };
}
