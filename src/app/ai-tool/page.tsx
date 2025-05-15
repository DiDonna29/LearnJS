import AiToolForm from '@/components/ai-tool/AiToolForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export default function AiToolPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3"><Brain className="h-8 w-8 text-primary" /> AI-Powered Learning Path Builder</CardTitle>
          <CardDescription className="text-lg">
            Not sure where to start? Tell us about your current experience and career goals, and our AI will suggest a personalized learning path for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This tool leverages generative AI to analyze your input and recommend a sequence of topics to help you achieve your JavaScript development goals efficiently.
          </p>
        </CardContent>
      </Card>
      <AiToolForm />
    </div>
  );
}
