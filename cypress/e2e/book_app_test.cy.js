// первичный запуск npx cypress open
// запуск npx cypress run
// npm run e2e:headless = npx cypress run --headless -b chrome --spec "cypress/e2e/book_app_test.cy.js"
// npm run e2e:chrome  = npx cypress run --headed -b chrome --spec "cypress/e2e/book_app_test.cy.js"

describe("Тест book_app", () => {
  const viewports = [
    { width: 1280, height: 720 }, // desktop
    { width: 768, height: 1024 }, // mobile
  ];
  //либо можно задать через presets (в cypress есть список устройствc с уже заданными свойствами).
  //Ex: const preents =["mackbook-15","samsung-note9"].
  //далее уже в тесте прописывем
  //viewports.forEach((device) => {
  //cy.viewport(device);
  //не забываем про орииентацию - portrait и landscape. Ex: viewports("samsung-note9", "landscape")

  beforeEach(() => {
    viewports.forEach((views) => {
      cy.viewport(views.width, views.height);
      cy.visit("/"); // URL по которому нужно перейти лежит в файле cypress.config.js
    });
  });

  it.only("Тест авторизации", () => {
    viewports.forEach((views) => {
      cy.viewport(views.width, views.height);
      cy.login("bropet@mail.ru", "123"); //эта команда лежит в commands.js
      cy.contains("Добро пожаловать bropet@mail.ru");
      cy.should("be.visible");
    });
  });

  it("Тест пустого email", () => {
    cy.login("", "123"); //эта команда лежит в commands.js
    cy.get("#mail").then((elements) => {
      //отработает функция get, вернет набор элементов с селектором #mail, далее отработает фунция then
      expect(elements[0].checkValidity()).to.be.false; //элемент нулевой не прошёл валидацию, т.е. валидация false
      expect(elements[0].validationMessage).to.be.eql("Заполните это поле."); //и проверяем, что появилась надпись "Заполните это поле"
    });
  });

  it("Тест пустого password", () => {
    cy.login("bropet@mail.ru", ""); //эта команда лежит в commands.js
    cy.get("#pass").then((elements) => {
      //отработает функция get, вернет набор элементов с селектором #pass, далее отработает фунция then
      expect(elements[0].checkValidity()).to.be.false; //элемент нулевой не прошёл валидацию, т.е. валидация false
      expect(elements[0].validationMessage).to.be.eql("Заполните это поле."); //и проверяем, что появилась надпись "Заполните это поле"
    });
  });
});
