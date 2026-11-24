# Mortgage domain primer

Background for the LoanCrate design exercise. The exercise may be set in this domain or in something more generic that parallels it. Either way, LoanCrate is the company Ted is applying to, so frame design decisions the way they would. Use this vocabulary in UI copy and seed data. Every claim here is sourced (see *Sources*). Don't add claims you can't source.

## What LoanCrate is

An AI-native Loan Origination System (LOS) for mortgage lenders that replaces legacy systems like ICE's Encompass. From their site, the AI:

- validates every document against agency guidelines on upload
- auto-categorizes and renames documents and replaces outdated versions
- creates conditions automatically from extracted data. For example, a large deposit on a bank statement adds a Letter of Explanation (LOX) condition.
- runs custom rules for disclosures, changes of circumstance, and compliance checks

Their FAQ says the AI organizes, enhances, and pre-reviews data, but **final underwriting decisions stay with humans**. Treat that as a hard product principle.

**Business context (from interviews):** LoanCrate is going live with a top-10 US lender, so expect enterprise scale, high volume, and one huge customer shaping requirements. Designers sit in pods covering areas such as post-closing and automated underwriting.

## Loan lifecycle

1. **Application.** The borrower completes the 1003 (see below). The loan officer (LO) owns this stage.
2. **Disclosures.** The Loan Estimate goes out early in the process. TRID rules govern timing, and changes of circumstance can require re-disclosure.
3. **Processing.** The processor gathers documents and orders the appraisal, title, verification of employment, and so on.
4. **Automated underwriting (AUS).** Fannie Mae's Desktop Underwriter (DU) or Freddie Mac's Loan Product Advisor (LPA) returns findings and documentation requirements.
5. **Underwriting.** A human underwriter reviews the file and issues a conditional approval with a list of conditions.
6. **Conditions.** The processor collects documents and explanations. The underwriter clears, rejects, or waives each condition.
7. **Clear to close (CTC).** All required conditions are cleared.
8. **Closing and funding.** The Closing Disclosure is sent, documents are signed, and the loan funds.
9. **Post-closing.** Trailing documents are collected, collateral is reviewed, the loan is delivered to an investor (Fannie, Freddie, or an aggregator), and post-closing QC runs.

**Roles:** borrower, loan officer, processor, underwriter, closer, post-closer, QC analyst, plus operations managers watching the whole pipeline.

## The 1003 / URLA

The Uniform Residential Loan Application is Fannie Mae Form 1003, also Freddie Mac Form 65. Its sections:

1. **Borrower:** personal info, current employment and income, previous employment, other income (Social Security, alimony, retirement, etc.)
2. **Finances:** assets (bank, investment, retirement accounts), other assets and credits (earnest money, gifts), liabilities, other liabilities (alimony, child support)
3. **Real estate owned:** value, status, mortgages, rental income
4. **Loan and property:** amount, purpose, property address, units, occupancy, other new mortgages, rental income, grants or gifts
5. **Declarations:** yes/no questions about occupancy, undisclosed borrowing, judgments, bankruptcy, foreclosure
6. **Acknowledgments and agreements**
7. **Military service**
8. **Demographic information** (optional, for fair housing compliance)

Most of the AI's value comes from checking documents against what the borrower stated here. Does stated income match the paystubs? Do stated assets match the bank statements? Are there debts on the credit report the borrower didn't list?

## Conditions

Conditions are the requirements that must be met to move the loan forward. They're the core of the processor and underwriter workflow.

- **Categories by timing:** prior to docs (PTD), prior to closing (PTC), prior to funding (PTF), at closing, and post-closing or trailing.
- **Sources:** AUS findings, underwriter judgment, investor overlays, and in LoanCrate's case, AI-generated conditions from extracted data.
- **Typical lifecycle:** open → requested from borrower → received → under review → cleared. It can also end as:
  - **Rejected:** with a reason, then back to requested.
  - **Waived:** with a justification and an approver.
- **Common examples:** income docs, asset docs, LOX for a large deposit or credit inquiry, gift letter plus proof of donor funds, employment-gap explanation, divorce decree, appraisal issues, title issues, flood or homeowners insurance, and paying off or closing accounts before funding.

## Large deposits and the LOX (Fannie Mae Selling Guide B3-4.2-02)

- A **large deposit** is a single deposit over **50% of the borrower's total monthly qualifying income**.
- **Purchases:** if the funds go toward the down payment, closing costs, or reserves, the lender must document where they came from. That could be a borrower explanation (the LOX), proof of an asset sale, or a gift letter. If the source can't be documented, the unsourced amount is subtracted from verified assets.
- **Refinances:** no documentation is required, but borrowed funds and related debt must be considered.
- **No LOX needed** when the source is clearly printed on the statement (payroll, Social Security, a tax refund, or a transfer between verified accounts), unless the funds look borrowed.
- Bank statements typically cover the most recent two months.

**Design implication:** whether the rule applies depends on loan purpose, income, how the funds are used, and what's printed on the statement. A good AI condition shows why it fired and avoids firing when an exception applies.

## Typical documents in a file

Paystubs, W-2s, tax returns, verification of employment (VOE), bank and investment statements, credit report, appraisal, title commitment, homeowners and flood insurance, gift letters, LOXs, purchase contract, Loan Estimate, Closing Disclosure, note, and deed of trust.

## Post-closing

- Collect trailing documents, such as the final title policy, recorded deed, and insurance confirmations.
- Review the collateral (note, deed, title).
- Deliver the loan file to the investor within its deadline.
- **QC:** Fannie Mae requires lenders to review at least 10% of monthly production within 90 days of the closing month.
- **Common defects:** undisclosed debt (Fannie's top defect in its discretionary sample), income miscalculation, and missing documents.
- Defects can force the lender to **repurchase** the loan, which is very expensive. That's why accuracy, audit trails, and evidence matter so much.

## What this means for design

- **Humans decide, AI prepares.** Show suggestions, not silent decisions. Every AI action needs accept, modify, or reject, plus a record of who did what.
- **Show the evidence.** Every extracted value or AI condition links to the exact document, page, and region it came from.
- **Exceptions first.** Processors handle many loans at once, so surface what needs a human and let the rest flow.
- **Explain the rule.** When the AI creates a condition, say which guideline or rule triggered it and what would satisfy it.
- **Audit trail everywhere.** Regulators, investors, and QC will ask who changed what, when, and why.
- **Deadlines drive priority:** closing date, rate lock expiration, disclosure timing, and investor delivery windows.
- **Density is a feature.** Users live in these screens all day, so optimize for scanning and keyboard use, not first-run delight.
- **Uncertainty is normal.** Blurry scans, handwritten LOXs, and mismatched names happen. Design for low confidence and failure states, not just the happy path.

## Questions to ask in the exercise briefing

- Which user and role? Processor, underwriter, closer, post-closer, or QC?
- Which loan stage, and is it a purchase or a refinance?
- Is the AI behavior given, or do I define what the AI does?
- What does success look like? Speed, accuracy, fewer touches, or fewer defects?
- Are there existing patterns or components I should reuse?
- What's in and out of scope for two hours?

## Sources

- Fannie Mae Selling Guide B3-4.2-02, Depository Accounts: https://selling-guide.fanniemae.com/sel/b3-4.2-02/depository-accounts
- Fannie Mae, Uniform Residential Loan Application: https://singlefamily.fanniemae.com/delivering/uniform-mortgage-data-program/uniform-residential-loan-application
- Experian, URLA section overview: https://www.experian.com/blogs/ask-experian/uniform-residential-loan-application-form-1003/
- The Mortgage Reports, underwriting conditions: https://themortgagereports.com/40312/mortgage-underwriting-what-are-conditions-and-how-do-i-satisfy-them
- Fannie Mae Selling Guide D1-3-01, post-closing QC: https://selling-guide.fanniemae.com/sel/d1-3-01/lender-post-closing-quality-control-review-process
- Certified Credit, post-closing overview (vendor article): https://www.certifiedcredit.com/what-happens-after-the-loan-closes-a-lenders-guide-to-post-closing-compliance/
- LoanCrate homepage and FAQ: https://www.loancrate.com/
