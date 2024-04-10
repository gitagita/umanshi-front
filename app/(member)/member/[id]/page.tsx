import MemberForm from "@/components/member-form";

export const metadata = {
  title: "Member",
}

interface iParams { params: { id: string } }

export default function MemberStartPage({ params: { id } }: iParams) {
  return (
    <div>
      <MemberForm id={id} />
    </div>
  );
}