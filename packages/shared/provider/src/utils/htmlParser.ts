import toJson from "node-html2json";

import { DataReturnTypes } from "../providers/default";

class HtmlParser {
  #parser;

  constructor() {
    this.#parser = toJson;
  }

  public parse(
    htmlString: string,
    mapping: Record<string, unknown> = {}
  ): DataReturnTypes {
    if (!htmlString || htmlString === "") {
      throw new Error("Nada a executar");
    }

    try {
      const result = this.#parser(htmlString, mapping);
      return result;
    } catch (err) {
      throw new Error(`Estourou alguma coisa aqui. Veja: ${err.message}`);
    }
  }
}

export default new HtmlParser();
