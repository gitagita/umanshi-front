import { Suspense } from "react";
import CalendarData from "@/components/calendar-data";

interface iParams { params: { id: string } }
export default async function CalendarRangePage({ params: { id } }: iParams) {
  return (
    <div>
      <Suspense fallback={<h1>Loading calendar info</h1>}>
        <CalendarData params={{ id: id }} />
      </Suspense>
    </div>
  );
}