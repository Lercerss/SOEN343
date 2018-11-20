export class Loan {
    constructor(loanJSON) {
        this.id = loanJSON.id;
        this.user_id = loanJSON.user_id;
        this.copy_id = loanJSON.copy_id;
        this.loan_ts = loanJSON.loan_ts;
        this.return_ts = loanJSON.return_ts;
        this.expectedReturn = loanJSON.expectedReturn;
    }
}
