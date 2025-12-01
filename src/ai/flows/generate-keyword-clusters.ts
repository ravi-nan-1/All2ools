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
    clusterTitle: z.string().describe("An AI-rewritten, SEO-friendly title for the keyword cluster that captures its main theme."),
    parentTopic: z.string().describe('The broader parent topic or category this cluster belongs to. This might be the primary keyword or a more general theme.'),
    intent: z.enum(['Informational', 'Transactional', 'Commercial', 'Navigational', 'Unknown']).describe('The most likely user search intent for this cluster. Classify it based on what a user is trying to accomplish.'),
    relevanceScore: z.number().min(0).max(100).describe('A score from 0-100 indicating how semantically related the keywords in the cluster are to each other.'),
    difficultyScore: z.number().min(0).max(100).describe('An estimated SEO Keyword Difficulty (KD) score from 0-100 for ranking for the keywords in this cluster, where 0 is easy and 100 is very difficult.'),
    searchVolume: z.number().min(0).describe('A plausible estimated monthly search volume for the main topic of this cluster.'),
    cpc: z.number().min(0).describe('A plausible estimated Cost Per Click (CPC) in USD for the keywords in this cluster.'),
    competition: z.number().min(0).max(1).describe('A score from 0.0 to 1.0 representing PPC competition, where 1.0 is highest competition.'),
    opportunityScore: z.number().min(0).max(100).describe('An overall "Opportunity Score" from 0-100, combining difficulty, volume, and competition. Higher is better.'),
    trafficPotential: z.number().min(0).describe('An estimated potential monthly organic traffic this cluster could generate if ranking in the top 3.'),
    priority: z.enum(['High', 'Medium', 'Low']).describe('A suggested priority ranking for content creation based on all available metrics.'),
    serpFeatures: z.array(z.string()).describe('A list of common SERP features found for these keywords (e.g., "Featured Snippet", "People Also Ask", "Video Pack").'),
    seasonality: z.string().describe('A brief description of any seasonality trends for this topic (e.g., "Year-round", "Spikes in December", "Popular in summer").'),
    keywords: z.array(z.string()).describe('A list of keywords from the input that belong to this cluster.'),
    aiSeoTitle: z.string().describe('An AI-generated, SEO-friendly meta title for a page targeting this cluster (50-60 characters).'),
    aiMetaDescription: z.string().describe('An AI-generated, compelling meta description for a page targeting this cluster (150-160 characters).'),
    aiContentBrief: z.string().describe('An AI-generated, detailed content brief for an article targeting this cluster. Should include key topics, entities, and questions to answer. Format as bullet points.'),
    aiKeywordExpansion: z.object({
        related: z.array(z.string()).describe('A list of 5-7 semantically related keywords or LSI keywords to expand the topic.'),
        questions: z.array(z.string()).describe('A list of 3-5 common questions users ask related to this topic.'),
    }).describe('AI-powered suggestions for expanding the keyword set for this cluster.'),
});
export type Cluster = z.infer<typeof ClusterSchema>;

const GenerateKeywordClustersOutputSchema = z.object({
  clusters: z.array(ClusterSchema),
  aiPillarPageSuggestion: z.string().describe("Based on all clusters, suggest which one should be the main 'pillar page' and which ones should be 'supporting cluster pages' that link to it. Provide a brief (2-3 sentences) strategic rationale."),
  duplicateKeywords: z.array(z.string()).describe("A list of any duplicate keywords that were found in the user's input and removed."),
});
export type GenerateKeywordClustersOutput = z.infer<typeof GenerateKeywordClustersOutputSchema>;

export async function generateKeywordClusters(input: GenerateKeywordClustersInput): Promise<GenerateKeywordClustersOutput> {
  const uniqueKeywords = [...new Set(input.secondaryKeywords)];
  const duplicates = input.secondaryKeywords.filter((item, index) => input.secondaryKeywords.indexOf(item) !== index);

  const flowResult = await generateKeywordClustersFlow({
    ...input,
    secondaryKeywords: uniqueKeywords,
  });

  return {
    ...flowResult,
    duplicateKeywords: [...new Set(duplicates)],
  };
}

const generateKeywordClustersPrompt = ai.definePrompt({
  name: 'generateKeywordClustersPrompt',
  input: {schema: GenerateKeywordClustersInputSchema},
  output: {schema: GenerateKeywordClustersOutputSchema.omit({ duplicateKeywords: true }) },
  prompt: `You are a world-class SEO strategist and content planner specializing in topic clusters. Your task is to group a list of secondary keywords into highly relevant, semantically-sound clusters around a primary keyword.

For each cluster, you must:
1.  **AI-Rewrite Cluster Name:** Create a short, descriptive, SEO-friendly title for the core topic of the group.
2.  **Assign Parent Topic:** Identify the broader category.
3.  **Determine User Intent:** Classify as Informational, Transactional, Commercial, or Navigational.
4.  **Score Relevance:** Provide a "Relevance Score" (0-100) for semantic cohesion.
5.  **Estimate SEO Metrics (be realistic):**
    - **Keyword Difficulty (KD):** Provide a "difficultyScore" (0-100) for ranking difficulty.
    - **Search Volume:** Estimate a plausible monthly "searchVolume".
    - **CPC:** Estimate a plausible "cpc" in USD.
    - **Competition:** Estimate PPC "competition" from 0.0 to 1.0.
    - **Opportunity Score:** Calculate an overall "opportunityScore" (0-100) based on volume vs. difficulty.
    - **Traffic Potential:** Estimate potential monthly "trafficPotential" for a top-ranking page.
    - **Priority:** Assign a "priority" (High, Medium, Low) for content creation.
    - **SERP Features:** List common "serpFeatures" (e.g., "Featured Snippet", "People Also Ask").
    - **Seasonality:** Describe any "seasonality" trends.
6.  **Group Keywords:** List the input keywords that belong to this cluster.
7.  **Generate AI SEO Metadata:**
    - Create an SEO-optimized "aiSeoTitle" (50-60 chars).
    - Create a compelling "aiMetaDescription" (150-160 chars).
8.  **Generate AI Content Brief:** Create a detailed "aiContentBrief" in bullet points, outlining key topics, entities, and questions for an article on this cluster.
9.  **Generate AI Keyword Expansion:**
    - Suggest 5-7 related/LSI keywords.
    - Suggest 3-5 common user questions.

After creating all clusters, provide an overarching "aiPillarPageSuggestion" based on the generated clusters, explaining which cluster should be the main pillar page and why.

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
    outputSchema: GenerateKeywordClustersOutputSchema.omit({ duplicateKeywords: true }),
  },
  async input => {
    const {output} = await generateKeywordClustersPrompt(input);
    return output!;
  }
);
