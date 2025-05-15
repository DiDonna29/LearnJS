
'use client';

import { useState, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestLearningPath, type SuggestLearningPathInput, type SuggestLearningPathOutput } from '@/ai/flows/suggest-learning-path';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { saveAiLearningPath } from '@/app/ai-tool/actions'; // Import the server action
import { auth } from '@/lib/firebase'; // To get current user for saving

const formSchema = z.object({
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Please select your experience level.',
  }),
  careerGoals: z.string().min(10, {
    message: 'Career goals must be at least 10 characters long.',
  }).max(200, {
    message: 'Career goals must be at most 200 characters long.',
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function AiToolForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestLearningPathOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formDataForSave, setFormDataForSave] = useState<SuggestLearningPathInput | null>(null);
  const { toast } = useToast();
  // const [isSavingPending, startSavingTransition] = useTransition(); // If needed for save button

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experienceLevel: undefined,
      careerGoals: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setSuggestion(null);
    setError(null);
    setFormDataForSave(data as SuggestLearningPathInput); // Save form data for potential save action

    try {
      const result = await suggestLearningPath(data as SuggestLearningPathInput);
      setSuggestion(result);
      toast({
        title: "Path Suggested!",
        description: "Your personalized learning path is ready.",
      });
    } catch (err) {
      console.error('Error fetching suggestion:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to generate path: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePath = async () => {
    if (!suggestion || !formDataForSave) {
      toast({ title: "Error", description: "No path to save.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    const currentUser = auth.currentUser;
    // In a real app, you'd get an ID token to pass for server-side verification:
    // const idToken = currentUser ? await currentUser.getIdToken() : null;
    // For simulation, we pass uid directly or null. The Server Action should verify it.
    const userId = currentUser ? currentUser.uid : null;

    try {
      const result = await saveAiLearningPath(userId, {
        input: formDataForSave,
        output: suggestion,
      });
      if (result.success) {
        toast({
          title: "Path Saved!",
          description: result.message,
        });
      } else {
        toast({
          title: "Save Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error saving path:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while saving.';
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Tell Us About Yourself</CardTitle>
          <CardDescription>Provide your details to get a custom learning path.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>How comfortable are you with JavaScript development?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="careerGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career Goals</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., front-end development, full-stack with React and Node" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>What do you want to achieve with JavaScript?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Suggest Path
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Error Generating Path</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestion && (
        <Card className="mt-6 shadow-inner bg-secondary/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Wand2 className="text-primary"/> Your Suggested Learning Path
              </div>
              <Button size="sm" variant="outline" onClick={handleSavePath} disabled={isSaving || !auth.currentUser}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Path
              </Button>
            </CardTitle>
            {!auth.currentUser && <CardDescription className="text-xs text-muted-foreground">Log in to save your generated path.</CardDescription>}
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{suggestion.suggestedPath}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
