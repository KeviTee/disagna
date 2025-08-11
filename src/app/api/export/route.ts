import { NextResponse } from 'next/server';
import { Document, Packer, Paragraph } from 'docx';
import getDb from '@/lib/db';
import type { Project, Section } from '@/lib/types';

export async function POST(req: Request) {
  const { projectId } = await req.json();
  const db = await getDb();
  const project = await db
    .collection<Project>('projects')
    .findOne({ id: projectId });
  const sections = await db
    .collection<Section>('sections')
    .find({ projectId })
    .toArray();
  const doc = new Document({
    sections: [
      {
        children: sections.map(s => new Paragraph(s.content))
      }
    ]
  });
  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${project?.topic || 'document'}.docx"`
    }
  });
}
