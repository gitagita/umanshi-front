import CalendarRange from "@/components/calendar-range";

interface iParams { params: { id: string } }
export default function CalendarRangePage({ params: { id } }: iParams) {

  return (
    <div>
      <CalendarRange id={id} />
    </div>
  );
}