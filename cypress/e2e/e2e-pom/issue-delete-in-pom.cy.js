import IssueModal from "../../pages/IssueModal";
const issueTitle = 'This is an issue of type: Task.';

describe('Deleting an issue and cancel deletion', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      cy.visit(url + '/board');
      cy.get(IssueModal.backlogList)
        .should('be.visible');
      cy.contains(issueTitle)
        .click();
      IssueModal.getIssueDetailModal()
        .should('be.visible');
    });
  });

  it('Should delete issue successfully', () => {
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
  });

  it('Should cancel deletion process successfully', () => {
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
  });
});