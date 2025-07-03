import { ProposalStatus } from "@prisma/client";
export declare class UpdateProposalDto {
    status?: ProposalStatus;
    installmentsPaid?: number;
}
