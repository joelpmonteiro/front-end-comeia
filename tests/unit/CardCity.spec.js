// tests/unit/CardCity.spec.js
import { mount, createLocalVue } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Vuetify from "vuetify";
import CardCity from "../../src/components/Card/CardCity.vue";
import VueRouter from "vue-router";

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuetify);

const router = new VueRouter();

describe("CardCity.vue", () => {
  let wrapper;
  let vuetify = null;

  beforeEach(() => {
    vuetify = new Vuetify();

    // Mock do `generateSlug` para retorno esperado
    vi.mock("../../src/util/", () => ({
      generateSlug: vi.fn(() => "london"),
    }));

    wrapper = mount(CardCity, {
      localVue,
      vuetify,
      router,
      propsData: {
        city: {
          name: "London",
          main: { temp: 15 },
          weather: [{ description: "Clear", icon: "01n" }],
        },
      },
    });
  });

  it("renderiza nome da cidade e temperatura", () => {
    expect(wrapper.text()).toContain("London");
    expect(wrapper.text()).toContain("15°C - Clear");
  });

  it("emite o evento removeCity quando o botão delete é clicado", async () => {
    const deleteButton = wrapper.find("button");
    expect(deleteButton.exists()).toBe(true);
    await deleteButton.trigger("click"); // Trigger the delete button click
    expect(wrapper.emitted("removeCity")).toBeTruthy();
    expect(wrapper.emitted("removeCity")[0]).toEqual(["London"]);
  });

  it("Função de navegar quando clica em detalhes", async () => {
    const viewDetailsButtons = wrapper.findAll("button"); // Use findAll to get an array
    expect(viewDetailsButtons.length).toBeGreaterThan(1); // Check that there are at least two buttons
    const viewDetailsButton = viewDetailsButtons.at(1); // Use at() on WrapperArray

    expect(viewDetailsButton.exists()).toBe(true);

    // Spy on the router push method
    const spy = vi.spyOn(router, "push");

    await viewDetailsButton.trigger("click");

    expect(spy).toHaveBeenCalledWith({
      path: "/details/london",
    });
  });
});
