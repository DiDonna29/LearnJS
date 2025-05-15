'use server';

/**
 * @fileOverview AI-powered learning path suggestions based on user's experience and goals.
 *
 * - suggestLearningPath - A function that suggests a learning path.
 * - SuggestLearningPathInput - The input type for the suggestLearningPath function.
 * - SuggestLearningPathOutput - The return type for the suggestLearningPath function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLearningPathInputSchema = z.object({
  experienceLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The user\u0027s current experience level with JavaScript.'),
  careerGoals: z
    .string()
    .describe(
      'The user\u0027s career goals, e.g., \u0022front-end development,\u0022 \u0022back-end development,\u0022 or \u0022full-stack development.\u0022'
    ),
});
export type SuggestLearningPathInput = z.infer<typeof SuggestLearningPathInputSchema>;

const SuggestLearningPathOutputSchema = z.object({
  suggestedPath: z
    .string()
    .describe(
      'A suggested learning path, including specific topics and the order in which they should be learned.'
    ),
});
export type SuggestLearningPathOutput = z.infer<typeof SuggestLearningPathOutputSchema>;

export async function suggestLearningPath(
  input: SuggestLearningPathInput
): Promise<SuggestLearningPathOutput> {
  return suggestLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLearningPathPrompt',
  input: {schema: SuggestLearningPathInputSchema},
  output: {schema: SuggestLearningPathOutputSchema},
  prompt: `You are an expert in JavaScript and web development.

  Based on the user\u0027s experience level and career goals, suggest a learning path for them. The learning path should include specific topics and the order in which they should be learned.

  Experience Level: {{{experienceLevel}}}
  Career Goals: {{{careerGoals}}}
  `,
});

const suggestLearningPathFlow = ai.defineFlow(
  {
    name: 'suggestLearningPathFlow',
    inputSchema: SuggestLearningPathInputSchema,
    outputSchema: SuggestLearningPathOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
