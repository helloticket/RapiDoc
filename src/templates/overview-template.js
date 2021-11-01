import { html } from "lit-element";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import marked from "marked";
import { downloadResource, viewResource } from "~/utils/common-utils";

/* eslint-disable indent */
function headingRenderer() {
  const renderer = new marked.Renderer();
  renderer.heading = (text, level, raw, slugger) =>
    `<h${level} class="observe-me" id="overview--${slugger.slug(
      raw
    )}">${text}</h${level}>`;
  return renderer;
}

export default function overviewTemplate() {
  return html`
    <section
      id="overview"
      part="section-overview"
      class="observe-me ${this.renderStyle === "view"
        ? "section-gap"
        : "section-gap--read-mode"}"
    >
      ${this.resolvedSpec?.info
        ? html`
            <div
              id="api-title"
              part="label-overview-title"
              style="font-size:32px"
            >
              ${this.resolvedSpec.info.title}
              ${!this.resolvedSpec.info.version
                ? ""
                : html` <span
                    style="font-size:var(--font-size-small);font-weight:bold"
                  >
                    ${this.resolvedSpec.info.version}
                  </span>`}
            </div>
            <div
              id="api-info"
              style="font-size:calc(var(--font-size-regular) - 1px); margin-top:8px;"
            >
              ${this.specUrl && this.allowSpecFileDownload === "true"
                ? html` <div
                    style="display:flex; margin:12px 0; gap:8px; justify-content: start;"
                  >
                    <button
                      class="m-btn thin-border"
                      style="width:180px"
                      part="btn btn-outline"
                      @click="${(e) => {
                        downloadResource(this.specUrl, "openapi-spec", e);
                      }}"
                    >
                      Download OpenAPI
                    </button>
                  </div>`
                : ""}
            </div>
            <slot name="overview"></slot>
            <div id="api-description">
              ${this.resolvedSpec.info.description
                ? html`${unsafeHTML(`
                <div class="m-markdown regular-font">
                ${marked(
                  this.resolvedSpec.info.description,
                  this.infoDescriptionHeadingsInNavBar === "true"
                    ? { renderer: headingRenderer() }
                    : undefined
                )}
              </div>`)}`
                : ""}
            </div>
          `
        : ""}
    </section>
  `;
}
/* eslint-enable indent */
