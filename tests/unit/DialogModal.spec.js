import { mount, createLocalVue } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import Vuetify from "vuetify";
import DialogModal from "../../src/components/modal/Dialog.vue"; // Atualize o caminho conforme necessário

const localVue = createLocalVue();
localVue.use(Vuetify);

describe("DialogModal.vue", () => {
  let wrapper;
  let vuetify;
  let app;

  beforeEach(() => {
    // Adiciona o elemento data-app para Vuetify
    app = document.createElement("div");
    app.setAttribute("data-app", true);
    document.body.appendChild(app);
    vuetify = new Vuetify();
    wrapper = mount(DialogModal, {
      localVue,
      vuetify,
      propsData: {
        open: true, // Testa o componente com o diálogo aberto
      },
    });
  });

  afterEach(() => {
    // Remove o elemento data-app após os testes
    if (app) {
      document.body.removeChild(app);
    }
  });

  it("renderiza o componente", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("mostra o diálogo quando a prop open é true", async () => {
    // Aguarde o Vue processar a reatividade
    await wrapper.vm.$nextTick();

    // Verifique se o diálogo está visível no DOM
    const dialog = wrapper.findComponent({ name: "v-dialog" });
    expect(dialog.exists()).toBe(true);

    // Verifique se o diálogo está visível
    expect(dialog.element.style.display).not.toBe("none");
  });

  it("emite evento showAddCityDialog quando closeDialog é chamado", async () => {
    const spy = vi.spyOn(wrapper.vm, "$emit");
    await wrapper.vm.closeDialog();
    expect(spy).toHaveBeenCalledWith("showAddCityDialog");
    expect(wrapper.vm.showAddCityDialog).toBe(false);
  });

  it("emite evento addCityDialog com valor newCity quando addCity é chamado", async () => {
    // Set the input value
    wrapper.setData({ newCity: "New York" });

    // Spy on the $emit method
    const spy = vi.spyOn(wrapper.vm, "$emit");

    await wrapper.vm.addCity();

    expect(spy).toHaveBeenCalledWith("addCityDialog", "New York");
    expect(wrapper.vm.newCity).toBe("");
    expect(wrapper.vm.showAddCityDialog).toBe(false);
  });

  it("não emite evento addCityDialog quando a variavel for vazia", async () => {
    // Clear the input value
    wrapper.setData({ newCity: "" });

    // Spy on the $emit method
    const spy = vi.spyOn(wrapper.vm, "$emit");

    await wrapper.vm.addCity();

    expect(spy).not.toHaveBeenCalledWith("addCityDialog");
    expect(wrapper.vm.newCity).toBe("");
    expect(wrapper.vm.showAddCityDialog).toBe(false);
  });

  it("limpa a variavel newCity e fecha o diálogo quando o botão cancelar é clicado", async () => {
    wrapper.setData({ newCity: "Some City" });
    await wrapper.find("button").trigger("click"); // Click the cancel button
    expect(wrapper.vm.newCity).toBe("");
    expect(wrapper.vm.showAddCityDialog).toBe(false);
  });
});
