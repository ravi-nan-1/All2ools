'use server';

/**
 * @fileOverview A Genkit flow that takes a primary keyword and a list of secondary keywords and groups them into semantic clusters with advanced SEO metrics and AI-powered content strategy suggestions.
 *
 * - generateKeywordClusters - A function that returns a list of keyword clusters with intent, difficulty scores, and AI content suggestions.
 * - GenerateKeywordClustersInput - The input type for the generateKeywordClusters function.
 * - GenerateKeywordClustersOutput - The return type for the generateKeywordClusters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateKeywordClustersInputSchema = z.object({
  primaryKeyword: z.string().describe('The main, overarching keyword that defines the core topic.'),
  secondaryKeywords: z.array(z.string()).describe('A list of secondary and long-tail keywords to be grouped.'),
});
export type GenerateKeywordClustersInput = z.infer<typeof GenerateKeywordClustersInputSchema>;

const ClusterSchema = z.object({
    clusterTitle: z.string().describe('A short, descriptive title for the keyword cluster that captures its main theme.'),
    parentTopic: z.string().describe('The broader parent topic or category this cluster belongs to. This might be the primary keyword or a more general theme.'),
    intent: z.enum(['Informational', 'Transactional', 'Commercial', 'Navigational', 'Unknown']).describe('The most likely user search intent for this cluster.'),
    relevanceScore: z.number().min(0).max(100).describe('A score from 0-100 indicating how semantically related the keywords in the cluster are to each other.'),
    difficultyScore: z.number().min(0).max(100).describe('An estimated SEO difficulty score from 0-100 for ranking for the keywords in this cluster, where 0 is easy and 100 is very difficult.'),
    keywords: z.array(z.string()).describe('A list of keywords from the input that belong to this cluster.'),
    aiSeoTitle: z.string().describe('An AI-generated, SEO-friendly meta title for a page targeting this cluster (60 characters max).'),
    aiMetaDescription: z.string().describe('An AI-generated, compelling meta description for a page targeting this cluster (160 characters max).'),
    aiContentBrief: z.string().describe('An AI-generated, detailed content brief for an article targeting this cluster. Should include key topics, entities, and questions to answer. Format as bullet points.'),
    aiKeywordExpansion: z.object({
        related: z.array(z.string()).describe('A list of 5-7 semantically related keywords or LSI keywords to expand the topic.'),
        questions: z.array(z.string()).describe('A list of 3-5 common questions users ask related to this topic.'),
    }).describe('AI-powered suggestions for expanding the keyword set for this cluster.'),
});

const GenerateKeywordClustersOutputSchema = z.object({
  clusters: z.array(ClusterSchema),
  aiPillarPageSuggestion: z.string().describe("Based on all clusters, suggest which one should be the main 'pillar page' and which ones should be 'supporting cluster pages' that link to it. Provide a brief (2-3 sentences) strategic rationale."),
});
export type GenerateKeywordClustersOutput = z.infer<typeof GenerateKeywordClustersOutputSchema>;

export async function generateKeywordClusters(input: GenerateKeywordClustersInput): Promise<GenerateKeywordClustersOutput> {
  return generateKeywordClustersFlow(input);
}

const generateKeywordClustersPrompt = ai.definePrompt({
  name: 'generateKeywordClustersPrompt',
  input: {schema: GenerateKeywordClustersInputSchema},
  output: {schema: GenerateKeywordClustersOutputSchema},
  prompt: `You are an expert SEO strategist and content planner specializing in topic clusters. Your task is to group a list of secondary keywords into highly relevant, semantically-sound clusters around a primary keyword.

For each cluster, you must:
1.  **Create a Cluster Title:** A short, descriptive title for the core topic of the group.
2.  **Assign a Parent Topic:** Identify the broader category.
3.  **Determine User Intent:** Classify as Informational, Transactional, Commercial, or Navigational.
4.  **Score Relevance:** Provide a "Relevance Score" (0-100) for semantic cohesion.
5.  **Estimate SEO Difficulty:** Provide a "Difficulty Score" (0-100) for ranking difficulty.
6.  **Group Keywords:** List the input keywords that belong to this cluster.
7.  **Generate AI SEO Metadata:**
    - Create an SEO-optimized meta title (max 60 chars).
    - Create a compelling meta description (max 160 chars).
8.  **Generate AI Content Brief:** Create a detailed content brief in bullet points, outlining key topics and questions for an article on this cluster.
9.  **Generate AI Keyword Expansion:**
    - Suggest 5-7 related/LSI keywords.
    - Suggest 3-5 common user questions.

After creating all clusters, provide an overarching "Pillar Page Suggestion" based on the generated clusters, explaining which cluster should be the main pillar page and why.

**Primary Keyword (Core Context):** {{{primaryKeyword}}}

**Secondary Keywords to Cluster:**
{{#each secondaryKeywords}}- {{{this}}}
{{/each}}

Instructions:
- Create logical clusters that would be targeted by a single, comprehensive piece of content.
- Think about SERP similarity: keywords that would likely show similar search results should be grouped together.
- Not all secondary keywords must be used. If a keyword doesn't fit well into any cluster, omit it.
- Ensure all scores and AI-generated content are plausible and reflect a deep understanding of modern SEO principles.
`,
});

const generateKeywordClustersFlow = ai.defineFlow(
  {
    name: 'generateKeywordClustersFlow',
    inputSchema: GenerateKeywordClustersInputSchema,
    outputSchema: GenerateKeywordClustersOutputSchema,
  },
  async input => {
    const {output} = await generateKeywordClustersPrompt(input);
    return output!;
  }
);
