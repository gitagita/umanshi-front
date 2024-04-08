import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: "%s | Umanshi",
        default: "Umanshi"
    },
    description: "일정 조율 서비스, 우리가 만나는 시간",
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}