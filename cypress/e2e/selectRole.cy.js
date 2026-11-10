describe("SelectRole Component", () => {
	it("Navigates to /loginTeacher when Teacher button is clicked", () => {

		cy.visit("http://localhost:3000/selectRole");

		//CUSelRolProf
		cy.contains("PROFESOR/A").click();

		//CUIniSesProf
		cy.get("input[id=login_email]").type("email1@email.com");
		cy.get("input[id=login_password]").type("pass123*");
		cy.get("button[type=submit]").click();

		//CUCreaEjerSim
		cy.get("[data-testid=menu-button]").click();
		cy.contains("Mis ejercicios").click();

		cy.contains("Crear ejercicio").click();

		cy.get("input[id=create_exercise_language]").click();
		cy.get(".ant-select-dropdown").contains("Español").click();
		cy.get("input[id=create_exercise_category]").click();
		cy.get(".ant-select-dropdown").contains("Familia").click();
		cy.get("input[id=create_exercise_networkType]").click();
		cy.get(".ant-select-dropdown").contains("I-I").click();
		cy.get("input[id=create_exercise_representation]").click();
		cy.get(".ant-select-dropdown").contains("SIMBÓLICA").click();
		cy.get("input[id=create_exercise_title]").type("Ejemplo");
		cy.contains("Select mainImage").click();
		cy.get("input[placeholder='input search text']").type("Hola");
		cy.get(".ant-input-search-button").click();
		cy.get(".ant-card").eq(1).click();
		cy.contains("Accept").click();
		cy.get("input[id=create_exercise_definitionPictogram]").click();
		cy.get("img[src='/pictograms/is.webp']").parent().click();
		cy.get("input[id=create_exercise_definitionText]").type("Ejemplo");
		cy.get("input[id=create_exercise_ampliationPictogram]").click();
		cy.get("img[src='/pictograms/has.webp']").parent().click();
		cy.get("input[id=create_exercise_ampliationText_I-I_ampliationText]").type("Ejemplo");
		cy.get("button").contains("Crear ejercicio").click();

		//CUElimEjer
		cy.get("button").contains("Eliminar").click();

		//CUEstAula
		cy.get("[data-testid=menu-button]").click();
		cy.contains("Mis aulas").click();

		cy.get("button").contains("Ver estadísticas").click();

		//CUDetAlum
		cy.get("[data-testid=menu-button]").click();
		cy.contains("Mis aulas").click();
		cy.contains("class1T1").click();

		//CUEstAula
		cy.get("button").contains("Ver estadísticas").click();

		//CUCierreSesion
		cy.get("[data-testid=menu-button]").click();
		cy.contains("Cerrar sesión").click();

		//CUSelRolAlum
		cy.contains("ALUMNO/A").click();

		//CUIniSesAlum
		cy.get("input[id=login_username]").type("maria1");
		cy.get("button").contains("Iniciar sesión").click();

		//CUSelecEjer
		cy.get(".ant-drawer-close").click();
		cy.get(".ant-card").eq(1).click();
		cy.get(".anticon-home").click();

		//CUCierreSesion
		cy.get("[data-testid=menu-button]").click();
		cy.contains("Cerrar sesión").click();
	});
});