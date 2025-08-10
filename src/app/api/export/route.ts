import { NextResponse } from 'next/server';
import { Document, Packer, Paragraph } from 'docx';
import db from '@/lib/db';

export async function POST(req: Request) {
  const { projectId } = await req.json();
  db.read();
  const project = db.data.projects.find(p => p.id === projectId);
  const sections = db.data.sections.filter(s => s.projectId === projectId);
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
      'Content-Disposition': `attachment; filename="${project?.title || 'document'}.docx"`
    }
  });
}
