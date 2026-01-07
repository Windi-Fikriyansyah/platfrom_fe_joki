import FreelancerNavbar from "@/components/freelancer/FreelancerNavbar";

export default function FreelancerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <FreelancerNavbar>{children}</FreelancerNavbar>;
}
