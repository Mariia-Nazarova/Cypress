// первичный запуск npx cypress open
// запуск npx cypress run
// npm run e2e:headless = npx cypress run --headless -b chrome --spec "cypress/e2e/book_app_test.cy.js"
// npm run e2e:chrome  = npx cypress run --headed -b chrome --spec "cypress/e2e/book_app_test.cy.js"
// запуск viewports через терминал: npx cypress run--browser chrome--config viewportWidth=1280,viewportHeight=720, результат будет лежать в папке е2е->videos

describe("Тест book_app", () => {
  const viewports = [
    { width: 1280, height: 720 }, // desktop
    { width: 768, height: 1024 }, // mobile
  ];
  //либо можно задать через presets (в cypress есть список устройствc с уже заданными свойствами).
  //Ex: const preents =["mackbook-15","samsung-note9"]. Далее уже в тесте прописывем:
  //viewports.forEach((device) => {
  //cy.viewport(device);
  //не забываем про ориентацию при необходимости - portrait и landscape. Ex: viewports("samsung-note9", "landscape")

  beforeEach(() => {
    viewports.forEach((views) => {
      cy.viewport(views.width, views.height);
      cy.visit("/"); // URL по которому нужно перейти лежит в файле cypress.config.js
    });
  });

  it("Тест авторизации", () => {
    viewports.forEach((views) => {
      cy.viewport(views.width, views.height);
      cy.login("bropet@mail.ru", "123"); //эта команда лежит в commands.js
      cy.contains("Добро пожаловать bropet@mail.ru");
      cy.should("be.visible");
      cy.contains("Log out").click();
    });
  });

  it("Тест пустого email", () => {
    cy.login("", "123");
    cy.get("#mail").then((elements) => {
      //отработает функция get, вернет набор элементов с селектором #mail, далее отработает фунция then
      expect(elements[0].checkValidity()).to.be.false; //элемент нулевой не прошёл валидацию, т.е. валидация false
      expect(elements[0].validationMessage).to.be.eql("Заполните это поле."); //и проверяем, что появилась надпись "Заполните это поле"
    });
  });

  it("Тест пустого password", () => {
    cy.login("bropet@mail.ru", "");
    cy.get("#pass").then((elements) => {
      //отработает функция get, вернет набор элементов с селектором #pass, далее отработает фунция then
      expect(elements[0].checkValidity()).to.be.false; //элемент нулевой не прошёл валидацию, т.е. валидация false
      expect(elements[0].validationMessage).to.be.eql("Заполните это поле."); //и проверяем, что появилась надпись "Заполните это поле"
    });
  });

  it("Тест невалидного email", () => {
    cy.login("1@mail.ru", "123");
    cy.contains("Неправильая почта или пароль");
    cy.should("be.visible");
  });

  it("Тест невалидного password", () => {
    cy.login("bropet@mail.ru", "4");
    cy.contains("Неправильая почта или пароль");
    cy.should("be.visible");
  });

  it("Тест на добавление книги в избранное при создании", () => {
    cy.addBook(
      "Биология добра и зла.",
      "Как говорит знаменитый приматолог и нейробиолог",
      "Роберт Сапольски"
    );
    cy.get("#favorite").click().check().should("be.checked");
    cy.contains("Submit").click();
  });

  it("Тест на добавление книги в избранное из каталога ", () => {
    const bookForFavorite1 = //"книга не в избранном"
      '[href="book/9671d858-7851-4ad9-9dab-657a64384025"] > .h-100 > .card-footer > .btn';
    cy.login("bropet@mail.ru", "123");
    cy.get(bookForFavorite1).should("have.text", "Add to favorite").click();
    cy.get(bookForFavorite1).should("have.text", "Delete from favorite");
    //для возврата в исходное состояние
    cy.get(bookForFavorite1).click();
  });

  it("Тест на удаление книги из избранного", () => {
    const bookForFavorite2 = // "книга в избранном"
      '[href="book/ea2f7147-86f3-48d5-9a16-0d1286aa66a1"] > .h-100 > .card-footer > .btn';
    cy.login("bropet@mail.ru", "123");
    cy.get(bookForFavorite2)
      .should("have.text", "Delete from favorite")
      .click();
    cy.get(bookForFavorite2).should("have.text", "Add to favorite");
    //для возврата в исходное состояние
    cy.get(bookForFavorite2).click();
  });
});
