/**
 * Sample high-risk loan application data for development and testing
 */

export interface LoanApplication {
    id: string;
    applicant: string;
    amount: number;
    status: "pending" | "under_review" | "flagged" | "approved" | "rejected";
    createdAt: string;
}

export const sampleLoans: LoanApplication[] = [
    {
        id: "1",
        applicant: "John Smith",
        amount: 50000,
        status: "pending",
        createdAt: "2025-01-10T10:00:00.000Z",
    },
    {
        id: "2",
        applicant: "Sarah Johnson",
        amount: 150000,
        status: "under_review",
        createdAt: "2025-01-08T10:00:00.000Z",
    },
    {
        id: "3",
        applicant: "Michael Chen",
        amount: 500000,
        status: "pending",
        createdAt: "2025-01-05T10:00:00.000Z",
    },
    {
        id: "4",
        applicant: "Emily Williams",
        amount: 1000000,
        status: "flagged",
        createdAt: "2025-01-03T10:00:00.000Z",
    },
];
