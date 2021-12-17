describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("li", "Monday");
  });

  it("should book an interview", () => {
    /* Click the Add button */
    cy.get("[alt=Add]")
      .first()
      .click();
      
    /* Type name in input field, select interviewer and then click save */
    cy.get("[data-testid=student-name-input]")
      .type("Lydia Miller-Jones");

    cy.get("[alt='Sylvia Palmer']")
      .click();
    
    cy.contains("Save")
      .click();

    /* Validate the new appointment shows */
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    /* Force click hidden Edit button */
    cy.get("[alt=Edit")
      .first()
      .click({force: true});
    
    /* Edit form and then click save */
    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Jennifer Monroe");

    cy.get("[alt='Tori Malcolm']")
      .click();
    
    cy.contains("Save")
      .click();

    /* Validate the new appointment shows */
    cy.contains(".appointment__card--show", "Jennifer Monroe");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should cancel an interview", () => {
    /* Force click hidden Delete button */
    cy.get("[alt=Delete]")
      .first()
      .click({force: true});
    
    /* Confirm Delete Operation */
    cy.contains("Confirm")
      .click();
    
    /* Validate async status display and content was removed */
    cy.contains("Deleting").should('exist');
    cy.contains("Deleting").should('not.exist');
    cy.contains("appointment__card--show", "Archie Cohen").should('not.exist');
  });
});