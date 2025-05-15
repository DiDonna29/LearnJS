
import type { ContentItem } from '@/lib/types'; // Import the type
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, FileText, PlaySquare, BookOpen } from 'lucide-react';

// Use the ContentItem type for props
interface ContentCardProps extends ContentItem {}

const typeIcons = {
  'Article': <FileText className="h-4 w-4" />,
  'Tutorial': <PlaySquare className="h-4 w-4" />,
  'Documentation': <BookOpen className="h-4 w-4" />,
};

export default function ContentCard({ id, title, type, source, description, imageUrl, dataAiHint, category, externalLink }: ContentCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={title}
          data-ai-hint={dataAiHint}
          layout="fill"
          objectFit="cover"
          className="bg-muted" // Add a background color for placeholders
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start mb-1">
          <Badge variant="secondary" className="whitespace-nowrap flex items-center gap-1">
            {typeIcons[type]} {type}
          </Badge>
          <Badge variant="outline">{category}</Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>From: {source}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline" disabled={!externalLink}>
          <Link href={externalLink || '#'} target="_blank" rel="noopener noreferrer">
            Read More <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
