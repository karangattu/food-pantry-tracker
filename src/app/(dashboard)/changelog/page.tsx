"use client";

import { APP_VERSION, changelog } from "@/lib/version";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ChangelogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Changelog</h1>
        <Badge variant="secondary">v{APP_VERSION}</Badge>
      </div>

      {changelog.map((entry) => (
        <Card key={entry.version}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">v{entry.version}</CardTitle>
              <span className="text-sm text-gray-600">{entry.date}</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {entry.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  {change}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
